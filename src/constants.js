import { encode } from 'plantuml-encoder'

const URL_REGEX = /^.*\.(plantuml|pu|puml)(\?.*)?$/

/**
 * selector: 대상 엘리먼트 조회
 * extract: 코드 추출
 * replace: 대상 엘리먼트내에 이미지로 변경할 엘리먼트
 * compress:
 */
const Profiles = {
	default: {
		selector: "pre[lang='uml'], pre[lang='puml'], pre[lang='plantuml']",
		extract: (elem) => elem.querySelector('code').textContent.trim(),
		replace: (elem) => elem,
		compress: (elem) => encode(elem.querySelector('code').textContent.trim()),
	},
	github: {
		// Markdown + asciidoc
		selector: [
			"pre[lang='uml']",
			"pre[lang='puml']",
			"pre[lang='plantuml']",
			'div div pre:not(.CodeMirror-line)', // asciidoc
			'div .blob-wrapper', // .puml, .pu, .plantuml
		].join(', '),
		extract: (elem) => {
			console.log(elem)

			// .puml, .pu, .plantuml
			if (elem.classList.contains('blob-wrapper') && URL_REGEX.test(location.href)) {
				return [...elem.querySelectorAll('td.blob-code-inner')].map((row) => row.innerText).join('\n')
			}

			const child = elem.querySelector('code')

			// markdown
			if (child !== null) {
				return child.textContent.trim()
			}

			// asciidoc
			return elem.textContent.trim()
		},
		replace: (elem) => {
			// .puml, .pu, .plantuml
			if (elem.classList.contains('blob-wrapper') && URL_REGEX.test(location.href)) {
				return elem.querySelector('table')
			}

			const child = elem.querySelector('code')

			// Markdown
			if (child !== null) {
				return child
			}

			// Asciidoc
			return elem
		},
		compress: (elem) => {
			let plantuml = ''

			if (elem.classList.contains('blob-wrapper') && URL_REGEX.test(location.href)) {
				// .puml, .pu, .plantuml
				plantuml = [...elem.querySelectorAll('td.blob-code-inner')].map((row) => row.innerText).join('\n')
			} else {
				const child = elem.querySelector('code')
				if (child === null) {
					// Asciidoc
					plantuml = elem.textContent.trim()
				} else {
					// Markdown
					plantuml = elem.querySelector('code').textContent.trim()
				}
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
		replace: (elem) => elem.parentElement.parentElement,
		compress: (elem) => encode(elem.innerText.trim()),
	},
}

export { Profiles, URL_REGEX}
