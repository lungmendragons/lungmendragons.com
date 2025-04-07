export default eventHandler(async () => {
  try {
    const res = await $fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCS4VAQlO-ON54Ilt5ZUbdmg&key=${process.env.YT_API_TOKEN}`,
      { method: "GET" }
    ) as any;
    const uploadsList = res.items[0].contentDetails.relatedPlaylists.uploads;
    const recent = await $fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsList}&maxResults=1&key=${process.env.YT_API_TOKEN}`,
      { method: "GET" }
    ) as any;
    await hubKV().set("home-yt-recent", recent);
    return recent;
  } catch (e) {
    console.error(e);
    return "error";
  }
});
