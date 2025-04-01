<script setup lang="ts">
import { createGachaSession, tenRoll, type BannerInfo, type RollResult } from "rs-app";

const totalPulls = ref(0);
const pity = ref(0);
const imageUrl = ref();

function doGacha() {
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
  const result: RollResult[] = tenRoll(session);
  console.log(result);

  $fetch("/api/pages/gachasim/image", {
    method: "PUT",
    body: result,
  })
    .then((res) => {
      imageUrl.value = URL.createObjectURL(res);
      totalPulls.value += result.length;
      if (result.filter((c) => c.rarity === 6).length > 0) {
        const i = result.findLastIndex((c) => c.rarity === 6);
        pity.value = 9 - i;
      } else {
        pity.value += 10;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<template>
  <div>
    <NButton @click="doGacha">pull</NButton>
    <br>
    Pulls: {{ totalPulls }}<br>
    Pity: {{ pity }}<br>
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Rotated">
    </div>
    <div v-else>
      waiting...
    </div>
  </div>
</template>