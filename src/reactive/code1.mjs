import { isEmpty } from "medash";
let activeEffect = null;
const bucket = new WeakMap();
const data = {
    text: 11
}
const obj = new Proxy(data, {
    get(target, key) {
        let depsMaps = bucket.get(target);
        if (isEmpty(depsMaps)) {
            depsMaps = new Map();
            bucket.set(target, depsMaps);
        }
        let deps = depsMaps.get(key);
        if (isEmpty(deps)) {
            deps = new Set();
            depsMaps.set(key, deps);
        }
        deps.add(activeEffect)
        return target[key];
    },
    set(target, key, newValue) {
        target[key] = newValue;
        const depsMaps = bucket.get(target);
        if (isEmpty(depsMaps)) return;
        const effects = depsMaps.get(key);
        effects && effects.forEach(val => val());
        return newValue;
    }
})

function effect(fn) {
    activeEffect = fn;
    fn();
}

setTimeout(() => {
    obj.text1 = 'hello vue3';
}, 1000)

effect(() => {
    console.log(obj.text);
});