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
        //get credentials from Config library in case any weren't pass
        if(!username || !password || !connectedAppKey || !connectedAppSecret){
            let config = this.getConfiguredCredentials();
            username = !!username ? username : config.username;
            password = !!password ? password : config.password;
            connectedAppKey = !!connectedAppKey ? connectedAppKey : config.client_id;
            connectedAppSecret = !!connectedAppSecret ? connectedAppSecret : config.client_secret;
        }
        checkRequiredInput(username, 'Missing username');
        checkRequiredInput(password, 'Missing password');
        checkRequiredInput(connectedAppKey, 'Missing connectedAppKey');
        checkRequiredInput(connectedAppSecret, 'Missing connectedAppSecret');
        
        this.login(username, password, connectedAppKey, connectedAppSecret);
        this.getIdentity();
    }
    catch(error){
        throw error;
    }
}

function checkRequiredInput(val, message){
    if(!val){
        throw new Error(message);
    }
}

SF.prototype.getConfiguredCredentials = function(){
    let creds = {};
    let configLibrary = libByName('Config');
    if(configLibrary){
        ['username', 'password', 'client_id', 'client_secret'].forEach(keyName => {
            let entry = configLibrary.findByKey(keyName);
            if(entry){
                creds[keyName] = entry.field('value');
            }
        });
    }
    return creds;
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
        throw error
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

SF.prototype.post = function(mLib, mEntry){
    try{
        //try to get mLib or mEntry if they were passed in and if we have those built-in memento functions available
        if(!mLib && typeof lib === 'function'){
            mLib = lib();
        }
        if(!mEntry && typeof entry === 'function'){
            mEntry = entry();
        }
        if(mLib && mEntry){
            let url = (this.mementoUrl + '/' + mLib.title).toString();
            //have to do some custom translation from memento's Library and Entry objects into our own objects, because JSON.stringify() is not working on memento's classes.
            let body = {
                lib: JSON.stringify(this.mapLibraryToSLibrary(mLib)),
                entry: JSON.stringify(this.mapEntryToSObject(mLib, mEntry))
            };
            let req = http();
            req.headers({'Authorization': this.authHeader});
            return req.post(url, JSON.stringify(body));
        }
        else{
            throw new Error('Did not post to Salesforce: Missing library or entry');
        }
    }
    catch(error){
        throw error
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

const thingsITrackTables = [
    {
        name: 'Locations',
        fields: ['Name', 'Physical Location', 'Rating']
    },
    {
        name: 'Running Gear',
        fields: ['Name', 'Gear Type', 'Description', 'Date Purchased', 'Mileage (manual)', 'Retired', 'Start Image', 'End Image']
    },
    {
        name: 'XXXX Run Log',
        fields: ['Date', 'Start Location', 'Distance', 'Duration', 'Gear Used', 'Description', 'Average Pace']
    }
];

SF.prototype.mapLibraryToSLibrary = function(lib){
    let sLibrary = {};
    if(lib && lib instanceof Library){
        sLibrary.name = lib.title;
        sLibrary.entries = lib.entries().map(e => {
            return this.mapEntryToSObject(lib, e);
        })
    }
    return sLibrary;
}

SF.prototype.mapEntryToSObject = function(lib, entry){
    let sObject = {};
    if(entry && entry instanceof Entry){
        sObject.author = entry.author;
        sObject.creationTime = entry.creationTime;
        sObject.deleted = entry.deleted;
        sObject.description = entry.description;
        sObject.favorites = entry.favorites;
        sObject.mementoId = entry.id;
        sObject.lastModifiedTime = entry.lastModifiedTime;
        sObject.name = entry.name;
        sObject.title = entry.title;
        sObject.fields = {};

        if(lib && lib instanceof Library){
            let tableName = lib.title.indexOf('Run Log') > -1 ? 'XXXX Run Log' : lib.title;
            log('tableName: ' + tableName);
            thingsITrackTables.find(t => t.name === tableName).fields.forEach(fieldName => {
                let fieldValue = entry.field(fieldName);
                if(fieldValue instanceof JSGeolocation){
                    log('got a JSGeolocation value');
                    let addressFieldName = (fieldName + '_address').toString();
                    sObject.fields[addressFieldName] = fieldValue.address;
                    let latFieldName = (fieldName + '_lat').toString();
                    sObject.fields[latFieldName] = fieldValue.lat;
                    let lonFieldName = (fieldName + '_lng').toString();
                    sObject.fields[lonFieldName] = fieldValue.lng;
                }
                else{
                    log('entry.field(' + fieldName + '): ' + fieldValue);
                    sObject.fields[fieldName] = fieldValue;
                    log('sObject.fields.length: ' + sObject.fields.length);
                }
                
            });
        }
    }
    return sObject;
}

//old stuff...
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