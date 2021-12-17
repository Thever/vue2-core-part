# 什么是模板引擎？
模板引擎是将数据要变为视图最优雅的解决方案。

# 历史上曾经出现过的其它数据变视图的方法
纯 DOM 法           非常笨拙，没有实战价值

数组 join 法        曾几何时非常流行，是曾经的前端必会只是
在 js 里单双引号内的内容是不能换行的，为了提高 dom 结构可读性，利用了数组的 join 方法（将数组变为字符串），注意 join 的参数 '' 不可以省略，否则得到的 str 字符串会是以逗号间隔的

ES6的反引号法       es6中新增的（`${value}`）语法糖，很好用

模板引擎            解决数据变为视图的最优雅的方法

# mustache的基本使用
Github:https://github.com/janl/mustache.js
mustache 是“胡子”的意思，因为它的嵌入标记 {{ }} 非常像胡子。
{{ }} 的语法也被 vue 沿用。
注意，mustache 的 {{ }} 内是不能像 vue 里那样写表达式。
使用 mustache 需要引入 mustache 库，可以直接通过 cdn 方式引入。
然后通过 Mustache.render(templateStr, data) 方式生成 dom 模板

# mustache的底层token思想
mustache 模板引擎的作用是将字符串模板变为 dom 模板，最后结合数据挂载到 dom 树上，在页面渲染呈现。这个过程中，mustache 引入了一个名为 tokens 的概念，用来作为“中间人”。所谓一图胜千言，直接放图。

           编译           结合数据解析
字符串模板 -----> tokens --------------> dom字符串

![basic](C:\Users\Administrator\Desktop\vue2源码\01.mustache模板引擎\basic.webp)

# 模板字符串编译为 tokens
```
    //  Scanner类实例是一个扫描器，用来扫描构造时作为参数提供的那个模板字符串。
    //  属性
    //  pos：指针，用于记录当前扫描到字符串的位置
    //  tail：尾巴，值为当前指针之后的字符串（包括指针当前指向的那个字符）
    //  方法
    //  scan：无返回值，让指针跳过传入的结束标识 stopTag
    //  scanUntil：传入一个指定内容 stopTag 作为让指针 pos 结束扫描的标识，并返回扫描内容

    /* 扫描器类 */
    export default class Scanner{
        constructor(templateStr){
            //  字符串模板
            this.templateStr = templateStr
            //  指针位置
            this.pos = 0
            //  尾巴,一开始就是模板字符串原文
            this.tail = templateStr
        }
        
        //  功能弱，就是路过指定内容，没有返回值
        scan(tag){
            //  确保当前指针位置再指定跳过的内容上
            if(this.tail.indexOf(tag) == 0){
                // 指针跳过tag，比如 tag 是 {{，则 pos 就会加2
                this.pos += tag.length
                // substring 不传第二个参数直接截取到末尾
                // 修改尾巴从当前指针这个字符开始，到最后的全部字符
                this.tail = this.templateStr.substring(this.pos)
            }
        }

        //  让指针进行扫描，直到遇到指定内容结束，并且能返回结束之前路过的文字
        scanUtil(stopTag){
            //  记录下执行本方法的时指针的位置
            const pos_backup = this.pos
            //  当尾巴的开头不为stopTag，就说明还没扫描到stopTag
            //  为了避免死循环，指针位置要不能超过模板字符串
            while(!this.eos() && this.tail.indexOf(stopTag) !== 0){
                //  移动指针位置
                this.pos++;
                //  改变尾巴为当前指针这个字符开始，到最后的全部字符
                this.tail = this.templateStr.substring(this.pos)
            }
            //  返回扫描过的字符串，不包括当前指针所在的位置
            return this.templateStr.substring(pos_backup, this.pos)
        }

        // 指针是否已经抵达字符串末端，返回布尔值 eos(end of string)
        eos() {
            return this.pos >= this.templateStr.length
        }
    }
```

# 根据模板字符串生成 tokens
有了 Scanner 类后，就可以着手去根据传入的模板字符串生成一个 tokens 数组了。最终想要生成的 tokens 里的每一条 token 数组的第一项用 name(数据) 或 text(非数据文本) 或 #(循环开始) 或 /(循环结束) 作为标识符。
新建一个 parseTemplateToTokens.js 文件来实现

