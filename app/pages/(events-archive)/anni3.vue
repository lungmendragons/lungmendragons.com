<script setup lang="ts">
import CrosswordInput from "~/components/Crossword/Input.vue";
import CrosswordModal from "~/components/Crossword/Modal.vue";
import { acrossClues, type Clue, downClues } from "~/utils/events-archive/anni3-clues";
import { grid } from "~/utils/events-archive/anni3-grid";
import { NButton, useModal } from "naive-ui";
import { h } from "vue";

useSeoMeta({
  title: "Third Anniversary Crossword | Lungmen Dragons",
});

const modal = useModal();

function showClue(c: Clue) {
  const m = modal.create({
    title: `${c.num} ${c.direction.toUpperCase()}`,
    preset: "card",
    class: `
      w-min
      min-w-[33vw]
      max-w-[80vw]
      md:max-w-[40vw]
      max-h-[80vh]
    `,
    content: () => h(CrosswordModal, c),
    footer: () => h(
      NButton,
      { type: "primary", onClick: () => m.destroy() },
      () => "Close",
    ),
  });
};
</script>

<template>
  <NFlex
    vertical
    justify="center"
    align="center"
    class="min-h-[20vh]">
    <NFlex vertical justify="center">
      <input
        type="text"
        maxlength="12"
        class="
          relative
          w-[70vw] md:w-[500px]
          h-[6vh] landscape:h-[12vh] md:landscape:h-[75px]
          mx-auto
          text-center
          text-[32px]
          text-black
          font-bold
          bg-[#60a5fa]">
      <NImage src="/ld-events/anni3/hints.png" class="w-[80vw] md:w-[30vw] mx-auto my-4 md:my-6" />
    </NFlex>
    <NGrid
      class="mt-4 md:!size-[624px]"
      responsive="screen"
      :cols="12"
      :x-gap="2"
      :y-gap="2">
      <template v-for="box in grid" :key="box.id">
        <NGridItem>
          <CrosswordInput v-if="box.content" v-bind="box" />
        </NGridItem>
      </template>
    </NGrid>
    <NSpace vertical class="mb-6 text-sm md:text-xl text-center">
      <div class="mt-3">
        Across
      </div>
      <NButtonGroup size="small">
        <template v-for="aClue in acrossClues" :key="aClue.id">
          <NButton type="primary" @click="showClue(aClue)">
            {{ aClue.num }}
          </NButton>
        </template>
      </NButtonGroup>
      <div class="mt-3">
        Down
      </div>
      <NButtonGroup size="small">
        <template v-for="dClue in downClues" :key="dClue.id">
          <NButton type="primary" @click="showClue(dClue)">
            {{ dClue.num }}
          </NButton>
        </template>
      </NButtonGroup>
    </NSpace>
  </NFlex>
</template>
