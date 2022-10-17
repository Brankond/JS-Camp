const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

const isFunction = (val) => {
    return val && Object.prototype.toString.call(val) === '[object Function]'
}

const isPromise = (val) => {
    return val && val.constructor === Promise;
}

const handleCallback = (callback, state, result) => {
    let { onFullfilled, onRejected, resolve, reject } = callback;

    try {
        if (state === FULLFILLED) {
            isFunction(onFullfilled) ? resolve(onFullfilled(result)) : resolve(result);
        } else if (state === REJECTED) {
            isFunction(onRejected) ? reject(onRejected(result)) : reject(result);
        }
    } catch(error) {
        reject(error)
    }
}

const handleCallbacks = (callbacks, state, result) => {
    while (callbacks.length) handleCallback(callbacks.shift(), state, result);
}

Promise.prototype.then = function(onFullfilled, onRejected) {
    return new Promise((resolve, reject) => {
        let callback = { onFullfilled, onRejected, resolve, reject };

        if (this.state === PENDING){
            this.callbacks.push(callback);
        } else {
            setTimeout(() => handleCallback(callback, this.state, this.result), 0)
        }
    })
}

const transition = (promise, state, result) => {
    if (promise.state !== PENDING) return;
    promise.state = state;
    promise.result = result;
    setTimeout(()=> handleCallbacks(promise.callbacks, state, result));
}

const resolvePromise = (promise, result, resolve, reject) => {
    if (result === promise) {
        let reason = new TypeError('Can not fullfill promise with itself');
        return reject(reason);
    }

    if (isPromise(result)) {
        return result.then(resolve, reject);
    }

    if (isThenable(result)) {
        try {
            let then = result.then;
            if (isFunction(then)) {
                return new Promise(then.bind(result).then(resolve, reject));
            }
        } catch(error) {
            return reject(error);
        }
    }

    resolve(result);
}

function Promise(f) {
    this.state = 'pending';
    this.result = null;
    this.callbacks = [];

    const onFullfilled = val => transition(this, FULLFILLED, val);
    const onRejected = reason => transition(this, REJECTED, reason);

    let ignore = false;
    let resolve = val => {
        if (ignore) return;
        ignore = true;
        resolvePromise(this, val, onFullfilled, onRejected);
    }
    let reject = reason => {
        if (ignore) return;
        ignore = true;
        onRejected(reason);
    }

    try {
        f(resolve, reject);
    } catch(error) {
        reject(error);
    }
}