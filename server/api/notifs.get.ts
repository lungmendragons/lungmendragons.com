import type { StorageValue } from "unstorage";

export default eventHandler(async () => {
  const keys = await hubKV().keys("notifs");

  if (!keys.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "No keys found",
    });
  };

  const KVs: StorageValue[] = [];
  for (const key of keys) {
    const data = await hubKV().get(key);
    KVs.push({ key, data });
  };

  return KVs;
});
