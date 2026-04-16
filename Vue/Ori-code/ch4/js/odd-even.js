function isValueNumber (value){
    return (/^[1-9]\d*$/).test(value+'')
}
//定义数字输入组件
const oddEven = {
    //组件显示的内容
    template: '\
    <div>\
        <input type="text" :value="currentValue" @change="handleChange">\
        {{result}}\
    </div>',
    data() {
        return {
            currentValue: 1,
            result: 1 + '是奇数'
        }
    },
    methods: {
        handleChange(event) {
            var val = event.target.value.trim()
            var myNum = Number(val)
            if(isValueNumber(myNum)) {
                this.currentValue = myNum
                if(myNum % 2 === 0)
                    this.result = myNum + '是偶数'
                else
                    this.result = myNum + '是奇数'
            } else {
                alert('请输入正整数！')
            }
        }
    }
}