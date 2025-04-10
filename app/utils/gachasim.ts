import { NuxtImg } from "#components";
import type { CSSProperties, VNode } from "vue";
import type { RollResult } from "rs-app";

export function bg(r: number): string {
  switch (r) {
    case 3: return "#3495eb";
    case 4: return "#dfbdf2";
    case 5: return "#fff0b8";
    case 6: return "#ed7b18";
    default: return "#000000";
  }
}

export function show(r: number, show: number): boolean {
  switch (r) {
    case 3: return (show & 0b0001) > 0;
    case 4: return (show & 0b0010) > 0;
    case 5: return (show & 0b0100) > 0;
    case 6: return (show & 0b1000) > 0;
    default: return false;
  }
}

function tenStyle(r: number, md: boolean): CSSProperties {
  return {
    backgroundColor: bg(r),
    width: md ? "80px" : "30px",
    height: md ? "220px" : "78px",
    objectFit: "cover",
  }
}

export function renderImgComponent(c: RollResult, md: boolean): VNode {
  return h(NuxtImg, {
    src: `https://raw.githubusercontent.com/fexli/ArknightsResource/refs/heads/main/charpor/${c.character}_1.png`,
    style: tenStyle(c.rarity, md),
  });
}

export async function getCNBannerData(): Promise<{
  banners: Array<{ id: string; offBanners: any[]; rateUp: any[] }>;
  characters: { [key: string]: string };
}> {
  const weedy: { gachaPoolClient: any[] } = await $fetch("https://weedy.prts.wiki/gacha_table.json");
  const banners = weedy.gachaPoolClient.map((b: any) => {
    return {
      id: b.gachaPoolId,
      offBanners: b.gachaPoolDetail.detailInfo.availCharInfo.perAvailList,
      rateUp: b.gachaPoolDetail.detailInfo.upCharInfo
        ? b.gachaPoolDetail.detailInfo.upCharInfo.perCharList
        : [],
      // objList: b.gachaPoolDetail.detailInfo.gachaObjList,
    };
  });

  const characterTableCNRaw: any = await $fetch("https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/refs/heads/master/zh_CN/gamedata/excel/character_table.json")
  const characterTableCN: { [key: string]: any } = JSON.parse(characterTableCNRaw);
  const characterIDs: string[] = Object.keys(characterTableCN);
  const appellations: { [key: string]: string } = {
    "ShiraYuki": "Shirayuki",
    "Гум": "Gummy",
    "Зима": "Zima",
    "Истина": "Istina",
    "Роса": "Rosa",
    "Позёмка": "Pozëmka",
    "Лето": "Leto",
  };

  const chars: Array<[string, string]> = characterIDs.map((c: string) => {
    const a = characterTableCN[c].appellation;
    return a in appellations
      ? [ c, appellations[a] ]
      : [ c, a ];
  });

  const characters: { [key: string]: string } = Object.fromEntries(chars);

  return { banners, characters };
}
