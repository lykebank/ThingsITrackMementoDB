// Mimic the Memento http()syntax.
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


function log(message){
    //stubs out memento's log() function.
}