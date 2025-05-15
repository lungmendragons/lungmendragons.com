import { createToken, RoomActionKind } from "bingo-server/state-key";

export default eventHandler(async event => {
  return await createToken({
    expires: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
    room: { action: RoomActionKind.Create },
  });
});