export default eventHandler(async (event) => {
  const { key } = await readBody(event);

  try {
    await hubKV().del(key);
    return "success";
  } catch (error: any) {
    return error.message;
  }
});
