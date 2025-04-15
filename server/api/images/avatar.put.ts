import { assertMethod } from "h3";
import { nanoid } from "nanoid";
import path from "node:path";

export default eventHandler(async (event) => {
  assertMethod(event, ["POST", "PUT", "PATCH"]);

  const form = await readFormData(event);
  const file = form.get("files") as File; // "files" is the default
  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing file",
    });
  };

  if (file.size > (2 << 20)) {
    throw createError({
      statusCode: 413,
      statusMessage: "File rejected: File size must be less than 2MB",
    });
  }
  
  let ext: string;

  switch (file.type) {
    case "image/png":
      ext = "png";
      break;
    case "image/jpeg":
      ext = "jpeg";
      break;
    default:
      throw createError({
        statusCode: 415,
        statusMessage: "File rejected: File type must be `image/png` or `image/jpeg`",
      });
  }

  // todo: simple image crop function
  // currently non-square images are going to be stretched and squished but it is what it is

  const id = nanoid(16);
  const unique = `${id}.${ext}`;

  try {
    const object = await useBlob().put(path.join("avatar", unique), file);
    // i don't understand why it needs to be an array but it doesn't work otherwise
    return [object];
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Storage error: ${e.message}`,
    });
  }
});
