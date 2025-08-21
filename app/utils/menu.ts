import CarbonEarthFilled from "~icons/carbon/earth-filled";
import HeroiconsBookOpen from "~icons/heroicons/book-open";
import HeroiconsBookmark from "~icons/heroicons/bookmark";
import HeroiconsPuzzlePiece from "~icons/heroicons/puzzle-piece";
import HeroiconsShoppingBag from "~icons/heroicons/shopping-bag";
import HeroiconsStar from "~icons/heroicons/star";
import HeroiconsTrophy from "~icons/heroicons/trophy";
import HeroiconsWrenchScrewdriver from "~icons/heroicons/wrench-screwdriver";
import HeroiconsOutlineExternalLink from "~icons/heroicons-outline/external-link";
import HeroiconsOutlineLibrary from "~icons/heroicons-outline/library";
import TablerClock from "~icons/tabler/clock";
import TablerHome from "~icons/tabler/home";
import HeroiconsPencilSquareSolid from "~icons/heroicons/pencil-square-solid";
import HeroiconsCloudArrowUp from "~icons/heroicons/cloud-arrow-up";
import MaterialSymbolsNotificationAddOutlineRounded from "~icons/material-symbols/notification-add-outline-rounded?width=24px&height=24px";

import { type MenuOption, NIcon, NMarquee } from "naive-ui";
import { type Component, h } from "vue";
import NavMenuLink from "~/components/Nav/MenuLink.vue";
import NavMenuLinkMobile from "~/components/Nav/MenuLinkMobile.vue";
import LogoIconSwitcher from "~/components/Logo/IconSwitcher.vue";
import SVGSineWave from "~/components/SVG/SineWave.vue";

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

function sidebarMenuMain(linkComponent: Component): MenuOption[] {
  return [
    {
      label: () => h(
        linkComponent,
        { to: "/is5-bingo" },
        () => h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }
          },
          [
            h(
              "img",
              {
                src: "/ld-events/bingo4/bingo_logo_moons.png",
                style: {
                  height: "0.625rem",
                  marginTop: "0.25rem",
                  objectFit: "contain",
                  filter: `
                    drop-shadow(0 -1px 1px #8a120a)
                    drop-shadow(1px 1px 1px #4e76c2)
                    drop-shadow(0 1px 1px #4e76c2)
                    drop-shadow(-1px -1px 1px #8a120a)
                  `,
                },
              },
            ),
            h(
              "div",
              {
                style: {
                  textAlign: "center",
                  color: "#eee",
                  lineHeight: 1.5,
                  filter: `
                    drop-shadow(0 -1px 1px #8a120a)
                    drop-shadow(1px 1px 1px #4e76c2)
                    drop-shadow(0 1px 1px #4e76c2)
                    drop-shadow(-1px -1px 1px #8a120a)
                  `,
                }
              },
              "Bingo Lockout #4",
            ),
            h(SVGSineWave),
          ]
        ),
      ),
      key: "is5-bingo",
      props: {
        style: {
          height: "5rem",
        }
      }
    },
    {
      key: "divider-0",
      type: "divider",
    },
    {
      label: () => h(
        linkComponent,
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
          label: "Players",
          key: "players",
          icon: renderIcon(CarbonEarthFilled),
          disabled: true,
          // extra: "[WIP]",
        },
        {
          label: () => h(
            linkComponent,
            { to: "/shop" },
            () => "Shop",
          ),
          key: "shop",
          icon: renderIcon(HeroiconsShoppingBag),
        },
        {
          label: () => h(
            linkComponent,
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
                linkComponent,
                { to: "/sgl2" },
                () => h(
                  NMarquee,
                  null,
                  {
                    default: () => h(
                      "div",
                      {
                        style: {
                          marginRight: "1rem",
                          // background: "linear-gradient(0deg, #7c99ec 40%, grey 70%)",
                          // "-webkit-background-clip": "text",
                          // "-webkit-text-fill-color": "transparent",
                        },
                      },
                      { default: () => "Skywalking Global League #2" },
                    )
                  },
                ),
              ),
              key: "sgl2",
              icon: () => h(
                "img",
                {
                  src: "/ld-events/sgl2/icon2.png",
                  style: {
                    width: "1.125rem",
                    marginTop: "1px",
                    filter: "drop-shadow(0 0 1px black)",
                  },
                },
              ),
            },
            {
              label: () => h(
                linkComponent,
                { to: "/anni3" },
                () => "Third Anniversary",
              ),
              key: "anni3",
              icon: renderIcon(HeroiconsStar),
            },
            {
              label: () => h(
                linkComponent,
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
}

function sidebarMenuGameResources(linkComponent: Component): MenuOption[] {
  return [
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
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
              }
            },
            [
              h("span", null, "Lungmen Toolbox"),
              h(
                "span",
                {
                  style: {
                    fontSize: "0.5rem",
                    backgroundColor: "#fd03",
                    width: "fit-content",
                    padding: "0 0.2rem",
                    marginBottom: "0.25rem",
                  }
                },
                "NEW",
              ),
            ]
          ),
          key: "lungmen-toolbox",
          icon: renderIcon(HeroiconsWrenchScrewdriver),
          children: [
            {
              label: () => h(
                linkComponent,
                { to: "/gachasim" },
                () => "Gacha Simulator",
              ),
              key: "gachasim",
              icon: () => h(
                "img",
                {
                  src: "/official/orundum.png",
                  style: { width: "1.375rem", marginTop: "2px" },
                },
              ),
            },
          ]
        },
        {
          label: () => h(
            linkComponent,
            { to: "/guides" },
            () => "Guides",
          ),
          key: "guides",
          icon: renderIcon(HeroiconsBookOpen),
        },
        {
          label: () => h(
            linkComponent,
            { to: "/resources" },
            () => "Resource Index",
          ),
          key: "resources",
          icon: renderIcon(HeroiconsBookmark),
        },
        {
          label: () => h(
            linkComponent,
            { to: "/guesser" },
            () => "Arknights Guesser",
          ),
          key: "guesser",
          icon: renderIcon(HeroiconsPuzzlePiece),
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
      children: [
        {
          label: () => h(
            linkComponent,
            { to: "/guides/endfield" },
            () => "Guides",
          ),
          key: "guides/endfield",
          icon: renderIcon(HeroiconsBookOpen),
        },
        {
          label: "Resource Index",
          key: "resources/endfield",
          icon: renderIcon(HeroiconsBookmark),
          disabled: true,
        },
      ],
    },
  ];
}

