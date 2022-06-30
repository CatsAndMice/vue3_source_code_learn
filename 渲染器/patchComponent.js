
function hasPropsChanged(nextProps, pervProps) {
    const nextKeys = object.keys(nextProps);
    // props长度不相等时，说明子组件props发生了改变
    if (nextKeys.length !== Object.keys(pervProps)) {
        return true
    }

    for (let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i];
        //不相等的props值
        if (nextKeys[key] !== pervProps[key]) {
            return true
        }


        return false;
    }
}


// 组件Props对象是浅响应
function patchComponent(n1, n2, anchor) {
    const instance = (n2.component = n1.component);
    const { props } = instance;
    //判断子组件pros是否改变
    if (hasPropsChanged(n1.props, n2.props)) {
        props
        // for()
    }
}

