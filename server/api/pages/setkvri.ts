import type { StorageValue } from "unstorage";

export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async () => {
    const keys = await useKV().keys("resourceindex");

    if (!keys.length) {
      throw createError({
        statusCode: 404,
        message: "No keys found",
      });
    };

    const KVs: StorageValue[] = [];
    for (const key of keys) {
      const data = await useKV().get(key);
      KVs.push({ key: key.slice(14), data });
    };

    await useKV().set("resource-index", KVs);

    return "KV set: resource-index";
  }
});
