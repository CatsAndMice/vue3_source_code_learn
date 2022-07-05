const { ref } = require('@vue/reactivity');
const { isFunc } = require('medash');
function defineAsyncComponent(options) {
    let InnerComp = null
    if (isFunc(options)) {
        options = {
            loader: options
        }
    }

    const { loader } = options

    return {
        name: "AsyncComponentWrapper",
        setup() {
            const loaded = ref(false)
            const timeout = ref(false)
            loader().then((c) => {
                InnerComp = c
                loaded.value = true
            })
            let timer = null
            // 超时
            if (options.timeout) {
                timer = setTimeout(() => {
                    timeout.value = true
                }, options.timeout)
            }

            onUnMounted(() => {
                clearTimeout(timer)
            })
            const placeholder = { type: Text, children: "" }
            return () => {
                if (loaded.value) {
                    return { type: InnerComp }
                } else if (timeout.value) {

                    return options.errorComponent ? { type: options.errorComponent } : placeholder
                }
                return placeholder
            }
        }
    }
}


defineAsyncComponent({
    loader: () => import('../'),
    //超时/Error组件
    timeout: 1000,
    errorComponent: MyErrorComp//指定出错时要渲染的组件
})