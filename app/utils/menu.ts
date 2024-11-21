import CarbonEarthFilled from "~icons/carbon/earth-filled";
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
import HeroiconsPencilSquareSolid from "~icons/heroicons/pencil-square-solid";
import HeroiconsCloudArrowUp from "~icons/heroicons/cloud-arrow-up";

import { type MenuOption, NIcon } from "naive-ui";
import { type Component, h } from "vue";
import NavMenuLink from "~/components/Nav/MenuLink.vue";
import LogoIconSwitcher from "~/components/Logo/IconSwitcher.vue";

function renderIcon(icon: Component) {
  return () => h(
    NIcon,
    null,
    () => h(icon),
  );
};

function sidebarMenuDivider(index: number): MenuOption {
  return {
    key: `divider-${index}`,
    type: "divider",
  };
};

const sidebarMenuMain: MenuOption[] = [
  {
    label: () => h(
      NavMenuLink,
      { to: "/" },
      () => "Home",
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
          () => "Players",
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
          () => "Timeline",
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
              () => "Third Anniversary",
            ),
            key: "anni3",
            icon: renderIcon(HeroiconsStar),
          },
          {
            label: () => h(
              NavMenuLink,
              { to: "/bingo3" },
              () => "Bingo Lockout 3",
            ),
            key: "bingo3",
            icon: renderIcon(HeroiconsTrophy),
          },
        ],
      },
    ],
  },
];

const sidebarMenuGameResources: MenuOption[] = [
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
          () => "Guides",
        ),
        key: "guides",
        icon: renderIcon(HeroiconsBookOpen),
      },
      {
        label: () => h(
          NavMenuLink,
          { to: "/resources" },
          () => "Resource Index",
        ),
        key: "resources",
        icon: renderIcon(HeroiconsBookmark),
      },
      {
        label: () => h(
          NavMenuLink,
          { to: "/guesser" },
          () => "Arknights Guesser",
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
];

const sidebarMenuExternalLinks: MenuOption[] = [
  {
    label: () => h(
      NavMenuLink,
      {
        to: "https://forms.gle/SfZmwk1ogpLp1UdHA",
        target: "_blank",
      },
      () => "Submit a Video",
    ),
    key: "submit-video",
    icon: renderIcon(HeroiconsOutlineExternalLink),
  },
  {
    label: () => h(
      NavMenuLink,
      {
        to: "https://forms.gle/oXEMezJqYFXcrs6bA",
        target: "_blank",
      },
      () => "Open Recruitment",
    ),
    key: "open-recruitment",
    icon: renderIcon(HeroiconsOutlineExternalLink),
  },
];

const sidebarMenuWriter: MenuOption[] = [
  {
    label: () => h(
      NavMenuLink,
      { to: "/write" },
      () => "Write",
    ),
    key: "write",
    icon: renderIcon(HeroiconsPencilSquareSolid),
  },
  {
    label: () => h(
      NavMenuLink,
      { to: "/post" },
      () => "Post",
    ),
    key: "post",
    icon: renderIcon(HeroiconsCloudArrowUp),
  },
];

export function getSidebarMenu(roles?: string[]): MenuOption[] {
  let divider = 1;
  const menu = [
    ...sidebarMenuMain,
    sidebarMenuDivider(divider++),
    ...sidebarMenuGameResources,
    sidebarMenuDivider(divider++),
  ];

  if (roles && roles.includes("writer")) {
    menu.push(...sidebarMenuWriter);
    menu.push(sidebarMenuDivider(divider++));
  };

  menu.push(...sidebarMenuExternalLinks);
  return menu;
}
