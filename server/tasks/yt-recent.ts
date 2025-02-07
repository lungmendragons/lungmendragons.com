export default defineTask({
  meta: {
    name: "yt-recent",
    description: "Fetch most recent video from the Lungmen Dragons YouTube channel",
  },
  async run() {
    const res = await $fetch("/api/pages/home/yt", { method: "PUT" });
    if (res === "success") {
      return { result: "Recent video updated" };
    } else {
      return { result: "Error fetching recent video" };
    }
  },
});
