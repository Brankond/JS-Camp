// manual implementation of call
// 1. add desired function (to be executed) to the pointed object (as a property)
// 2. execute the function and return results (if any)
// 3. delete the function from the object's property list
Function.prototype.custom_call = function(obj) {
    let context = obj || window // set to window if input object is null
    let fn = Symbol(); // use ES6 Symbol(), make sure that the added function is a unique property
    context[fn] = this;
    [_, ...args] = arguments // collect other arguments
    console.log(args)
    let result = context[fn](...args); 
    delete context[fn];
    return result;
}

// test
let value = 2

let a = {
    value: 1
}

function bar() {
    console.log('value:', this.value);
}

bar.custom_call(a)
// logs 'value: 1' instead 'value: 2'

// manual implementation of apply
// codes are similar as the case for "call", except for that it takes another parameter, which is an array containing all the parameters for the funciton to be executed
Function.prototype.custom_apply = function(obj, arg_arr) {
    let context = obj || window;
    let fn = Symbol();
    context[fn] = this;
    let result;
    if (!arg_arr) {
        result = context[fn]();
    } else {
        result = context[fn](...arg_arr);
    }
    delete context[fn];
    return result;
}

let b  = {
    value: 3,
}

function foo() {
    console.log(this.value)
}

foo.custom_apply(b)

// manual implementation of bind
Function.prototype.custom_bind = function(obj) {    
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable")
    }  
    // throw error if caller is not a function

    let self = this;
    [_, ...args_outer] = arguments;

    var return_fn = function() {
        self.apply(this instanceof self ? this : obj, [...args_outer, ...arguments])
        // if this function is called as constructor function, as the following statement has set its prototype to be the same as self (the caller function), 'this instanceof self' will return true.
    }
    return_fn.prototype = this.prototype
    return return_fn;
}

let c = {
    value: 5
}

function bee(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name)
    console.log(age)
}

let beeBind = bee.custom_bind(c, 'Tom');
var person = new beeBind(12) // if run as constructor function, the internal binding of this will be cancelled (in this case, this points to 'person' instead of 'c')
beeBind(18)