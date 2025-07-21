export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async (event) => {
    const body = await readBody(event);
    const id = body.id;

    try {
      const recent = await $fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&fields=items(id,snippet(title,description,publishedAt))&id=${id}&key=${process.env.YT_API_TOKEN}`,
        { method: "GET" }
      ) as any;
      console.log(recent);
      if (!recent.items[0]) return "empty";
      await useKV().set("home-yt-recent", recent);
      return "success";
    } catch (e) {
      console.error(e);
      return "error";
    }
  }
});