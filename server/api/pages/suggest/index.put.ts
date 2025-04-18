import { nanoid } from "nanoid";

export default eventHandler({
  onRequest: [requirePermission(AuthPermission.User)],
  handler: async (event) => {
    const { time, data } = await readBody(event);
    const id = nanoid(8);
    
    const user = {
      id: event.context.auth!.user.id,
      name: event.context.auth!.user.name,
    };

    try {
      await useKV().set(`residx-suggest:${id}`, { user, time, data });
      return "success";
    } catch (error: any) {
      return error.message;
    }
  }
});
