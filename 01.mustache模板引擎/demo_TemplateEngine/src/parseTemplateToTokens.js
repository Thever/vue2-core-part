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