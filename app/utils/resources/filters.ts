import { ref } from "vue";

export const categoryOptions = ref([
  {
    label: "Tools",
    value: "tools",
  },
  {
    label: "Spreadsheets",
    value: "sheets",
  },
  {
    label: "Assets",
    value: "assets",
  },
  {
    label: "Wikis",
    value: "wiki",
  },
  {
    label: "Software",
    value: "code",
  },
  {
    label: "Just For Fun",
    value: "fun",
  },
  {
    label: "Emulators (etc)",
    value: "emu",
  },
  {
    label: "Other",
    value: "other",
  },
]);

export const languageOptions = ref([
  {
    label: "English",
    value: "en",
  },
  {
    label: "简体中文",
    value: "cn",
  },
  {
    label: "繁體中文",
    value: "tw",
  },
  {
    label: "日本語",
    value: "jp",
  },
  {
    label: "한국어",
    value: "kr",
  },
]);

export const sortOptions = ref([
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Author",
    value: "author",
  },
]);
