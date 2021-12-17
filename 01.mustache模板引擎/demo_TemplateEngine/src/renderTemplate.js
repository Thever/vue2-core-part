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