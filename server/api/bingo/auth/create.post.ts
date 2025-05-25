import { createToken, RoomActionKind } from "bingo-server/state-key";

export default eventHandler({
  // onRequest: [ requirePermission(AuthPermission.User) ],
  handler: async () => {
    return await createToken({
      expires: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
      room: { action: RoomActionKind.Create },
    });
  },
});
