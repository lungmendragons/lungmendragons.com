import type { BlobObject } from "@nuxthub/core";
import { assertMethod } from "h3";
import { nanoid } from "nanoid";

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

  // todo: simple image crop function
  // currently non-square images are going to be stretched and squished but it is what it is

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
