new Vue({
    // 实例范围,vue监控container中的内容
    el:".container",
    data:{
        // 定义地址列表数据
        addressList: [],
        limitNum: 3,
        currentIndex: 0
    },
    // 生命周期钩子
    mounted: function  () {
        // 确保实例插入完成
        this.$nextTick(function () {
            // 调用初始化方法
            this.getAddressList();
        })
    },
    // 计算属性，实现数组分割
    computed: {
        filterAddress:function () {
            return this.addressList.slice(0,this.limitNum)
        } 
    },
    // 数据请求
    methods: {
        // 数据请求
        getAddressList: function () {
            var _this=this;
            this.$http.get("data/address.json").then(function (response) {
                var res = response.data;
                console.log("请求状态"+res);
                // 请求成功的状态是0
                if(res.status=='0'){
                    _this.addressList=res.result;
                }
            },function () {
                alert("请求失败")
            })
        },
        // 点击显示更多
        loadMore: function () {
            this.limitNum = this.addressList.length;
        },
        // 设置默认
        setDefault: function (addressId) {
            // 通过循环遍历
            this.addressList.forEach(function (address, index) {
                if(address.addressId==addressId){
                    address.isDefault = true;
                    console.log("address.addressId"+address.addressId)
                }else{
                    address.isDefault = false;
                }
            });
        }
    }
})