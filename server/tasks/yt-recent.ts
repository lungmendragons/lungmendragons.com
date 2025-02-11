import { red, cyan } from "yoctocolors";

const isProd = process.env.NODE_ENV === "production";

function getDateNow() {
  return new Date(Date.now());
}

function sched(p: any): string {
  return p.scheduledTime
    ? new Date(p.scheduledTime).toLocaleString("en-GB")
    : "N/A"
}

export default defineTask({
  meta: {
    name: "yt-recent",
    description: "Fetch most recent video from the Lungmen Dragons YouTube channel",
  },
  run({ payload }) {
    if (!isProd) console.log(`${red("yt-recent")}:\n  scheduledTime: ${cyan(sched(payload))}\n  Date.now():    ${cyan(getDateNow().toLocaleString("en-GB"))}`);
    $fetch("/api/pages/home/yt", { method: "PUT" });
    return { result: "yt-recent task executed" };
  },
});
