`MyComponent
<template>
<header><slot name="header"></slot></header>
<div><slot name="body"></slot></div>
<footer><slot name="footer"></slot></footer>
</template>
`
`
<MyComponent>
<template #header>
<h1>我是标题</h1>
</template>
<template #body>
<section>我是标题</section>
</template>
<template #footer>
<p>我是标题</p>
</template>
</MyComponent>
`

//编译成后如下函数
function render() {
    return {
        type: MyComponent,
        children: {
            header(){
                return{
                    type: 'h1',
                    children: '我是标题'
                }
            },
            body(){
                return {
                    type: 'div',
                    children:''
                }
            },
            footer(){
                return {
                    type:'p',
                    children:'我是标题'
                }
            }
        }
    }
}


// MyComponent组件模板的编译结果
function render(){
    return [
        {
            type:'header',
            children:[this.$slots.header()]
        },
        {
            type:'div',
            children:[this.$slots.body()]
        },
        {
            type:'footer',
            children:[this.$slots.footer()]
        },
    ]
}