const { effect, createObj } = require('./effect')
const { or, isObject, isNull, isFunc, eq } = require('medash')
function readValue(value, seen = new Set()) {
    const isObj = or(!isObject(obj), isNull(obj))
    if (or(isObj, seen.has(value))) return
    seen.add(value)

    //循环读取值
    for (const v in value) {
        //暂时
        readValue(value[v], seen)
    }

    return value
}

function watch(obj, cb, option = {}) {
    //watch可以传入函数 
    let getter,
        newValue,
        oldValue,
        cleanup;
    isFunc
    if (isFunc(obj)) {
        getter = obj
    } else {
        getter = () => readValue(obj)
    }
    const onInvalidate = (fn) => {
        cleanup = fn
    }

    const job = () => {
        newValue = effectFn()
        if (cleanup) {
            cleanup()
        }
        cb(oldValue, newValue, onInvalidate)
        oldValue = newValue
    }

    const effectFn = effect(() => {
        return getter()
    }, {
        //新旧与旧值比较
        lazy: true,
        scheduler() {
            //重新赋值后调用
            if (eq(option.flush, 'post')) {
                const p = Promise.resolve()
                p.then(job)
            } else {
                job()
            }
        }
    })
    if (option.immediate) {
        job()
    } else {
        oldValue = effectFn()
    }

}
const obj = createObj({ name: 1 })

watch(() => obj.name, (oldValue, newVal, onInvalidate) => {
    console.log(oldValue, newVal);
})

obj.name++
setTimeout(() => {
    obj.name++
}, 2000)