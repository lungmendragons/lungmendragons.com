<script setup lang="ts">
import type { CSSProperties } from 'vue';

const props = defineProps<{
  items: string[];
  highlights: Record<string, CSSProperties>;
}>();

const escapedWords = computed(() =>
  Object.keys(props.highlights).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
);

const wordRegex = computed(() =>
  new RegExp(`\\b(${escapedWords.value.join('|')})\\b`, "g")
);

function tokenize(line: string) {
  const segments: {
    text: string;
    match: boolean;
    spec?: CSSProperties;
  }[] = [];

  const time = line.slice(0,6);
  const msg = line.slice(6);

  let last = 0;
  segments.push({
    text: time,
    match: true,
    spec: { color: "grey", fontFamily: "monospace" }
  });

  for (const match of msg.matchAll(wordRegex.value)) {
    const start = match.index!;
    const end = start + match[0].length;

    if (start > last) {
      segments.push({ text: msg.slice(last, start), match: false });
    }

    const word = match[0];
    segments.push({
      text: word,
      match: true,
      spec: props.highlights[word]
    });

    last = end;
  }

  if (last < msg.length) {
    segments.push({ text: msg.slice(last), match: false });
  }

  return segments;
}

const bingoLog = ref<HTMLElement>();

onUpdated(() => {
  if (bingoLog.value)
    bingoLog.value.scrollTop = bingoLog.value.scrollHeight;
});
</script>

<template>
  <div ref="bingoLog" class="bingo-log">
    <ul>
      <li v-for="(line, i) in items" :key="i">
        <template v-for="(seg, j) in tokenize(line)" :key="j">
          <span
            v-if="seg.match"
            :style="seg.spec">
            {{ seg.text }}
          </span>
          <span v-else>{{ seg.text }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  font-size: 12px;
}
.bingo-log {
  max-height: 220px;
  padding: 6px 8px;
  background-color: #0003;
  overflow-y: auto;
}
</style>
