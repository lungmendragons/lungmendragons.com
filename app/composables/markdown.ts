import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";

import { abbr } from "@mdit/plugin-abbr";
import { alert } from "@mdit/plugin-alert";
import { align } from "@mdit/plugin-align";
import { attrs } from "@mdit/plugin-attrs";
import { imgLazyload } from "@mdit/plugin-img-lazyload";
import { imgSize } from "@mdit/plugin-img-size";
import { spoiler } from "@mdit/plugin-spoiler";
import { sup } from "@mdit/plugin-sup";
import { sub } from "@mdit/plugin-sub";
import { tab } from "@mdit/plugin-tab";
import { tocPlugin } from "@mdit-vue/plugin-toc";
import { headersPlugin } from "@mdit-vue/plugin-headers";
import katex from "@vscode/markdown-it-katex";
import anchor from "markdown-it-anchor";
import footnote from "markdown-it-footnote";
import multiMdTableExt from "markdown-it-multimd-table-ext";
import externalLink from "markdown-it-external-link";

// demonstration todo: imgsize, headers, anchor

import "@mdit/plugin-alert/style";
import "@mdit/plugin-spoiler/style";
import "~/assets/css/katex.min.css";

/* TODO: import { component } from "@mdit-vue/plugin-component";
Ability to include Vue components opens up a lot of possibilities.
For example, a guide writer could include:
 - a widget comparing an operator's stats to another just by specifying their names,
 - an auto-generated graph of an operator's damage vs enemy DEF/RES,
 - an interactive list of enemies filtered by immunity to a specific status effect,
 - an "add to planner" button next to a skill or module,
 - etc. */

export function useMarkdown() {
  const markdownIt = MarkdownIt({
    linkify: true,
    typographer: true,
  });

  markdownIt
    .use(abbr)
    .use(alert)
    .use(align)
    .use(attrs, { allowed: [ "id", "class" ] })
    .use(imgLazyload)
    .use(imgSize)
    .use(spoiler)
    .use(sup)
    .use(sub)
    .use(tab, { name: "tabs" })
    .use(tocPlugin, { level: [ 1, 2, 3 ] })
    .use(headersPlugin)
    .use(katex)
    .use(anchor)
    .use(footnote)
    .use(multiMdTableExt, { multiline: true, rowspan: true, headerless: true })
    .use(externalLink, { hosts: [ "https://www.lungmendragons.com" ] });

  function renderMarkdown(c: string): string {
    const rendered = markdownIt.render(c);
    return DOMPurify.sanitize(rendered);
  };

  return {
    markdownIt,
    renderMarkdown,
  };
}
