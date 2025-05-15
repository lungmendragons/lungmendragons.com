import { createToken, RoomActionKind } from "bingo-server/state-key";

export default eventHandler(async (event) => {
  const { room } = event.context.params || {};

  return await createToken({
    expires: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
    room: { action: RoomActionKind.Join, room },
  });
});