```
    import Scanner from './Scanner'
    import nestTokens from './nestTokens'

    /* 将模板字符串变为tokens数组 */
    export default function parseTemplateToTokens(templateStr){
        let tokens = []
        let words = ''
        //  创建扫描器
        let scanner = new Scanner(templateStr)
        //  让扫描器工作
        while(!scanner.eos()){
            //  收集开始标记出现之前的文字
            words = scanner.scanUtil('{{')
            //  不为空存储数据
            if(words != ''){
                //  智能处理空格，标签中的空格不能去除，普通文字中的空格可以去除
                let isInJJH = false
                //  拼接用的空白字符串
                let _words = ''
                for(let i = 0; i < words.length; i++){
                    //  判断是否在标签里
                    //  标签开始，在标签内
                    if(words[i] == '<'){
                        isInJJH = true
                    }
                    //  标签结束，在标签外
                    if(words[i] == '>'){
                        isInJJH = false
                    }
                    //  如果这项不是空格，拼接上
                    if(!/\s/.test(words[i])){
                        //  不在标签中，且这一位是空格
                        _words += words[i]
                    }else{
                        //  如果这项是空格，只有当它在标签内的时候，才拼接
                        if(isInJJH){
                            _words += words[i]
                            return
                        }
                    }
                }
                console.log(_words)
                //  存起来，去掉空格
                tokens.push(['text', _words])
            }
            //  过双大括号
            scanner.scan('{{')
            //  收集反大括号之前的文字
            words = scanner.scanUtil('}}')
            //  不为空存储数据
            if(words != ''){
                //  该words就是{{}}中间的东西，判断一下首字符
                if(words[0] == '#'){
                    //  #开头，从下标为1的项开始存，因为下标为0的项是#
                    tokens.push(['#', words.substring(1)])
                }else if(words[0] == '/'){
                    //  '/'开头，从下标为1的项开始存，因为下标为0的项是 '/'
                    tokens.push(['/', words.substring(1)])
                }else{
                    //  文字内容的话直接存
                    tokens.push(['name', words])
                }
            }
            //  过双反大括号
            scanner.scan('}}')
        }

        //  返回折叠收集的tokens
        return nestTokens(tokens)
    }
```

# 在 index.js 引入 parseTemplateToTokens
```
import parseTemplateToTokens from './parseTemplateToTokens'

//  全局提供 demoTemplateEngine 对象
window.demoTemplateEngine = {
    //  渲染方法
    render(templateStr, data){
        //  调用 parseTemplateToTokens 函数，让模板字符串能够变为tokens数组
        let tokens = parseTemplateToTokens(templateStr)
        //  代用 renderTemplate 函数，让tokens数组变为dom字符串
        let domStr = renderTemplate(tokens, data)
        // console.log(tokens)
        return domStr
    }
}
```

接下来就能传入data,template来生成tokens了

