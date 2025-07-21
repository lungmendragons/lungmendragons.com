/* eslint no-restricted-syntax: ["off"] */
import { s } from "binary-schema";

export const enum ClientOpcode {
  SendAction,
  SendSync,
  ChangeSync,
  Init,
}

export const enum ServerOpcode {
  Init,
  SendAction,
  SendSync,
  ReqIdent,
  Close,
}

export interface ClientData {
  sync: boolean;
  room: string;
  id: string;
}

export type PublicClientData = Omit<ClientData, "token">;

export const ClientDataSchema: s.Schema<ClientData> = s.struct({
  sync: s.boolean,
  room: s.string,
  id: s.string,
});
export const PublicClientDataSchema: s.Schema<PublicClientData> = s.struct({
  sync: s.boolean,
  room: s.string,
  id: s.string,
});

export type ServerMessage =
  { opcode: ServerOpcode.Init; client: ClientData; rejoin: string } |
  { opcode: ServerOpcode.SendAction; client: PublicClientData; data: Uint8Array } |
  { opcode: ServerOpcode.SendSync; client: PublicClientData; data: Uint8Array } |
  { opcode: ServerOpcode.ReqIdent } |
  { opcode: ServerOpcode.Close; client: PublicClientData };

export type ClientMessage =
  { opcode: ClientOpcode.SendAction; data: Uint8Array } |
  { opcode: ClientOpcode.SendSync; data: Uint8Array; to: string | undefined } |
  { opcode: ClientOpcode.ChangeSync; id: string } |
  { opcode: ClientOpcode.Init };

export const ServerMessageSchema: s.Schema<ServerMessage> = s.union("opcode", {
  [ServerOpcode.Init]: { client: ClientDataSchema, rejoin: s.string },
  [ServerOpcode.SendAction]: { client: PublicClientDataSchema, data: s.bytearray },
  [ServerOpcode.SendSync]: { client: PublicClientDataSchema, data: s.bytearray },
  [ServerOpcode.ReqIdent]: {},
  [ServerOpcode.Close]: { client: PublicClientDataSchema },
});

export const ClientMessageSchema: s.Schema<ClientMessage> = s.union("opcode", {
  [ClientOpcode.SendAction]: { data: s.bytearray },
  [ClientOpcode.SendSync]: { data: s.bytearray, to: s.option(s.string) },
  [ClientOpcode.ChangeSync]: { id: s.string },
  [ClientOpcode.Init]: {},
});
