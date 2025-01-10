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

export default eventHandler(async () => {
  const uploaded: string[] = [];

  for (const folder of akr) {
    const folderPath = path.resolve(akrPath, folder.name);
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (folder.filter && !folder.filter.some(f => file.startsWith(f)))
        continue;

      const fullPath = path.join(folderPath, file);
      const stats = fs.statSync(fullPath);
      const exists = await hubBlob().get(`akresource/${folder.name}/${file}`);

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
        const object = await hubBlob().put(fileName, blob, { prefix: `akresource/${folder.name}/` });
        uploaded.push(object.pathname);
        console.log(`Uploaded: ${fileName} to ${object.pathname}`);
      } catch (e: any) {
        throw createError({
          statusCode: 500,
          statusMessage: `Storage error: ${e.message}`,
        });
      }
    }
  }

  return `Uploaded ${uploaded.length} files:\n\n${uploaded.join("\n")}`;
});
