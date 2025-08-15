import { HtmlBasePlugin } from "@11ty/eleventy"
import markdownItFootnote from "markdown-it-footnote"

export default function (eleventyConfig) {
	eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote))
	eleventyConfig.addPlugin(HtmlBasePlugin)
}
