var minRemoveToMakeValid = function(s) {
    const stack = [];
    const chars = s.split('');
    for (let i = 0;i<chars.length;i++){
        if (chars[i] === '(') {
            stack.push(i);
        }   else if (chars[i] === ')'){
            if (stack.length > 0) {
                stack.pop();
            } else {
                chars[i]= '';
            }
        }
    }
    while (stack.length > 0) {
        chars[stack.pop()] = "";
    }
    return chars.join("");
};

console.log(minRemoveToMakeValid("lee(t(c)o)de)"));