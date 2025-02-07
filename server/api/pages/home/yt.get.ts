export default eventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const res = await $fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCS4VAQlO-ON54Ilt5ZUbdmg&key=${config.ytApiToken}`,
    { method: "GET" }
  ) as any;

  const uploadsList = res.items[0].contentDetails.relatedPlaylists.uploads;

  const recent = await $fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsList}&maxResults=1&key=${config.ytApiToken}`,
    { method: "GET" }
  ) as any;

  return recent;
});
