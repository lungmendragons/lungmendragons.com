import * as impl from "../pkg/rs_app_impl";
import type { GachaSession } from "../pkg/rs_app_impl";

export { GachaSession } from "../pkg/rs_app_impl";

interface ByRarity<T> { six: T, five: T, four: T, three: T }

export interface BannerInfo {
  rate_up: ByRarity<string[]>,
  off_banner: ByRarity<string[]>,
  banner_type: string,
}

export interface RollResult {
  rarity: number,
  character: string,
}

export function createGachaSession(banner: BannerInfo): GachaSession {
  return impl.createGachaSession(banner);
}

export function singleRoll(session: GachaSession): RollResult {
  return impl.singleRoll(session);
};

export function tenRoll(session: GachaSession): RollResult[] {
  const out = [];
  for(let i = 0; i < 10; i++) {
    out.push(singleRoll(session));
  }
  return out;
}