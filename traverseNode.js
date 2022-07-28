import { isFunc } from "medash"

const traverseNode = (ast) => {
    const currentNode = ast
    if (currentNode.type === "Element" && currentNode.tag === "p") {
        currentNode.tag = 'p'
    }
    // 文本内容重复两次
    if (currentNode.type === "Text") {
        currentNode.content = currentNode.content.repeat(2)
    }
    const children = currentNode.children
    if (children) {
        for (let index = 0; index < children.length; index++) {
            traverseNode(children[index])
        }
    }
}