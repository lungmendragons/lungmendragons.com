import fs from "node:fs";
import path from "node:path";

const akrPath = "submodules/ArknightsResource/";

export default eventHandler(async (event) => {
  const { folder } = event.context.params || {};
  const folderPath = path.resolve(akrPath, folder); // folder.name);
  const files = fs.readdirSync(folderPath);
  return files.length;
});
