var Salesforce = {
    login: function(loginUrl, username, password){
        if(loginUrl && username && password){
            let body = '';
            body += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:enterprise.soap.sforce.com">';
                body += '<soapenv:Header></soapenv:Header>';
                body += '<soapenv:Body>';
                    body += '<urn:login>';
                        body += '<urn:username>' + username + '</urn:username>';
                        body += '<urn:password>' + password + '</urn:password>';
                    body += '</urn:login>';
                body += '</soapenv:Body>';
            body += '</soapenv:Envelope>';
            log(body);
            let req = http();
            log('created http() request');
            log('setting headers');
            req.headers({
                'content-type': 'text/xml',
                'SOAPAction': '',
                'User-Agent': 'MementoDB'
            });
            log('sending request to ' + loginUrl);
            let loginResult = req.post(loginUrl, body);
            log('got loginResult');
            log('loginResult.code: ' + loginResult.code);
            log('loginResult.body: ' + loginResult.body);
            return loginResult;
        }
        else{
            return null;
        }
    },
    getAccessToken: function(username, password, client_id, client_secret){
        if(username && password && client_id && client_secret){
            let fullUrl = 'https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=' + client_id + '&client_secret=' + client_secret + '&username=' + username + '&password=' + password;
            let tokenResponse = http().post(fullUrl, null);
            return tokenResponse;
        }
        else{
            return null;
        }
    }
}