```
    let templateStr = `
        <ul>
            {{#arr}}
                <li>
                <div>{{name}}的基本信息</div>
                <div>
                    <p>{{name}}</p>
                    <p>{{age}}</p>
                    <div>
                    <p>爱好：</p>
                    <ol>
                        {{#hobbies}}
                        <li>{{.}}</li>
                        {{/hobbies}}
                    </ol>
                    </div>
                </div>
                </li>
            {{/arr}}
        </ul>
    `

let data = {
    arr:[
        {name:'小明',age:12,hobbies:['游泳','羽毛球']},
        {name:'小红',age:11,hobbies:['编程','写作文','看报纸']},
        {name:'小强',age:13,hobbies:['打台球']}
    ]
}
```
# 实现token的嵌套
新建 nestTokens.js 文件，定义 nestTokens 函数来做 tokens 的嵌套功能，将传入的 tokens 处理成包含嵌套的 nestTokens 数组返回。
然后在 parseTemplateToTokens.js 引入 nestTokens，在最后 return nestTokens(tokens)

实现思路
在 nestTokens 中，我们遍历传入的 tokens 的每一个 token，遇到第一项是 # 和 / 的分别做处理，其余的做一个默认处理。大致思路是当遍历到的 token 的第一项为 # 时，就把直至遇到配套的 / 之前，遍历到的每一个 token 都放入一个容器（collector）中，把这个容器放入当前 token 里作为第 3 项元素。

但这里有个问题：在遇到匹配的 / 之前又遇到 # 了怎么办？也就是如何解决循环里面嵌套循环的情况？

解决的思路是新建一个 栈数据类型 的数组（stack），遇到一个 #，就把当前 token 放入这个栈中，让 collector 指向这个 token 的第三个元素。遇到下一个 # 就把新的 token 放入栈中，collector 指向新的 token 的第三个元素。遇到 / 就把栈顶的 token 移出栈，collector  指向移出完后的栈顶 token。这就利用了栈的先进后出的特点，保证了遍历的每个 token 都能放在正确的地方，也就是 collector 都能指向正确的地址。

```
/*
    函数的功能是折叠tokens,将#和/之间的tokens能够整合起来，作为它的下标为3的项
*/
export default function nestTokens(tokens) {
    //  结果数组
    let nestedTokens = [];

    //  栈结构，存放小tokens,栈顶(靠近端口的，最新进入的)的tokens数组中当前操作的这个tokens小数组
    let sections = [];

    //  收集器，天生指向nestedTokens结果数组，引用类型值，所以指向的是同一个数组
    //  收集器的指向会变化，当遇见#的时候，收集器会指向这个token的下标为2的新数组
    let collector = nestedTokens;

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        switch (token[0]) {
            case "#":
                //  收集器中放入token
                collector.push(token);
                //  入栈
                sections.push(token);
                //  给token添加下标为2的项
                token[2] = [];
                //  重定向收集器指向目标
                collector = token[2];
                //  给token添加下标为2的项, 让收集器指向他
                //  连等会有问题，慎用，记得测试
                // collector = token[2] = []
                break;
            case "/":
                //  出栈,pop()会返回刚刚弹出的项
                sections.pop();
                //  改变收集器为栈结构队尾(队尾是栈顶)那项下标为2的数组
                collector = sections.length > 0 ? sections[sections.length - 1][2] : nestedTokens;
                break;
            default:
                //  collector可能是nestedTokens或token的下标为2的数组，指向变更上述判断做了处理，推入内容即可
                collector.push(token);
        }
    }
    return nestedTokens;
}
```

#tokens结合数据解析为dom字符串
大致思路是遍历 tokens 数组，根据每条 token 的第一项的值来做不同的处理，为 text 就直接把 token[1] 加入到最终输出的 dom 字符串，为 name 则根据 token[1] 去 data 里获取数据，结合进来。
当 data 里存在多层嵌套的数据结构，比如 data = { test: { a: { b: 10 } } }，这时如果某个 token 为 ["name", "test.a.b"]，即代表数据的 token 的第 2 项元素是 test.a.b 这样的有多个点符号的值，那么我么直接通过 data[test.a.b] 是无法拿到正确的值的，因为 js 不认识这种写法。我们需要提前准备一个 lookup 函数，用以正确获取数据。

```
/*
    功能是可以在dataObj对象中，寻找用连续点符号的keyName属性
    比如，dataObj是
    {
        a:{
            b:{
                c: 100
            }
        }
    }
    namelookup(dataObj, 'a.b.c')结果就是100
*/
export default function lookup(dataObj, keyName) {
    //  查看keyName中有没有点符号,但是不能是.本身
    if (keyName.indexOf(".") != -1 && keyName != '.') {
        //  如果有点符号，就拆开成数组
        let keys = keyName.split(".");
        //  设置临时变量用于周转，一层层寻找下去
        let temp = dataObj;
        //  每找一层，就将其设置为新的临时变量
        for (let i = 0; i < keys.length; i++) {
            temp = temp[keys[i]];
        }
        return temp
    } else {
        //  没有的话就是直接使用了一级属性，返回
        return dataObj[keyName];
    }
}
```

接下来就可以开始写个 renderTemplate 函数将 tokens 和 data 作为参数传入，解析为 dom 字符串了。

```
import lookup from "./lookup"
import parseArray from "./parseArray"
/*
    函数的功能是让tokens数组变为dom字符串
*/
export default function renderTemplate(tokens, data){
    console.log(tokens, data)
    //  结果字符串
    let resultStr = ''
    //  遍历tokens
    for(let i = 0; i < tokens.length; i++){
        let token = tokens[i]
        //  看类型
        if(token[0] == 'text'){
            //  静态文字内容拼起来
            resultStr += token[1]
        }else if(token[0] == 'name'){
            //  如果是name类型，把对应的属性拼起来
            //  使用lookup函数应对'a.b.c'属性使用的形式
            resultStr += lookup(data, token[1])
        }else if(token[0] == '#'){
            //  处理递归
            resultStr += parseArray(token, data)
        }else{

        }
    }
    console.log(resultStr)
    return resultStr
}
```

需要注意的是遇到循环的情况，也就是当某个 token 的第一项为 "#" 时，要再次递归调用 renderTemplate 函数。这里我们新定义了一个 parseArray 函数来处理。

```
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
```
