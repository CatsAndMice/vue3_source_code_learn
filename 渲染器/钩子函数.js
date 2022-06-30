const { shallowReactive, shallowReadonly } = require("@vue/reactivity")

// A组件注册onMount,B组件注册onMount ,它们均各自注册在组件本身上
let currentInstance = null//全局变量
function setCurrentInstance(instance) {
    currentInstance = instance
}

function mountComponent(vnode, container, anchor) {
    const instance = {
        state,
        props: shallowReactive(props),
        subTree: false,
        slots,
        mounted: []
    }

    const setupContext = { attrs, emit, slots }

    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), setupContext)
    setCurrentInstance(null)
}


function onMounted(fn){
    if(currentInstance){
        currentInstance.mounted.push(fn)
    }else{
        console.error('onMounted函数只能在setup函数中调用');
    }
}