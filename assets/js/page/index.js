require("../../css/page/index.less");
var pageLoad = require("../common/pageLoad.js");
var transCalendar = require("../vendor/LunarCalendar/transCalendar.js");
var wx = require("../vendor/weChat/wxInit.js");
var Dom = require("../common/dom.js");
var fuc = {
    config: {
        today:""
    },
    init: function() {
        pageLoad({backgroundColor: "#fff"});
        this.renderPage();
        this.bindEvent();
    },
    renderPage: function() {
        wx.wxConfig(1);
        var that = this;
        document.addEventListener('touchmove', function (e) {//禁止浏览器上下滑动页面
            e.preventDefault();
        });
        //头部时间显示
        var ca = new transCalendar();
        var d = new Date();//获得当天日期
        var nlArr = ca.getls(d);
        var nl = nlArr[0]+"年（"+nlArr[1]+"）"+nlArr[2]+"月"+nlArr[3];
        var tf = function (i) {
            return (i < 10 ? '0' : '') + i
        };
        var years = d.getFullYear(),
             months = tf(d.getMonth() + 1),
            days = tf(d.getDate()),
            weeks = d.getDay(),
            hourAndMinute = d.getHours()+":"+ d.getMinutes();
        $('.day').html(days);
        $('.month').html(months + "月");
        $('.lunarCalendar').html(nl);
        var dateTime = years + "-" + months + "-" + days;
        that.config.today = years + "-" + months + "-" + days;
//        console.log(dateTime);
        switch (weeks) {
            case 0:
                $('.week').html("星期日");
                break;
            case 1:
                $('.week').html("星期一");
                break;
            case 2:
                $('.week').html("星期二");
                break;
            case 3:
                $('.week').html("星期三");
                break;
            case 4:
                $('.week').html("星期四");
                break;
            case 5:
                $('.week').html("星期五");
                break;
            case 6:
                $('.week').html("星期六");
                break;
        }
        //事件数据加载
        var template = $('#eventListTemplate').html();
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/event/getEventOfDay",
            data: {
                dateTime: dateTime
            },
            dateType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var eventList = data.data;
                    var html = '',mark = '',joinerNum;
                    if (eventList.length > 0) {
                        $('.event').css('display', 'block');
                        $('.eventBg').css('display', 'none');
                        eventList = that.filterEvent(eventList);
                        for (var i = 0; i < eventList.length; i++) {
                            if (i < 5) {
                                if (eventList[i].isOwner) {
                                    mark = "@";
                                    if (eventList[i].joiners != null && eventList[i].joiners[0]) {
                                        joinerNum = parseInt(eventList[i].joiners.length) + 1;
                                        html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark + eventList[i].joiners[0].nickName);
                                    } else {
                                        html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, "").replace(/{{user}}/g, "");
                                    }
                                } else {
                                    mark = "#";
                                    joinerNum = parseInt(eventList[i].joiners.length) + 1;
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark + eventList[i].owner.nickName);
                                }
                            } else {
                                break;
                            }
                        }
                        $('.scheduleList').append(html);
                        $('.list').on('tap', function () {
                            var eventId = $(this).attr('id');
                            $('body').html("").css("background", "#fff");
                            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + eventId);
                        });
                    } else {
                        $('.event').css('display', 'none');
                        $('.eventBg').css('display', 'block');
                    }
                }
                function transHour(time) {
                    var timeArr = time.split(" ");
                    var hourArr = timeArr[1].split(":");
                    return hourArr[0] + ":" + hourArr[1];
                }
            }
        });
        //私人运势显示
        $.get("http://www.li-li.cn/llwx/fortune/get", {"dateTime": dateTime + " 08:00:00"}, function (data) {
            if (data.code == 0) {
                var data = data.data;
                if (data.personal) {
                    $('.suitMatter').html(" ");
                    $('.suitable').css("display", 'block');
                    var html = "";
                    if (data.personal.type3) {
                        var type = data.personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
                        html = "<span>" + type + "</span>";
                        $('.suitMatter').append(html);
                    } else {
                        $('.suitMatter').html("诸事不宜");
                    }
                }
            }
        });
        //天气
        $.get(
            "http://www.li-li.cn/llwx/weather/get",
            {
                "date":that.config.today,
                "days":1
            },
            function(data){
            if(data.code==0){
                if(data.data){
                    var weatherList = data.data[0];
                    var html = "",weatherCode = "",
                        sunUp = weatherList.sunUp,
                        sunDown = weatherList.sunDown;
                    var dayOrNight = Dom.dayOrnight(hourAndMinute,sunUp,sunDown);
                    if(dayOrNight == "dayTime"){//白天
                        weatherCode = weatherList.dCode;
                        if(weatherList.qlty){
                            html = weatherList.city+"&nbsp;&nbsp;"+weatherList.dTxt+"&nbsp;&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
                        }else{
                            html = weatherList.city+"&nbsp;&nbsp;"+weatherList.dTxt+"&nbsp;&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
                        }
                    }else if(dayOrNight == "nightTime"){//黑夜
                        weatherCode = weatherList.nCode;
                        if(weatherList.qlty){
                            html = weatherList.city+"&nbsp;&nbsp;"+weatherList.nTxt+"&nbsp;&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
                        }else{
                            html = weatherList.city+"&nbsp;&nbsp;"+weatherList.nTxt+"&nbsp;&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
                        }
                    }
                    $('.weather').append(html);
                    if(weatherCode>=101&&weatherCode<=213){//多云
                        $(".conShadow").attr("class", "conShadow cloudsDay");
                    }else if(weatherCode>=300&&weatherCode<=313){//雨
                        $(".conShadow").attr("class", "conShadow rainDay");
                    }else if(weatherCode>=400&&weatherCode<=407){//雪
                        $(".conShadow").attr("class", "conShadow snowDay");
                    }else if(weatherCode>=500&&weatherCode<=501){//雾
                        $(".conShadow").attr("class", "conShadow fogDay");
                    }else if(weatherCode>=502&&weatherCode<=508){//霾
                        $(".conShadow").attr("class", "conShadow hazeDay");
                    }else{//晴天
                        $(".conShadow").attr("class", "conShadow fairDay");
                    }
                }
            }else{

            }
        })
    },
    //过滤事件
    filterEvent:function (eventList) {
        var that = this;
        if (eventList.length >= 6) {
            for (var i = 0; i < eventList.length && eventList.length > 5; i++) {
                if (that.compareDate(eventList[0].event.startTime)) {
                    eventList.splice(0, 1);
                }
            }
        }
        return eventList;
    },
    //比较startTime与当前时间比较,如果小于当前时间返回1(比较时分)
    compareDate:function (startTime) {
        var d = new Date();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var timeArr = startTime.split(" ");
        var hourArr = timeArr[1].split(":");
        return hourArr[0] < hour ? 1 : (hourArr[0] == hour && hourArr[1] < minute ? 1 : 0);
    },
    bindEvent: function() {
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
        //点击、滑动事件
        $('.con').on('swipeUp', function (event) {
            $('body').html("").css("background", "#fff");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/calendar.html");
        });
        $('.down').on('tap', function (event) {
            $('body').html("").css("background", "#fff");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/calendar.html");
        });
        $('.addEvent').on('tap', function () {
            $('body').html("").css("background", "#66cccc");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/addEvent.html");
        });
    }
}

fuc.init();