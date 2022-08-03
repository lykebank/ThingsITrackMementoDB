function test(){}

test.prototype.destructuring = function({name = 'kyle'} = {}){
    if(console){
        console.log('name: ' + name);
    }
}