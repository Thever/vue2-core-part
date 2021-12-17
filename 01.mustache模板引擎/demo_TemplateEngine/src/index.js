import parseTemplateToTokens from './parseTemplateToTokens'
import renderTemplate from './renderTemplate'

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