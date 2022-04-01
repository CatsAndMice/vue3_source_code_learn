const { isEmpty } = require("medash")

let data = {
    a: 1
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
}

function trigger(target, key) {
    const depsMaps = bucket.get(target)
    //若设置属性时,该属性并没有在于map中,则直接返回
    if (isEmpty(depsMaps)) return
    const deps = depsMaps.get(key)
    deps && deps.foreach(dep => dep())
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

function effect(fn) {
    activeEffect = fn
    fn()
}

effect(() => {
    console.log(obj.a);
})

//设置不存在的属性,也会触发get
setTimeout(() => {
    obj.b = 1
}, 2000)

