<script setup lang="ts">
import { useThemeVars } from "naive-ui";

const props = defineProps<{ content: string }>();
const md = ref<string>("");
const markdown = useMarkdown();
const themeVars = useThemeVars();

watch(
  props,
  p => md.value = markdown.renderMarkdown(p.content),
);
</script>

<template>
  <div id="md" v-html="md" />
</template>

<style scoped>
/* originally from https://github.com/mixu/markdown-styles/blob/master/layouts/github/assets/css/github-markdown.css */
/* heavily modified for LD */

:deep(*) {
  word-wrap: break-word;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  :deep(p),
  :deep(li),
  :deep(table) th,
  :deep(table) td {
    font-size: 0.9em;
  }
  :deep(li) li {
    font-size: 1em;
  }
}

:deep(a) {
  background: transparent;
  color: v-bind("themeVars.primaryColor");
}

:deep(a):active,
:deep(a):hover {
  outline: 0;
}

:deep(strong) {
  font-weight: bold;
}

:deep(img) {
  border: 0;
}

:deep(hr) {
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  height: 1px;
  padding: 0;
  margin: 16px 0;
  border: none;
  border-top: 1px solid #aaa8;
}

:deep(hr):before {
  display: table;
  content: "";
}

:deep(hr):after {
  display: table;
  clear: both;
  content: "";
}

:deep(pre) {
  overflow: auto;
  margin-top: 0;
  margin-bottom: 0;
  font: 12px Consolas, "Liberation Mono", Menlo, Courier, monospace;
}

:deep(code),
:deep(pre) {
  font-family: monospace, monospace;
  font-size: 1em;
}

:deep(input) {
  color: inherit;
  font: inherit;
  margin: 0;
  line-height: normal;
}

:deep(html) input[disabled] {
  cursor: default;
}

:deep(input)[type="checkbox"] {
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0;
}

:deep(table) {
  border-collapse: collapse;
  border-spacing: 0;
}

:deep(td),
:deep(th) {
  padding: 0;
}

:deep(a):hover,
:deep(a):focus,
:deep(a):active {
  text-decoration: underline;
}

:deep(ul),
:deep(ol) {
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
}

:deep(ul)       { list-style-type: "⬥  "; }
:deep(ul) ul    { list-style-type: "-  "; }
:deep(ul) ul ul { list-style-type: ""; }

:deep(ol) {
  list-style-type: decimal;
}

:deep(ol) ol,
:deep(ul) ol {
  list-style-type: lower-roman;
}

:deep(ul) ul ol,
:deep(ul) ol ol,
:deep(ol) ul ol,
:deep(ol) ol ol {
  list-style-type: lower-alpha;
}

:deep(dd) {
  margin-left: 0;
}

:deep(code) {
  font: 12px Consolas, "Liberation Mono", Menlo, Courier, monospace;
}

:deep(*):first-child {
  margin-top: 0 !important;
}

