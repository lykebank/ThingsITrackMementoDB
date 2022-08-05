try{
    var config = new Config();
    var u = config.getKey('username');
    var p = config.getKey('password');
    var k = config.getKey('client_id');
    var s = config.getKey('client_secret');

    let sf = new SF(u, p, k, s);

    log(sf.accessToken);

    //sf.insertLocation('big memento test');
    let l = libByName('Locations');
    let e = l.entries()[0];
    sf.post(l, e);
}
catch(error){
    if(typeof log === 'function'){
        log(error);
    }
}