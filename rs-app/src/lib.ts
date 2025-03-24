// import * as impl from "../pkg/rs_app_impl";

// Turns an object into a serde enum.
// type Enum<T> = {
//   [name in keyof T]: T[name] extends undefined ?
//     name :
//     { [_ in name]: T[name] };
// }[keyof T];
export { GachaSession, createGachaSession, singleRoll } from "../pkg/rs_app_impl";