export default defineTask({
  meta: {
    name: "gsheet",
    description: "Fetch SGL2 data from Google Sheets",
  },
  async run() {
    const res = await $fetch("/api/pages/sgl2/gsheet");
    if (res === "success") {
      return { result: "SGL2 data updated" };
    } else {
      return { result: "Error fetching SGL2 data" };
    }
  },
});
