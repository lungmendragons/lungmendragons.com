// import * as impl from "../pkg/rs_app_impl";

// Turns an object into a serde enum.
// type Enum<T> = {
//   [name in keyof T]: T[name] extends undefined ?
//     name :
//     { [_ in name]: T[name] };
// }[keyof T];
import * as impl from "../pkg/rs_app_impl";

type ByRarity<T> = { six: T, five: T, four: T, three: T };

export type BannerInfo = {
  rate_up: ByRarity<string[]>,
  off_banner: ByRarity<string[]>,
};

export type RollResult = {
  rarity: number,
  character: string,
};

export function createGachaSession(banner: BannerInfo): impl.GachaSession {
  return impl.createGachaSession(banner);
}

export function singleRoll(session: impl.GachaSession): RollResult {
  return impl.singleRoll(session);
};

export function tenRoll(session: impl.GachaSession): RollResult[] {
  let out = [];
  for(let i = 0; i < 10; i++) {
    out.push(singleRoll(session));
  }
  return out;
}