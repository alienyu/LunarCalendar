require("../../css/page/newSchedule.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/dropLoad/dropLoad.js");
var wx = require("../vendor/weChat/wxInit.js");
var mask = require("../plugins/mask/mask.js");
var fuc = {
    config: {
        pageIndex: 0,
        pageSize: 10,
        scheduleData: [],
        topDate: "",
        bottomDate: "",
        direction: ""
    },
    init: function() {
        pageLoad({backgroundColor: "#66cccc"});
        //this.getData();
        this.renderBMP();
        this.initDropLoad();
    },
    getData: function(type) {
        var that = this;
        //mask.open();
        var param = {
            pageNo: that.config.pageIndex, //必填，页码，进入页面时传0，上拉+1，下拉-1
            pageSize:that.config.pageSize, //选填，每页数量，默认10
        };
        if(type != "init") {
            $.extend(param, {
                direction: that.config.direction, //选填，方向，上拉传up，下拉传down，进入页面时不传
                lastDate: that.config.direction == "up" ? that.config.bottomDate : that.config.topDate //选填，进入页面时不传，上拉传最下面一天，下拉传最上面一天
            });
        }
        $.ajax({
            type: "get",
            url: "/event/getSchedule",
            data: param,
            success: function(data) {
                mask.close();
                if(data.code == 0) {
                    that.renderPage(data);
                } else {
                    alert(data.msg);
                }
            }
        })
    },
    renderBMP: function() {
        $(".bmap").each(function(i, e) {
            var map = new BMap.Map(e.id);
            var point = new BMap.Point(116.331398,39.897445);
            map.centerAndZoom(point,12);
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint("国顺东路200号", function(point){
                if (point) {
                    map.centerAndZoom(point, 16);
                    map.addOverlay(new BMap.Marker(point));
                }else{
                    alert("您选择地址没有解析到结果!");
                }
            }, "上海市");
        });
    },
    renderPage: function(data) {

    },
    initDropLoad: function() {
        var that = this;
        /*--------------------------上拉刷新、下拉刷新------------------------*/
        $('#container').dropload({
            scrollArea:window,
            domUp:{
                domClass   : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉加载更多</div>',
                domUpdate  : '<div class="dropload-update">↑释放加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            },
            domDown : {
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="dropload-noData">暂无数据</div>'
            },
            autoLoad:false,//关闭自动加载
            loadUpFn:function(me){
                that.config.pageIndex--;
                console.log(that.config.pageIndex)
            },
            loadDownFn:function(me){
                that.config.pageIndex++;
                console.log(that.config.pageIndex)
            },
            threshold : 50//提前加载距离
        });

    }
}

fuc.init();

