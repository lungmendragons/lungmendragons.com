import type { BoardDef, TileDef } from "..";
import { shuffle } from "./util";

interface Pools {
  currency: TileDef[];
  recruiting: TileDef[];
  thoughts: TileDef[];
  converting: TileDef[];
  mechanics: TileDef[];
  spine: TileDef[];
  st_specific: TileDef[];
  sq_class: TileDef[];
  sq_playstyle: TileDef[];
  sq_restriction: TileDef[];
  st_sq_high: TileDef[];
  en_shift: TileDef[];
  en_effect: TileDef[];
  en_leak: TileDef[];
  en_defeat: TileDef[];
  en_high: TileDef[];
  op_kit: TileDef[];
  op_enemy: TileDef[];
  op_negative: TileDef[];
  op_deploy: TileDef[];
  op_hard: TileDef[];
  sp_cannot: TileDef[];
  sp_face_off: TileDef[];
  sp_emergency: TileDef[];
  sp_high: TileDef[];
  boss_f3: TileDef[];
  boss_f5: TileDef[];
  sp_rng: TileDef[];
  sp_timer: TileDef[];
  sp_collectible: TileDef[];
}

export default function generate(pools: Pools): BoardDef {
  Object.values(pools).forEach(v => shuffle(v));
  const stage0 = {
    a1: pools.currency[0]!,
    a2: pools.recruiting[0]!,
    a3: pools.thoughts[0]!,
    a4: pools.converting[0]!,
    a5: pools.mechanics[0]!,
    o1: pools.boss_f3[0]!,
    o2: pools.boss_f5[0]!,
    o3: pools.sp_rng[0]!,
    o4: shuffle([ pools.sp_timer[0]!, pools.sp_collectible[0]! ]),
    c1: shuffle([
      pools.spine[0]!,
      pools.st_specific[0]!,
      pools.sq_class[0]!,
      pools.sq_playstyle[0]!,
      pools.sq_restriction[0]!,
    ]),
    c1s: pools.st_sq_high[0]!,
    c2: shuffle([
      pools.en_shift[0]!,
      pools.en_effect[0]!,
      pools.en_leak[0]!,
      pools.en_defeat[0]!,
    ]),
    c2s: pools.en_high[0]!,
    c3: shuffle([
      pools.op_kit[0]!,
      pools.op_enemy[0]!,
      pools.op_negative[0]!,
      pools.op_deploy[0]!,
    ]),
    c3s: pools.op_hard[0]!,
    c4a: shuffle([
      pools.sp_cannot[0]!,
      pools.sp_face_off[0]!,
    ]),
    c4b: pools.sp_emergency[0]!,
    c4c: pools.sp_high[0]!,
  };
  const rem = shuffle([
    stage0.c1[3]!,
    stage0.c1[4]!,
    stage0.c2[2]!,
    stage0.c2[3]!,
    stage0.c3[2]!,
    stage0.c3[3]!,
    stage0.c4a[1]!,
  ]);
  const stage1rand = {
    a1: stage0.a1,
    a2: stage0.a2,
    a3: stage0.a3,
    a4: stage0.a4,
    a5: stage0.a5,
    o3: stage0.o3,
    c1a: stage0.c1[0]!,
    c1b: stage0.c1[1]!,
    c1c: stage0.c1[2]!,
    c1s: stage0.c1s,
    c2a: stage0.c2[0]!,
    c2b: stage0.c2[1]!,
    c2s: stage0.c2s,
    c3a: stage0.c3[0]!,
    c3b: stage0.c3[1]!,
    c3s: stage0.c3s,
    c4a: stage0.c4a[0]!,
    c4b: stage0.c4b,
    c4c: stage0.c4c,
    ra: rem[0]!,
    rb: rem[1]!,
    rc: rem[2]!,
  };
  const slist = {
    o1: stage0.o1,
    o2: stage0.o2,
    o4: stage0.o4[0]!,
  };
  const rlist = shuffle(Object.values(stage1rand));
  return {
    width: 5,
    height: 5,
    extra: 0,
    /* eslint-disable antfu/consistent-list-newline */
    tiles: [
      ...rlist.slice(0, 5),
      ...rlist.slice(5, 10),
      rlist[10]!, slist.o1, slist.o4, slist.o2, rlist[11]!,
      ...rlist.slice(12, 17),
      ...rlist.slice(17, 22),
    ],
  };
}
