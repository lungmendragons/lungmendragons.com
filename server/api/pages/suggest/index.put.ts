import { nanoid } from "nanoid";

export default eventHandler(async (event) => {
  const { user, time, data } = await readBody(event);
  const id = nanoid(8);

  try {
    await useKV().set(`residx-suggest:${id}`, { user, time, data });
    return "success";
  } catch (error: any) {
    return error.message;
  }
});
