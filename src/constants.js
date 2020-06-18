import { encode } from 'plantuml-encoder'

const Profiles = {
	default: {
		selector: "pre[lang='uml'], pre[lang='puml'], pre[lang='plantuml']",
		extract: (elem) => elem.querySelector('code').textContent.trim(),
		replace: (elem) => elem,
		compress: (elem) => encode(elem.querySelector('code').textContent.trim()),
	},
	github: {
		// Markdown + asciidoc
		selector: "pre[lang='uml'], pre[lang='puml'], pre[lang='plantuml'], div div pre", // Markdown, asciidoc
		extract: (elem) => {
			const child = elem.querySelector('code')
			if (child !== null) {
				return child.textContent.trim()
			} // Markdown

			return elem.textContent.trim() // Asciidoc
		},
		replace: (elem) => {
			const child = elem.querySelector('code')
			if (child !== null) {
				return child
			} // Markdown

			return elem // Asciidoc
		},
		compress: (elem) => {
			let plantuml = ''
			const child = elem.querySelector('code')
			if (child === null) {
				// Asciidoc
				plantuml = elem.textContent.trim()
			} else {
				// Markdown
				plantuml = elem.querySelector('code').textContent.trim()
			}

			return encode(plantuml)
		},
	},
	zenhub: {
		selector: 'div.zhc-markdown pre code',
		extract: (elem) => elem.textContent.trim(),
		replace: (elem) => elem,
		compress: (elem) => encode(elem.textContent.trim()),
	},
	gitlab: {
		selector: 'pre code span.line, div div pre', // Markdown, asciidoc
		extract: (elem) => elem.textContent.trim(),
		replace(elem) {
			const child = elem.querySelector('code')
			if (child === null) {
				return elem // Asciidoc
			}

			return child // Markdown
		},
		compress(elem) {
			let plantuml = ''
			if (elem.tagName === 'SPAN') {
				// Markdown
				elem.parentNode.querySelectorAll('span.line').forEach((span) => {
					plantuml = plantuml + span.textContent.trim() + '\n'
				})
			} else {
				// Asciidoc
				plantuml = elem.textContent.trim()
			}

			return encode(plantuml)
		},
	},
	gitpitch: {
		selector: 'pre code.lang-uml',
		extract: (elem) => elem.innerText.trim(),
		replace: (elem) => elem,
		compress: (elem) => encode(elem.innerText.trim()),
	},
	bitbucket: {
		selector: 'div.codehilite.language-plantuml > pre',
		extract: (elem) => elem.innerText.trim(),
		replace: (elem) => elem,
		compress: (elem) => encode(elem.innerText.trim()),
	},
	atlassian: {
		selector: 'pre.code-java, pre',
		extract: (elem) => elem.innerText.trim(),
		compress: (elem) => elem.innerText.trim(),
		replace: (elem) => elem.parentElement.parentElement,
	},
}

export { Profiles }
