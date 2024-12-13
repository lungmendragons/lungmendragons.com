import type { StorageValue } from "unstorage";

export default cachedEventHandler(async () => {
  const keys = await hubKV().keys("resourceindex");

  if (!keys.length) {
    throw createError({
      statusCode: 404,
      message: "No keys found",
    });
  };

  const KVs: StorageValue[] = [];
  for (const key of keys) {
    const data = await hubKV().get(key);
    KVs.push({ key, data });
  };

  return KVs;
}, {
  maxAge: 300, // 5 minutes
  getKey: event => event.path,
});
