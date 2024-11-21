import { nanoid } from "nanoid";

export default eventHandler(async (event) => {
  const key = nanoid(8);
  const { body } = await readBody(event);

  await hubKV().set(`notifs:${key}`, body);

  return { key, body };
});
