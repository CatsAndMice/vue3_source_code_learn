function ref(val) {
    const wrap = {
        value: val
    }
    //区分是否为ref,往wrap添加一个不可枚举属性_v_isRef，并且值为true
    Object.defineProperty(wrap, '_v_isRef', {
        value: true
    })
    return reactive(wrap)
}

//响应对象解构失效问题

//解构响应对象的某个属性
function toRef(obj, key) {
    const wrap = {
        get value() {
            return obj[key]
        },
        //赋值，触发响应
        set value(val) {
            obj[key] = val
        }
    }
    //解构后转化后，类似于ref结构数据
    Object.defineProperty(wrap, '_v_isRef', {
        value: true
    })
    return wrap
}

//批量解构响应对象的属性
function toRefs(obj) {
    const wrap = {}
    for (const key in obj) {
        wrap[key] = toRef(obj, key)
    }
    return wrap
}

