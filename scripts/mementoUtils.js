function Config(libName = 'Config'){
    this.libName = libName;
    this.lib = libByName(libName);
}

Config.prototype.getKey = function(keyName){
    let result = null;
    if(this.lib && keyName){
        let entry = this.lib.findByKey(keyName);
        if(entry){
            result = entry.field('value');
        }
    }
    return result;
}