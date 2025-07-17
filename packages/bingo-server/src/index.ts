import { DurableObject } from "cloudflare:workers";
import { nanoid } from "nanoid";
import { base64Url } from "@better-auth/utils/base64";
import {
  decodeTokenData,
  RoomActionKind,
  verifyToken,
  type TokenData,
} from "bingo-server/state-key";
import {
  ClientDataSchema,
  ClientMessageSchema,
  ClientOpcode,
  ServerMessageSchema,
  ServerOpcode,
  type ClientMessage,
  type ServerMessage,
  type ClientData,
  type PublicClientData,
} from "./lib/protocol";
import { isArrayBuffer } from "node:util/types";
import { BinaryReader, BinaryWriter } from "binary-schema";

const getProtocols = (header: string | null) => !header ? [] : header.split(",").map(x => x.trim());
async function validateToken(request: Request) {
  const protocols = getProtocols(request.headers.get("Sec-WebSocket-Protocol"));

  let token: string | undefined;
  let hasBingoProtocol = false;
  for (const protocol of protocols) {
    if (protocol.startsWith("token.")) {
      // "token.".length
      token = protocol.slice(6);
    }
    if (protocol === "bingo") {
      hasBingoProtocol = true;
    }
  }

  if (!hasBingoProtocol) {
    return new Response(null, {
      status: 400,
      statusText: "subprotocol `bingo` not present.",
    });
  }

  if (!token) {
    return new Response(null, {
      status: 401,
      statusText: "requires `token.` protocol in the `Sec-WebSocket-Protocol` header",
    });
  }

  const res = await verifyToken(token);
  if (res === null) {
    return new Response(null, {
      status: 403,
      statusText: "invalid token",
    });
  }

  const [ tokenData, out ] = res;

  if (tokenData.expires <= Date.now()) {
    return new Response(null, {
      status: 403,
      statusText: "expired token",
    });
  }

  return out;
}

export default {
  async fetch(req: Request, env: Env) {
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response(null, { status: 426, statusText: "expected websocket upgrade" });
    } else {
      const res = await validateToken(req);
      if (res instanceof Response) {
        return res;
      }

      const request = new Request(req);

      request.headers.append("bingo-token-data", res);

      const id = env.WSDurableObject.idFromName("bingoserver");
      return env.WSDurableObject.get(id, { locationHint: "enam" }).fetch(request);
    }
  },
};

function getPublicClientData(client: WebSocket): PublicClientData {
  const data = getClientData(client);
  return {
    sync: data.sync,
    id: data.id,
    room: data.room,
  };
};

function getClientData(client: WebSocket): ClientData {
  const buffer: Uint8Array = client.deserializeAttachment();
  return BinaryReader.using(buffer.buffer, ClientDataSchema.decode);
}

function setClientData(client: WebSocket, data: ClientData) {
  client.serializeAttachment(BinaryWriter.using(data, ClientDataSchema.encode));
}

