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
    src: `https://lungmendragons.com/images/akresource/charpor/${c.character}_1.png`,
    style: tenStyle(c.rarity, md),
  });
}

export const charImg = [
  { name: "Hibiscus", character: "char_120_hibisc", rarity: 3 },
  { name: "Lava", character: "char_121_lava", rarity: 3 },
  { name: "Beagle", character: "char_122_beagle", rarity: 3 },
  { name: "Fang", character: "char_123_fang", rarity: 3 },
  { name: "Kroos", character: "char_124_kroos", rarity: 3 },
  { name: "Gitano", character: "char_109_fmout", rarity: 4 },
  { name: "Deepcolor", character: "char_110_deepcl", rarity: 4 },
  { name: "Myrrh", character: "char_117_myrrh", rarity: 4 },
  { name: "Shirayuki", character: "char_118_yuki", rarity: 4 },
  { name: "Meteor", character: "char_126_shotst", rarity: 4 },
  { name: "Dobermann", character: "char_130_doberm", rarity: 4 },
  { name: "May", character: "char_133_mm", rarity: 4 },
  { name: "Beehunter", character: "char_137_brownb", rarity: 4 },
  { name: "(141_nights)", character: "char_141_nights", rarity: 4 },
  { name: "Scavenger", character: "char_149_scave", rarity: 4 },
  { name: "Cuora", character: "char_150_snakek", rarity: 4 },
  { name: "Sora", character: "char_101_sora", rarity: 5 },
  { name: "Texas", character: "char_102_texas", rarity: 5 },
  { name: "Franka", character: "char_106_franka", rarity: 5 },
  { name: "Liskarm", character: "char_107_liskam", rarity: 5 },
  { name: "Silence", character: "char_108_silent", rarity: 5 },
  { name: "(115_headbr)", character: "char_115_headbr", rarity: 5 },
  { name: "Ptilopsis", character: "char_128_plosis", rarity: 5 },
  { name: "Blue Poison", character: "char_129_bluep", rarity: 5 },
  { name: "Astgenne", character: "char_135_halo", rarity: 5 },
  { name: "Lappland", character: "char_140_whitew", rarity: 5 },
  { name: "Specter", character: "char_143_ghost", rarity: 5 },
  { name: "Projekt Red", character: "char_144_red", rarity: 5 },
  { name: "Provence", character: "char_145_prove", rarity: 5 },
  { name: "Nearl", character: "char_148_nearl", rarity: 5 },
  { name: "Kal'tsit", character: "char_003_kalts", rarity: 6 },
  { name: "Ch'en", character: "char_010_chen", rarity: 6 },
  { name: "Blaze", character: "char_017_huang", rarity: 6 },
  { name: "Exusiai", character: "char_103_angel", rarity: 6 },
  { name: "Siege", character: "char_112_siege", rarity: 6 },
  { name: "(113_cqbw)", character: "char_113_cqbw", rarity: 6 },
  { name: "Ifrit", character: "char_134_ifrit", rarity: 6 },
  { name: "Hoshiguma", character: "char_136_hsguma", rarity: 6 },
  { name: "Shining", character: "char_147_shining", rarity: 6 },
  { name: "Muelsyse", character: "char_249_mlyss", rarity: 6 },
];
