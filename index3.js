const { isEmpty, eq } = require("medash")

let data = {
    isOk: true,
    value: 0
}

let activeEffect
//effeat栈
let effectStack = []

const bucket = new WeakMap()
function track(target, key) {
    if (isEmpty(activeEffect)) return target[key]
    let depsMaps = bucket.get(target)
    //判断target是否已存在
    if (isEmpty(depsMaps)) {
        depsMaps = new Map()
        bucket.set(target, depsMaps)
    }
    //判断key是否已存于depsMaps Map对象中
    let deps = depsMaps.get(key)
    if (isEmpty(deps)) {
        deps = new Set()
        depsMaps.set(key, deps)
    }
    deps.add(activeEffect)

    //将收集的依赖,在activeEffect.deps存储
    activeEffect.deps.push(deps);
}

function trigger(target, key) {
    const depsMaps = bucket.get(target)
    //若设置属性时,该属性并没有在于map中,则直接返回
    if (isEmpty(depsMaps)) return
    const deps = depsMaps.get(key)
    const effectRuns = new Set()
    //过滤当前activeEffect
    deps && deps.forEach(dep => {
        if (!eq(activeEffect, dep)) {
            effectRuns.add(dep)
        }
    })

    effectRuns.forEach(effectRun => effectRun())
    // deps && deps.forEach(dep => dep())
}

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },

    set(target, key, newVal) {
        target[key] = newVal
        trigger(target, key)
    }
})

function cleanup(effectFn) {
    effectFn.deps.forEach(dep => {
        dep.delete(effectFn)
    })
}

function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()

        //最后还原activeEffect
        effectStack.pop()
        //没有嵌套effect时,执行完副作用函数，activeEffect被赋值为undefined
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
}

// effect(() => {
//     console.log('fn1');
//     effect(() => {
//         console.log('fn2');
//         console.log(obj.isOk);
//     })
//     console.log(obj.value);
// })

//无限调用，栈溢出
effect(() => {
    obj.value += 1
    console.log(obj.value);
}) //obj.value += 1 等价于  obj.value = obj.value + 1  读取obj.value触发track收集依赖,然后设置obj.value触发trigger,避免无限循环,trigger函数中过滤activeEffect即可

//修改obj.value应该触发fn1打印出来，但出现的是fn2
setTimeout(() => {
    obj.value = 1
}, 2000)