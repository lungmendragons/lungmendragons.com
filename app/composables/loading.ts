import { useTimeout } from "@vueuse/core";
import type { MessageReactive } from "naive-ui";

export function useLoading(loading: Ref<boolean>) {
  const message = useMessage();
  const activeMessage = ref<MessageReactive>();
  const queuedText = ref<string>();
  const delay = useTimeout(300, {
    controls: true,
    callback: () => {
      if (queuedText.value) {
        activeMessage.value = message.loading(takeRef(queuedText, undefined)!, { duration: undefined });
      }
    },
  });

  let active = false;

  watch(loading, () => {
    if (active && !loading.value) {
      activeMessage.value?.destroy();
      queuedText.value = undefined;
      delay.stop();
      active = false;
    }
  });

  return {
    start: (text: string) => {
      activeMessage.value?.destroy();
      queuedText.value = text;
      delay.start();
      active = true;
    },
  };
}
