
let human = {
    name: ''
}
let info = [human,human];
let userInfo = {
   //human,
    //info,
   ...info
}

console.log(info);
console.log(...info);
//console.log(userInfo);

//userInfo['name'] = 'sadaf';
userInfo.name = 'mahfuz'
console.log(userInfo);