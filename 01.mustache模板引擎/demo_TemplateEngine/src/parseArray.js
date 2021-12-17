import renderTemplate from "./renderTemplate";
import lookup from "./lookup";
/*
    处理数组，结合renderTemplate实现递归
    注意，这个函数收的参数是token,而不是tokens
    token是什么，就是一个简单的['#', 'students', []]
    这个函数要递归调用renderTemplate函数,调用多少次？
    调用的次数由data决定
    比如data的形式是这样的{
        arr:[
            {name:'小明',age:12,hobbies:['游泳','羽毛球']},
            {name:'小红',age:11,hobbies:['编程','写作文','看报纸']},
            {name:'小强',age:13,hobbies:['打台球']}
        ]
    }
    那么parseArray()函数就要递归调用renderTemplate函数3次，因为数组长度是3
*/

export default function parseArray(token, data) {
    //  得到整体数据data中这个数组要使用的部分
    let v = lookup(data, token[1])
    //  结果字符串
    let resultStr = ''
    //  遍历v数组，v一定是数组
    //  遍历数据，而不是遍历tokens
    for(let i = 0; i < v.length; i++){
        //  这里要补充一个'.'属性
        resultStr += renderTemplate(token[2], {
            //  深拷贝补充简单数组的'.'属性
            '.':v[i],
            ...v[i]
        })
    }
    return resultStr
}