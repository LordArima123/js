var checkValidString = function(s) {
    let openmin = 0, openmax=0;
    for(let i of s){
        if (i==='('){
            openmin++;
            openmax++
        } else if (i === ')'){
            openmin--
            openmax--
        } else {
            openmin--
            openmax++
        }
        if (openmax<0) return false
        if (openmin<0) openmin=0    
    }
    return openmin===0
};
s ="(((((*(()((((*((**(((()()*)()()()*((((**)())*)*)))))))(())(()))())((*()()(((()((()*(())*(()**)()(())"
console.log(checkValidString(s))