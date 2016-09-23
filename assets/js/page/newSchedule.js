require("../../css/page/newSchedule.less");
var pageLoad = require("../common/pageLoad.js");
var wx = require("../vendor/weChat/wxInit.js");
var Dom = require("../common/dom.js");
var mask = require("../plugins/mask/mask.js");
var _ = require("../vendor/underscore.js");
var fuc = {
    config: {
        pageIndex: 0,
        pageSize: 10,
        scheduleData: [],
        direction: "",
        lastDate: "",
        stopSliderUp: false, //阻止上滑,即不加载后面数据
        stopSliderDown: false //阻止下滑,即不加载前面数据
    },
    init: function() {
        pageLoad({backgroundColor: "#66cccc"});
        this.initHeadDate();
        this.getData("init");
        this.bindEvent();
    },
    initHeadDate: function() {
        $(".current_month").text(new Date().getFullYear() + "年" + (new Date().getMonth()+1) + "月");
    },
    getData: function(type) {
        var that = this;
        mask.open();
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
                    var newData = {},
                    today = Dom.getToday(data.data.length > 0 ? data.data[0].date : "");
                    //初始化
                    newData.dataArr = that.dealData(data.data);
                    if(type == "init") {
                        //没有数据说明今天以后一条数据都没有了
                        if(data.data.length < 1) {
                            that.config.stopSliderUp = true;
                        }
                        $.extend(newData, {type: type, today: today});
                        that.renderPage(newData);
                    } else {
                        //滑动判断
                        if(data.data.length < 1) {
                            if(that.config.direction == "up") {
                                that.config.stopSliderUp = true;
                            } else if(that.config.direction == "down") {
                                that.config.stopSliderDown = true;
                            }
                        } else {
                            $.extend(newData, {type: type, today: today});
                            that.renderPage(newData);
                        }
                    }
                } else {
                    alert(data.msg);
                }
            },
            error: function() {
                if(type != "init") {
                    if(that.config.direction == "up") {
                        that.config.pageIndex --;
                    } else {
                        that.config.pageIndex ++;
                    }
                }
            }
        })
    },
    dealData: function(data) {
        if(data.length > 0) {
            $(data).each(function(i, e) {
                var date = e.date;
                e.isOutOfDate = Dom.compareTimeDate(date) == 'below' ? true : false;
                e.detailDate = {
                    year: e.date.split("-")[0],
                    month: e.date.split('-')[1],
                    day: e.date.split('-')[2],
                    weekDay: Dom.transWeek(new Date(e.date))
                }
            });
        }
        return data;
    },
    renderBMP: function() {
        $(".bmap:not(.has_render)").each(function(i, e) {
            var map = new BMap.Map(e.id);
            var point = new BMap.Point($(e).data('longitude'), $(e).data('latitude'));
            map.centerAndZoom(point, 15);
            map.addEventListener("tilesloaded", function () {
                $(e).find(".anchorBL").remove();
                $(e).find(".BMap_cpyCtrl").remove();
                $(e).addClass("has_render");
            });
        })
    },
    renderPage: function(data) {
        var tmp = $("#dateListTpl").html();
        var html = _.template(tmp);
        $("#container").append(html({data: data}));
        if(data.type != "init") {

        }
        this.renderBMP();
    },
    bindEvent: function() {
        var that = this;
        $("#container").on("swipeUp", function(e) {
            //上滑==拉取后续数据,判断是否滚动到底部
            if($(document.body).scrollTop() + $(window).height() == $(document).height()) {
                //判断是否还有后续数据
                if(!that.config.stopSliderUp) {
                    that.config.direction = "up";
                    that.config.pageIndex ++;
                    that.config.lastDate = that.getSideDomDate().bottomDate;
                    that.getData();
                }
            }
            //渲染吸顶日期
            that.checkHeadDate("up");
        });

        $("#container").on("swipeDown", function(e) {
            //下拉==拉取先前数据,判断是否滚动到顶部
            if($(document.body).scrollTop() == 0) {
                //判断是否还有前面数据
                if(!that.config.stopSliderDown) {
                    that.config.direction = "down";
                    that.config.pageIndex --;
                    that.config.lastDate = that.getSideDomDate().topDate;
                    that.getData();
                }
            }
            //渲染吸顶日期
            that.checkHeadDate("up");
        });
    },
    getSideDomDate: function() {
        return {
            topDate: $(".record").first().data("date"),
            bottomDate: $(".record").last().data("date")
        }
    },
    checkHeadDate: function(direction) {

    }
}

fuc.init();

