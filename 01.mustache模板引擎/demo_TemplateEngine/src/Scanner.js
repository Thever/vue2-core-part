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