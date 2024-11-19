import type { BlobObject } from "@nuxthub/core";
import { assertMethod } from "h3";
import { nanoid } from "nanoid";
import sizeOf from "image-size";

export default eventHandler(async (event) => {
  assertMethod(event, [ "POST", "PUT", "PATCH" ]);

  const form = await readFormData(event);
  const file = form.get("files") as File; // "files" is the default
  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing file",
    });
  };

  try {
    ensureBlob(file, {
      maxSize: "2MB",
    });
  } catch (e: any) {
    throw createError({
      statusCode: 413,
      statusMessage: `File rejected: ${e.message}`,
    });
  }

  try {
    ensureBlob(file, {
      types: [ "image/png", "image/jpeg" ],
    });
  } catch (e: any) {
    throw createError({
      statusCode: 415,
      statusMessage: `File rejected: ${e.message}`,
    });
  }

  const uint8a = await file.arrayBuffer()
    .then(buf => new Uint8Array(buf));
  const { width, height } = sizeOf(uint8a);

  if (!width || !height) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid file",
    });
  };

  // todo: simple image crop function so this hardcoded enforcement is no longer needed
  // the available packages are surprisingly shit

  // got annoyed by an error i couldn't figure out which turned out to be because
  // the image was 110x111, so giving a bit of room for error here
  if (width / height > 1.01 || height / width > 1.01) {
    throw createError({
      statusCode: 418,
      statusMessage: "File rejected: Image must be square",
    });
  };

  const ext = file.name.split(".").pop();
  const id = nanoid(16);
  const unique = `${id}.${ext}`;

  // i don't understand why it needs to be an array but it doesn't work otherwise
  const objects: BlobObject[] = [];
  try {
    const object = await hubBlob().put(unique, file, { prefix: "avatar/" });
    objects.push(object);
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Storage error: ${e.message}`,
    });
  }

  return objects;
});
