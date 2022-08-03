function test(){}

test.prototype.destructuring = function( {name = 'kyle'} = {}){
    if(log && typeof log === 'function'){
        log('name: ' + name);
    }
    if(console){
        console.log('name: ' + name);
    }
}