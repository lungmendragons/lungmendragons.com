import { DurableObject } from "cloudflare:workers";
import { nanoid } from "nanoid";
import { verifyToken, deserializeData } from "bingo-server/state-key";

export default {
  async fetch(request: Request, env: Env) {
    if (request.headers.get("upgrade") !== "websocket") {
      return new Response(null, { status: 426, statusText: "expected websocket upgrade" });
    } else {
      const id = env.WSDurableObject.idFromName("testroom");
      return env.WSDurableObject.get(id).fetch(request);
    }
  }
}

interface ClientData {
  perms: number,
  token: string,
}

type PublicClientData = Omit<ClientData, "token">;

type Attachment = {
  [T in keyof ClientData as FirstChar<T>]: ClientData[T];
}

type FirstChar<S> = S extends `${infer Head}${infer _}` ? Head : "";

const getPublicClientData = (client: WebSocket): PublicClientData => {
  const data = getClientData(client);
  return {
    perms: data.perms,
  };
};

function getClientData(client: WebSocket): ClientData {
  const { p, t }: Attachment = client.deserializeAttachment();
  return { perms: p, token: t };
}

function setClientData(client: WebSocket, data: ClientData) {
  const attachment: Attachment = { p: data.perms, t: data.token };
  client.serializeAttachment(attachment);
}

const getProtocols = (header: string | null) => !header ? [] : header.split(",").map(x => x.trim());

export class WSDurableObject extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request) {
    const protocols = getProtocols(request.headers.get("Sec-WebSocket-Protocol"));

    let token: string | undefined = undefined;
    for (const protocol of protocols) {
      if (protocol.startsWith("token.")) {
        // "token.".length
        token = protocol.slice(7);
      }
    }

    if (!token) {
      return new Response(null, {
        status: 401,
        statusText: "requires `token.` protocol in the `Sec-WebSocket-Protocol` header",
      });
    }

    const token_data = await verifyToken(token);
    if (!token_data) {
      return new Response(null, {
        status: 403,
        statusText: "invalid token",
      });
    }

    console.log(JSON.stringify(token_data));
    const { expires, perms } = deserializeData(token_data);

    if (expires <= Date.now()) {
      return new Response(null, {
        status: 403,
        statusText: "expired token",
      });
    }

    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server);

    const clientData: ClientData = { perms, token: nanoid() };
    setClientData(server, clientData);

    this.send(server, {
      client: getPublicClientData(server),
      kind: "open",
    });

    server.send(JSON.stringify({
      client: clientData,
      kind: "init",
      peers: this.ctx.getWebSockets().map(getPublicClientData),
    }));

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(client: WebSocket, message: string | ArrayBuffer) {
    if (typeof message === "string") {
      try {
        const messageData = JSON.parse(message);
        this.send(client, {
          client: getPublicClientData(client),
          kind: "message",
          data: messageData,
        });
      } catch {

      }
    }
  }

  webSocketClose(client: WebSocket, code: number, reason: string, wasClean: boolean) {
    this.send(client, {
      client: getClientData(client),
      kind: "close",
    });
  }

  send(from: WebSocket, data: any) {
    for (const client of this.ctx.getWebSockets()) {
      if (from !== client) {
        client.send(JSON.stringify(data));
      }
    }
  }
}