// Mimic the Memento http().get() syntax.

function http() {
	return new httpClient();
}

function httpClient() {
	this.request = new XMLHttpRequest();
}

httpClient.prototype.request = new XMLHttpRequest();

httpClient.prototype.get = function (url) {
	if (!this.request) {
		this.request = new XMLHttpRequest();
	}
	this.request.open('GET', url, false);
	this.request.send(null);
	var HttpResult = {};
	HttpResult.code = this.request.status;
	HttpResult.body = null;
	if (this.request.status === 200) {
		HttpResult.body = this.request.responseText;
	}
	return HttpResult;
}

httpClient.prototype.post = function (url, body) {
	if (!this.request) {
		this.request = new XMLHttpRequest();
	}
	this.request.open('POST', url, false);
	this.request.send(body);
	if (this.request.status === 200) {
		return this.request.response;
	}
	else {
		return this.request.responseText;
	}
}

httpClient.prototype.headers = function (val = {}) {
	if (!this.request) {
		this.request = new XMLHttpRequest();
	}
	Object.keys(val).forEach(key => {
		this.request.setRequestHeader(key, val[key]);
	});
}
