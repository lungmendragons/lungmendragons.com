import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useNotifStore = defineStore("notifs", () => {
  const notifs = useLocalStorage("notifs", {
    dismissed: [] as string[],
  });

  function getDismissed(): string[] {
    return notifs.value.dismissed;
  };

  function addToDismissed(key: string): void {
    if (!notifs.value.dismissed.includes(key)) {
      notifs.value.dismissed.push(key);
    };
  };

  return {
    getDismissed,
    addToDismissed,
  };
});
