import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
} from "snabbdom";

// //  初始化patch函数
// const patch = init([
//     // Init patch function with chosen modules
//     classModule, // makes it easy to toggle classes
//     propsModule, // for setting properties on DOM elements
//     styleModule, // handles styling on elements with support for animations
//     eventListenersModule, // attaches event listeners
// ]);

// //  指定容器
// const container = document.getElementById("container");

// const vnode = h("div#container.two.classes", { on: { click: () => {console.log(`vnode`)} } }, [
//     h("span", { style: { fontWeight: "bold" } }, "This is bold"),
//     " and this is just normal text",
//     h("a", { props: { href: "/foo" } }, "I'll take you places!"),
// ]);
// // Patch into empty DOM element – this modifies the DOM as a side effect
// // patch函数可以让虚拟节点上树
// patch(container, vnode);

// const newVnode = h(
//     "div#container.two.classes",
//     { on: { click: () => {console.log(`newVnode`)} } },
//     [
//         h(
//             "span",
//             { style: { fontWeight: "normal", fontStyle: "italic" } },
//             "This is now italic type"
//         ),
//         " and this is still just normal text",
//         h("a", { props: { href: "/bar" } }, "I'll take you places!"),
//     ]
// );
// // Second `patch` invocation
// patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state

//  初始化patch函数
const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

//  指定容器
const container = document.getElementById("container");

const myVnode1 = h('ul', {}, [
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D'),
    h('li', { key: 'E' }, 'E')
])

// 第一次上树
patch(container, myVnode1)

const btn = document.getElementById('btn')
// 新节点
const myVnode2 = h('ul', {}, [
    h('li', { key: 'QQ' }, 'QQB'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'F' }, 'F'),
    h('li', { key: 'G' }, 'G')
])
btn.onclick = function () {
    patch(myVnode1, myVnode2)
}
//  diff算法只会在同一个虚拟节点(选择器相同且key相同)，才会进行精细化比较。
//  diff算法只会进行同层比较，不会进行跨层比较(跨层直接删除旧的,插入新的)
//  diff算法适用于vue2,vue3的实际开发需要