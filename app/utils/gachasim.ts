import { NuxtImg } from "#components";
import type { CSSProperties, VNode } from "vue";

function bg(r: number) {
  switch (r) {
    case 3: return "#3495eb";
    case 4: return "#dfbdf2";
    case 5: return "#fff0b8";
    case 6: return "#ed7b18";
    default: return "#000000";
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

export function renderImgComponent(char: string, rarity: number, md: boolean): VNode {
  return h(NuxtImg, {
    src: `https://lungmendragons.com/images/akresource/charpor/${char}_1.png`,
    style: tenStyle(rarity, md),
  });
}

export const charImg = [
  { character: "char_120_hibisc", rarity: 3 },
  { character: "char_121_lava", rarity: 3 },
  { character: "char_122_beagle", rarity: 3 },
  { character: "char_123_fang", rarity: 3 },
  { character: "char_124_kroos", rarity: 3 },
  { character: "char_109_fmout", rarity: 4 },
  { character: "char_110_deepcl", rarity: 4 },
  { character: "char_117_myrrh", rarity: 4 },
  { character: "char_118_yuki", rarity: 4 },
  { character: "char_126_shotst", rarity: 4 },
  { character: "char_130_doberm", rarity: 4 },
  { character: "char_133_mm", rarity: 4 },
  { character: "char_137_brownb", rarity: 4 },
  { character: "char_141_nights", rarity: 4 },
  { character: "char_149_scave", rarity: 4 },
  { character: "char_150_snakek", rarity: 4 },
  { character: "char_101_sora", rarity: 5 },
  { character: "char_102_texas", rarity: 5 },
  { character: "char_106_franka", rarity: 5 },
  { character: "char_107_liskam", rarity: 5 },
  { character: "char_108_silent", rarity: 5 },
  { character: "char_115_headbr", rarity: 5 },
  { character: "char_128_plosis", rarity: 5 },
  { character: "char_129_bluep", rarity: 5 },
  { character: "char_135_halo", rarity: 5 },
  { character: "char_140_whitew", rarity: 5 },
  { character: "char_143_ghost", rarity: 5 },
  { character: "char_144_red", rarity: 5 },
  { character: "char_145_prove", rarity: 5 },
  { character: "char_148_nearl", rarity: 5 },
  { character: "char_003_kalts", rarity: 6 },
  { character: "char_010_chen", rarity: 6 },
  { character: "char_017_huang", rarity: 6 },
  { character: "char_103_angel", rarity: 6 },
  { character: "char_112_siege", rarity: 6 },
  { character: "char_113_cqbw", rarity: 6 },
  { character: "char_134_ifrit", rarity: 6 },
  { character: "char_136_hsguma", rarity: 6 },
  { character: "char_147_shining", rarity: 6 },
  { character: "char_249_mlyss", rarity: 6 },
];
