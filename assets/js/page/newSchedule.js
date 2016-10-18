require("../../css/page/newSchedule.less");
var wx = require("../vendor/weChat/wxInit.js");
var Dom = require("../common/dom.js");
var mask = require("../plugins/mask/mask.js");
require("../vendor/ImproveMobile/zeptoSlider.js")
var _ = require("../vendor/underscore.js");
var fuc = {
    config: {
        pageIndex: 0,
        pageUp: 0, //下滑页码
        pageDown: 0, //上滑页码
        pageSize: 10,
        scheduleData: [],
        direction: "",
        isLoading: false,
        startY: "", //判断滑动初始位置
        endY: ",", //判断滑动结束位置
        lastDate: "",
        bottomDate: "", //拉取以前的数据中最后一条的日期
        monthPos: {},
        stopSliderUp: false, //阻止上滑,即不加载后面数据
        stopSliderDown: false, //阻止下滑,即不加载前面数据
        urlArr:""//接口域名配置
    },
    init: function () {
        this.config.urlArr = Dom.configuration();
        $('#main_box').css("visibility","visible");
        this.initHeadDate();
        this.getData("init");
        this.bindEvent();
    },
    initHeadDate: function () {
        $(".current_month").text(new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月");
    },
    getData: function (type) {
        var that = this;
        mask.open();
        var param = {
            pageNo: that.config.pageIndex, //必填，页码，进入页面时传0，上拉+1，下拉-1
            pageSize: that.config.pageSize, //选填，每页数量，默认10
        };
        if (type != "init") {
            $.extend(param, {
                direction: that.config.direction, //选填，方向，上拉传up，下拉传down，进入页面时不传
                lastDate: that.config.lastDate //选填，进入页面时不传，上拉传最下面一天，下拉传最上面一天
            });
        }
        if (!this.config.isLoading) {
            this.config.isLoading = true;
            $.ajax({
                type: "get",
                url: that.config.urlArr[0]+"/event/getSchedule",
                data: param,
                async: true,
                success: function (data) {
                    that.config.isLoading = false;
                    if (data.code == 0) {
                        var newData = {},
                            today = Dom.getToday(data.data.length > 0 ? data.data[0].date : "");
                        //初始化
                        newData.dataArr = that.dealData(data.data);
                        if (type == "init") {
                            //没有数据说明今天以后一条数据都没有了
                            if (data.data.length < 1) {
                                that.config.stopSliderUp = true;
                            }
                            $.extend(newData, {type: type, today: today});
                            that.renderPage(newData);
                        } else {
                            //滑动判断
                            if (data.data.length < 1) {
                                if (that.config.direction == "up") {
                                    that.config.stopSliderUp = true;
                                } else if (that.config.direction == "down") {
                                    that.config.stopSliderDown = true;
                                }
                                mask.close();
                            } else {
                                $.extend(newData, {type: type, today: today});
                                if (that.config.direction == "down") {
                                    that.config.bottomDate = $(data.data).last().get(0).date;
                                }
                                that.renderPage(newData);
                            }
                        }
                    } else {
                        mask.close();
                        alert(data.msg);
                    }
                },
                error: function () {
                    mask.close();
                    if (type != "init") {
                        if (that.config.direction == "up") {
                            that.config.pageIndex = --that.config.pageUp;
                        } else {
                            that.config.pageIndex = ++that.config.pageDown;
                        }
                    }
                }
            })
        }
    },
    dealData: function (data) {
        if (data.length > 0) {
            $(data).each(function (i, e) {
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
    renderBMP: function () {
        var that = this;
        $(".bmap:not(.has_render)").each(function (i, e) {
            var bd_lon = that.bd_encrypt($(e).data('longitude'), $(e).data('latitude')).bd_lon,
                bd_lat = that.bd_encrypt($(e).data('longitude'), $(e).data('latitude')).bd_lat;
            var width = parseInt($(e).css("width"), 10),
                height = parseInt($(e).css('height'), 10);
            var src = "http://api.map.baidu.com/staticimage?center=" + bd_lon + ',' + bd_lat + "&width=" + width + "&height=" + height + "zoom=17&markers=" + bd_lon + ',' + bd_lat + "&copyright=0";
                $(e).attr("src", src).addClass("has_render");
        })
    },
    renderPage: function (data) {
        var tmp = $("#dateListTpl").html();
        var html = _.template(tmp);
        if (data.type == "init") {
            $("#container").append(html({data: data}));
            $(".today_has_date").length > 0 && this.renderCurrentTimeLine();
            if($("#today").prev().offset()){
                $(document.body).scrollTop($("#today").prev().offset().top - 60);
            }else{
                $(document.body).scrollTop(200);
            }
        } else {
            if (this.config.direction == "up") {
                $("#container").append(html({data: data}));
            } else {
                //如果新数据中最后一条与原数据第一条不是同年同月的就给原数据补充头部月份图
                var dom = $("#container .record").first();
                dom.attr("id", "current");
                var firstDate = dom.data("date");
                if ((this.config.bottomDate.split("-")[0] != firstDate.split("-")[0]) || (this.config.bottomDate.split("-")[1] != firstDate.split("-")[1])) {
                    var year = firstDate.split('-')[0];
                    var month = firstDate.split('-')[1];
                    var dateClass = "headDate_" + year + "_" + month;
                    var monthDom = '<div class="month_divide month_' + month + '" ><div class="text">'+ year + '年' + month + '月</div></div>';
                    $("#container").find("div").first().before(monthDom);
                    dom.addClass("first_day").addClass(dateClass);
                }
                if ($(".record").first().hasClass("no_record") && $(".record").first().data("date").split("-")[2] != 1) {
                    $(".record").first().prev().remove();
                }
                $("#container").find("div").first().before(html({data: data}));
                window.location.href = "#current";
                dom.removeAttr("id");
            }
        }
        this.renderBMP();
        if ($("#container").find("div").first().hasClass("month_divide")) {
            $("#container").find("div").first().css("margin-top", "0px");
        }
        mask.close();
        this.calculateMonthPos();
    },
    renderCurrentTimeLine: function () {
        var dom = $(".today_has_date").eq(0),
            times = 0;
        $(".today_has_date").each(function (i, e) {
            var time = $(e).data("date") + " " + $(e).find(".time").text().split("-")[0];
            if (Dom.compareTimeDate(time) == "below") {
                dom = $(e);
                times++;
            }
        });
        if (times == 0) {
            $(dom).before($('<div id="today" class="current_time_line"></div>'));
        } else {
            $(dom).after($('<div id="today" class="current_time_line"></div>'));
        }
    },
    calculateMonthPos: function () {
        var that = this;
        this.config.monthPos = {};
        this.config.monthPos.min = "";
        this.config.monthPos.list = {};
        $(".first_day").each(function (i, e) {
            var key = $(e).attr("class").match(/headDate_\d+_\d+/);
            var position = $(e).position().top - 30;
            that.config.monthPos.list[key] = position;
            if (i == 0) {
                that.config.monthPos.min = position;
            }
        });
    },
    bindEvent: function () {
        var that = this;

        $(window).on('touchstart', function (e) {
            that.config.startY = e.targetTouches[0].pageY;
        });

        $(window).on("touchmove", function (e) {
            //渲染吸顶日期
            that.checkHeadDate($(document.body).scrollTop() + parseInt($(window).height() / 2), 10);
            that.config.endY = e.targetTouches[0].pageY;
            var direct = (that.config.endY - that.config.startY > 0) ? "down" : "up";
            that.renderOtherData(direct);
        });

        //go today
        $(".back_today").on("tap", function (e) {
            var dom = $("#today").prev().hasClass("record") ? $("#today").prev() : $("#today")
            var todayPos = dom.position().top - 30;
            $(document.body).scrollTo({toTo: todayPos});
        });

        //添加活动按钮
        $("#addActivity").on('tap', function (e) {
            if ($(e.target).hasClass("open")) {
                $(e.target).removeClass("open");
                $(".select_mask").fadeOut();
                $("#btnDetail").removeClass("move_up").addClass("move_down");
            } else {
                $(e.target).addClass("open");
                $(".select_mask").fadeIn();
                $("#btnDetail").removeClass("move_down").addClass("move_up");
            }
        });

        //添加活动详情跳转地址
        $("#container").on('tap', '.content', function (e) {
            if($(e.target).parents(".record").hasClass("no_record")) {
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/activity.html");
            } else {
                var id = $(e.target).parents('.record').data("eventid");
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId="+id);
                //window.location.href = "http://www.li-li.cn/llwx/common/to?url2=http%3a%2f%2fwww.li-li.cn%2fwx%2fview%2fnewShowEvent.html?eventId=" + id;
            }
        });

    },
    renderOtherData: function (direct) {
        var that = this;
        var top = $(document.body).scrollTop();
        //判断滚动到底部
        if (direct == "up" && (top + $(window).height() >= $(document.body).height() - 1000)) {
            //判断是否还有后续数据
            if (!that.config.stopSliderUp) {
                that.config.direction = "up";
                that.config.pageIndex = ++that.config.pageUp;
                that.config.lastDate = that.getSideDomDate().bottomDate;
                that.getData();
            }
        }
        if (direct == "down" && top == 0) {
            //判断是否还有前面数据
            if (!that.config.stopSliderDown) {
                that.config.direction = "down";
                that.config.pageIndex = --that.config.pageDown;
                that.config.lastDate = that.getSideDomDate().topDate;
                that.getData();
            }
        }
    },
    getSideDomDate: function () {
        return {
            topDate: $(".record").first().data("date"),
            bottomDate: $(".record").last().data("date")
        }
    },
    checkHeadDate: function (pos) {
        try {
            //如果有跨月的情况
            if (this.config.monthPos.min) {
                if (pos < this.config.monthPos.min) {
                    var date = $(".record").first().data("date");
                    var text = date.split("-")[0] + "年" + date.split("-")[1] + "月";
                    $(".current_month").text(text);
                    return false;
                } else {
                    var resultKey = "";
                    for (var i in this.config.monthPos.list) {
                        if (pos > this.config.monthPos.list[i]) {
                            resultKey = i;
                        } else {
                            break;
                        }
                    }
                    var date = $("." + resultKey).data("date");
                    var text = parseInt(date.split("-")[0], 10) + "年" + parseInt(date.split("-")[1], 10) + "月";
                    $(".current_month").text(text);
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    bd_encrypt: function (gg_lon, gg_lat) {
        var X_PI = Math.PI * 3000.0 / 180.0;
        var x = gg_lon, y = gg_lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
        var bd_lon = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return {
            bd_lat: bd_lat,
            bd_lon: bd_lon
        };
    },
}

fuc.init();