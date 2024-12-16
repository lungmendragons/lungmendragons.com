// import _characterTableCN from "~~/submodules/ArknightsResource/gamedata/excel/character_table.json";
// import _characterPatchTableCN from "~~/submodules/ArknightsResource/gamedata/excel/char_patch_table.json";
// import _moduleTableCN from "~~/submodules/ArknightsResource/gamedata/excel/uniequip_table.json";
// import _skillTableCN from "~~/submodules/ArknightsResource/gamedata/excel/skill_table.json";
// import _itemTableCN from "~~/submodules/ArknightsResource/gamedata/excel/item_table.json";

import _characterTable from "~~/submodules/ArknightsGameData_YoStar/en_US/gamedata/excel/character_table.json";
// import _characterPatchTable from "~~/submodules/ArknightsGameData_YoStar/en_US/gamedata/excel/char_patch_table.json";
import _moduleTable from "~~/submodules/ArknightsGameData_YoStar/en_US/gamedata/excel/uniequip_table.json";
import _skillTable from "~~/submodules/ArknightsGameData_YoStar/en_US/gamedata/excel/skill_table.json";
import _itemTable from "~~/submodules/ArknightsGameData_YoStar/en_US/gamedata/excel/item_table.json";

import type { Operator, Skill, Module } from "~/utils/types/operators";

export function useGamedata() {
  // const characterTableCN: any = _characterTableCN;
  // const characterPatchTableCN: any = _characterPatchTableCN;
  // const moduleTableCN: any = _moduleTableCN;

  const characterTable: any = _characterTable;
  // const characterPatchTable: any = _characterPatchTable;
  const moduleTable: any = _moduleTable;
  const skillTable: any = _skillTable;
  // const itemTable: any = _itemTable;

  // const amiyaGuard = Object.values(characterPatchTable.patchChars)[0];
  // const amiyaMedic = Object.values(characterPatchTable.patchChars)[1];

  for (const char in characterTable) {
    Object.defineProperty(characterTable[char], "id", { value: char });
  }

  for (const char in moduleTable.charEquip) {
    if (characterTable[char] !== undefined)
      characterTable[char].modules = moduleTable.charEquip[char];
  }

  return {
    operators: characterTable as { [key: string]: Operator },
    // skills: skillTable as { [key: string]: Skill },
    // modules: moduleTable.equipDict as { [key: string]: Module },
    getOperator: (id: string) => characterTable[id] as Operator,
    getSkill: (id: string) => skillTable[id] as Skill,
    getModule: (id: string) => moduleTable.equipDict[id] as Module,
    // getItem: (id: string) => itemTable.items[id],
    subclasses: moduleTable.subProfDict,
  };
}
