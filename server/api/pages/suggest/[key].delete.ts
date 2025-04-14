export default eventHandler(async (event) => {
  const { key } = event.context.params || {};

  try {
    await hubKV().del(key);
    return "success";
  } catch (error: any) {
    return error.message;
  }
});
