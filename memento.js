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

function libByName(name){
    return new Library();
}
function Library(){
    this.name = 'mock name';
    this.title = 'mock title';
}
Library.prototype.create = function(values){ return {...values};}
Library.prototype.entries = function(){ return [new Entry()];}
Library.prototype.find = function(query){return new Entry();}
Library.prototype.findById = function(id){return new Entry();}
Library.prototype.findByKey = function(key){return new Entry();}
Library.prototype.linksTo = function(linkedEntry){return [new Entry()];}
Library.prototype.show = function(){};

function Entry(){
    this.author = 'mock author';
    this.creationTime = Date.now();
    this.deleted = false;
    this.description = 'mock description';
    this.favorites = false;
    this.id = 'mock id';
    this.lastModifiedTime = Date.now();
    this.name = 'mock name';
    this.title = 'mock title';
};
Entry.prototype.field = function(name){return null;}
Entry.prototype.link = function(name, entry){}
Entry.prototype.unlink = function(name, entry){}
Entry.prototype.recalc = function(){}
Entry.prototype.trash = function(){}
Entry.prototype.untrash = function(){}
Entry.prototype.set = function(name, value){}
Entry.prototype.show = function(){}