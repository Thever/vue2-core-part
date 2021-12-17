// patchVnode.js
import updateChildren from './updateChildren'

export default function patchVnode(oldVnode, newVnode) {
    // 判断新旧vnode是否是同一个对象
    if (oldVnode === newVnode) return
    // 判断新vnode有没有text属性
    if (
        newVnode.text != undefined &&
        (newVnode.children === undefined || newVnode.children.length === 0)
    ) {
        // 新node有text属性
        console.log('新Vnode有text属性')
        if (newVnode.text != oldVnode.text) {
            // 如果新虚拟节点中的text和老的虚拟节点的text不同，那么直接的让新的text写入老的elm中即可。如果老的elm中是children，name也会立即消失掉
            oldVnode.elm.innerText = newVnode.text
        }
    } else {
        // 新node没有text属性，有children
        // 判断老的虚拟节点有没有children
        if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
            // 老的vnode有children，此时是最复杂的情况。就是新老vnode都有children
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else {
            // 老的vnode没有children，新的有
            // 清空老vnode的内容
            oldVnode.elm.innerText = ''
            // 遍历新的vnode的子节点，创建dom，上树
            for (let i = 0; i < newVnode.children.length; i++) {
                const dom = createElement(newVnode.children[i])
                oldVnode.elm.appendChild(dom)
            }
        }
    }
}