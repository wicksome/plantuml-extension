// eslint-disable-next-line import/no-unassigned-import
import 'webext-dynamic-content-scripts'
import addDomainPermissionToggle from 'webext-domain-permission-toggle'
import { arrayBufferToBase64 } from './encoder/encoder'
import './options-storage'

// GitHub Enterprise support
addDomainPermissionToggle()

const injectContentScript = (tab) => {
	chrome.permissions.getAll(({ origins }) => {
		const regex = new RegExp(
			`^${origins.join('|^')}`.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\*/g, '.+')
		)

		if (tab.url.match(regex)) {
			chrome.tabs.executeScript(tab.id, { file: 'plantuml-extension.js' }, chrome.runtime.lastError)
		}
	})
}

chrome.browserAction.onClicked.addListener((tab) => {
	injectContentScript(tab)
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		injectContentScript(tab)
	}
})

chrome.runtime.onMessage.addListener((message, sender, callback) => {
	if (message.action === 'plantuml') {
		fetch(message.url).then((res) => {
			const contentType = res.headers.get('Content-Type')

			res.arrayBuffer().then((buff) => {
				const base64 = arrayBufferToBase64(buff)
				const dataUri = `data:${contentType};base64,${base64}`
				callback(dataUri)
			})
		})
	}

	return true
})
