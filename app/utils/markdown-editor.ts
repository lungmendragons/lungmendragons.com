import { NButton, NScrollbar } from "naive-ui";
import type { ModalOptions } from "naive-ui";

export interface WIP {
  time: number;
  title: string;
  description: string;
  content: string;
};

export function getTitle(title: string): string {
  return title.length ? title : "(untitled)";
};

export function getDescription(description: string): string {
  return description.length ? description : "(empty)";
};

export function getContent(content: string): string {
  return content.length ? content : "(empty)";
};

export function getFilenameTitle(title: string): string {
  return title.length > 0
    ? title.replace(" ", "")
    : "Untitled";
};

export function getFilenameDate(): string {
  return new Date(Date.now())
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "_")
    .slice(0, 15);
};

export function getModalOptions(
  data: WIP,
  restoreFn: (title: string, description: string, content: string) => void,
): ModalOptions {
  return {
    preset: "card",
    style: { width: "400px" },
    title: getTitle(data.title),
    content: () => h(
      NScrollbar,
      {
        style: {
          maxHeight: "400px",
          fontSize: "0.7rem",
        },
      },
      () => getContent(data.content),
    ),
    headerExtra: () => h(
      "span",
      null,
      () => new Date(data.time).toLocaleString(),
    ),
    footer: () => h(
      NButton,
      { type: "primary", onClick: () => restoreFn(data.title, data.description, data.content) },
      () => "Restore",
    ),
  };
};
