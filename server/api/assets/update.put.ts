import path from "node:path";

export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async (event) => {
    const form = await readFormData(event);
    const files = form.getAll("files") as File[];
    const uploaded: string[] = [];

    for (const file of files) {
      const { name } = file;

      const exists = await useBlob().get(`akresource/${name}`);
      if (exists) {
        return `! skipped ${name} (already exists)`;
      }

      // 16MB (the good kind)
      if (file.size > (16 << 20)) {
        throw createError({
          statusCode: 413,
          statusMessage: "File rejected: File size must be less than 16MB",
        });
      }

      if (file.type != "image/png") {
        throw createError({
          statusCode: 415,
          statusMessage: "File rejected: File type must be `image/png`",
        });
      }

      try {
        const object = await useBlob().put(
          path.posix.join("akresource", name),
          file,
          { httpMetadata: { contentType: file.type } },
        );
        uploaded.push(`+ ${object.key}`);
      } catch (e: any) {
        throw createError({
          statusCode: 500,
          statusMessage: `Storage error: ${e.message}`,
        });
      }
    }

    return uploaded.join("\n");
  }
});
