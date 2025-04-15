import mime from "mime";

export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event);
  setHeader(event, "Content-Security-Policy", "default-src 'none';");
  const object = await useBlob().get(decodeURIComponent(pathname));
  if (!object) {
    throw createError({ message: "File not found", statusCode: 404 });
  }
  setHeader(
    event,
    "Content-Type",
    object.httpMetadata?.contentType ||
      mime.getType(pathname) ||
      "application/octet-stream"
  );
  setHeader(event, "Content-Length", object.size);
  setHeader(event, "etag", object.httpEtag);

  return object.body;
});
