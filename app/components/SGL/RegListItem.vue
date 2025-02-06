<script setup lang="ts">
import { NHighlight, useThemeVars } from "naive-ui";
import type { RegData } from "~/utils/events-archive/sgl2";

const { data } = defineProps<{ data: RegData }>();
const themeVars = useThemeVars();
const altPattern = [ "1a", "2a", "3a", "4a" ];
const playerName = data.player.split("#")

const endingsStyle = {
  textAlign: "left",
  color: "#bbb",
}

const endingsHighlightStyle = {
  color: themeVars.value.primaryColor,
  background: "transparent",
}

function getEndingNames() {
  const e = [];
  if (data.endings.includes("ed1")) e.push([ "1", "Lofty Silverfrost" ]);
  if (data.endings.includes("ed1alt")) e.push([ "1a", "Ice-Cold Image" ]);
  if (data.endings.includes("ed2")) e.push([ "2", "Sami's Entropy" ]);
  if (data.endings.includes("ed2alt")) e.push([ "2a", "Hollow Visage" ]);
  if (data.endings.includes("ed3")) e.push([ "3", "Gardener" ]);
  if (data.endings.includes("ed3alt")) e.push([ "3a", "Sentinel" ]);
  if (data.endings.includes("ed4")) e.push([ "4", "Sands of Time" ]);
  if (data.endings.includes("ed4alt")) e.push([ "4a", "Enter Eternity" ]);
  return e;
}
</script>

<template>
  <NGrid x-gap="12" :cols="2">
    <NGi class="text-right text-base sm:text-xl leading-6 font-bold">
      {{ playerName[0] }}
      <span class="text-neutral-500">#{{ playerName[1] }}</span>
    </NGi>
    <NGi>
      <div style="display: grid; grid-template-columns: 12px 1fr; gap: 0 12px">
        <template v-for="ending in getEndingNames()" :key="ending[0]">
          <div style="grid-column: span 1 / span 1; font-size: 0.75rem; line-height: 1rem">
            <NHighlight
              :text="ending[0]"
              :patterns="altPattern"
              :style="endingsStyle"
              :highlight-style="endingsHighlightStyle"
            />
          </div>
          <div style="grid-column: span 1 / span 1; font-size: 0.75rem; line-height: 1rem">
            {{ ending[1] }}
          </div>
        </template>
        <template v-if="getEndingNames().length < 3">
          <div style="grid-column: span 1 / span 1; font-size: 0.75rem; line-height: 1rem">
            &nbsp;
          </div>
        </template>
      </div>
    </NGi>
  </NGrid>
</template>
