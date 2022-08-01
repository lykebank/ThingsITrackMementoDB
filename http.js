// Mimic the Memento http().get() syntax.

function http() {
  return new httpClient();
}

function httpClient() {
}

httpClient.prototype.get = function(query) {
  var request = new XMLHttpRequest();
  request.open('GET', query, false);  // `false` makes the request synchronous
  request.send(null);
  var HttpResult = {};
  HttpResult.code = request.status;
  HttpResult.body = null;
  if (request.status === 200) {
    HttpResult.body = request.responseText;
  }
  return HttpResult;
}

httpClient.prototype.post = function(url, data){
  let request = new XMLHttpRequest();
  request.open('POST', url, false);
  request.send(data);
  if(request.status === 200){
    return request.response;
  }
  else{
    return request.responseText;
  }
}
