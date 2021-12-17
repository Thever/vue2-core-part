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
