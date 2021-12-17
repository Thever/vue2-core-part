/*
主入口
 */

import parse from './parse'

const templateString = `
<div>
    <h3 class="box" title="标题" data-type="3">你好</h3>
    <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
    </ul>
</div>
`
console.log('输入的模板字符串', templateString);
const ast = parse(templateString)
console.log('生成的AST\n', ast)