import { base64Url } from "@better-auth/utils/base64";
import { createHMAC } from "@better-auth/utils/hmac";

const hmac = createHMAC("SHA-256", "base64url");

const serializeToken = (
  data: string,
  signature: string,
) => `${base64Url.encode(data)}.${base64Url.encode(signature)}`;

export const createToken = async (data: string) => serializeToken(data, await hmac.sign(await signKey(), data));

export const verifyToken = async (
  token: string
) => {
  try {
    const split = token.split(".");
    if (split.length !== 2) {
      return null;
    }
    const string_data = new TextDecoder().decode(base64Url.decode(split[0]!));
    const valid = await hmac.verify(await verifyKey(), string_data, base64Url.decode(split[1]!));
    if (valid) {
      return string_data;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const serializeData = (
  expires: number,
  perms: number,
) => JSON.stringify([
  expires,
  perms,
]);

export const deserializeData = (data: string) => {
  const [expires, perms] = JSON.parse(data) as [number, number];
  return { expires, perms };
}

let cachedSignKey: CryptoKey;
const signKey = async () => {
  cachedSignKey ??= await hmac.importKey(base64Url.decode(process.env.BINGO_AUTH_SECRET!), "sign");
  return cachedSignKey;
}
let cachedVerifyKey: CryptoKey;
const verifyKey = async () => {
  cachedVerifyKey ??= await hmac.importKey(base64Url.decode(process.env.BINGO_AUTH_SECRET!), "verify");
  return cachedVerifyKey;
}