function Salesforce(){}

Salesforce.prototype.login = function(loginUrl, username, password){
    if(loginUrl && username && password){
        let body = "";
        body += "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:enterprise.soap.sforce.com\">";
            body += "<soapenv:Header></soapenv:Header>"
            body += "<soapenv:Body>"
                body += "<urn:login>"
                    body += "<urn:username>" + username + "</urn:username>"
                    body += "<urn:password>" + password + "</urn:password>"
                body += "</urn:login>"
            body += "</soapenv:Body>"
        body += "</soapenv:Envelope>";
        let req = http();
        req.headers({
            "content-type": "text/xml",
            "SOAPAction": "",
            "User-Agent": "MementoDB"
        });
        let loginResult = req.post(loginUrl, body);
        return loginResult;
    }
    else{
        return null;
    }
}
