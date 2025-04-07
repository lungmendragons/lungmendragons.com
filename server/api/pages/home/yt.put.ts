export default eventHandler(async (event) => {
  const id = readBody(event);

  try {
    const recent = await $fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YT_API_TOKEN}`,
      { method: "GET" }
    ) as any;
    await hubKV().set("home-yt-recent", recent);
    return "success";
  } catch (e) {
    console.error(e);
    return "error";
  }
});