export class WSDurableObject extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("keepalive:heartbeat", "keepalive:ack"));
  }

  async fetch(request: Request) {
    const tokenData = decodeTokenData(base64Url.decode(request.headers.get("bingo-token-data")!));

    switch (tokenData.room.action) {
      case RoomActionKind.Create:
        return this.createRoom(tokenData);
      case RoomActionKind.Join:
        return this.joinRoom(tokenData, tokenData.room.room);
    }
  }

  createRoom(_token: TokenData) {
    let room: string;
    while (true) {
      room = nanoid(16);
      if (this.ctx.getWebSockets(room).length === 0) {
        break;
      }
    };

    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server, [ room ]);

    const clientData: ClientData = {
      sync: true,
      id: nanoid(8),
      token: nanoid(),
      room,
    };
    setClientData(server, clientData);

    console.log(`opening ${clientData.id} in ${clientData.room}`);

    return new Response(null, {
      headers: {
        "Sec-Websocket-Protocol": "bingo",
      },
      status: 101,
      webSocket: client,
    });
  }

  joinRoom(_token: TokenData, room: string) {
    if (room.length > 16) {
      return new Response(null, { status: 400, statusText: "invalid room id" });
    }

    const peerWs = this.ctx.getWebSockets(room);
    if (peerWs.length === 0) {
      return new Response(null, { status: 400, statusText: "invalid room id" });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server, [ room ]);

    const clientData: ClientData = {
      sync: false,
      id: nanoid(8),
      token: nanoid(),
      room,
    };
    setClientData(server, clientData);

    console.log(`opening ${clientData.id} in ${clientData.room}`);

    return new Response(null, {
      headers: {
        "Sec-Websocket-Protocol": "bingo",
      },
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(client: WebSocket, data: string | ArrayBuffer) {
    let message: ClientMessage;

    try {
      if (isArrayBuffer(data)) {
        message = BinaryReader.using(data, ClientMessageSchema.decode);
      } else {
        const buffer = base64Url.decode(data);
        message = BinaryReader.using(buffer, ClientMessageSchema.decode);
      }
    } catch (e) {
      console.error(e);
      return;
    }

    const clientData = getClientData(client);

    switch (message.opcode) {
      case ClientOpcode.SendAction:
        let hasSync = false;
        for (const peer of this.ctx.getWebSockets(clientData.room)) {
          const peerClientData = getClientData(peer);
          if (peerClientData.sync) {
            this.sendSingle(peer, {
              opcode: ServerOpcode.SendAction,
              client: clientData,
              data: message.data,
            });
            hasSync = true;
            break;
          }
        }
        if (!hasSync) {
          this.deleteRoom(clientData.room);
        }
        break;
      case ClientOpcode.SendSync:
        if (clientData.sync) {
          this.sendAll(client, clientData.room, {
            opcode: ServerOpcode.SendSync,
            client: clientData,
            data: message.data,
          });
        }
        break;
      case ClientOpcode.ChangeSync:
        if (clientData.sync) {
          let target: [WebSocket, ClientData] | undefined;
          for (const peer of this.ctx.getWebSockets(clientData.room)) {
            const cd = getClientData(client);
            if (cd.id === message.id) {
              target = [ peer, cd ];
              break;
            }
          }
          if (target) {
            clientData.sync = false;
            target[1].sync = true;
            setClientData(client, clientData);
            setClientData(target[0], target[1]);
          }
        }
        break;
      case ClientOpcode.Init:
        this.sendSingle(client, {
          opcode: ServerOpcode.Init,
          client: clientData,
        });
        break;
    }
  }

  deleteRoom(room: string) {
    const peers = this.ctx.getWebSockets(room);
    for (const peer of peers) {
      peer.close(1000, "room closed.");
    }
  }

  webSocketClose(client: WebSocket, _code: number, reason: string, _wasClean: boolean) {
    const clientData = getPublicClientData(client);
    console.log(`closing ${clientData.id} in ${clientData.room}`);

    // shut the whole room down.
    if (clientData.sync) {
      this.deleteRoom(clientData.room);
      return;
    }

    this.sendAll(client, clientData.room, {
      opcode: ServerOpcode.Close,
      client: clientData,
    });

    client.close(1000, reason);
  }

  sendAll(from: WebSocket | undefined, room: string, message: ServerMessage) {
    // const data = from ? getClientData(from) : { id: "none" };
    // console.log(`sending ${JSON.stringify(message, (_, value) => {
    //   if (isUint8Array(value)) {
    //     return base64Url.encode(value);
    //   } else {
    //     return value;
    //   }
    // })} from ${data.id}`);
    const view = BinaryWriter.using(message, ServerMessageSchema.encode);
    for (const client of this.ctx.getWebSockets(room)) {
      if (from !== client) {
        if (client.readyState === WebSocket.READY_STATE_OPEN)
          client.send(view);
      }
    }
  }

  sendSingle(to: WebSocket, message: ServerMessage) {
    // const data = getClientData(to);
    // console.log(`sending ${JSON.stringify(message, (_, value) => {
    //   if (isUint8Array(value)) {
    //     return base64Url.encode(value);
    //   } else {
    //     return value;
    //   }
    // })} to ${data.id}`);
    const view = BinaryWriter.using(message, ServerMessageSchema.encode);
    to.send(view);
  }
}
