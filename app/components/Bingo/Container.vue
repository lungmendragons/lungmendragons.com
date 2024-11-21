<script setup lang="ts">
import TabPane from "./TabPane.vue";
import { type BingoEntry, type BingoSorted, categories, submissions } from "~/utils/events-archive/bingo3-submissions";
import { isDark } from "~/utils/theme";
import { useToggle } from "@vueuse/core";
import { NFlex, NTag, NTime } from "naive-ui";
import { type CSSProperties, h, onMounted, reactive, ref } from "vue";

const tournamentTime = new Date(Date.UTC(2024, 3, 13, 23, 0, 0)).toLocaleString(
  undefined,
  { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" },
);

// const isDark = useDark();
const applyFilter = ref(true);
const toggleFilter = useToggle(applyFilter);

const sorted = ref<BingoSorted>({});
const dataQF: BingoSorted = {};
const dataPB: BingoSorted = {};
const rankKey = ref("rank.qf");

Object.keys(submissions).forEach((category: string) => {
  dataQF[category] = submissions[category].filter((entry: BingoEntry) => entry.rank.qf > 0);
  dataPB[category] = submissions[category].sort((a: BingoEntry, b: BingoEntry) => a.rank.pb > b.rank.pb ? 1 : -1);
});

function toggleData(): void {
  sorted.value = applyFilter.value ? dataQF : dataPB;
};

function toggleRankCol(): void {
  rankKey.value = applyFilter.value ? "rank.qf" : "rank.pb";
};

function handleUpdateValue(): void {
  toggleFilter();
  toggleData();
  toggleRankCol();
};

onMounted(() => {
  toggleData();
});

const cols = [
  reactive({
    key: rankKey,
    title: "#",
    className: "w-[10%] hidden md:table-cell",
  }),
  {
    key: "player",
    title: "Player",
    className: "w-[43%] md:w-[35%]",
    render(row: BingoEntry) {
      const tags = row.tags.map((tagKey: string) => {
        return h(
          NTag,
          {
            style: { fontFamily: "Inter18pt, sans-serif" },
            type: "primary",
            round: true,
            bordered: false,
          },
          {
            default: () => tagKey,
          },
        );
      });
      return h(
        NFlex,
        null,
        [
          row.player,
          tags,
        ],
      );
    },
  },
  {
    key: "time",
    title: "Time",
    className: "w-[25%] md:w-[25%]",
  },
  {
    key: "submitted",
    title: "Submitted",
    className: "w-[32%] md:w-[40%]",
    render(row: BingoEntry) {
      // new Date(row.submitted).toLocaleString(
      //   undefined, { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit", timeZoneName:"short" }
      // );
      return h(NTime, { time: new Date(row.submitted) });
    },
  },
];

function renderTab(src: string, label: string) {
  return () => h(
    TabPane,
    {
      src,
      imgClass: isDark.value ? "w-6 lg:w-12 drop-shadow-[0_0_2px_#ddd]" : "w-6 lg:w-12 invert",
      label,
      labelClass: "hidden md:block",
    },
  );
};

function railStyle({ focused, checked }: { focused: boolean; checked: boolean }) {
  const style: CSSProperties = {};
  if (checked) {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    };
  } else {
    style.background = "#444444";
    if (focused) {
      style.boxShadow = "0 0 0 2px #44444440";
    };
  }
  return style;
};
</script>

