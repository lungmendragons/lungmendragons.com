import fs from "node:fs";
import path from "node:path";

const akrPath = "submodules/ArknightsResource/";
const akr = [
  { name: "camplogo", filter: null },
  { name: "charpor", filter: null },
  { name: "equip", filter: null },
  { name: "equipt", filter: null },
  { name: "equiptc", filter: null },
  { name: "skills", filter: null },

  { name: "avatar/ASSISTANT", filter: [ "char_", "token_" ] },
  { name: "charpack", filter: [ "char_" ] },
  { name: "items", filter: [ "MTL_" ] },
  { name: "kvimg", filter: [ "brand_" ] },
];

export default eventHandler(async (event) => {
  const { folder } = event.context.params || {};
  const uploaded: string[] = [];
  console.log(folder);

  const folderPath = path.resolve(akrPath, folder); // folder.name);
  const files = fs.readdirSync(folderPath);

  // @ts-expect-error possible undefined
  const filter = akr.find(f => f.name === folder).filter || null;

  for (const file of files) {
    if (filter && !filter.some(f => file.startsWith(f)))
      continue;

    const fullPath = path.join(folderPath, file);
    const stats = fs.statSync(fullPath);
    const exists = await hubBlob().get(`akresource/${folder}/${file}`);

    if (exists || !stats.isFile()) {
      console.log(`Skipped: ${file}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(fullPath);
    const blob = new Blob([ fileBuffer ], { type: "image/png" });

    try {
      ensureBlob(blob, {
        maxSize: "16MB",
      });
    } catch (e: any) {
      throw createError({
        statusCode: 413,
        statusMessage: `File rejected: ${e.message}`,
      });
    }

    try {
      ensureBlob(blob, {
        types: [ "image/png" ],
      });
    } catch (e: any) {
      throw createError({
        statusCode: 415,
        statusMessage: `File rejected: ${e.message}`,
      });
    }

    try {
      const object = await hubBlob().put(fileName, blob, { prefix: `akresource/${folder}/` });
      uploaded.push(object.pathname);
      // console.log(`Uploaded: ${fileName} to ${object.pathname}`);
    } catch (e: any) {
      throw createError({
        statusCode: 500,
        statusMessage: `Storage error: ${e.message}`,
      });
    }
  }

  return `Uploaded ${uploaded.length} files:\n${uploaded.join("\n")}\n`;
});
