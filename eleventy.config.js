import { HtmlBasePlugin } from "@11ty/eleventy"
import markdownItFootnote from "markdown-it-footnote"

export default function (eleventyConfig) {
	eleventyConfig.addPreprocessor("em dash", "md", function (data, content) {
		return content.replaceAll(" - ", " — ")
	})

	eleventyConfig.amendLibrary("md", (md) => {
		md.set({ typographer: true, quotes: "«»„“" })
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

	eleventyConfig.addPairedShortcode("action", function (content, page) {
		return josmHelpShortcode(content, `Action/${page}`)
	})

	eleventyConfig.addPairedShortcode("dialog", function (content, page) {
		return josmHelpShortcode(content, `Dialog/${page}`)
	})

	eleventyConfig.addPairedShortcode("menu", function (content, page) {
		return josmHelpShortcode(content, `Menu/${page}`)
	})

	eleventyConfig.addPairedShortcode("help", josmHelpShortcode)

	function josmHelpShortcode(content, page) {
		let href = `https://josm.openstreetmap.de/wiki/Help/${encodeURI(page)}`
		return `[${content}](${href})`
	}

	eleventyConfig.addPassthroughCopy({ "node_modules/simpledotcss/simple.min.css" : "simple.min.css" })
	eleventyConfig.addPassthroughCopy("style.css")
}
