import ExternalLinkIcon from "~/components/ExternalLinkIcon.global.vue";
import FaSolidSwimmer from "~icons/fa-solid/swimmer";
import FaSolidTemperatureLow from "~icons/fa-solid/temperature-low";
import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
import Fa6RegularChessKnight from "~icons/fa6-regular/chess-knight";
import Fa6SolidExplosion from "~icons/fa6-solid/explosion";
import Fa6SolidWind from "~icons/fa6-solid/wind";
import GgDice2 from "~icons/gg/dice-2";
import HeroiconsArrowTrendingUp16Solid from "~icons/heroicons/arrow-trending-up-16-solid";
import HeroiconsCake from "~icons/heroicons/cake";
import HeroiconsFire20Solid from "~icons/heroicons/fire-20-solid";
import HeroiconsGlobeAsiaAustralia from "~icons/heroicons/globe-asia-australia";
import HeroiconsRocketLaunch16Solid from "~icons/heroicons/rocket-launch-16-solid";
import HeroiconsTrophy from "~icons/heroicons/trophy";
import PhShootingStarFill from "~icons/ph/shooting-star-fill";

import { NText } from "naive-ui";
import { h, type VNode } from "vue";
import { NuxtLink } from "#components";

const Colour = {
  highlight: "#60a5fa",
  normal: "#fff",
};

function renderFlex(
  stuff: Array<string | (() => VNode)>,
): () => VNode {
  return (): VNode => h(
    NText,
    null,
    {
      default: () => stuff.map(item => typeof item === "string" ? item : item()),
    },
  );
};

function renderNuxtLink(
  href: string,
  label: string,
  stuff: Array<string | (() => VNode)>,
): () => VNode {
  return (): VNode => h(
    NuxtLink,
    {
      href,
      label,
      target: "_blank",
      external: true,
    },
    {
      default: () => stuff.map(item => typeof item === "string" ? item : item()),
    },
  );
};

function renderBigTitle(
  title: string,
): () => VNode {
  return (): VNode => h(
    NText,
    {
      class: `
        text-2xl
        font-black
        leading-6
      `,
    },
    {
      default: () => title,
    },
  );
};

