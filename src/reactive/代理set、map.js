const {eq} = require('medash')
//存储代理的Map对象
const reactiveMap = new Map()
function reactive (obj){
    const proxy = createReactive(obj)
    const proxyValue = reactiveMap.get(obj)
    if(proxyValue)return proxyValue
    reactiveMap.set(obj,proxy)
    return proxy
}
function createReactive (obj){
    return new Proxy(obj,{
        get(target,key,receiver){
            //访问raw时，返回对象本身
            if(eq(key,'raw'))return target
            if(eq(key,'size')){
                //size对于Map、Set来说它是一个属性，存在this指向问题
                //手动触发track函数

                return Reflect.get(target,key,target)
            }
            //delete都是属性，硬绑定this指向
            return target[key].bind(target)
        }
    })
}

const proxySet =  reactive(new Set([1,2]))
console.log(proxySet.raw);