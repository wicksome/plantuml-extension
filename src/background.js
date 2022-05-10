// eslint-disable-next-line import/no-unassigned-import
import 'webext-dynamic-content-scripts'
import addDomainPermissionToggle from 'webext-domain-permission-toggle'
import { arrayBufferToBase64 } from './encoder/encoder'
import './options-storage'

// GitHub Enterprise support
addDomainPermissionToggle()

const injectContentScript = (tab) => {
	console.log('[plantuml] Inject plantuml-extension.js to tab', tab)

	chrome.permissions.getAll(({ origins }) => {
		const regex = new RegExp(
			`^${origins.join('|^')}`.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\*/g, '.+')
		)

		if (tab.url.match(regex)) {
			chrome.tabs.executeScript(tab.id, { file: 'plantuml-extension.js' }, chrome.runtime.lastError)
		}
	})
}

/**
 * 확장프로그램 아이콘이 클릭될 때 실행.
 */
chrome.browserAction.onClicked.addListener((tab) => {
	injectContentScript(tab)
})

/**
 * 탭이 업데이트되면 실행.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	console.log('[plantuml] Updated tab', `#${tabId}`, changeInfo)

	if (changeInfo.status === 'complete') {
		injectContentScript(tab)
	}
})

/**
 * runtime.sendMessage 혹은 tabs.sendMessage에 의해 메시지가 전송될 때 실행.
 */
chrome.runtime.onMessage.addListener((message, _, callback) => {
	console.log('[plantuml] Send message', message)

	if (message.action !== 'plantuml') return true

	fetch(message.url).then((res) => {
		const contentType = res.headers.get('Content-Type')

		res.arrayBuffer().then((buff) => {
			const base64 = arrayBufferToBase64(buff)
			const dataUri = `data:${contentType};base64,${base64}`
			callback(dataUri)
		})
	})

	return true
})