export const items = [
  {
    title: renderBigTitle("Founded"),
    color: Colour.highlight,
    time: "July 2021",
    icon: HeroiconsRocketLaunch16Solid,
    content: renderFlex([
      "Lungmen Dragons was founded by ", // space needed
      renderNuxtLink(
        "https://www.youtube.com/channel/UC9v7YF2Y5z1JF1Q6J2J1Y8A",
        "Zafang on YouTube",
        [
          "Zafang",
          () => h(ExternalLinkIcon, { small: true }),
        ],
      ),
      " in July 2021, with the goal of bringing the competitive, hardcore Arknights gameplay community to EN.",
    ]),
  },
  {
    title: "Growth",
    color: Colour.normal,
    time: "October 2021",
    icon: Fa6BrandsYoutube,
    content: renderFlex([ "Our YouTube channel reaches 1,000 subscribers." ]),
  },
  {
    title: "First Event",
    color: Colour.normal,
    time: "March 2022",
    icon: Fa6SolidWind,
    content: renderFlex([ "We ran our first Nicheknights event during Contingency Contract Wild Scales (CC#6)." ]),
  },
  {
    title: "First Anniversary",
    color: Colour.normal,
    time: "August 2022",
    icon: HeroiconsCake,
    content: renderFlex([ "One year on, Lungmen Dragons has expanded to 33 members, and reaches 2,000 YouTube subscribers." ]),
  },
  {
    title: "CC#8 Nicheknights",
    color: Colour.normal,
    time: "August 2022",
    icon: Fa6RegularChessKnight,
    content: renderFlex([ "After our first Nicheknights event was positively received, we ran another one for Contingency Contract Dawnseeker (CC#8), with a new winner for every day of the two-week event." ]),
  },
  {
    title: "CC#10 Nicheknights",
    color: Colour.normal,
    time: "February 2023",
    icon: Fa6SolidExplosion,
    content: renderFlex([ "We were able to run another Nicheknights event for Contingency Contract Ashring (CC#10), which was another success." ]),
  },
  {
    title: renderBigTitle("Bingo Lockout"),
    color: Colour.highlight,
    time: "April 2023",
    icon: HeroiconsTrophy,
    content: renderFlex([
      renderNuxtLink(
        "https://twitter.com/LungmenDragons/status/1663757193265528832",
        "Lungmen Dragons on Twitter",
        [
          "Sponsored by Arknights EN,",
          () => h(ExternalLinkIcon, { small: true }),
        ],
      ),
      " we ran a community event around Mizuki & Caerula Arbor. This marked the first time ever that such an event was officially sponsored. The community judged it to be a resounding success, and the publishers agreed.",
    ]),
  },
  {
    title: "CC#11 Nicheknights",
    color: Colour.normal,
    time: "June 2023",
    icon: FaSolidSwimmer,
    content: renderFlex([ "We were able to run another Nicheknights event for Contingency Contract Fake Waves (CC#11), though not for the weak links or faint of heart." ]),
  },
  {
    title: "2nd Anniversary",
    color: Colour.normal,
    time: "August 2023",
    icon: HeroiconsCake,
    content: renderFlex([ "Two years on, Lungmen Dragons has grown to 61 world-class players." ]),
  },
  {
    title: renderBigTitle("CC#12 Official Trailer"),
    color: Colour.highlight,
    time: "September 2023",
    icon: PhShootingStarFill,
    content: renderFlex([
      "Arknights EN releases the ",
      renderNuxtLink(
        "https://www.youtube.com/watch?v=1fXZ9Z7j6H8",
        "Arknights Official Trailer - Contingency Contract Season #12 Operation Base Point",
        [
          "official trailer",
          () => h(ExternalLinkIcon, { small: true }),
        ],
      ),
      " for Contingency Contract Basepoint (CC#12), with all but one of the featured high-risk clears being from Lungmen Dragons players - and the one exception joined us soon after. Seeing their hard work canonised was a moment our players will never forget.",
    ]),
  },
  {
    title: "CC#12 Nicheknights",
    color: Colour.normal,
    time: "October 2023",
    icon: HeroiconsFire20Solid,
    content: renderFlex([ "For the final installment of the game mode as we knew it then, we ran a final Nicheknights event for Contingency Contract Basepoint (CC#12). Nothing remains, nothing rewinds." ]),
  },
  {
    title: renderBigTitle("Bingo Lockout 2"),
    color: Colour.highlight,
    time: "November 2023",
    icon: GgDice2,
    content: renderFlex([ "After the success of the first run in April, we were delighted to run Bingo Lockout a second time, again sponsored by Arknights EN." ]),
  },
  {
    title: renderBigTitle("Bingo Lockout 3"),
    color: Colour.highlight,
    time: "April 2024",
    icon: FaSolidTemperatureLow,
    content: renderFlex([ "With the newest installment of Integrated Strategies, Expeditioner's Joklumarkar, we organised a third run of Bingo Lockout, this time with a rather different format - 16 teams consisting of one Navigator (an Arknights content creator) and one Expeditioner (an Arknights player from the community). This run was the most successful so far, and was met with an extremely positive community response." ]),
  },
  {
    title: "Skywalking Global League #1",
    color: Colour.normal,
    time: "May 2024",
    icon: HeroiconsGlobeAsiaAustralia,
    content: renderFlex([ "In collaboration with strategy groups from servers worldwide - SC, JP, KR, and TC - we represented EN's participation in a global tournament in Mizuki & Caerula Arbor, played at difficulty 15." ]),
  },
  {
    title: "3rd Anniversary",
    color: Colour.normal,
    time: "August 2024",
    icon: HeroiconsArrowTrendingUp16Solid,
    content: renderFlex([ "Three years on, Lungmen Dragons continues to grow." ]),
  },
];
