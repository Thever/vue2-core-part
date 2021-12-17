// let obj = {}

// Object.defineProperty(obj, 'a', {
//     value:3,
//     //  是否可写
//     writable:true,
//     //  是否可以被枚举
//     enumerable:true
// })

// Object.defineProperty(obj, 'b', {
//     value:5,
//     //  是否可以被枚举
//     enumerable:false
// })

// console.log(obj)
// obj.a++
// console.log(obj.a, obj.b)
// for(let k in obj){
//     console.log(k)
// }

// let obj = {}
// //  周转变量
// let val = 1
// Object.defineProperty(obj, 'a', {
//     get() { // 下文中该方法统称为getter
//         console.log('get property a')
//         return val
//     },
//     set(newVal) { // 下文中该方法统称为setter
//         if (val === newVal) return
//         console.log(`set property a -> ${newVal}`)
//         val = newVal
//     }
// })
// console.log(obj)
// console.log(obj.a)

//  闭包封装
// function defineReactive(data, key, val) {
//     Object.defineProperty(data, key, {
//         //  可枚举
//         enumerable: true,
//         //  可以被配置
//         configurable: true,
//         get() {
//             return val
//         },
//         set(newVal) {
//             if (val === newVal) {
//                 return
//             }
//             val = newVal
//         }
//     })
// }

// let obj = {}
// defineReactive(obj, 'a', 10)
// console.log(obj.a)
// obj.a++
// console.log(obj.a)


import observe from "./observe.js";
import Watcher from "./Watcher.js";

var obj = {
    a: {
        m: {
            n: 5,
        },
    },
    b: 10,
    c: {
        d: {
            e: {
                f: 6666,
            },
        },
    },
    g: [22, 33, 44, 55],
};

observe(obj);
new Watcher(obj, "a.m.n", (val) => {
    // Watcher会提前算出a.m.n的值，在求值过程中触发get
    console.log("★我是watcher，我在监控a.m.n", val);
});
// console.log(obj.a.m.n)
obj.a.m.n = 88;
obj.a.m.n = 43;
// obj.g.push(66);
console.log(obj.a.m.n);
console.log(obj);