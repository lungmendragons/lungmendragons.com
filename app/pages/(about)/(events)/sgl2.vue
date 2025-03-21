<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import type { RowData, RowDataSorted, /* RegData */ } from "~/utils/events-archive/sgl2";
import PhEmptyBold from '~icons/ph/empty-bold?width=256px&height=256px';

const isMD = useMediaQuery(mediaQuery.minWidth.md as string);
const data = await $fetch("/api/pages/sgl2/all", { method: "GET" });
const qf = data.qf as RowData[];

function qfSort(): RowDataSorted[] {
  return qf
    .filter((entry) => entry.run1.score > 0 || entry.run2.score > 0) // "" > 0 evaluates to false
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
        <NCard class="w-fit mx-auto mt-4" size="small">
          <template #header>
            <div class="text-center text-xs font-normal">
              TOURNAMENT INFORMATION
            </div>
          </template>
          <template #action>
            <div class="text-center text-xs">
              Click to zoom.
            </div>
          </template>
          <NCollapse class="w-64 my-1.5">
            <NCollapseItem name="1">
              <template #header>
                <div class="text-center w-full pr-5">
                  Schedule
                </div>
              </template>
              <div class="max-h-96 overflow-hidden w-full text-center">
                <NImage
                  src="/ld-events/sgl2/event-information.png"
                  width="240"
                  class="mx-auto"
                />
              </div>
            </NCollapseItem>
            <NCollapseItem name="2">
              <template #header>
                <div class="text-center w-full pr-5">
                  Format and Rules
                </div>
              </template>
              <div class="max-h-96 overflow-hidden w-full text-center">
                <NImage
                  src="/ld-events/sgl2/rules.png"
                  width="240"
                  class="mx-auto"
                />
              </div>
            </NCollapseItem>
            <NCollapseItem name="3">
              <template #header>
                <div class="text-center w-full pr-5">
                  Casters
                </div>
              </template>
              <div class="max-h-96 overflow-hidden w-full text-center">
                <NImage
                  src="/ld-events/sgl2/casters.png"
                  width="240"
                  class="mx-auto"
                />
              </div>
            </NCollapseItem>
          </NCollapse>
        </NCard>
        <NFlex vertical class="mx-auto md:pb-8 w-full md:w-3/5 p-2 md:p-4">
          <NuxtLink
            class="mx-auto"
            to="https://www.youtube.com/@LungmenDragons/streams"
            target="_blank">
            <NButton
              :size="isMD ? 'large' : 'medium'"
              type="primary"
              icon-placement="right"
              color="#F24242">
              <template #icon>
                <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" />
              </template>
              <span class="font-bold">Watch live on YouTube</span>
            </NButton>
          </NuxtLink>
          <NuxtLink
            class="mx-auto"
            to="https://www.twitch.tv/lungmendragons"
            target="_blank">
            <NButton
              :size="isMD ? 'large' : 'medium'"
              type="primary"
              icon-placement="right"
              color="#b9a3e3">
              <template #icon>
                <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" />
              </template>
              <span class="font-bold">Watch live on Twitch</span>
            </NButton>
          </NuxtLink>
        </NFlex>
      </div>
      <NTabs
        type="segment"
        animated
        justify-content="space-evenly"
        class="mx-auto pb-8 w-full md:w-4/5 px-2 md:px-4"
        tab-style="filter:drop-shadow(0 1px 3px black)">
        <NTabPane name="scheduleAndBracket" tab="Schedule & Bracket">
          <NCard size="small" class="mb-2">
            Times are displayed in UTC-4. All matches are live.
          </NCard>
          <SGLScheduleTablePlayoffs class="mb-2" />
          <SGLBracket />
        </NTabPane>
        <NTabPane name="groups" tab="Groups Results">
          <SGLGroupTable />
          <NCard size="small" class="mb-2 mt-2">
            Times are displayed in UTC-4.
          </NCard>
          <SGLScheduleTable />
        </NTabPane>
        <NTabPane name="qualifiers" tab="QF Results">
          <NFlex
            justify="center"
            align="center"
            class="text-xs md:text-sm my-4">
            <NuxtLink to="https://docs.google.com/document/d/1TteQ9YokVLr83krA5S2GBjfrz7bN2D1f5F3PndA2Ktc" target="_blank">
              <NButton
                :size="isMD ? 'medium' : 'small'"
                type="primary"
                icon-placement="right">
                <template #icon>
                  <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" />
                </template>
                Qualifying Rules
              </NButton>
            </NuxtLink>
          </NFlex>
          <NList bordered>
            <NListItem v-if="qfSort().length === 0">
              <NEmpty description="No data yet.">
                <template #icon>
                  <NIcon>
                    <PhEmptyBold />
                  </NIcon>
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