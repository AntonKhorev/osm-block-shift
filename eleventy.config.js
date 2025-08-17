import { HtmlBasePlugin } from "@11ty/eleventy"
import markdownItFootnote from "markdown-it-footnote"

export default function (eleventyConfig) {
	eleventyConfig.amendLibrary("md", (md) => {
		md.use(markdownItFootnote)
		md.renderer.rules.footnote_block_open = () => (
			`<section class="footnotes">\n` +
			`<h2>Примечания</h2>\n` +
			`<ol class="footnotes-list">\n`
		)
	})
	eleventyConfig.addShortcode("tag", function (kv) {
		const [k, v] = kv.split("=")
		if (!v || v == "*") {
			return `[\`${kv}\`](https://wiki.openstreetmap.org/wiki/Key:${encodeURIComponent(k)})`
		} else {
			return `[\`${kv}\`](https://wiki.openstreetmap.org/wiki/Tag:${encodeURIComponent(kv)})`
		}
	})
	eleventyConfig.addPairedShortcode("TODO", function () {})
	eleventyConfig.addPlugin(HtmlBasePlugin)
}
