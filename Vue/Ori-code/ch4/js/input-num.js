function isValueNumber (value){
    return (/^[1-9]\d*$/).test(value+'')
}
//定义数字输入组件
const inputNumber = {
    //组件显示的内容
    template: '\
    <div>\
        <input type="text" :value="currentValue" @change="handleChange">\
        <button @click="handleDown" :disabled="currentValue <= 1">-</button>\
        <button @click="handleUp">+</button>\
    </div>',
    data() {
        return {
            currentValue: 1
        }
    },
    methods: {
        handleDown() {
            if (this.currentValue <= 1)
                return
            this.currentValue -= 1
        },
        handleUp() {
            this.currentValue += 1
        },
        handleChange(event) {
            var val = event.target.value.trim()
            if(isValueNumber(val)) {
                this.currentValue = Number(val)
            } else {
                event.target.value = this.currentValue
            }
        }
    }
}