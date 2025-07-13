<script lang="ts" setup>
import type { PopoverInst, InputInst } from "naive-ui";
import { NButton, NFlex, NInput } from "naive-ui";

const { set } = defineProps<{
  set: (text: string) => void;
  disabled: boolean;
}>();

const value = ref("");
const popoverRef = ref<PopoverInst>();
const inputRef = ref<InputInst>();

function handleUpdate(show: boolean) {
  if (!show)
    value.value = "";
}

function handleSet() {
  set(value.value);
  handleHide();
}

function handleHide() {
  popoverRef.value?.setShow(false);
  value.value = "";
}
</script>

<template>
  <NPopover
    ref="popoverRef"
    trigger="click"
    :disabled="disabled"
    @update:show="handleUpdate"
  >
    <template #trigger>
      <slot />
    </template>
    <NFlex>
      <NInput
        ref="inputRef"
        v-model:value="value"
        style="flex: 1"
        type="text"
        @vue:mounted="inputRef?.focus()"
        @focus="console.log('focus')"
        @keyup.enter="handleSet"
        @keyup.escape="handleHide"
      />
      <NButton type="primary" @click="handleSet">
        Set
      </NButton>
    </NFlex>
  </NPopover>
</template>
