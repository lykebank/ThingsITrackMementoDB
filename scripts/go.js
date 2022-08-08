function  go(){
    try{
        let response = new SF().post(lib(), entry());
        message('Posted to Salesforce. Result: ' + response.body);
    }
    catch(error){
        if(typeof log === 'function'){
            log(error);
        }
    }
}