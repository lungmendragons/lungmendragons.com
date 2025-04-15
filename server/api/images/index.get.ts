export default eventHandler(async () => {
  const { objects } = await useBlob().list({
    limit: 1000,
    include: ["httpMetadata"],
  });

  return objects;
});
