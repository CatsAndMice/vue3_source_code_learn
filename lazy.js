const { isEmpty, eq, isFunc } = require("medash")
let data = { isOk: true, value: 0 }
let activeEffect
let effectStack = []
const bucket = new WeakMap()
function track(target, key) {
    if (isEmpty(activeEffect)) return target[key]
    let depsMaps = bucket.get(target)
    if (isEmpty(depsMaps)) {
        depsMaps = new Map()
        bucket.set(target, depsMaps)
    }
    let deps = depsMaps.get(key)
    if (isEmpty(deps)) {
        deps = new Set()
        depsMaps.set(key, deps)
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps);
}

function trigger(target, key) {
    const depsMaps = bucket.get(target)
    if (isEmpty(depsMaps)) return
    const deps = depsMaps.get(key)
    const effectRuns = new Set()
    deps && deps.forEach(dep => {
        if (!eq(activeEffect, dep)) {
            effectRuns.add(dep)
        }
    })
    effectRuns.forEach(effectRun => {
        if (isFunc(effectRun.option.scheduler)) {
            effectRun.option.scheduler(effectRun)
        } else {
            effectRun()
        }
    })

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

function effect(fn, option = {}) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    //新增
    effectFn.option = option
    effectFn.deps = []

    if (!option.lazy) {
        effectFn()
    }
    return effectFn
}

const jobQueue = new Set()
const p = Promise.resolve()
let isFlushing = false
function flushing() {
    if (isFlushing) return
    isFlushing = true
    //同步代码执行后
    p.then(() => {
        jobQueue.forEach(job => job())
    }).finally(() => {
        isFlushing = false
    })
}

const effectFn = effect(() => {
    console.log(obj.value);
}, {
    //lazy为true时,副作用函数不立即执行
    lazy: true
})

