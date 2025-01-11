import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

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

  // @ts-expect-error length does not exist on type
  return assets.data.length;
});