<template>
  <NScrollbar class="max-h-[70vh]">
    <NFlex
      vertical
      id="bingo3-wrapper"
      class="px-2 md:px-8">
      <NFlex
        vertical
        class="px-2 my-8 w-full md:w-3/4 mx-auto"
      >
        <NFlex
          justify="center"
          align="end"
          class="mb-3"
        >
          <img
            class="drop-shadow-[0_0_4px_black]"
            src="/ld-events/bingo3/logo-en-white-02.png"
            width="242"
          >
          <img
            class="drop-shadow-[0_0_4px_black] mb-2.5"
            src="/ld-events/bingo3/ld-logo-full-d7d7d7-01-a90.png"
            width="220"
          >
        </NFlex>
        <NFlex
          id="heroText"
          vertical
          class="mx-auto px-3 md:px-9 py-6 bg-black/[65%]"
        >
          <div class="text-sm md:text-lg drop-shadow-[0_1px_3px_black] text-white">
            A path through the tundra has been charted, but we still need assistants for our team.
            Do you have what it takes to brave the icefields or will you get lost in the snow?
            Join us once again for another Bingo Lockout Tournament,
            <NuxtLink
              href="https://twitter.com/ArknightsEN/status/1769561921563644077"
              target="_blank"
            >
              sponsored by Arknights EN.
            </NuxtLink>
          </div>
          <div class="drop-shadow-[0_1px_3px_black] text-white">
            In case you missed it, you can watch all the highlights from
            <NuxtLink
              href="https://www.youtube.com/watch?v=BCMHZfOMAwM"
              target="_blank"
            >
              Day 1
            </NuxtLink>
            and
            <NuxtLink
              href="https://www.youtube.com/watch?v=CwZMzno4lIQ"
              target="_blank"
            >
              Day 2
            </NuxtLink>
            on YouTube.
          </div>
          <div class="m-2 text-xl drop-shadow-[0_1px_3px_black] text-white">
            The final day, featuring the semi-finals and grand final, starts
            <span class="text-[#f3b224]">{{ tournamentTime }}.</span>
          </div>
          <div class="drop-shadow-[0_1px_3px_black] text-white">
            Note: The finals are
            <NuxtLink
              href="https://twitter.com/LungmenDragons/status/1777887243442499682"
              target="_blank"
            >
              rescheduled
            </NuxtLink>
            to 1 day later than previously stated. The time you see above is the new start time.
          </div>
        </NFlex>
      </NFlex>

      <NFlex class="mx-auto">
        <iframe
          credentialless
          class="mx-auto"
          width="800"
          height="450"
          src="https://www.youtube.com/embed/zIyqPEVSdYY"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </NFlex>
      <NFlex
        justify="end"
        class="mt-8"
      >
        <NSwitch
          v-model:value="applyFilter"
          :rail-style="railStyle"
          default-value="true"
          :on-update:value="handleUpdateValue"
        >
          <template #checked>
            Qualifying rules
          </template>
          <template #unchecked>
            All best times
          </template>
        </NSwitch>
      </NFlex>
      <!-- Only 3 entries in Row A, min height is needed otherwise it's really annoying to navigate -->
      <NCard
        class="md:min-h-[470px] mb-8"
        content-style="padding:8px"
      >
        <NTabs
          animated
          type="line"
          justify-content="space-evenly"
          pane-class="py-0"
        >
          <template
            v-for="c of categories"
            :key="c.key"
          >
            <NTabPane
              :name="c.key"
              :tab="renderTab(`/ld-events/bingo3/category/${c.key}.png`, c.title)"
            >
              <NDataTable
                :columns="cols"
                :data="sorted[c.key]"
                :max-height="310"
                :pagination="false"
                :bordered="false"
                row-class-name="h-14 text-xs md:text-base"
              />
            </NTabPane>
          </template>
        </NTabs>
      </NCard>
    </NFlex>
  </NScrollbar>
</template>

<style scoped>
#bingo3-wrapper {
  background-image: url("/ld-events/bingo3/主界面_EN_BG.png");
  background-attachment: fixed;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  font-family: NewTegomin, sans-serif;
}

#heroText > * > a {
  color: #53ebda;
}

#heroText > * > a:hover {
  text-decoration: underline;
}

@media (max-width: 1400px) {
  iframe {
    width: 1024px;
    height: 576px;
  }
}

@media (max-width: 1200px) {
  iframe {
    width: 768px;
    height: 432px;
  }
}

@media (max-width: 1000px) {
  iframe {
    width: 640px;
    height: 360px;
  }
}

@media (max-width: 768px) {
  iframe {
    width: 468px;
    height: 263px;
  }
}

@media (max-width: 540px) {
  iframe {
    width: 384px;
    height: 216px;
  }
}

@media (max-width: 456px) {
  iframe {
    width: 300px;
    height: 169px;
  }
}

@media (max-width: 374px) {
  iframe {
    width: 256px;
    height: 144px;
  }
}
</style>
