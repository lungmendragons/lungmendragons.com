import { nanoid } from "nanoid";

export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async (event) => {
    const key = nanoid(8);
    const { body } = await readBody(event);

    await useKV().set(`notifs:${key}`, body);

    return { key, body };
  }
});
