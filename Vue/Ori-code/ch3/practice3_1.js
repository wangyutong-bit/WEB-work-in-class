Vue.createApp({
    data() {
        return {
        cartList:[
            {
                type:'图书',
                items:[
                    {
                        id: 1,
                        gname: 'Spring Boot从入门到实战',
                        gprice: 79.8,
                        count: 5
                    },
                    {
                        id: 2,
                        gname: 'Java Web开发从入门到实战',
                        gprice: 69.8,
                        count: 10
                    },
                    {
                        id: 3,
                        gname: 'Java EE框架整合开发入门到实战',
                        gprice: 69.8,
                        count: 100
                    }
                ]
            },
            {
                type:'家电',
                items:[
                    {
                        id: 1,
                        gname: '电视机X',
                        gprice: 888,
                        count: 5
                    },
                    {
                        id: 2,
                        gname: '冰箱Y',
                        gprice: 999,
                        count: 10
                    }
                ]
            }
        ]
        }
    },
    computed: {
        totalPrice() {
            var total = 0
            for (var i = 0; i < this.cartList.length; i++) {
                var item = this.cartList[i].items
                for(var j = 0; j < item.length; j++){
                    var goods = item[j]
                    total = total + goods.gprice * goods.count
                }
            }
            return total
        }
    },
    methods: {
        reduce(index, index1) {
            if(this.cartList[index].items[index1].count === 1) 
                return
            this.cartList[index].items[index1].count--
        },
        add(index, index1) {
            this.cartList[index].items[index1].count++
        },
        remove(index, index1) {
            this.cartList[index].items.splice(index1, 1)
        },
        removeAll() {
            this.cartList.splice(0, this.cartList.length)
        }
    }
}).mount('#cart')