## Table of contents

Generated automatically with 

```
[[toc]]
```

Note that despite being a level 2 heading, the table of contents displays it with the same indentation as the level 1 heading below this, while all subsequent level 2 headings are indented. Only headings up to level 3 will be included.

[[toc]]

---

# Heading level 1
```
# Heading level 1
```
## Heading level 2
```
## Heading level 2
```
### Heading level 3
```
### Heading level 3
```
#### Heading level 4
##### Heading level 5
###### Heading level 6
```
#### Heading level 4
##### Heading level 5
###### Heading level 6
```
Headings 4/5/6 are identical in all but name.

# Markdown

## Text

Note that underlines are not permitted to avoid users confusing them for links.

**Bold**
`**Bold**`

*Italic*
`*Italic*` `_Italic_`

~~Strikethrough~~ `~~Strikethrough~~`

Super^script^ `Super^script^`

Sub~script~ `Sub~script~`

Abbreviations:  
The LGD faction consists of Ch'en, Hoshiguma, and Swire.
*[LGD]: Lungmen Guard Department
```
The LGD faction consists of Ch'en, Hoshiguma, and Swire.
*[LGD]: Lungmen Guard Department
```

#### Align text

::: left
Left aligned
:::

::: center
Center aligned
:::

::: right
Right aligned
:::

```
::: left
Left aligned
:::

::: center
Center aligned
:::

::: right
Right aligned
:::
```

#### Comments

The following comment will not be rendered in the HTML:

[This is a comment.]: #

```
The following comment will not be rendered in the HTML:

[This is a comment.]: #
```

## Paragraphs

**Normal paragraph.** Lorem ipsum dolor sit amet, consectetur adipiscing elit.
**No line break despite new line.** Cras eget finibus massa. Praesent ut nisl leo. Aenean non augue a ligula interdum molestie vitae a diam.
```
**Normal paragraph.** Lorem ipsum dolor sit amet, consectetur adipiscing elit.
**No line break despite new line.** Cras eget finibus massa. Praesent ut nisl leo. Aenean non augue a ligula interdum molestie vitae a diam.
```

**Another normal paragraph.** Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
**With a line break (2 spaces after first line).** Cras eget finibus massa. Praesent ut nisl leo. Aenean non augue a ligula interdum molestie vitae a diam.

```
**Another normal paragraph.** Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | <-- (2 spaces)
**With a line break (2 spaces after first line).** Cras eget finibus massa. Praesent ut nisl leo. Aenean non augue a ligula interdum molestie vitae a diam.
```

(2 line breaks required to separate elements.)

#### Normal aligned:

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices porta mauris nec convallis. Ut imperdiet, risus a pellentesque ultrices, dolor diam consectetur ipsum, ut rutrum augue velit vel nunc. Aliquam erat volutpat. Ut hendrerit enim sed augue luctus lacinia. Nullam ultrices hendrerit arcu, molestie aliquet quam condimentum sit amet. Sed venenatis bibendum turpis ac mattis. Praesent cursus eros dui, sit amet viverra tortor porta ut. Nulla accumsan facilisis diam id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus.

```
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices porta mauris nec convallis. Ut imperdiet, risus a pellentesque ultrices, dolor diam consectetur ipsum, ut rutrum augue velit vel nunc. Aliquam erat volutpat. Ut hendrerit enim sed augue luctus lacinia. Nullam ultrices hendrerit arcu, molestie aliquet quam condimentum sit amet. Sed venenatis bibendum turpis ac mattis. Praesent cursus eros dui, sit amet viverra tortor porta ut. Nulla accumsan facilisis diam id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus.
```

#### Justify aligned:

::: justify
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices porta mauris nec convallis. Ut imperdiet, risus a pellentesque ultrices, dolor diam consectetur ipsum, ut rutrum augue velit vel nunc. Aliquam erat volutpat. Ut hendrerit enim sed augue luctus lacinia. Nullam ultrices hendrerit arcu, molestie aliquet quam condimentum sit amet. Sed venenatis bibendum turpis ac mattis. Praesent cursus eros dui, sit amet viverra tortor porta ut. Nulla accumsan facilisis diam id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus.
:::

```
::: justify
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices porta mauris nec convallis. Ut imperdiet, risus a pellentesque ultrices, dolor diam consectetur ipsum, ut rutrum augue velit vel nunc. Aliquam erat volutpat. Ut hendrerit enim sed augue luctus lacinia. Nullam ultrices hendrerit arcu, molestie aliquet quam condimentum sit amet. Sed venenatis bibendum turpis ac mattis. Praesent cursus eros dui, sit amet viverra tortor porta ut. Nulla accumsan facilisis diam id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus.
:::
```

