use rand::Rng;
use serde::{Deserialize, Serialize};
use wasm_bindgen::{JsValue, prelude::wasm_bindgen};

#[wasm_bindgen]
pub struct GachaSession {
    banner_data: BannerData,
    since_last_six: u32,
    until_five_guarantee: Option<u32>,
    total_rolls: u32,
}

#[derive(Serialize, Deserialize)]
pub struct ByRarity<T> {
    six: T,
    five: T,
    four: T,
    three: T,
}

#[derive(Serialize, Deserialize)]
pub struct BannerData {
    off_banner: ByRarity<Vec<String>>,
    rate_up: ByRarity<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
pub struct RollResult {
    rarity: u8,
    character: String,
}

#[wasm_bindgen(js_name = "createGachaSession")]
pub fn create_gacha_session(banner: JsValue) -> Result<GachaSession, JsValue> {
    Ok(GachaSession {
        banner_data: serde_wasm_bindgen::from_value(banner)?,
        since_last_six: 0,
        until_five_guarantee: Some(10),
        total_rolls: 0,
    })
}

#[wasm_bindgen(js_name = "singleRoll")]
pub fn single_roll(session: &mut GachaSession) -> Result<JsValue, JsValue> {
    let result = {
        let mut rng = rand::rng();

        session.since_last_six += 1;
        session
            .until_five_guarantee
            .as_mut()
            .map(|v| *v = v.saturating_sub(1));
        session.total_rolls += 1;

        let six_rate = session.since_last_six.saturating_sub(50) + 1;
        if rng.random_range(0..50) < six_rate {
            session.since_last_six = 0;
            session.until_five_guarantee = None;

            let pool = if rng.random_bool(0.5) {
                &session.banner_data.rate_up.six
            } else {
                &session.banner_data.off_banner.six
            };

            RollResult {
                rarity: 6,
                character: pool[rng.random_range(0..pool.len())].clone(),
            }
        } else {
            let val = if session.until_five_guarantee == Some(0) {
                0
            } else {
                rng.random_range(0..49)
            };

            match val {
                0..4 => {
                    session.until_five_guarantee = None;

                    let pool = if rng.random_bool(0.5) {
                        &session.banner_data.rate_up.five
                    } else {
                        &session.banner_data.off_banner.five
                    };

                    RollResult {
                        rarity: 5,
                        character: pool[rng.random_range(0..pool.len())].clone(),
                    }
                }
                4..29 => {
                    let pool = &session.banner_data.off_banner.four;

                    RollResult {
                        rarity: 4,
                        character: pool[rng.random_range(0..pool.len())].clone(),
                    }
                }
                29..49 => {
                    let pool = &session.banner_data.off_banner.four;

                    RollResult {
                        rarity: 4,
                        character: pool[rng.random_range(0..pool.len())].clone(),
                    }
                }
                _ => unreachable!(),
            }
        }
    };

    serde_wasm_bindgen::to_value(&result).map_err(From::from)
}
