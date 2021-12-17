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
