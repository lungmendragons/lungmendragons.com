import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import type { WIP } from "~/utils/markdown-editor";

export const useMarkdownStore = defineStore("markdown", () => {
  const wip = useLocalStorage("markdown-wip", {
    mostRecent: {
      time: 0,
      title: "",
      description: "",
      content: "",
    } as WIP,
    history: [] as WIP[],
    savedDrafts: [] as WIP[],
  });

  const historyMaxItems = 10;
  const draftsMaxItems = 20;

  function setWipRecent(data: WIP): string {
    // 5 minutes
    if (data.time - getWipRecent().time > 300000 || wip.value.history.length === 0) {
      wip.value.mostRecent = data;
      pushToWipHistory(data);
      return "success";
    } else {
      return "error";
    }
  };

  function forceSetWipRecent(data: WIP): void {
    wip.value.mostRecent = data;
    pushToWipHistory(data);
  };

  function pushToWipHistory(data: WIP): void {
    wip.value.history.push(data);
    if (wip.value.history.length > historyMaxItems)
      wip.value.history.shift();
  };

  function getWipRecent(): WIP {
    return wip.value.mostRecent;
  };

  function getWipHistory(): WIP[] {
    return wip.value.history;
  };

  function deleteWipFromHistory(timeToDelete: number): string {
    const index = wip.value.history.findIndex(wip => wip.time === timeToDelete);
    if (index > -1) {
      wip.value.history.splice(index, 1);
      return "success";
    } else {
      return "error";
    };
  };

  function clearWipHistory(): void {
    wip.value.history = [];
  };

  function saveDraft(data: WIP): string {
    if (wip.value.savedDrafts.length <= draftsMaxItems) {
      wip.value.savedDrafts.push(data);
      return "success";
    } else {
      return "error";
    };
  };

  function saveDraftOverwrite(data: WIP, timeToOverwrite: number): string {
    const index = wip.value.savedDrafts.findIndex(wip => wip.time === timeToOverwrite);
    if (index > -1) {
      wip.value.savedDrafts[index]!.title = data.title;
      wip.value.savedDrafts[index]!.description = data.description;
      wip.value.savedDrafts[index]!.content = data.content;
      return "success";
    } else {
      return "error";
    };
  };

  function getSavedDraft(timeToFind: number): WIP | undefined {
    return wip.value.savedDrafts.find(wip => wip.time === timeToFind);
  };

  function getSavedDrafts(): WIP[] {
    return wip.value.savedDrafts;
  };

  function deleteDraft(timeToDelete: number): string {
    const index = wip.value.savedDrafts.findIndex(wip => wip.time === timeToDelete);
    if (index > -1) {
      wip.value.savedDrafts.splice(index, 1);
      return "success";
    } else {
      return "error";
    };
  };

  return {
    setWipRecent,
    forceSetWipRecent,
    getWipRecent,
    getWipHistory,
    deleteWipFromHistory,
    clearWipHistory,
    saveDraft,
    saveDraftOverwrite,
    getSavedDraft,
    getSavedDrafts,
    deleteDraft,
  };
});
