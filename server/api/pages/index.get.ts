import type { StorageValue } from "unstorage";

export default eventHandler(async () => {
  // const { namespace } = event.context.params || {};
  // if (!namespace) {
  //   throw createError({
  //     statusCode: 400,
  //     message: "Missing namespace",
  //   });
  // };

  // const keys = await hubKV().keys(namespace);
  const keys = await hubKV().keys("guides"); // temporary

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
