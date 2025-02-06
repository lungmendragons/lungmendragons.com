<script setup lang="ts">
import { NScrollbar } from "naive-ui";
import { useMediaQuery } from "@vueuse/core";
import SGLRegListItem from "~/components/SGL/RegListItem.vue";
import SGLQFListItem from "~/components/SGL/QFListItem.vue";
import type { RowData, RowDataSorted, RegData } from "~/utils/events-archive/sgl2";
import PhEmptyBold from '~icons/ph/empty-bold?width=256px&height=256px';

const isMD = useMediaQuery(mediaQuery.minWidth.md as string);
const data = await $fetch("/api/pages/sgl2/all", { method: "GET" });
const qf = data.qf as RowData[];
const reg = data.reg as RegData[];

function regSort(): RegData[] {
  return reg
    .filter((entry) => entry.valid)
    .sort((a, b) => a.player.localeCompare(b.player));
}

function qfSort(): RowDataSorted[] {
  return qf
    .filter((entry) => entry.total > 0) // "" > 0 evaluates to false
    .sort((a, b) => b.total - a.total)
    .map((entry, index) => {
      return {
        rank: index + 1,
        ...entry,
      }
    });
}

onBeforeMount(() => qfSort());
</script>

<template>
  <div id="sgl2">
    <NScrollbar>
      <img
        src="/ld-events/sgl2/logo.png"
        alt="SGL2 Logo"
        class="max-w-full max-h-[150px] px-[5%] mx-auto mt-4">
      <div class="my-2">
        <div class="mx-4 mb-2 md:mb-0 text-xs lg:text-sm text-center text-white drop-shadow-[0_0_1px_black]">
          Skywalking Global League #2: Season Frost Crown is a D15 IS4
          Integrated Strategies tournament held in collaboration by:
        </div>
        <div class="mx-auto w-fit text-xs lg:text-sm text-center text-white font-bold">
          <span class="italic">Babel&nbsp;Progressors&nbsp;</span><span class="font-medium">[SC]</span>,
          <span class="italic">Lungmen&nbsp;Dragons&nbsp;</span><span class="font-medium">[EN]</span>,
          <span class="italic">Ae?&#8288;gir&nbsp;Organizing&nbsp;Committee&nbsp;</span><span class="font-medium">[TC]</span>,
          <span class="italic">Team&nbsp;Keo&nbsp;</span><span class="font-medium">[KR]</span>,
          and
          <span class="italic">Projekt&nbsp;Fuji&nbsp;</span><span class="font-medium">[JP]</span>.
        </div>
        <div class="mx-4 mt-2 text-xs lg:text-sm text-center text-white drop-shadow-[0_0_1px_black]">
          Registration ends:
          <NTime
            :time="1740034740000"
            format="yyyy-MM-dd hh:mm"
            class="font-bold"
          />
          <span class="italic">
            (<NTime :time="1740034740000" type="relative" />)
          </span>
        </div>
        <div class="mx-4 text-xs lg:text-sm text-center text-white drop-shadow-[0_0_1px_black]">
          Live qualifiers end:
          <NTime
            :time="1740639540000"
            format="yyyy-MM-dd hh:mm"
            class="font-bold"
          />
          <span class="italic">
            (<NTime :time="1740639540000" type="relative" />)
          </span>
        </div>
        <div class="mx-4 italic text-xs text-center text-white drop-shadow-[0_0_1px_black]">
          Shown in your timezone: [{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}]
        </div>
      </div>
      <NFlex
        justify="center"
        align="center"
        class="text-xs md:text-sm my-4">
        <NuxtLink to="https://forms.gle/2idKuHk9pK5nVGnf9" target="_blank">
          <NButton
            :size="isMD ? 'medium' : 'small'"
            type="primary"
            icon-placement="right">
            <template #icon>
              <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" />
            </template>
            Register
          </NButton>
        </NuxtLink>
        <NuxtLink to="https://docs.google.com/document/d/1TteQ9YokVLr83krA5S2GBjfrz7bN2D1f5F3PndA2Ktc" target="_blank">
          <NButton
            :size="isMD ? 'medium' : 'small'"
            type="primary"
            icon-placement="right">
            <template #icon>
              <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" />
            </template>
            Rules
          </NButton>
        </NuxtLink>
      </NFlex>
      <NTabs
        type="segment"
        animated
        justify-content="space-evenly"
        class="mx-auto pb-8 w-full md:w-4/5 px-2 md:px-4"
        tab-style="filter:drop-shadow(0 1px 3px black)">
        <NTabPane name="registered" tab="Registered Players">
          <NFlex vertical class="mx-auto w-full md:w-2/3">
            <NList bordered>
              <NListItem v-if="regSort().length === 0">
                <NEmpty description="No data yet.">
                  <template #icon>
                    <n-icon>
                      <PhEmptyBold />
                    </n-icon>
                  </template>
                </NEmpty>
              </NListItem>
              <NListItem
                v-else
                v-for="(entry, i) in regSort()"
                :key="entry.key"
                :style="{
                  backgroundColor: i % 2 === 0 ? '#5552' : '',
                  padding: '0.625rem 0.875rem 0.75rem 0.875rem',
                }">
                <SGLRegListItem :data="entry" />
              </NListItem>
            </NList>
          </NFlex>
        </NTabPane>
        <NTabPane name="qualifiers" tab="Live Qualifiers">
          <NFlex vertical class="mx-auto">
            <NList bordered>
              <NListItem v-if="qfSort().length === 0">
                <NEmpty description="No data yet.">
                  <template #icon>
                    <n-icon>
                      <PhEmptyBold />
                    </n-icon>
                  </template>
                </NEmpty>
              </NListItem>
              <NListItem
                v-else
                v-for="entry in qfSort()"
                :key="entry.key"
                :style="{
                  backgroundColor: entry.rank % 2 === 0 ? '#5552' : '',
                  padding: '0.625rem 0.875rem 0.75rem 0.875rem',
                }">
                <SGLQFListItem :data="entry" />
              </NListItem>
            </NList>
          </NFlex>
        </NTabPane>
      </NTabs>
    </NScrollbar>
  </div>
</template>

<style scoped>
#sgl2 {
  position: relative;
  height: 80svh;
  background-image: url("/ld-events/sgl2/bg-trans.png");
  background-position: center;
  background-size: cover;
}

@media (max-height: 950px) {
  #sgl2 {
    height: 73vh;
  }
}
</style>