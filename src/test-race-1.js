function greet(name) {
	if (!name || typeof name !== 'string') {
		throw new Error('Name must be a non-empty string');
	}
	const trimmed = name.trim();
	return `Hello, ${trimmed}!`;
}

function farewell(name) {
	return `Goodbye, ${name}!`;
}

module.exports = { greet, farewell };
