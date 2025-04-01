import sharp from "sharp";
import type { RollResult } from "rs-app";

function bg(r: number) {
  switch (r) {
    case 3: return "#3495eb";
    case 4: return "#dfbdf2";
    case 5: return "#fff0b8";
    case 6: return "#ed7b18";
    default: return "#000000";
  }
}

export default eventHandler(async (event) => {
  const rollResults: RollResult[] = await readBody(event);
  const path = "akresource/charpor/";
  const bufArray = [];

  for (let i = 0; i < rollResults.length; i++) {
    const img = await hubBlob().get(`${path}${rollResults[i].character}_1.png`)
    if (img) bufArray.push(await img.arrayBuffer());
  }

  const sharpArray = [];

  for (let i = 0; i < bufArray.length; i++) {
    const output = await sharp(bufArray[i])
      .resize(120, 360)
      .flatten( { background: bg(rollResults[i].rarity) } )
      .toBuffer();
    sharpArray.push(output);
  }

  const data = await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: sharpArray[0], left: 40, top: 180 },
      { input: sharpArray[1], left: 40 + (120 * 1), top: 180 },
      { input: sharpArray[2], left: 40 + (120 * 2), top: 180 },
      { input: sharpArray[3], left: 40 + (120 * 3), top: 180 },
      { input: sharpArray[4], left: 40 + (120 * 4), top: 180 },
      { input: sharpArray[5], left: 40 + (120 * 5), top: 180 },
      { input: sharpArray[6], left: 40 + (120 * 6), top: 180 },
      { input: sharpArray[7], left: 40 + (120 * 7), top: 180 },
      { input: sharpArray[8], left: 40 + (120 * 8), top: 180 },
      { input: sharpArray[9], left: 40 + (120 * 9), top: 180 },
    ])
    .png()
    .toBuffer();

  return new Blob([data], { type: "image/png" });
});
