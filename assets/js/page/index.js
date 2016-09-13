require("../../css/page/index.less");
var transCalendar = require("../vendor/LunarCalendar/transCalendar.js");
//require("../vendor/weChat/wxInit.js");

var fuc = {
    config: {},
    init: function() {
        this.pageLoad({backgroundColor: "#12101A"});
        this.renderPage();
    },
    pageLoad: function(options) {
        document.addEventListener('touchmove', function (e) {//禁止浏览器上下滑动页面
            e.preventDefault();
        });

        var defaults = {opacity: 1, backgroundColor: "#000", delayTime: 500, zindex: 999, sleep: 500};
        var options = $.extend(defaults, options);
        var _PageHeight = document.documentElement.clientHeight, _PageWidth = document.documentElement.clientWidth;
        var _LLLoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';"><div class="ll_loading_con"><div class="ll-loading"><div class="ll-load-inner"><div class="ll-load-container"><div class="ll-load-scale-multiple la-2x"><div></div><div></div><div></div></div></div></div><div class="ll-load-logo"><span class="ll-logo-1"></span><span class="ll-logo-2"></span><span class="ll-logo-3"></span></div></div></div></div>';
        $("body").append(_LLLoadingHtml);
        document.onreadystatechange = PageLoaded;
        function PageLoaded() {
            if (document.readyState == "complete") {
                var loadingMask = $('#loadingPage');
                setTimeout(function () {
                    loadingMask.animate({"opacity": 0}, options.delayTime, function () {
                        $(this).remove()
                    })
                }, options.sleep)
            }
        }
    },
    renderPage: function() {
        //wxConfig(1);
        //头部时间显示
        var ca = new tranCalendar();
        var d = new Date();//获得当天日期
        var nlArr = ca.getls(d);
        var nl = nlArr[0]+"年（"+nlArr[1]+"）"+nlArr[2]+"月"+nlArr[3];
        var tf = function (i) {
            return (i < 10 ? '0' : '') + i
        };
        var years = d.getFullYear();
        var months = d.getMonth() + 1;
        var days = tf(d.getDate());
        var weeks = d.getDay();
        $('.day').html(days);
        $('.yearAndMonth').html(years + "年" + months + "月");
        $('.lunarCalendar').html(nl);
        var dateTime = years + "-" + months + "-" + days;
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
                        for (var i = 0; i < eventList.length; i++) {
                            if (i < 5) {
                                if (eventList[i].isOwner) {
                                    mark = "@";
                                    if (eventList[i].joiners != null && eventList[i].joiners[0]) {
                                        joinerNum = parseInt(eventList[i].joiners.length)+1;
                                        html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark + eventList[i].joiners[0].nickName);
                                    }else{
                                        html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, "").replace(/{{user}}/g, "");
                                    }
                                } else {
                                    mark = "#";
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, "").replace(/{{user}}/g, mark+eventList[i].owner.nickName);
                                }
                            } else {
                                break;
                            }
                        }
                        $('.scheduleList').append(html);
                        $('.list').hammer().on('tap', function (event) {
                            var eventId = $(this).attr('id');
                            $('body').html("").css("background", "#66cccc");
                            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/showEvent.html?eventId=" + eventId);
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
        //点击、滑动事件
        $('.con').hammer().on('swipeup', function (event) {
            $('body').html("").css("background", "#12101A");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
        });
        $('.down').hammer().on('tap', function (event) {
            $('body').html("").css("background", "#12101A");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
        });
        $('.addEvent').click(function () {
            $('body').html("").css("background", "#66cccc");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/addEvent.html?date=" + dateTime);
        });
    }
}