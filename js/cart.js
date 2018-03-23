new Vue({
    el: "#app",
    data:{
        // 所有的数据要想渲染，首先要在data中存在
        productList: [],
        checkAllFlag: false,
        totalMoney: 0,
        delFlag: false
    },
    // 相当于整个文档加载完成后，也就是相当于$(function (){})，在vue1.0版本中，使用ready，而不是mounted
    mounted: function () {
        // 为了保证实例插入，所以要使用$nextTick
        // this.cartView();
        this.$nextTick(function () {
            // vm.cartView();
            // 这里也可以使用this
            this.cartView();
        })
    },
    methods: {
        cartView: function(){
            // 在vue实例的方法中，所有的this都指向实例vm,但是在函数内部this的作用域已经发生了变化。
            var _this = this;
            // 这里的this相当于vue，使用vue中的一个请求方法
            // get后面跟请求地址，也可以传递参数，同时then()参数中有一个成功回调，也有一个失败回调
            // res最终拿到的结果
            // 这里的this就相当于vm就是实例化的vue对象
            this.$http.get('data/cartData.json',{"id":123}).then(function (res) {
                _this.productList = res.body.result.list;
                // _this.totalMoney = res.body.result.totalMoney;
                console.log("productList"+res.body.result.list)
            })
        },
        // 改变商品数量和金钱
        changeMoney: function (product, way) {
            if(way>0){
                product.productQuantity++;
                console.log(product.productQuantity)
            }else{
                product.productQuantity--;
                if(product.productQuantity<1){
                    product.productQuantity = 1;
                }
            }
            this.calcTotalPrice();
        },
        // 商品是否选中--单选
        selectedProduct: function (item) {
            if(typeof item.checked == 'undefined'){
                // 如果不在data选项中出现的数据，想在页面中直接使用，需要使用$set方法,主要是在循环中不能直接定义
                // 在cartData.json中也没有设置checked字段的值，要想使用，需要使用set方法
                // 第一种方法：第一个参数，像item中添加checked变量，添加的值是true，通过vue全局注册，向item变量中注册了checked属性，值是true，注册后就可以在html中使用checked属性了，也就是实现了用vue监听不存在的变量。
                // Vue.set(item,"checked",true)
                // 第二种方法：局部注册，使用$set
                this.$set(item,"checked",true)
            }else{
                item.checked = !item.checked;
            }
            this.calcTotalPrice();
        },
        // 全选按钮是否选中,以及各列表的循环
        // 在cartData.json中也没有设置checkAll字段的值，但由于不是循环，所以可以直接在data选项中设置。
        checkAll: function (flag) {
            this.checkAllFlag = flag;
            var _this = this;
            // 如果全选被选中，那么循环列表
                this.productList.forEach(function (item, index){
                    // 上面那种写法是点击后才能产生checked属性，所以当用户直接点击全选，直接就给checked赋值是没有意义的，所以要加一个判断
                    if(typeof item.checked == 'undefined') {
                        _this.$set(item, "checked",_this.checkAllFlag);
                    }else{
                        // 设置checked值为true，那么各个按钮的状态都是选中状态
                        item.checked = _this.checkAllFlag;
                    }
                })
           
            // 调用获取总价函数
            this.calcTotalPrice();
        },
        // 计算价格
        calcTotalPrice: function () {
            var _this = this;
            // 注意初始应该是0
            this.totalMoney = 0;
            this.productList.forEach(function (item, index) {
                // 循环遍历后价格累加
                if (item.checked) {
                    _this.totalMoney += item.productPrice * item.productQuantity;
                  }
            })
        },
        // 点击删除按钮，弹框出现
        delConfirm: function (item) {
            this.delFlag=true;
            // 同时将item存储赋值给curProduct
            this.curProduct = item;
            // 这里的item就是前面html页面传递过来的，可以打断点看item的具体含义，当点击第一个时就代表下面这一串
            // {
        //   "productId":"600100002115",
        //   "productName":"黄鹤楼香烟",
        //   "productPrice":19,
        //   "productQuantity":1,
        //   "productImage":"img/goods-1.jpg",
        //   "parts":[
        //     {
        //       "partsId":"10001",
        //       "partsName":"打火机",
        //       "imgSrc":"img/part-1.jpg"
        //     },
        //     {
        //       "partsId":"10002",
        //       "partsName":"打火机",
        //       "imgSrc":"img/part-1.jpg"
        //     }
        //   ]
        // }
        console.log("curProduct"+this.curProduct)
        },
        // 删除当前项 vue2.0的主题思想就是能用原生js做的，就不要用vue了,这个删除$delete以前在1.0中可以使用，2.0已经废弃了,所以学习vue2.0原生js的掌握很重要
        delProduct: function() {
            // 正常情况应该是后台删除，传递id给后台，请求数据，这里用json没有办法模拟
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index, 1);
            this.delFlag = false;
          }
    },
    // fileter，有全局的fileter，也有局部的filter
    // 下面局部filters
    // 一般小数点的处理是后台处理后返回
    filters: {
        formatMoney: function (value) {
            return "￥"+value.toFixed(2);
        }
    }    
})
// 全局fileter  Vue.filter();全局过滤器可以在各个页面中使用
// 注意这里的money要加引号
Vue.filter("money",function (value,type){
    return "￥"+value.toFixed(2) + type;
})
