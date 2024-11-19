import CarbonEarthFilled from "~icons/carbon/earth-filled";
// import HeroiconsUser from "~icons/heroicons/user";
import HeroiconsBookOpen from "~icons/heroicons/book-open";
import HeroiconsBookmark from "~icons/heroicons/bookmark";
import HeroiconsPuzzlePiece from "~icons/heroicons/puzzle-piece";
import HeroiconsStar from "~icons/heroicons/star";
import HeroiconsTrophy from "~icons/heroicons/trophy";
import HeroiconsWrenchScrewdriver from "~icons/heroicons/wrench-screwdriver";
import HeroiconsOutlineExternalLink from "~icons/heroicons-outline/external-link";
import HeroiconsOutlineLibrary from "~icons/heroicons-outline/library";
import TablerClock from "~icons/tabler/clock";
import TablerHome from "~icons/tabler/home";

import { type MenuOption, NIcon } from "naive-ui";
import { type Component, h } from "vue";
import NavMenuLink from "~/components/Nav/MenuLink.vue";
import LogoIconSwitcher from "~/components/Logo/IconSwitcher.vue";

// const { status, data } = useAuth();

function renderIcon(icon: Component) {
  return () => h(
    NIcon,
    null,
    { default: () => h(icon) },
  );
};

export const sidebarMenu: MenuOption[] = [
  // {
  //   label: () => h(
  //     NavMenuLink,
  //     { to: "/profile" },
  //     { default: () => data.value?.user?.email },
  //   ),
  //   key: "profile",
  //   icon: renderIcon(HeroiconsUser),
  //   show: status.value === "authenticated",
  // },
  // {
  //   key: "divider-1",
  //   type: "divider",
  //   show: status.value === "authenticated",
  // },
  {
    label: () => h(
      NavMenuLink,
      { to: "/" },
      { default: () => "Home" },
    ),
    key: "index",
    icon: renderIcon(TablerHome),
  },
  {
    label: "Lungmen Dragons",
    key: "about",
    icon: () => h(
      LogoIconSwitcher,
      {
        style: { width: "1.25rem", height: "1.25rem" },
      },
    ),
    children: [
      {
        label: () => h(
          NavMenuLink,
          null,
          { default: () => "Players" },
        ),
        key: "players",
        icon: renderIcon(CarbonEarthFilled),
        disabled: true,
        extra: "[WIP]",
      },
      {
        label: () => h(
          NavMenuLink,
          { to: "/timeline" },
          { default: () => "Timeline" },
        ),
        key: "timeline",
        icon: renderIcon(TablerClock),
      },
      {
        label: "Events Archive",
        key: "events-archive",
        icon: renderIcon(HeroiconsOutlineLibrary),
        children: [
          {
            label: () => h(
              NavMenuLink,
              { to: "/anni3" },
              { default: () => "Third Anniversary" },
            ),
            key: "anni3",
            icon: renderIcon(HeroiconsStar),
          },
          {
            label: () => h(
              NavMenuLink,
              { to: "/bingo3" },
              { default: () => "Bingo Lockout 3" },
            ),
            key: "bingo3",
            icon: renderIcon(HeroiconsTrophy),
          },
        ],
      },
    ],
  },
  {
    key: "divider-1",
    type: "divider",
  },
  {
    label: "Arknights",
    key: "arknights",
    icon: () => h(
      "img",
      {
        src: "/official/arknights-icon.png",
        style: { width: "1.25rem" },
      },
    ),
    style: { backgroundColor: "#0000ff" },
    children: [
      {
        label: () => h(
          NavMenuLink,
          { to: "/guides" },
          { default: () => "Guides" },
        ),
        key: "guides",
        icon: renderIcon(HeroiconsBookOpen),
      },
      {
        label: () => h(
          NavMenuLink,
          { to: "/resources" },
          { default: () => "Resource Index" },
        ),
        key: "resources",
        icon: renderIcon(HeroiconsBookmark),
      },
      {
        label: () => h(
          NavMenuLink,
          { to: "/guesser" },
          { default: () => "Arknights Guesser" },
        ),
        key: "guesser",
        icon: renderIcon(HeroiconsPuzzlePiece),
      },
      {
        label: "Lungmen Toolbox",
        key: "lungmen-toolbox",
        icon: renderIcon(HeroiconsWrenchScrewdriver),
        disabled: true,
        extra: "[WIP]",
      },
    ],
  },
  {
    label: "Arknights: Endfield",
    key: "endfield",
    icon: () => h(
      "img",
      {
        src: "/official/endfield-icon.png",
        style: { width: "1.25rem" },
      },
    ),
    disabled: true,
    extra: "[WIP]",
  },
  {
    key: "divider-3",
    type: "divider",
  },
  {
    label: () => h(NavMenuLink, {
      to: "https://forms.gle/SfZmwk1ogpLp1UdHA",
      target: "_blank",
    }, { default: () => "Submit a Video" }),
    key: "submit-video",
    icon: renderIcon(HeroiconsOutlineExternalLink),
  },
  {
    label: () => h(NavMenuLink, {
      to: "https://forms.gle/oXEMezJqYFXcrs6bA",
      target: "_blank",
    }, { default: () => "Open Recruitment" }),
    key: "open-recruitment",
    icon: renderIcon(HeroiconsOutlineExternalLink),
  },
];
