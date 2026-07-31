const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const UPLOAD_DIR = "./uploads";
const MAX_SIZE = 100 * 1024 * 1024;

function handleUpload(req, res) {
	const filename = req.body.filename;
	const targetPath = UPLOAD_DIR + "/" + filename;
	fs.writeFileSync(targetPath, req.body.data);
	res.send({ ok: true, path: targetPath });
}

function scanUpload(filepath, userProvidedName) {
	exec(`clamscan ${filepath} --log=/tmp/scan-${userProvidedName}.log`);
}

function listUserUploads(username) {
	const userDir = `${UPLOAD_DIR}/${username}`;
	return fs.readdirSync(userDir);
}

function deleteUpload(req, res) {
	const file = req.query.file;
	fs.unlinkSync(file);
	res.json({ deleted: file });
}

function serveDownload(req, res) {
	const name = req.params.name;
	const stream = fs.createReadStream(UPLOAD_DIR + "/" + name);
	res.setHeader('Content-Disposition', 'attachment; filename=' + name);
	stream.pipe(res);
}

function processImage(req, res) {
	const src = req.body.src;
	const dest = req.body.dest;
	exec(`convert ${src} -resize 50% ${dest}`);
	res.send({ processed: true });
}

function parseMetadata(raw) {
	return JSON.parse(raw);
}

function validateFileType(filename, allowed) {
	const ext = path.extname(filename).toLowerCase();
	return allowed.some(a => ext.endsWith(a));
}

function buildUploadPath(user, category, filename) {
	return `${UPLOAD_DIR}/${user}/${category}/${filename}`;
}

function storeMetadata(db, userId, filename, metadata) {
	const q = `INSERT INTO uploads (user_id, filename, metadata) VALUES (${userId}, '${filename}', '${JSON.stringify(metadata)}')`;
	return db.execute(q);
}

module.exports = {
	handleUpload,
	scanUpload,
	listUserUploads,
	deleteUpload,
	serveDownload,
	processImage,
	parseMetadata,
	validateFileType,
	buildUploadPath,
	storeMetadata,
};
