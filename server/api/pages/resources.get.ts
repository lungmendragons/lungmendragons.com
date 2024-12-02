import type { StorageValue } from "unstorage";

export default eventHandler(async () => {
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
});