function sidebarMenuExternalLinks(linkComponent: Component): MenuOption[] {
  return [
    {
      label: () => h(
        linkComponent,
        {
          to: "https://forms.gle/SfZmwk1ogpLp1UdHA",
          target: "_blank",
        },
        () => "Submit a Video",
      ),
      key: "submit-video",
      icon: renderIcon(HeroiconsOutlineExternalLink),
    },
  ];
}

function sidebarMenuWriter(linkComponent: Component): MenuOption[] {
  return [
    {
      label: () => h(
        linkComponent,
        { to: "/write" },
        () => "Write",
      ),
      key: "write",
      icon: renderIcon(HeroiconsPencilSquareSolid),
    },
    {
      label: () => h(
        linkComponent,
        { to: "/post" },
        () => "Post",
      ),
      key: "post",
      icon: renderIcon(HeroiconsCloudArrowUp),
    },
  ];
}

function sidebarMenuAdmin(linkComponent: Component): MenuOption[] {
  return [
    {
      label: () => h(
        linkComponent,
        { to: "/notifs" },
        () => "Create Notification",
      ),
      key: "notifs",
      icon: renderIcon(MaterialSymbolsNotificationAddOutlineRounded),
    },
  ];
}

export function getSidebarMenu(mobile: boolean, perms?: number): MenuOption[] {
  const LinkComponent: Component = mobile ? NavMenuLinkMobile : NavMenuLink;

  let divider = 1;
  const menu = [
    ...sidebarMenuMain(LinkComponent),
    sidebarMenuDivider(divider++),
    ...sidebarMenuGameResources(LinkComponent),
    sidebarMenuDivider(divider++),
  ];

  if (perms) {
    // see app/middleware/auth.global.ts
    if (perms & 2) {
      menu.push(...sidebarMenuWriter(LinkComponent));
      menu.push(sidebarMenuDivider(divider++));
    }
    if (perms & 128) {
      menu.push(...sidebarMenuAdmin(LinkComponent));
      menu.push(sidebarMenuDivider(divider++));
    };
  };

  menu.push(...sidebarMenuExternalLinks(LinkComponent));
  return menu;
}
