import optionsStorage from './options-storage'
import { Profiles } from './constants'

function escapeHtml(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

function getBackgroundColor(element, pseudoElt) {
	if (element !== null) {
		if (pseudoElt === undefined) {
			pseudoElt = null
		}

		return window.getComputedStyle(element, pseudoElt).getPropertyValue('background-color')
	}

	return ''
}

function CodePre(nodeList) {
	this.exist = false
	this.list = nodeList
	this.parentColor = ''
	this.selfColor = ''
	if (this.list.length > 0) {
		this.selfColor = getBackgroundColor(this.list.item(0))
		this.parentColor = getBackgroundColor(this.list.item(0).parentElement)
		this.exist = true
	}
}

const codePre = new CodePre(document.querySelectorAll('.markdown-body pre')) // Github style

function changeBackgroundColor(element, color, exist) {
	if (exist) {
		element.style.backgroundColor = color
	}
}

function replaceElement(umlElem, srcUrl) {
	const parent = umlElem.parentNode

	if (parent !== null) {
		// For asciidoc (div div pre)
		const imgElem = document.createElement('img')
		imgElem.setAttribute('src', escapeHtml(srcUrl))
		imgElem.setAttribute('title', '')
		parent.replaceChild(imgElem, umlElem)
		changeBackgroundColor(parent, codePre.parentColor, codePre.exist)

		imgElem.addEventListener('dblclick', () => {
			parent.replaceChild(umlElem, imgElem)
			changeBackgroundColor(parent, codePre.selfColor, codePre.exist)
		})

		umlElem.addEventListener('dblclick', () => {
			parent.replaceChild(imgElem, umlElem)
			changeBackgroundColor(parent, codePre.parentColor, codePre.exist)
		})
	}
}

function loop(counter, retry, siteProfile, baseUrl, type) {
	counter++

	if (type === 'zenhub' && document.querySelector('div.zhc-markdown') !== null) {
		counter += retry
	}

	if (type !== 'zenhub' && document.querySelector("i[aria-label='Loading content…']") === null) {
		counter += retry
	}

	const id = setTimeout(loop, 100, counter, retry, siteProfile, baseUrl, type)
	if (counter >= retry) {
		clearTimeout(id)
		onLoadAction(siteProfile, baseUrl)
	}
}

function onLoadAction(profile, baseUrl) {
	const plantUmlBaseUrl = baseUrl || 'https://www.plantuml.com/plantuml/img/'

	;[...document.querySelectorAll(profile.selector)]
		.filter((umlElem) => profile.extract(umlElem).startsWith('@start'))
		.forEach((umlElem) => {
			const plantUmlUrl = plantUmlBaseUrl + profile.compress(umlElem)
			const replaceElem = profile.replace(umlElem)

			if (plantUmlUrl.startsWith('https')) {
				replaceElement(replaceElem, plantUmlUrl)
			} else {
				// To avoid mixed-content
				chrome.runtime.sendMessage({ action: 'plantuml', url: plantUmlUrl }, (dataUri) =>
					replaceElement(replaceElem, dataUri)
				)
			}
		})
}

function run({ baseUrl, profile }) {
	const siteProfile = Profiles[profile] || Profiles.default

	if (document.querySelector("i[aria-label='Loading content…']") !== null) {
		// For wait loading @ gitlab.com
		loop(1, 10, siteProfile, baseUrl)
	}

	if (document.querySelector('div.zhc-loading') !== null) {
		// For wait loading Zenhub
		loop(1, 10, siteProfile, baseUrl, 'zenhub')
	}

	onLoadAction(siteProfile, baseUrl)
}

const init = async () => {
	const options = await optionsStorage.getAll()

	if (window.location.hostname === 'bitbucket.org') {
		const observer = new MutationObserver(() => {
			if (document.querySelectorAll('.language-plantuml').length > 0) {
				run(options)
				observer.disconnect()
			}
		})

		observer.observe(document.body, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true,
		})
	}

	// TODO: 미리보기시에도 적용되나 더블클릭으로 코드를 볼때에도 실행되면서 코드를 볼 수 있는 방법이 사라짐
	// if (window.location.hostname === 'github.com') {
	// 	const observer = new MutationObserver(() => {
	// 		const siteProfile = Profiles[options.profile]

	// 		if (!!siteProfile) {
	// 			if (document.querySelectorAll(siteProfile.selector).length > 0) {
	// 				run(options)
	// 				//observer.disconnect();
	// 			}
	// 		}
	// 	})

	// 	observer.observe(document.body, {
	// 		attributes: true,
	// 		characterData: true,
	// 		childList: true,
	// 		subtree: true,
	// 	})
	// }

	run(options)
}

init()
