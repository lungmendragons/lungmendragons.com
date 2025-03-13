<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
// import SGLRegListItem from "~/components/SGL/RegListItem.vue";
import SGLQFListItem from "~/components/SGL/QFListItem.vue";
import type { RowData, RowDataSorted, /* RegData */ } from "~/utils/events-archive/sgl2";
import PhEmptyBold from '~icons/ph/empty-bold?width=256px&height=256px';

// const { client } = useAuth();
// const { data: session } = await client.useSession(useFetch);
// const message = useMessage();

const isMD = useMediaQuery(mediaQuery.minWidth.md as string);
const data = await $fetch("/api/pages/sgl2/all", { method: "GET" });
// const isLoading = ref(false);
const qf = data.qf as RowData[];
// const reg = data.reg as RegData[];

// function regSort(): RegData[] {
//   return reg
//     .filter((entry) => entry.valid)
//     .sort((a, b) => a.player.localeCompare(b.player));
// }

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

// function doGsheetUpdate() {
//   isLoading.value = true;
//   $fetch("/api/pages/sgl2/gsheet", { method: "PUT" })
//     .then(res => {
//       if (res === "success") {
//         isLoading.value = false;
//         message.success("Data updated successfully");
//       } else {
//         isLoading.value = false;
//         message.error("Failed to update data");
//       }
//     });
// }

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
        <!-- <div class="mx-4 mt-2 text-xs lg:text-sm text-center text-white drop-shadow-[0_0_1px_black]">
          Registration ends:
          <NTime
            :time="1740034740000"
            format="yyyy-MM-dd HH:mm"
            class="font-bold"
          />
          <span class="italic">
            (<NTime :time="1740034740000" type="relative" />)
          </span>
        </div>
        <div class="mx-4 mt-2 text-xs lg:text-sm text-center text-white drop-shadow-[0_0_1px_black]">
          Live qualifiers end:
          <NTime
            :time="1740639540000"
            format="yyyy-MM-dd HH:mm"
            class="font-bold"
          />
          <span class="italic">
            (<NTime :time="1740639540000" type="relative" />)
          </span>
        </div>
        <div class="mx-4 italic text-xs text-center text-white drop-shadow-[0_0_1px_black]">
          Shown in your timezone: [{{ Intl.DateTimeFormat().resolvedOptions().timeZone }}]
        </div> -->
        <NFlex vertical class="mx-auto pb-8 w-full md:w-3/5 p-2 md:p-4">
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
          <NTable :single-line="false" size="small">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Server</th>
                <th>Player</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="3">
                  <NTime
                    time-zone="America/New_York"
                    :time="1741973400000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1741973400000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>TC</td>
                <td>Liriyin</td>
                <td>D</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1741986000000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>KR</td>
                <td>Artuosa</td>
                <td>A</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1741998600000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>KR</td>
                <td>Hays</td>
                <td>C</td>
              </tr>
              <tr>
                <td rowspan="3">
                  <NTime
                    time-zone="America/New_York"
                    :time="1742059800000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742059800000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>EN</td>
                <td>Aoao</td>
                <td>A</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742083200000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>SC</td>
                <td>Cola</td>
                <td>B</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742092200000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>JP</td>
                <td>Sena</td>
                <td>D</td>
              </tr>
              <tr>
                <td rowspan="3">
                  <NTime
                    time-zone="America/New_York"
                    :time="1742146200000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742146200000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>TC</td>
                <td>Winsok</td>
                <td>A</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742169600000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>KR</td>
                <td>Hijkstuv</td>
                <td>B</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742178600000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>JP</td>
                <td>YS</td>
                <td>A</td>
              </tr>
              <tr>
                <td rowspan="3">
                  <NTime
                    time-zone="America/New_York"
                    :time="1742232600000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742232600000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>EN</td>
                <td>Mei of May</td>
                <td>A</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742256000000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>TC</td>
                <td>WXY</td>
                <td>B</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742265000000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>SC</td>
                <td>Kaisei</td>
                <td>A</td>
              </tr>
              <tr>
                <td rowspan="3">
                  <NTime
                    time-zone="America/New_York"
                    :time="1742319000000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742319000000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>EN</td>
                <td>Polymer</td>
                <td>C</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742342400000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>TC</td>
                <td>Toby</td>
                <td>B</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742351400000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>JP</td>
                <td>Caron</td>
                <td>C</td>
              </tr>
              <tr>
                <td rowspan="3">
                  <NTime
                    time-zone="America/New_York"
                    :time="1742405400000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742405400000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>EN</td>
                <td>Bait</td>
                <td>D</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742428800000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>KR</td>
                <td>LemuenWheelchairThief</td>
                <td>D</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742437800000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>SC</td>
                <td>Eyanx</td>
                <td>C</td>
              </tr>
              <tr>
                <td rowspan="2">
                  <NTime
                    time-zone="America/New_York"
                    :time="1742491800000"
                    format="yyyy-MM-dd"
                    class="font-bold"
                  />
                </td>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742491800000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>SC</td>
                <td>Soup</td>
                <td>A</td>
              </tr>
              <tr>
                <td>
                  <NTime
                    time-zone="America/New_York"
                    :time="1742515200000"
                    format="HH:mm"
                    class="font-bold"
                  />
                </td>
                <td>JP</td>
                <td>Miguel_San</td>
                <td>B</td>
              </tr>
            </tbody>
          </NTable>
        </NFlex>
      </div>
      <NFlex
        justify="center"
        align="center"
        class="text-xs md:text-sm my-4">
        <!-- <NuxtLink to="https://forms.gle/2idKuHk9pK5nVGnf9" target="_blank">
          <NButton
            :size="isMD ? 'medium' : 'small'"
            type="primary"
            icon-placement="right">
            <template #icon>
              <ExternalLinkIcon :size="isMD ? 'large' : 'medium'" />
            </template>
            Register
          </NButton>
        </NuxtLink> -->
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
      <!-- <NCard
        v-if="session && (session.user.permissions & 4)"
        class="w-fit mx-auto my-4"
        size="small">
        <div class="text-center w-full">
          LD view
        </div>
        <NButton
          type="primary"
          size="small"
          :loading="isLoading"
          @click="doGsheetUpdate">
          Update data from Google Sheets
        </NButton>
        <div class="text-xs text-center w-full">
          Data is cached, allow a few mins <br> for changes to appear
        </div>
      </NCard> -->
      <!-- <NTabs
        type="segment"
        animated
        justify-content="space-evenly"
        class="mx-auto pb-8 w-full md:w-4/5 px-2 md:px-4"
        tab-style="filter:drop-shadow(0 1px 3px black)">
        <NTabPane name="qualifiers" tab="Live Qualifiers"> -->
      <NFlex vertical class="mx-auto pb-8 w-full md:w-3/5 px-2 md:px-4">
        <div>Qualifying Results</div>
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
      <!-- </NTabPane>
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
      </NTabs> -->
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