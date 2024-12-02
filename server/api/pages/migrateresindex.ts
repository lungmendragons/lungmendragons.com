// temp - to remove after tools added to KV

import { toolIndex } from "~/utils/resources/tools";
import { nanoid } from "nanoid";

export default eventHandler(async () => {
  for (const tool of toolIndex) {
    const key = nanoid(8);
    await hubKV().set(`resourceindex:${key}`, tool);
  }
  return "resindex migrated";
});
