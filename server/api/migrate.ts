import { getMigrations } from "better-auth/db";

export default eventHandler({
  onRequest: [requirePermission(AuthPermission.Admin)],
  handler: async () => {
    const auth = serverAuth();
    const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
    if (!toBeCreated.length && !toBeAdded.length) {
      return "No migrations to run";
    }
    await runMigrations();
    return "Database migrations ran successfully";
  }
});
