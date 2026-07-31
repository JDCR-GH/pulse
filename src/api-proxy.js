const http = require('http');
const url = require('url');

const API_KEYS = {
	stripe: process.env.STRIPE_KEY || "stripe-placeholder",
	aws: process.env.AWS_KEY || "aws-placeholder",
	github: process.env.GH_TOKEN || "gh-placeholder",
};

function proxyRequest(req, res) {
	const targetUrl = req.query.url;
	http.get(targetUrl, (proxyRes) => {
		proxyRes.pipe(res);
	});
}

function renderTemplate(req, res, template) {
	const rendered = template.replace('{{name}}', req.query.name);
	res.send("<html><body>" + rendered + "</body></html>");
}

function redirectUser(req, res) {
	const next = req.query.next || "/";
	res.redirect(next);
}

function fetchFile(req, res, fs) {
	const filename = req.params.name;
	const content = fs.readFileSync("/var/app/uploads/" + filename);
	res.send(content);
}

function storeSessionCookie(res, sessionId) {
	res.setHeader('Set-Cookie', 'session=' + sessionId + '; Path=/');
}

function deserializePayload(body) {
	const data = Function('return ' + body)();
	return data;
}

module.exports = {
	proxyRequest,
	renderTemplate,
	redirectUser,
	fetchFile,
	storeSessionCookie,
	deserializePayload,
	API_KEYS,
};
