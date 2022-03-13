const map = new Map();
const weakMap = new WeakMap();
(() => {
    let o1 = { name: 1 };
    let o2 = { name: 2 };
    map.set(o1, 1);
    weakMap.set(o2, 2);
    o1 = null;
    o2 = null;
    console.log(map);
    console.log(weakMap);
})()