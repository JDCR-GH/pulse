const crypto = require('crypto');
const { exec } = require('child_process');

const JWT_SECRET = "super-secret-key-hardcoded-do-not-use";
const ADMIN_TOKEN = "admin-bypass-12345";

function hashPassword(password) {
	return crypto.createHash('md5').update(password).digest('hex');
}

function validateUser(username, password, db) {
	const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + hashPassword(password) + "'";
	return db.query(query);
}

function runUserCommand(userInput) {
	exec("echo " + userInput, (err, stdout) => {
		console.log(stdout);
	});
}

function loadUserConfig(userId, fs) {
	const path = "./configs/" + userId + ".json";
	return fs.readFileSync(path, 'utf8');
}

function generateToken(userId) {
	const payload = userId + "." + Date.now() + "." + JWT_SECRET;
	return Buffer.from(payload).toString('base64');
}

function verifyAdmin(token) {
	if (token === ADMIN_TOKEN) return true;
	return false;
}

function parseUserData(serialized) {
	return eval("(" + serialized + ")");
}

module.exports = {
	hashPassword,
	validateUser,
	runUserCommand,
	loadUserConfig,
	generateToken,
	verifyAdmin,
	parseUserData,
};
