# Promise

1. `return` anything esle than a `Promise` instance inside a `.then` or `.catch` block will wrap the returned variable into a `Promise.resolve` object.

   For example:

   ```javascript
   Promise.resolve(1)
   .then((res)=>{
     return new Error('error!')
   })
   .then((res)=>{
     console.log('res:', res)
   })
   .catch((err)=>{
     console.log('catch:', err)
   })
   
   //	output
   // 	res: Error: error!!
   //			at Promise.resolve.then(...)
   ```

   In the above snippet, the error will not be catched by the `.catch` block, as the first `.then` block in fact returns `Promise.resolve(new Error('error!'))`.



## Async / Await

Async / Await is a syntax sugar that facilitates the usage of `Promise`

`async` 关键字用于声明一个函数为异步函数（如果这个函数内部没有任何 `await` 关键字，那么它实际上是同步执行的）

执行使用 `async` 关键字声明的函数会 `return` 一个 `Promise` 对象，如果函数内部也有返回值，那么这个值会作为这个 `Promise` 对象解决 `resolve` 的结果值，这个值会作为参数（第一个参数）传入这个 `Promise` 对象的 `.then()` 方法。

例：

```javascript
async function anAsyncFunction() {
  console.log('I am an async function');
  return 'result';
}

anAsyncFunction()
	.then((res) => { console.log(res) });

// output: 'result'
```

与 `async` 关键字经常搭配使用的是`await` 关键字

如果一个 `Promise` 对象出现在 `await` 关键字之后，那么 `await` 关键字之后的代码会被阻塞，直到 `Promise` 处理完成。

随着 `async` 和 `await` 关键字的引入，除开使用 `.catch` 之外，我们还可以使用 `try/catch` 代码块来对代码的异步部分进行错误处理

例：

```javascript
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
// output: 'I have error!'
```

