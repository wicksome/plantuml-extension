import optionsStorage from './options-storage'
import { Profiles, URL_REGEX } from './constants'
import { createImgElement } from './encoder/utils'

const DEFAULT_SERVER = 'https://www.plantuml.com/plantuml/img/'

function getBackgroundColor(element, pseudoElt) {
	if (element === null) return ''
	return window.getComputedStyle(element, pseudoElt ? pseudoElt : null).getPropertyValue('background-color')
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

function replaceElement(umlElem, srcUrl) {
	const parent = umlElem.parentNode

	if (parent === null) return
	if (umlElem.dataset.skipRender) return

	const imgElem = createImgElement(srcUrl)
	imgElem.setAttribute('style', 'max-width: 100%;')
	if (URL_REGEX.test(location.href)) {
		const style = imgElem.getAttribute('style')
		imgElem.setAttribute('style', style + 'padding: 15px; display: block; margin-left: auto; margin-right: auto;')
	}

	// change code to diagram
	parent.replaceChild(imgElem, umlElem)
	if (codePre.exist) parent.style.backgroundColor = codePre.parentColor

	imgElem.addEventListener('dblclick', () => {
		umlElem.dataset.skipRender = true

		parent.replaceChild(umlElem, imgElem)
		if (codePre.exist) parent.style.backgroundColor = codePre.selfColor
	})

	umlElem.addEventListener('dblclick', () => {
		parent.replaceChild(imgElem, umlElem)
		if (codePre.exist) parent.style.backgroundColor = codePre.parentColor
	})
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
	const plantUmlBaseUrl = baseUrl || DEFAULT_SERVER

	// TODO: get text from raw file

	const umlElements = [...document.querySelectorAll(profile.selector)]
		.filter((umlElem) => {
			const elem = profile.extract(umlElem)
			return !!elem && elem.startsWith('@start')
		})
		.filter((umlElem) => !umlElem.dataset.rendering)

	if (umlElements.length === 0) return

	console.log(`Count of elements for rendering: ${umlElements.length}`)

	umlElements.forEach((umlElem) => {
		umlElem.dataset.rendering = true

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

	// TODO: check profile when raw file
	// TODO: check profile when raw file(file://)

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
	console.log(window.location.href)
	console.log("options", options)

	const observer = new MutationObserver(() => {
		const siteProfile = Profiles[options.profile]

		if (!siteProfile) return
		if (document.querySelectorAll(siteProfile.selector).length <= 0) return

		run(options)
		if (options.profile === 'bitbucket') {
			observer.disconnect()
		}
	})

	observer.observe(document.body, {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
	})

	run(options)
}

init()
