import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

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

  const assets = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "fexli",
    repo: "ArknightsResource",
    path: folder,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const uploaded: string[] = [];
  let skipped = 0;

  // @ts-expect-error possible undefined
  const filter = akr.find(f => f.name === folder).filter || null;

  // @ts-expect-error must be iterator
  for (const file of assets.data) {
    if (file.type !== "file") {
      skipped++;
      continue;
    }

    if (filter && !filter.some(f => file.name.startsWith(f))) {
      skipped++;
      continue;
    }

    const exists = await hubBlob().get(`akresource/${file.path}`);
    if (exists) {
      skipped++;
      continue;
    }

    const response = await fetch(file.download_url);
    if (response.status !== 200) {
      throw createError({
        statusCode: response.status,
        statusMessage: `File rejected: ${response.statusText}`,
      });
    }

    const imgBlob = await response.blob();
    const blob = new Blob([ imgBlob ], { type: "image/png" });

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
      const object = await hubBlob().put(file.name, blob, { prefix: `akresource/${folder}/` });
      uploaded.push(object.pathname);
      // console.log(`Uploaded: ${fileName} to ${object.pathname}`);
    } catch (e: any) {
      throw createError({
        statusCode: 500,
        statusMessage: `Storage error: ${e.message}`,
      });
    }
  }

  return `Uploaded ${uploaded.length} files:\n${uploaded.join("\n")}\n(Skipped ${skipped} files)\n`;
});
