export default defineTask({
  meta: {
    name: "gsheet",
    description: "Fetch SGL2 data from Google Sheets",
  },
  run({ payload }) {
    $fetch("/api/pages/sgl2/gsheet", {
      method: "PUT",
      body: { payload },
    });
    return { result: "gsheet task executed" };
  },
});
