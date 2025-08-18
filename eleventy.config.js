import { HtmlBasePlugin } from "@11ty/eleventy"
import markdownItFootnote from "markdown-it-footnote"

export default function (eleventyConfig) {
	eleventyConfig.amendLibrary("md", (md) => {
		md.use(markdownItFootnote)
		md.renderer.rules.footnote_block_open = () => (
			`<hr>\n` +
			`<h2>Примечания</h2>\n` +
			`<ol>\n`
		)
		md.renderer.rules.footnote_block_close = () => (
			`</ol>\n`
		)
	})

	eleventyConfig.addPlugin(HtmlBasePlugin)

	eleventyConfig.addPairedShortcode("TODO", function () {})

	eleventyConfig.addShortcode("tag", function (kv) {
		const [k, v] = kv.split("=")
		if (!v || v == "*") {
			return `[\`${kv}\`](https://wiki.openstreetmap.org/wiki/Key:${encodeURIComponent(k)})`
		} else {
			return `[\`${kv}\`](https://wiki.openstreetmap.org/wiki/Tag:${encodeURIComponent(kv)})`
		}
	})

	eleventyConfig.addPairedShortcode("action", function (content, name, anchor) {
		return josmHelpShortcode(content, "Action", name, anchor);
	})

	eleventyConfig.addPairedShortcode("dialog", function (content, name, anchor) {
		return josmHelpShortcode(content, "Dialog", name, anchor);
	})

	eleventyConfig.addPairedShortcode("help", function (content, name, anchor) {
		return josmHelpShortcode(content, name, undefined, anchor);
	})

	function josmHelpShortcode(content, section, subsection, anchor) {
		let href = `https://josm.openstreetmap.de/wiki/Help/${encodeURIComponent(section)}`
		if (subsection) href += `/${encodeURIComponent(subsection)}`
		if (anchor) href += `#${anchor}`
		return `[${content}](${href})`
	}

	eleventyConfig.addPassthroughCopy({ "node_modules/simpledotcss/simple.min.css" : "simple.min.css" })
	eleventyConfig.addPassthroughCopy("style.css")
}
