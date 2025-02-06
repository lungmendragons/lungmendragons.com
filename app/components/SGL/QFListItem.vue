<script setup lang="ts">
import Link from "~/components/Link.global.vue";
import { NHighlight, useThemeVars } from "naive-ui";
import type { RunData, RowDataSorted } from "~/utils/events-archive/sgl2";
import { useMediaQuery } from "@vueuse/core";
import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";

const { data } = defineProps<{ data: RowDataSorted }>();
const themeVars = useThemeVars();
const isMD = useMediaQuery(mediaQuery.minWidth.md as string);
const altPattern = [ "1a", "2a", "3a", "4a" ];

const styleHigh = {
  padding: "0 6px",
  fontWeight: "bold",
  borderRadius: "4px",
  background: `${themeVars.value.primaryColor}11`,
  border: `1px solid ${themeVars.value.primaryColor}77`,
}

const styleLow = {
  padding: "0 6px",
  fontWeight: "bold",
  borderRadius: "4px",
  background: "#8882",
}

const run1Style = data.run1.score > data.run2.score ? styleHigh : styleLow;
const run2Style = data.run2.score > data.run1.score ? styleHigh : styleLow;
const run1Multi = data.run1.score > data.run2.score ? "x0.7" : "x0.3";
const run2Multi = data.run2.score > data.run1.score ? "x0.7" : "x0.3";

const endingsStyle = {
  fontSize: "0.675rem",
  lineHeight: "0.75rem",
  textAlign: "center",
  width: "65px",
  marginTop: "0.125rem",
  marginBottom: "0.375rem",
  color: "#999",
}

const endingsHighlightStyle = {
  color: themeVars.value.primaryColor,
  background: "transparent",
}

function getEndingNames(run: RunData) {
  const e = [];
  if (run.endings.includes("ed1")) e.push("1");
  if (run.endings.includes("ed1alt")) e.push("1a");
  if (run.endings.includes("ed2")) e.push("2");
  if (run.endings.includes("ed2alt")) e.push("2a");
  if (run.endings.includes("ed3")) e.push("3");
  if (run.endings.includes("ed3alt")) e.push("3a");
  if (run.endings.includes("ed4")) e.push("4");
  if (run.endings.includes("ed4alt")) e.push("4a");
  return `ED ${e.join("/")}`;
}
</script>

<template>
  <NFlex :vertical="!isMD">
    <NFlex
      :vertical="isMD"
      :align="isMD ? 'start' : 'center'"
      style="min-width: 300px">
      <NFlex align="center">
        <span :style="{
          fontWeight: 'bold',
          fontSize: '1.25rem',
          color: data.rank < 5 ? '#138732' : '#888'
        }">
          {{ data.rank }}
        </span>
        <span class="text-xl font-bold">
          {{ data.player }}
        </span>
      </NFlex>
      <NFlex align="center" size="small">
        <Link :to="data.run1.video">
          <NButton text>
            <NIcon :size="20" style="top:4px">
              <Fa6BrandsYoutube />
            </NIcon>
          </NButton>
        </Link>
        <div class="text-xs leading-3 mr-2">
          RUN 1
          <br>
          <span class="text-[0.6rem]">{{ data.run1.time }}</span>
        </div>
        <Link :to="data.run2.video">
          <NButton text>
            <NIcon :size="20" style="top:4px">
              <Fa6BrandsYoutube />
            </NIcon>
          </NButton>
        </Link>
        <div class="text-xs leading-3">
          RUN 2
          <br>
          <span class="text-[0.6rem]">{{ data.run2.time }}</span>
        </div>
      </NFlex>
    </NFlex>
    <NFlex align="center" :size="6">
      <NFlex
        vertical
        align="center"
        :size="0"
        :style="run1Style">
        <span class="text-[0.675rem] leading-[0.75rem] mt-1.5">
          {{ run1Multi }}
        </span>
        {{ data.run1.score }}
        <NHighlight
          :text="getEndingNames(data.run1)"
          :patterns="altPattern"
          :style="endingsStyle"
          :highlight-style="endingsHighlightStyle"
        />
      </NFlex>
      <NFlex
        vertical
        align="center"
        :size="0"
        :style="run2Style">
        <span class="text-[0.675rem] leading-[0.75rem] mt-1.5">
          {{ run2Multi }}
        </span>
        {{ data.run2.score }}
        <NHighlight
          :text="getEndingNames(data.run2)"
          :patterns="altPattern"
          :style="endingsStyle"
          :highlight-style="endingsHighlightStyle"
        />
      </NFlex>
      <NFlex
        vertical
        class="text-2xl font-bold"
        :size="2">
        <span :style="{ color: data.rank < 5 ? '' : '#888' }">
          = {{ data.total }}
        </span>
        <NTag
          v-if="data.rank < 5"
          size="small"
          :bordered="false"
          :color="{ color: '#13873255' }">
          Advance to finals
        </NTag>
      </NFlex>
    </NFlex>
  </NFlex>
</template>
