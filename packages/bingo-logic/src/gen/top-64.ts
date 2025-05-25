import type { BoardDef, TileDef } from "..";
import { shuffle } from "./util";

interface Pools {
  f3_boss: TileDef[];
  currency: TileDef[];
  recruiting: TileDef[];
  thoughts: TileDef[];
  false_to_truth: TileDef[];
  converting: TileDef[];
  mechanics: TileDef[];
  portal_scout: TileDef[];
  spine_of_epoch: TileDef[];
  stage_specific: TileDef[];
  squad_playstyle: TileDef[];
  squad_restrict: TileDef[];
  squad_class: TileDef[];
  enemy_shift: TileDef[];
  enemy_effect: TileDef[];
  enemy_leak: TileDef[];
  enemy_defeat: TileDef[];
  op_kit: TileDef[];
  op_enemy: TileDef[];
  op_death: TileDef[];
  op_deploy: TileDef[];
  emergency: TileDef[];
  high_general: TileDef[];
  high_specific: TileDef[];
  cannot: TileDef[];
  encounter: TileDef[];
  face_off: TileDef[];
}

export default function generate(pools: Pools): BoardDef {
  Object.values(pools).forEach(v => shuffle(v));
  const stage0 = {
    boss: [ pools.f3_boss[0]! ],
    a1: shuffle([
      pools.currency[0]!,
      pools.recruiting[0]!,
    ]),
    a2: shuffle([
      pools.thoughts[0]!,
      pools.false_to_truth[0]!,
    ]),
    a3: shuffle([
      pools.converting[0]!,
      pools.mechanics[0]!,
      pools.portal_scout[0]!,
    ]),
    b12: shuffle([
      pools.spine_of_epoch[0]!,
      pools.stage_specific[0]!,
      pools.squad_playstyle[0]!,
      pools.squad_restrict[0]!,
      pools.squad_class[0]!,
    ]),
    b3: shuffle([
      pools.enemy_shift[0]!,
      pools.enemy_effect[0]!,
      pools.enemy_leak[0]!,
      pools.enemy_defeat[0]!,
    ]),
    b4: shuffle([
      pools.op_kit[0]!,
      pools.op_enemy[0]!,
      pools.op_death[0]!,
      pools.op_deploy[0]!,
    ]),
    b5: [ pools.emergency[0]! ],
    b6: shuffle([
      pools.high_general[0]!,
      pools.high_specific[0]!,
    ]),
    s: shuffle([
      pools.face_off[0]!,
      pools.cannot[0]!,
      pools.encounter[0]!,
    ]),
  };
  const stage1: Record<string, TileDef> = {
    boss: stage0.boss[0]!,
    a1: stage0.a1[0]!,
    a2: stage0.a2[0]!,
    a3: stage0.a3[0]!,
    b12a: stage0.b12[0]!,
    b12b: stage0.b12[1]!,
    b12c: stage0.b12[2]!,
    b3a: stage0.b3[0]!,
    b3b: stage0.b3[1]!,
    b4a: stage0.b4[0]!,
    b4b: stage0.b4[1]!,
    b5: stage0.b5[0]!,
    b6: stage0.b6[0]!,
    s: stage0.s[0]!,
    all1: shuffle([
      stage0.b12[3]!,
      stage0.b12[4]!,
      stage0.b3[2]!,
      stage0.b3[3]!,
      stage0.b4[2]!,
      stage0.b4[3]!,
      stage0.b6[1]!,
    ])[0]!,
    all2: shuffle([
      stage0.a1[1]!,
      stage0.a2[1]!,
      stage0.a3[1]!,
      stage0.a3[2]!,
      stage0.s[1]!,
      stage0.s[2]!,
    ])[0]!,
  };
  const out = shuffle(Object.values(stage1));
  return {
    width: 4,
    height: 4,
    extra: 0,
    tiles: out,
  };
}
