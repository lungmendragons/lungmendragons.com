import { ref } from "vue";

export const grid = ref<any[]>([]);

const gridLayout
  = `C X X X C X F X X X . C
     X . . . F . . . . . . X
     X . . C X X C X F X X X
     X . C . X . X . . . . X
     F . X . X . X . . . . X
     X . X . . . X . . . . X
     C X X F . . X . . C . F
     X . X . . . X . C X F X
     . C X X X F X X . X . X
     . . F . . . F . . F . X
     . . X . . . . . . X . X
     . C X X X X X X F X . .`;
const layoutString = gridLayout.replace(/\s/g, "");

const n = 12;
let clue = 1;
for (let i = 0; i < n ** 2; i++) {
  const r = Math.floor(i / n);
  const c = ((i % n) + n) % n;
  if (layoutString[i] === ".") {
    grid.value.push({ content: false });
  } else {
    grid.value.push({
      id: `cw-id-${i}`,
      content: true,
      r,
      c,
      clue: layoutString[i] === "C" ? clue++ : 0,
      numbered: layoutString[i] === "C",
      coloured: layoutString[i] === "F",
    });
  }
};
