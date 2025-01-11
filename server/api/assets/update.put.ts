export default eventHandler(async (event) => {
  const form = await readFormData(event);
  const files = form.getAll("files") as File[];
  const uploaded: string[] = [];

  for (const file of files) {
    const { name } = file;

    const exists = await hubBlob().get(`akresource/${name}`);
    if (exists) {
      return `! skipped ${name} (already exists)`;
    }

    try {
      ensureBlob(file, {
        maxSize: "16MB",
      });
    } catch (e: any) {
      throw createError({
        statusCode: 413,
        statusMessage: `File rejected: ${e.message}`,
      });
    }

    try {
      ensureBlob(file, {
        types: [ "image/png" ],
      });
    } catch (e: any) {
      throw createError({
        statusCode: 415,
        statusMessage: `File rejected: ${e.message}`,
      });
    }

    const path = name.split("/");
    try {
      const object = await hubBlob().put(path.slice(-1)[0], file, { prefix: `akresource/${path.slice(0, -1).join("/")}/` });
      uploaded.push(`+ ${object.pathname}`);
    } catch (e: any) {
      throw createError({
        statusCode: 500,
        statusMessage: `Storage error: ${e.message}`,
      });
    }
  }

  return uploaded.join("\n");
});
