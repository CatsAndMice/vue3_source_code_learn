'use strict'
const getType = (value) => {
    const reg = /^\[object\s(\w+)\]$/;
    const type = toString.call(value);
    return reg.exec(type)[1]
}
const or = (param1, param2) => param1 || param2;
const isObject = (value) => {
    const type = getType(value);
    return type === 'Object'
}

const isArray = (value) => {
    return Array.isArray(value)
}

const isFunc = (callBack) => {
    let type = typeof callBack
    return type === 'function'
}

const each = (origin, callBack) => {
    const isArr = isArray(origin)
    if (!or(isObject(origin), isArr)) return;
    if (!isFunc(callBack)) return
    const keys = Object.keys(origin);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        callBack(isArr ? i : key, origin[key], origin);
    }
}

const types = [getType([]), getType({})]
const isSet = (obj) => getType(obj) === 'Set'
const isMap = (obj) => getType(obj) === 'Map'
const keys = ['add', 'delete', 'set']
function deepFreeze(obj) {
    const type = getType(obj)
    if (!types.includes(type)) return obj
    if (or(isObject(obj), isArray(obj))) {
        each(obj, (key, value) => {
            if (typeof value === "object") {
                obj[key] = deepFreeze(value)
            }
        })
        return Object.freeze(obj)
    }
    if (or(isMap(obj), isSet(obj))) {
        Array.from(obj.values()).forEach(value => {
            deepFreeze(value)
        })
        return new Proxy(obj, {
            get(target, key) {
                if (keys.includes(key)) {
                    throw new Error('只读，不允许修改!')
                }
                // if (eq(key, 'size')) {
                //     return Reflect.get(target, key, target)
                // }
                return isFunc(target[key]) ? target[key].bind(target) : target[key]
            },
            set() {
                throw new Error('只读，不允许修改或添加属性!')
            }
        })
    }
}

const map = deepFreeze(new Map([[1,2]]))
map.size(30)
console.log(map.size);