## Escaping characters

Use a \ backslash

\# \* \- `\# \* \-`

## Spoilers

Hover to reveal, click to keep revealed, double click to re-hide.

!!boo!! `!!boo!!`

Lorem ipsum dolor sit amet, !!consectetur adipiscing elit!!. Cras eget finibus massa. Praesent ut nisl leo. !!Aenean non augue a ligula interdum molestie vitae a diam.!!

```
Lorem ipsum dolor sit amet, !!consectetur adipiscing elit!!. Cras eget finibus massa. Praesent ut nisl leo. !!Aenean non augue a ligula interdum molestie vitae a diam.!!
```

## Footnotes

Footnote 1 link[^first]. `Footnote 1 link[^first].`

Footnote 2 link[^second]. `Footnote 2 link[^second].`

Inline footnote^[Text of inline footnote.] definition. `Inline footnote^[Text of inline footnote.] definition.`

[^first]: Footnotes **can have markup.**

    And also multiple paragraphs[^second].

[^second]: Footnote text.

```
[^first]: Footnotes **can have markup.**

    And also multiple paragraphs[^second].

[^second]: Footnote text.
```

Footnotes will always appear at the bottom of the page.

## Alerts

> [!note]
> Highlights information that users should take into account, even when skimming.

```
> [!note]
> Highlights information that users should take into account, even when skimming.
```

> [!tip]
> Optional information to help a user be more successful.

```
> [!tip]
> Optional information to help a user be more successful.
```

> [!important]
> Crucial information necessary for users to succeed.

```
> [!important]
> Crucial information necessary for users to succeed.
```

> [!warning]
> Critical content demanding immediate user attention due to potential risks.

```
> [!warning]
> Critical content demanding immediate user attention due to potential risks.
```

> [!caution]
> Negative potential consequences of an action.

```
> [!caution]
> Negative potential consequences of an action.
```

## Quotes

> Hello

`> Hello`

or

> Block quote
>
> with multiple paragraphs
>
> > and nested quote.

```
> Block quote
>
> with multiple paragraphs
>
> > and nested quote.
```

Double space still required for line break:

> Woof!  
> \- *Cardigan*

```
> Woof!  
> \- *Cardigan*
```

## Images

All images are lazy-loaded by default (i.e. the browser will not load them until the user scrolls to it.)

![Lungmen Dragons logo](/logo128.png)

```
![Lungmen Dragons logo](/logo128.png)
```

![Lungmen Dragons logo](/logo128.png) {.center} 

```
![Lungmen Dragons logo](/logo128.png) {.center} 
```

> [!warning]
> Images **cannot currently be resized.** Do so manually for now.

## Horizontal rule

Insert a faint grey line for spacing with `---`.

---

## Links

