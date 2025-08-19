import { HtmlBasePlugin } from "@11ty/eleventy"
import markdownItFootnote from "markdown-it-footnote"
import markdownItAttrs from "markdown-it-attrs"
import mermaidPlugin from "@kevingimbel/eleventy-plugin-mermaid"

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(HtmlBasePlugin)
	eleventyConfig.addPlugin(mermaidPlugin)

	eleventyConfig.addPassthroughCopy({ "node_modules/simpledotcss/simple.min.css" : "simple.min.css" })
	eleventyConfig.addPassthroughCopy({ "node_modules/mermaid/dist/mermaid.esm.min.mjs" : "mermaid/mermaid.esm.min.mjs" })
	eleventyConfig.addPassthroughCopy({ "node_modules/mermaid/dist/chunks/mermaid.esm.min/*.mjs": "mermaid/chunks/mermaid.esm.min" })
	eleventyConfig.addPassthroughCopy("mermaid.js")
	eleventyConfig.addPassthroughCopy("style.css")

	eleventyConfig.addFilter("sortByNumberInSlug", (obj) => {
		const result = Object.keys(obj)
			.sort((a, b) => {
				const [na] = obj[a].fileSlug.split("-")
				const [nb] = obj[b].fileSlug.split("-")
				return Number(na) - Number(nb)
			})
			.map(key => obj[key])
		return result
	})

	eleventyConfig.addPreprocessor("em dash", "md", function (data, content) {
		return content.replaceAll(" - ", " — ")
	})

	eleventyConfig.amendLibrary("md", (md) => {
		md.set({ typographer: true, quotes: "«»„“" })
		md.use(markdownItFootnote)
		md.use(markdownItAttrs)
		md.renderer.rules.footnote_block_open = () => (
			`<hr>\n` +
			`<h2>Примечания</h2>\n` +
			`<ol>\n`
		)
		md.renderer.rules.footnote_block_close = () => (
			`</ol>\n`
		)
	})

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
}
