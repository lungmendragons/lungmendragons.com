import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

export default cachedEventHandler(async () => {
  const tree = await octokit.request("GET /repos/{owner}/{repo}/git/trees/{tree_sha}", {
    owner: "fexli",
    repo: "ArknightsResource",
    tree_sha: "df6c6721e17fbd62428d681efbe6d6dbcc289948",
    recursive: "true",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return tree;
}, {
  maxAge: 3600, // 1 hour
  getKey: event => event.path,
});
