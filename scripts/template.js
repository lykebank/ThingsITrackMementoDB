var u = '';
var p = '';
var body = '';
body += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:enterprise.soap.sforce.com">';
    body += '<soapenv:Header></soapenv:Header>';
    body += '<soapenv:Body>';
        body += '<urn:login>';
            body += '<urn:username>' + u + '</urn:username>';
            body += '<urn:password>' + p + '</urn:password>';
        body += '</urn:login>';
    body += '</soapenv:Body>';
body += '</soapenv:Envelope>';
log(body);
var req = http();
log('created http() request');
log('setting headers');
req.headers({
    'content-type': 'text/xml',
    'SOAPAction': '',
    'User-Agent': 'MementoDB'
});
log('sending request to ' + loginUrl);
var loginResult = req.post(loginUrl, body);
log('got loginResult');
log('loginResult.code: ' + loginResult.code);
log('loginResult.body: ' + loginResult.body);