import { NFlex } from "naive-ui";
import type { SelectRenderLabel, SelectRenderTag } from "naive-ui";

export const renderColorSelectTag: SelectRenderTag = ({ option }): VNode => {
  return h(
    NFlex,
    { align: "center" },
    [
      h("div", {
        style: {
          backgroundColor: option.value,
          borderRadius: "50%",
          width: "16px",
          height: "16px",
        }
      }),
      option.label as string,
    ]
  )
}

export const renderColorSelectLabel: SelectRenderLabel = (option): VNode => {
  return h(
    NFlex,
    { align: "center" },
    [
      h("div", {
        style: {
          backgroundColor: option.value,
          borderRadius: "50%",
          width: "16px",
          height: "16px",
        }
      }),
      option.label as string,
    ]
  )
}
