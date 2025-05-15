import { NFlex } from "naive-ui";
import type { DropdownOption } from "naive-ui";
import type { VNodeChild } from "vue";

export function renderDropdownLabel(option: DropdownOption): VNodeChild {
  return h(
    NFlex,
    { align: "center" },
    [
      h("div", {
        style: {
          backgroundColor: option.hex,
          borderRadius: "50%",
          width: "16px",
          height: "16px",
        }
      }),
      option.label as string,
    ]
  )
}
