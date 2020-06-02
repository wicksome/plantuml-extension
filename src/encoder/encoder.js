const arrayBufferToBase64 = (buffer) => {
	const bytes = [].slice.call(new Uint8Array(buffer))

	let binary = ''
	bytes.forEach((b) => (binary += String.fromCharCode(b)))

	return window.btoa(binary)
}

export { arrayBufferToBase64 }
