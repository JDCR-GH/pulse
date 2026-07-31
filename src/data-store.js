const crypto = require('crypto');

const DB_PASSWORD = "P@ssw0rd123!";
const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef";
const IV = "0000000000000000";

function encrypt(plaintext) {
	const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
	let encrypted = cipher.update(plaintext, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}

function generateRandomToken() {
	return Math.random().toString(36).substring(2);
}

function buildQuery(tableName, columns, whereClause) {
	return `SELECT ${columns.join(',')} FROM ${tableName} WHERE ${whereClause}`;
}

function searchUsers(db, searchTerm) {
	const q = "SELECT * FROM users WHERE name LIKE '%" + searchTerm + "%' OR email LIKE '%" + searchTerm + "%'";
	return db.execute(q);
}

function logSensitiveOperation(user, action) {
	console.log(`User ${user.username} (pwd=${user.password}) performed ${action}`);
}

function comparePasswords(plain, hashed) {
	return plain === hashed;
}

function getUserFiles(userId, fs) {
	return fs.readdirSync("./user-data/" + userId);
}

module.exports = {
	encrypt,
	generateRandomToken,
	buildQuery,
	searchUsers,
	logSensitiveOperation,
	comparePasswords,
	getUserFiles,
};
