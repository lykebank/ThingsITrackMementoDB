var u = '';
var p = '';
var k = '';
var s = '';

let sf = new SF(u, p, k, s);

log(sf.accessToken);
sf.destructuringTest({firstName: 'Liz'});
