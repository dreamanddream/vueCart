var vm = new Vue({
    el: "#app",
    data: function() {
        return {
            title: "hello"
        }
    },
    // 相当于整个文档加载完成后，也就是相当于$(function (){})，在vue1.0版本中，使用ready，而不是mounted
    mounted: function () {
        this.cartView();
    },
    methods: {
        cartView: function(){
            // 在vue实例的方法中，所有的this都指向实例vm,但是在函数内部this的作用域已经发生了变化。
            var _this = this;
            // 这里的this相当于vue，使用vue中的一个请求方法
            // get后面跟请求地址，也可以传递参数，同时then()参数中有一个成功回调，也有一个失败回调
            // res最终拿到的结果
            this.$http.get('data/cartData.json',{"id":123}).then(function (res) {
                _this.productList = res.body.result.list;
                
                console.log(_this.productList)
            })
        }
    },
    // fileter，有全局的fileter，也有局部的filter
    // 局部filters
    filters: {

    }
    
})
// 全局fileter  Vue.filter();