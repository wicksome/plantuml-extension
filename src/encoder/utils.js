const escapeHtml = (text) => {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

const createImgElement = (src) => {
	// For asciidoc (div div pre)
	const imgElem = document.createElement('img')
	imgElem.setAttribute('src', escapeHtml(src))
	imgElem.setAttribute('style', 'max-width: 100%; padding: 15px;')
	return imgElem
}

export { escapeHtml, createImgElement }
