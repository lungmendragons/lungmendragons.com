/* eslint no-restricted-syntax: ["off"] */
import { base64Url } from "@better-auth/utils/base64";
import { createHMAC } from "@better-auth/utils/hmac";
import { BinaryReader, BinaryWriter, s } from "binary-schema";

const hmac = createHMAC("SHA-256", "base64urlnopad");

export const enum RoomActionKind {
  Create,
  Join,
}

export type RoomAction = { action: RoomActionKind.Create } | { action: RoomActionKind.Join; room: string };

export const RoomActionSchema: s.Schema<RoomAction> = s.union("action", {
  [RoomActionKind.Create]: {},
  [RoomActionKind.Join]: {
    room: s.string,
  },
});

export interface TokenData {
  expires: number;
  room: RoomAction;
}

export const TokenDataSchema: s.Schema<TokenData> = s.struct({
  expires: s.f64,
  room: RoomActionSchema,
});

export const encodeTokenData = (data: TokenData) => BinaryWriter.using(data, TokenDataSchema.encode);
export const decodeTokenData = (data: Uint8Array) => BinaryReader.using(data.buffer, TokenDataSchema.decode);

let cachedSignKey: CryptoKey;
let cachedVerifyKey: CryptoKey;

async function signKey() {
  cachedSignKey ??= await hmac.importKey(process.env.BINGO_AUTH_SECRET!, "sign");
  return cachedSignKey;
}

async function verifyKey() {
  cachedVerifyKey ??= await hmac.importKey(process.env.BINGO_AUTH_SECRET!, "verify");
  return cachedVerifyKey;
}

export async function createToken(
  data: TokenData,
) {
  const buffer = encodeTokenData(data);

  const signature = await hmac.sign(await signKey(), buffer);

  const token = `${base64Url.encode(buffer)}.${signature}`;

  return token;
}

export async function verifyToken(
  token: string,
) {
  try {
    const split = token.split(".");
    if (split.length !== 2) {
      return null;
    }
    const data = base64Url.decode(split[0]!);
    const valid = await hmac.verify(await verifyKey(), data, split[1]!);
    if (valid) {
      return decodeTokenData(data);
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
