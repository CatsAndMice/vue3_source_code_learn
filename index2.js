const { isEmpty } = require("medash")

let data = {
    isOk: true,
    value: 0
}

let activeEffect
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

    //重新创建新的Set对象
    const effectRuns = new Set(deps)
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

//清理依赖
//问题：trigger中这行代码:deps && deps.forEach(dep => dep()) 会执行副作用函数,重新执行cleanup方法
function cleanup(effectFn) {
    console.log(effectFn.deps);
    effectFn.deps.forEach(dep => {
        dep.delete(effectFn)
    })
}

function effect(fn) {
    //每次执行副作用函数时,将它所有的关联的依赖清理一次
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = []
    effectFn()
}

//处理三位运算符
/**
 * 当isOk为true，然后修改成false时,isOk、value属性依赖被收集
 * 
 * 当isOk为false时,再去修改obj.value = 11后会触发依赖,执行obj.value被收集的依赖
 * 造成不必要的消耗
 */
let value
effect(() => {
    value = obj.isOk ? obj.value : ''
    console.log('我执行了!');
})

setTimeout(() => {
    obj.value = '执行'
}, 2000)