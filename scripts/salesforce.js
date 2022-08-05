//username/password flow:
//send login POST, with username, password, client_id, client_secret
//get back an access token
//use it in subsequent API calls until it expires
//this method requires a high degree of trust (https://help.salesforce.com/s/articleView?id=sf.remoteaccess_disable_username_password_flow.htm&type=5)

//device flow for IoT integration:
//send login POST with client_id, and response_type of 'device_code'
//get back a verification URL, user_code, and device code (valid for 10 minutes), and recommended polling interval
//user must then open the URL, provide the user_code
    //meanwhile, my app is polling the original token endpoint at recommended interval (e.g. every 5 seconds)
    //but this time is sending grant_type of 'device' (not response_type 'device_code')
//once user has opened URL and provided user_code, the polling will succeed with a reponse containing access_token AND refresh_token
//so in order to pop up browser window, take user to URL, show user the user_code, and keep polling, can MementoDB script do this all, or do I need to include Tasker for this?


function SF(username, password, connectedAppKey, connectedAppSecret){
    try{
        this.login(username, password, connectedAppKey, connectedAppSecret);
        this.getIdentity();
    }
    catch(error){
        throw error;
    }
}

SF.prototype.login = function(username, password, client_id, client_secret){
    try{
        if(username && password && client_id && client_secret){
            let fullUrl = 'https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=' + client_id + '&client_secret=' + client_secret + '&username=' + username + '&password=' + password;
            let loginResponse = this.parseHttpResponse(http().post(fullUrl, null));
            this.authHeader = (loginResponse.token_type + ' ' + loginResponse.access_token).toString();
            this.accessToken = loginResponse.access_token        
            this.baseUrl = loginResponse.instance_url;
            this.apexUrl = (this.baseUrl + '/services/apexrest/').toString();
            this.mementoUrl = (this.apexUrl + 'memento').toString();
            this.identityUrl = (loginResponse.id + '?version=latest').toString();
        }
        else{
            throw new Error('SF.login(): missing inputs');
        }
    }
    catch(error){
        throw error;
    }
}

SF.prototype.getIdentity = function(){
    let req = http();
    req.headers({'Authorization': this.authHeader, 'Accept': 'application/json'});
    let identityResponse = this.parseHttpResponse(req.get(this.identityUrl));
    this.restUrl = identityResponse && identityResponse.urls ? identityResponse.urls.rest : null;
    this.sobjectsUrl = identityResponse && identityResponse.urls ? identityResponse.urls.sobjects : null;
    this.queryUrl = identityResponse && identityResponse.urls ? identityResponse.urls.query : null;
}

SF.prototype.postToSF = function(lib, entry){
    if(lib && entry){
        try{
            let url = (this.mementoUrl + '/' + lib.name).toString();
            let body = {
                lib: lib.name,
                entry: JSON.stringify(entry)
            };
            let req = http();
            req.headers({'Authorization': this.authHeader});
            return req.post(url, JSON.stringify(body));
        }
        catch(error){
            throw error;
        }
    }
}

SF.prototype.parseHttpResponse = function(httpResponse){
    try{
        if(httpResponse){
            return JSON.parse(httpResponse.body);
        }
        else{
            throw new Error('SF.parseHttpResponse(): httpResponse was null');
        }
    }
    catch(error){
        throw error;
    }
}

SF.prototype.insertLocation = function(entryId, locationName){
    if(locationName){
        try{    
            return this.insertSObject('Location__c', {
                Memento_ID__c: entryId,
                Name: locationName
            });
        }
        catch(error){
            throw error;
        }
    }
}

SF.prototype.upsertRun = function(entry){
    if(entry && entry instanceof Entry){
        try{    
            //use Run Log entry to insert an Exercise__c record
            //use link values to fill Salesforce lookup fields via external Id values
            //do nothing for now :)
        }
        catch(error){
            throw error;
        }
    }
}

SF.prototype.insertSObject = function(sobjectName, data){
    if(sobjectName && data){
        try{
            let url = (this.sobjectsUrl + sobjectName).toString();
            let body = JSON.stringify(data);
            let req = http();
            req.headers({'Authorization': this.authHeader});
            return req.post(url, body);
        }
        catch(error){
            throw error;
        }
    }
}