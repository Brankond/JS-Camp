// return inside promise blocks
Promise.resolve(1)
    .then((res)=>{
        console.log(res)
        return new Error('Error!')
    })
    .then((res)=>{
        console.log('res:', res)
    })
    .catch((err)=>{
        console.log('err:', err)
    })
// in the above code, the .catch block does not catch the error

Promise.resolve(1)
    .then((res)=>{
        console.log(res)
        return Promise.reject(new Error('Error!'))
    })
    .then((res)=>{
        console.log('res:', res)
    })
    .catch((err)=>{
        console.log('err:', err)
    })
// in the above code, the .catch block cathes the error properly

// Promise.all
let p1 = Promise.all([1,2,3])
let p2 = Promise.all([1,2,Promise.resolve('res')])
let p3 = Promise.all([1,2,Promise.reject('reason')]).catch((err)=>{console.log(err)})

setTimeout(()=>{
    console.log(p1)
    console.log(p2)
    console.log(p3)
},0)

// async/await
async function anAsyncFunction() {
    console.log('I am an async function');
    return 'result';
}

anAsyncFunction()
    .then((res) => { console.log(res) });

console.log(anAsyncFunction());

async function asyncFunctionWithError() {
    try {
        let varA = 'normal value';
        let varB = await new Promise((_, reject) => {
            reject('I have error!');
        })
    } catch(e) {
        console.log(e);
    }
    return 'finally';
}

asyncFunctionWithError();