import { createToken, serializeData } from "bingo-server/state-key";


export default eventHandler(async event => {
  return createToken(serializeData(
    Date.now() + 1000 * 60 * 2, // 2 minutes
    1,
  ));
});