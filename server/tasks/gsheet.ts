import { green, yellow } from "yoctocolors";

const isProd = process.env.NODE_ENV === "production";

function getDateNow() {
  return new Date(Date.now());
}

function log(x: "run" | "done") {
  if (!isProd) {
    switch (x) {
      case "run":
        console.log(`gsheet: ${yellow("running")} at ${getDateNow().toLocaleString("en-GB")}`);
        break;
      case "done":
        console.log(`gsheet: ${green("done")} at ${getDateNow().toLocaleString("en-GB")}`);
        break;
    }
  }
}

export default defineTask({
  meta: {
    name: "gsheet",
    description: "Fetch SGL2 data from Google Sheets",
  },
  async run({ context, payload }) {
    log("run");
    const res = await $fetch("/api/pages/sgl2/gsheet");
    const kv = await hubKV().get("sgl2-update-log") as Array<any>;
    const update = {
      time: getDateNow(),
      value: res,
      context,
      payload,
    };

    if (!kv)
      await hubKV().set("sgl2-update-log", [ update ]);
    else
      await hubKV().set("sgl2-update-log", [ ...kv, update ]);

    if (res === "success") {
      log("done");
      return { result: "SGL2 data updated" };
    } else {
      return { result: "Error fetching SGL2 data" };
    }
  },
});