:deep(*):last-child {
  margin-bottom: 0 !important;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(h4),
:deep(h5),
:deep(h6) {
  position: relative;
  margin-top: 1em;
  margin-bottom: 16px;
  font-weight: bold;
  line-height: 1.4;
}

:deep(h1) {
  padding-bottom: 0.2em;
  font-size: 2.5em;
  line-height: 1.2;
  font-weight: 900;
  border-image: linear-gradient(to right, #1b43df 20%, #eb141d 80%) 1;
  border-bottom: 2px solid;
}

@media (max-width: 768px) {
  :deep(h1) {
    font-size: 2em;
  }
}

:deep(h2) {
  font-size: 1.875em;
  line-height: 1.225;
  padding: 0 0.5em;
  font-weight: 700;
  border-image: linear-gradient(180deg, #1b43df, #eb141d) 1;
  border-left: 6px solid;
}

@media (max-width: 768px) {
  :deep(h2) {
    font-size: 1.6em;
  }
}

:deep(h3) {
  font-size: 1.5em;
  line-height: 1.43;
  padding: 0 0.5em;
  border-left: 6px solid #aaa8;
}

@media (max-width: 768px) {
  :deep(h3) {
    font-size: 1.3em;
  }
}

:deep(h4),
:deep(h5),
:deep(h6) {
  font-size: 1.25em;
}

@media (max-width: 768px) {
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    font-size: 1.1em;
  }
}

:deep(p),
:deep(blockquote),
:deep(ul),
:deep(ol),
:deep(dl),
:deep(table),
:deep(pre) {
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(ul),
:deep(ol) {
  padding-left: 2em;
}

:deep(ul) ul,
:deep(ul) ol,
:deep(ol) ol,
:deep(ol) ul {
  margin-top: 0;
  margin-bottom: 0;
}

:deep(li) > p {
  margin-top: 16px;
}

:deep(li) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

:deep(li):has(> :is(ul, ol, p)) > p {
  margin-top: 2px;
  margin-bottom: 2px;
}

:deep(dl) {
  padding: 0;
}

:deep(dl) dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: bold;
}

:deep(dl) dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

:deep(blockquote) {
  padding: 0 15px;
  color: #888;
  border-left: 3px solid #ddd;
}

:deep(blockquote) > :first-child {
  margin-top: 0;
}

:deep(blockquote) > :last-child {
  margin-bottom: 0;
}

:deep(table) {
  margin: 1rem auto;
  width: fit-content;
  overflow: auto;
  word-break: normal;
  word-break: keep-all;
}

:deep(table) th {
  font-weight: bold;
  background-color: #60a5fa33;
}

:deep(table) th,
:deep(table) td {
  padding: .5rem 1rem;
  border: 1px solid #aaa8;
}

@media (max-width: 768px) {
  :deep(table) th,
  :deep(table) td {
    padding: .25rem .5rem;
  }
}

:deep(img) {
  max-width: 100%;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

:deep(code) {
  padding: 0;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin: 0;
  font-size: 85%;
  background-color: #aaa3;
  border-radius: 3px;
}

:deep(code):before,
:deep(code):after {
  letter-spacing: -0.2em;
  content: "\00a0";
}

:deep(pre) > code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

:deep(.highlight) {
  margin-bottom: 16px;
}

:deep(.highlight) pre,
:deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #aaa3;
  border-radius: 3px;
}

:deep(.highlight) pre {
  margin-bottom: 0;
  word-break: normal;
}

:deep(pre) {
  word-wrap: normal;
}

:deep(pre) code {
  display: inline;
  max-width: initial;
  padding: 0;
  margin: 0;
  overflow: initial;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

:deep(pre) code:before,
:deep(pre) code:after {
  content: normal;
}

/* :deep(.black)   { color: black; } */
:deep(.silver)  { color: silver; }
:deep(.gray)    { color: gray; }
/* :deep(.white)   { color: white; } */
:deep(.maroon)  { color: maroon; }
:deep(.red)     { color: red; }
:deep(.purple)  { color: purple; }
:deep(.fuchsia) { color: fuchsia; }
:deep(.green)   { color: green; }
:deep(.lime)    { color: lime; }
:deep(.olive)   { color: olive; }
:deep(.yellow)  { color: yellow; }
:deep(.navy)    { color: navy; }
:deep(.blue)    { color: blue; }
:deep(.teal)    { color: teal; }
:deep(.aqua)    { color: aqua; }

:deep(.markdown-alert-note) {
  background-color: #2f81f70a;
}

:deep(.markdown-alert-important) {
  background-color: #a371f70a;
}

:deep(.markdown-alert-tip) {
  background-color: #3fb9500a;
}

:deep(.markdown-alert-warning) {
  background-color: #d299220a;
}

:deep(.markdown-alert-caution) {
  background-color: #f851490a;
}

:deep(.center) > * {
  margin: 0 auto;
}
</style>
