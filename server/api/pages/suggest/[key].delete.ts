export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async (event) => {
    const { key } = event.context.params || {};

    try {
      if(key) {
        await useKV().del(key);
        return "success";
      } else {
        return "no key specified";
      }
    } catch (error: any) {
      return error.message;
    }
  }
});