[Link 1](https://www.google.com) `[Link 1](https://www.google.com)`

_[Link 2, with **_extra_** `formatting`](https://www.google.com)_ `_[Link 2, with **_extra_** ``formatting``](https://www.google.com)_`

Or links as references: [link 3], [link 4][1] and [link 5] both with tooltip

[Link 3]: https://www.google.com
[Link 5]: https://www.google.com "Custom Tooltip"
[1]: https://www.google.com "Custom Tooltip"

```
Or links as references: [link 3], [link 4][1] and [link 5] both with tooltip

[Link 3]: https://www.google.com
[Link 5]: https://www.google.com "Custom Tooltip"
[1]: https://www.google.com "Custom Tooltip"
```

Image as link:

[![Lungmen Dragons logo](/logo128.png "LD logo")](https://www.lungmendragons.com)

```
[![Lungmen Dragons logo](/logo128.png "LD logo")](https://www.lungmendragons.com)
```

Quick link: <https://www.google.com> `<https://www.google.com>`

Automatic link: https://www.google.com `https://www.google.com`

Email address: <fake@email.com> (note the `mailto:` auto-added) `<fake@email.com>`

#### Relative links

Headers on the same page: [Jump to Table of Contents](#table-of-contents) `[Jump to Table of Contents](#table-of-contents)`

Lungmen Dragons pages: [Guides](/guides) `[Guides](/guides)`

## Code

Denote code with `backticks`.

```
Code block fenced with three backticks.
(no syntax highlighting)
```

```
\```
Code block fenced with three backticks.
(no syntax highlighting)
\```
^ (backslash is only here so they actually show up in the example)
```

## Ordered lists

1. First item
2. Second item
   1. Indented item
   2. Indented item
3. Third item
   - Indented unordered list
   - Indented item
4. Fourth item



1. Fifth item, despite many new lines

```
1. First item
2. Second item
   1. Indented item
   2. Indented item
3. Third item
   - Indented unordered list
   - Indented item
4. Fourth item



1. Fifth item, despite many new lines
```

1. First item
1. Second item, ignoring repeated number
1. Third item, ignoring repeated number
1. Fourth item, ignoring repeated number

```
1. First item
1. Second item, ignoring repeated number
1. Third item, ignoring repeated number
1. Fourth item, ignoring repeated number
```

6. First item, starting from stated number
3. Second item, ignoring out of order number
2. Third item, ignoring out of order number
12. Fourth item, ignoring out of order number

```
6. First item, starting from stated number
3. Second item, ignoring out of order number
2. Third item, ignoring out of order number
12. Fourth item, ignoring out of order number
```

1. First item
2. Second item with line break  
Additional element while preserving list continuity  
(2 spaces still required for line break)
asdfasdfa
3. Third item

```
1. First item
2. Second item with line break  | <-- (2 spaces)
Additional element while preserving list continuity  | <-- (2 spaces)
(2 spaces still required for line break)| <-- (no spaces)
asdfasdfa
3. Third item
```

1.  First item

    ![Lungmen Dragons logo](/logo128.png)

2.  Second item

    > blablablabla  
    > // bblalbalblaabl

3.  Third item

```
1.  First item

    ![Lungmen Dragons logo](/logo128.png)

2.  Second item

    > blablablabla  
    > // bblalbalblaabl

3.  Third item
```

## Unordered lists

- First item
- Second item, same delimiter
- Third item, same delimiter
  - Indented item
    - Further indented item
    - Further indented item
  - Indented item
- Fourth item, same delimiter

```
- First item
- Second item, same delimiter
- Third item, same delimiter
  - Indented item
    - Further indented item
    - Further indented item
  - Indented item
- Fourth item, same delimiter
```

* First item
- Second item with different delimiter is rendered as separate list
  1. Indented ordered list
  2. Second item
- Third item with same delimiter as second item
+ Fourth item with different delimiter
+ Fifth item with same delimiter as fourth item

```
* First item
- Second item with different delimiter is rendered as separate list
  1. Indented ordered list
  2. Second item
- Third item with same delimiter as second item
+ Fourth item with different delimiter
+ Fifth item with same delimiter as fourth item
```

## Math



Inline rendering:

*Euler’s identity $e^{i\pi}+1=0$ is considered to be an exemplar of mathematical beauty.*

```
*Euler’s identity $e^{i\pi}+1=0$ is considered to be an exemplar of mathematical beauty.*
```

Block rendering:

$$
{\displaystyle \zeta (s)=\sum _{n=1}^{\infty }{\frac {1}{n^{s}}}={\frac {1}{1^{s}}}+{\frac {1}{2^{s}}}+{\frac {1}{3^{s}}}+\cdots }
$$

```
$$
{\displaystyle \zeta (s)=\sum _{n=1}^{\infty }{\frac {1}{n^{s}}}={\frac {1}{1^{s}}}+{\frac {1}{2^{s}}}+{\frac {1}{3^{s}}}+\cdots }
$$
```

## Tables

Note that tables are **always centred.**

| Heading | Heading |
| --- | --- |
| Text | Text |
| Text | Text |

```
| Heading | Heading |
| --- | --- |
| Text | Text |
| Text | Text |
```


| Align Text Left | Align Text Centre | Align Text Right |
| :--- | :---: | ---: |
| Left Text | Centre Text | Right Text |
| Left Text | Centre Text | Right Text |

```
| Align Text Left | Align Text Centre | Align Text Right |
| :--- | :---: | ---: |
| Left Text | Centre Text | Right Text |
| Left Text | Centre Text | Right Text |
```


| Heading | Heading | Heading |
| --- | :---: | :---: |
| Text | Rowspan text | Text |
| Rowspan text | ^^ | Text |
| ^^ | Text | Rowspan text |
| ^^ | Text | ^^ |

```
| Heading | Heading | Heading |
| --- | :---: | :---: |
| Text | Rowspan text | Text |
| Rowspan text | ^^ | Text |
| ^^ | Text | Rowspan text |
| ^^ | Text | ^^ |
```


| Heading | Heading | Heading | Heading | 
| --- | --- | --- | --- |
| Text | Colspan text || Text |
| Rowspan text | Text | Colspan text ||
| ^^ | ```             | 1. Multi | $$              | \
| | Multi-line text | 2. line  | x = \frac{1}{2} | \
| | ```             | 3. text  | $$              |

```
| Heading      | Heading         | Heading  | Heading         | 
| ------------ | --------------- | -------- | --------------- |
| Text         | Colspan text              || Text            |
| Rowspan text | Text            | Colspan text              ||
| ^^           | ```             | 1. Multi | $$              | \
|              | Multi-line text | 2. line  | x = \frac{1}{2} | \
|              | ```             | 3. text  | $$              |
```

> [!warning]
> If you are on mobile, you will notice that the last table here does not fit on the screen.
> This will hopefully be horizontally scrollable at some point in the future, but for now,
> please be frugal with your table cells for the sake of mobile users (i.e. the majority.)

Consecutive tables require 2 lines between them.

Headerless: 
| :---: | :---: | :---: |
| ❌ | ⭕ | ❌ |
| ⭕ | ⭕ | ❌ |
| ⭕ | ❌ | ⭕ |

```
| :---: | :---: | :---: |
| ❌ | ⭕ | ❌ |
| ⭕ | ⭕ | ❌ |
| ⭕ | ❌ | ⭕ |
```

## Text colours

You can highlight text with the following colours by appending it with `{.colour}`.

> [!note]
> Currently this functionality is quite limited and only applies to whole blocks, rather than spans of text within a block. It will be improved later.

> [!caution]
> Don't use these inappropriately. Make sure the text is still legible in both dark mode and light mode.

|:---:|:---:|
| **gray** {.gray}     | **silver** {.silver}   |
| **maroon** {.maroon} | **red** {.red}         |
| **purple** {.purple} | **fuchsia** {.fuchsia} |
| **green** {.green}   | **lime** {.lime}       |
| **olive** {.olive}   | **yellow** {.yellow}   |
| **navy** {.navy}     | **blue** {.blue}       |
| **teal** {.teal}     | **aqua** {.aqua}       |

```
|:---:|:---:|
| **gray** {.gray}     | **silver** {.silver}   |
| **maroon** {.maroon} | **red** {.red}         |
| **purple** {.purple} | **fuchsia** {.fuchsia} |
| **green** {.green}   | **lime** {.lime}       |
| **olive** {.olive}   | **yellow** {.yellow}   |
| **navy** {.navy}     | **blue** {.blue}       |
| **teal** {.teal}     | **aqua** {.aqua}       |
```

## Extra spacing

If for whatever reason you need to space out paragraphs more than markdown formatting allows, you can insert `&#x200B;` (zero-width space) between blocks.

> [!note]
> If you find yourself inserting a lot of zero-width spaces into a gigantic wall of text to make it more readable, please consider using headings, horizontal rules, or rethinking how your text is structured. This ***especially*** applies if the text doesn't contain any level 2/3 headings as it won't be included in the table of contents.

*Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices porta mauris nec convallis. Ut imperdiet, risus a pellentesque ultrices, dolor diam consectetur ipsum, ut rutrum augue velit vel nunc. Aliquam erat volutpat. Ut hendrerit enim sed augue luctus lacinia.*

&#x200B;

*Sed venenatis bibendum turpis ac mattis. Praesent cursus eros dui, sit amet viverra tortor porta ut. Nulla accumsan facilisis diam id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus.*

```
*Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices porta mauris nec convallis. Ut imperdiet, risus a pellentesque ultrices, dolor diam consectetur ipsum, ut rutrum augue velit vel nunc. Aliquam erat volutpat. Ut hendrerit enim sed augue luctus lacinia.*

&#x200B;

*Sed venenatis bibendum turpis ac mattis. Praesent cursus eros dui, sit amet viverra tortor porta ut. Nulla accumsan facilisis diam id scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus.*
```

# To be implemented in future

## Tabs

Similar to the ones in the [Bingo 3](/bingo3) page to display qualifying times. Requires a bit more work but it'll be handy.

## Mentions

Less of a priority. Only if someone asks for it.

## Interactive components

This will require some work, but it will be sick as hell. Other site features need to take priority right now, though.

Some ideas I hope to give guide writers the ability to add:

- Widget comparing an operator's stats to another just by specifying their names
- Auto-generated graph of an operator's damage vs enemy DEF/RES
- Interactive list of enemies filtered by immunity to a specific status effect
- "Add to planner" button next to a skill or module
- ...

You get the idea. Sick as hell.

---

If there's anything you would like implemented in the markdown renderer, message **@toboruo** (hmm, maybe I *should* implement mentions, actually...)