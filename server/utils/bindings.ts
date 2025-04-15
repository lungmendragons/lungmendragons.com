import { createStorage, type StorageValue, type Storage } from "unstorage";
import cloudflareKV from "unstorage/drivers/cloudflare-kv-binding";

let kv: Storage<StorageValue>;
let db: D1Database;

export const env = () => (globalThis as any).__env__ as Env;

export const useKV = () => {
  if (kv) {
    return kv;
  }

  kv = createStorage({ driver: cloudflareKV({ binding: env().KV }) });
  return kv;
};

export const useDB = () => {
  if (db) {
    return db;
  }

  db = env().DB;
  return db;
}

export const useBlob = () => env().BLOB;