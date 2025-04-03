<script setup lang="ts">
import { createGachaSession, tenRoll, type BannerInfo, type RollResult } from "rs-app";
import { useMediaQuery } from "@vueuse/core";
import { renderImgComponent, charImg } from "~/utils/gachasim";

definePageMeta({
  auth: { only: "member" },
});

const totalPulls = ref(0);
const pity = ref(0);
const result = ref<RollResult[]>([]);
const count6 = ref(0);
const count5 = ref(0);
const count4 = ref(0);
const count3 = ref(0);
const isMD = useMediaQuery(mediaQuery.minWidth.md);

async function doGacha() {
  const bannerInfo: BannerInfo = {
    rate_up: {
      six: [
        "char_249_mlyss",
        ],
      five: [
        "char_135_halo",
        "char_108_silent",
      ],
      four: [],
      three: [],
    },
    off_banner: {
      six: [
        "char_003_kalts",
        "char_010_chen",
        "char_017_huang",
        "char_103_angel",
        "char_112_siege",
        "char_113_cqbw",
        "char_134_ifrit",
        "char_136_hsguma",
        "char_147_shining",
      ],
      five: [
        "char_101_sora",
        "char_102_texas",
        "char_106_franka",
        "char_107_liskam",
        "char_115_headbr",
        "char_128_plosis",
        "char_129_bluep",
        "char_140_whitew",
        "char_143_ghost",
        "char_144_red",
        "char_145_prove",
        "char_148_nearl",
      ],
      four: [
        "char_109_fmout",
        "char_110_deepcl",
        "char_117_myrrh",
        "char_118_yuki",
        "char_126_shotst",
        "char_130_doberm",
        "char_133_mm",
        "char_137_brownb",
        "char_141_nights",
        "char_149_scave",
        "char_150_snakek",
      ],
      three: [
        "char_120_hibisc",
        "char_121_lava",
        "char_122_beagle",
        "char_123_fang",
        "char_124_kroos",
      ],
    },
  };

  const session = createGachaSession(bannerInfo);
  const res = tenRoll(session);
  result.value = res;
  res.forEach((c) => {
    switch (c.rarity) {
      case 6:
        count6.value++;
        break;
      case 5:
        count5.value++;
        break;
      case 4:
        count4.value++;
        break;
      case 3:
        count3.value++;
        break;
      default:
        break;
    }
  });
  totalPulls.value += 10;
  if (result.value.filter((c) => c.rarity === 6).length > 0) {
    const i = result.value.findLastIndex((c) => c.rarity === 6);
    pity.value = 9 - i;
  } else {
    pity.value += 10;
  }
}
</script>

<template>
  <div>
    <NButton @click="doGacha">pull</NButton>
    <br>
    Pulls: {{ totalPulls }}<br>
    Pity: {{ pity }}<br>
    isMD: {{ isMD }}<br>
    <div v-if="result.length === 10">
      <NFlex
        :size="isMD ? [4,4] : [2,2]"
        justify="center"
        class="my-8">
        <component :is="renderImgComponent(result[0]!.character, result[0]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[1]!.character, result[1]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[2]!.character, result[2]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[3]!.character, result[3]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[4]!.character, result[4]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[5]!.character, result[5]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[6]!.character, result[6]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[7]!.character, result[7]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[8]!.character, result[8]!.rarity, isMD)" />
        <component :is="renderImgComponent(result[9]!.character, result[9]!.rarity, isMD)" />
      </NFlex>
    </div>
    <div v-else>
      waiting...
    </div>
    <div>
      6: {{ count6 }}<br>
      5: {{ count5 }}<br>
      4: {{ count4 }}<br>
      3: {{ count3 }}<br>
    </div>
    <Teleport to="#teleports">
      <div>
        <component
          v-for="c in charImg"
          :key="c.character"
          v-show="false"
          :is="renderImgComponent(c.character, c.rarity, isMD)"
        />
      </div>
    </Teleport>
  </div>
</template>