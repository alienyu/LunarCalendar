require("../../css/page/index.less");
var pageLoad = require("../common/pageLoad.js");
var transCalendar = require("../vendor/LunarCalendar/transCalendar.js");
var wx = require("../vendor/weChat/wxInit.js");
var fuc = {
    config: {},
    init: function() {
        pageLoad({backgroundColor: "#12101A"});
        this.renderPage();
        this.changeBg();
        this.bindEvent();
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
        wx.wxConfig(1);
        //头部时间显示
        var ca = new transCalendar();
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
    },
    changeBg: function() {
        var date = new Date();
        var hours = date.getHours();
        if (hours > 6 && hours < 19) {
            $(".conShadow").removeClass("night").addClass("daytime");
            this.dayTime();
        } else {
            $(".conShadow").removeClass("daytime").addClass("night");
            this.night();
        }
    },
    dayTime: function() {
        //*************白天*************//p
        document.writeln("<div id=\'far-clouds\' class=\'stage far-clouds\'></div><div id=\'near-clouds\' class=\'stage near-clouds\'></div>");
        (function ($) {
            function animate(options) {
                var element = $(options.element);
                var id = element.attr("id");
                if (options.type == "sprite" && options.fps) {
                    var width = options.width;
                    var height = options.height;
                    if ($.clouds.instances[id]["currentFrame"] == 0) {
                        if (options.onFirstFrame) {
                            options.onFirstFrame(element)
                        }
                    } else if ($.clouds.instances[id]["currentFrame"] == frames.length - 1) {
                        if (options.onLastFrame) {
                            options.onLastFrame(element)
                        }
                    } else if (options.onFrame && options.onFrame[$.clouds.instances[id]["currentFrame"]]) {
                        options.onFrame[$.clouds.instances[id]["currentFrame"]](element)
                    } else if (options.rewind == true) {
                        if ($.clouds.instances[id]["currentFrame"] <= 0) {
                            $.clouds.instances[id]["currentFrame"] = frames.length - 1
                        } else {
                            $.clouds.instances[id]["currentFrame"] = $.clouds.instances[id]["currentFrame"] - 1
                        }
                    } else {
                        if ($.clouds.instances[id]["currentFrame"] >= frames.length - 1) {
                            $.clouds.instances[id]["currentFrame"] = 0
                        } else {
                            $.clouds.instances[id]["currentFrame"] = $.clouds.instances[id]["currentFrame"] + 1
                        }
                    }
                    var yPos = $.clouds.bgY(element);
                    element.css({"background-position": frames[$.clouds.instances[id]["currentFrame"]] + "px " + yPos});
                    if (options.bounce && options.bounce[0] > 0 && options.bounce[1] > 0) {
                        var ud = options.bounce[0];
                        var lr = options.bounce[1];
                        var ms = options.bounce[2];
                        element.animate({
                            top: "+=" + ud + "px",
                            left: "-=" + lr + "px"
                        }, ms).animate({top: "-=" + ud + "px", left: "+=" + lr + "px"}, ms)
                    }
                } else if (options.type == "pan") {
                    if (!$.clouds.instances[id]["_stopped"]) {
                        if (options.dir == "left") {
                            $.clouds.instances[id]["l"] = ($.clouds.instances[id]["l"] - (options.speed || 1)) || 0;
                            $.clouds.instances[id]["t"] = $.clouds.bgY(element).replace("px", "")
                        } else {
                            $.clouds.instances[id]["l"] = ($.clouds.instances[id]["l"] + (options.speed || 1)) || 0;
                            $.clouds.instances[id]["t"] = $.clouds.bgY(element).replace("px", "")
                        }
                        var bgLeft = $.clouds.instances[id]["l"].toString();
                        if (bgLeft.indexOf("%") == -1) {
                            bgLeft += "px "
                        } else {
                            bgLeft += " "
                        }
                        var bgTop = $.clouds.instances[id]["t"].toString();
                        if (bgTop.indexOf("%") == -1) {
                            bgTop += "px "
                        } else {
                            bgTop += " "
                        }
                        $(element).css({"background-position": bgLeft + bgTop})
                    }
                }
                window.setTimeout(function () {
                    animate(options)
                }, parseInt(1000 / options.fps))
            }

            $.clouds = {
                bgY: function (element) {
                    var bgY = ($(element).css("background-position") || " ").split(" ")[1];
                    return bgY
                }, bgX: function (element) {
                    if (navigator.userAgent.match(/msie/)) {
                        var bgX = $(element).css("background-position-x") || 0
                    } else {
                        var bgX = ($(element).css("background-position") || " ").split(" ")[0]
                    }
                    return bgX
                }
            };
            $.fn.spritely = function (options) {
                var options = $.extend({type: "sprite", width: null, height: null, fps: 12}, options);
                var id = $(this).attr("id");
                if (!$.clouds.instances) {
                    $.clouds.instances = {}
                }
                if (!$.clouds.instances[id]) {
                    if (options.startAtFrame) {
                        $.clouds.instances[id] = {currentFrame: options.startAtFrame - 1}
                    } else {
                        $.clouds.instances[id] = {currentFrame: -1}
                    }
                }
                $.clouds.instances[id]["type"] = options.type;
                options.element = this;
                options.width = options.width || $(this).width() || 100;
                options.height = options.height || $(this).height() || 100;
                animate(options)
            };
            $.fn.clouds = function (options) {
                var options = $.extend({type: "pan", dir: "left", continuous: true, speed: 1}, options || {});
                return $(this).spritely(options)
            };
        })($);
        $(document).ready(function () {
            $("#far-clouds").clouds({fps: 30, speed: 0.4, dir: "left"});
            $("#near-clouds").clouds({fps: 30, speed: 1, dir: "left"})
        });
    },
    night: function() {
        //*************黑夜*************//
        document.writeln("<div class=\'night-box\'><div id=\'night-main\'></div></div>");
        (function ($, window, document) {
            $.fn.sparkle = function (options) {
                $.destroySparkle = $.destroySparkle || {};
                var id = this.data("sparkle-id") || (new Date()).getTime() + Math.random();
                if (options === "destroy" && this.find("svg").length > 0) {
                    $.destroySparkle[id] = true;
                    this.data("sparkle-id", null)
                }
                var $this = this;
                var settings = $.extend({
                    fill: "#fff",
                    stroke: "#fff",
                    size: 20,
                    delay: 0,
                    duration: 1500,
                    pause: 1000
                }, options);
                var cssAnimationAttr = "my-sparkle " + settings.duration + "ms infinite linear";
                var $star = $('<svg class="my-sparkle" version="1.1" viewBox="0.0 0.0 50.0 50.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="p.0"><path d="m0 0l50.0 0l0 50.0l-50.0 0l0 -50.0z" clip-rule="nonzero"></path></clipPath><g clip-path="url(#p.0)"><path fill="' + settings.stroke + '" fill-opacity="0.0" d="m0 0l50.0 0l0 50.0l-50.0 0z" fill-rule="nonzero"></path><path fill="' + settings.fill + '" d="m0.62204725 25.0l20.068499 -4.323374l4.309454 -20.13332l4.309454 20.13332l20.068499 4.323374l-20.068499 4.323374l-4.309454 20.133318l-4.309454 -20.133318z" fill-rule="nonzero"></path><path stroke="' + settings.stroke + '" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m0.62204725 25.0l20.068499 -4.323374l4.309454 -20.13332l4.309454 20.13332l20.068499 4.323374l-20.068499 4.323374l-4.309454 20.133318l-4.309454 -20.133318z" fill-rule="nonzero"></path></g></svg>').css({
                    position: "absolute",
                    width: settings.size,
                    height: settings.size,
                    zIndex: 9999
                });
                var w = this.width();
                var h = this.height();
                var getCoordinates = function () {
                    return {left: Math.random() * w, top: Math.random() * h}
                };
                var placeStar = function (init) {
                    var coords = getCoordinates();
                    if (init) {
                        $this.append($star)
                    }
                    $star.css({
                        "-moz-animation": cssAnimationAttr,
                        "-webkit-animation": cssAnimationAttr,
                        animation: cssAnimationAttr,
                        display: "block",
                        left: coords.left,
                        top: coords.top
                    });
                    window.setTimeout(function () {
                        $star.css({
                            "-moz-animation": null,
                            "-webkit-animation": null,
                            animation: null,
                            display: "none"
                        });
                        if (!$.destroySparkle[id]) {
                            window.setTimeout(function () {
                                placeStar(false)
                            }, settings.pause)
                        } else {
                            $star.remove()
                        }
                    }, settings.duration)
                };
                if (this.css("position") === "static") {
                    this.css("position", "relative")
                }
                if (!$.destroySparkle[id]) {
                    window.setTimeout(function () {
                        placeStar(true)
                    }, settings.delay);
                    this.data("sparkle-id", id)
                }
                return this
            }
        })($, window, document);
        $("#night-main").sparkle({fill: "#fff", stroke: "#fff", size: 15,}).sparkle({
            delay: 1000,
            pause: 750,
            size: 10
        });
    },
    bindEvent: function() {
        //点击、滑动事件
        $('.con').on('swipeUp', function (event) {
            $('body').html("").css("background", "#12101A");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
        });
        $('.down').on('tap', function (event) {
            $('body').html("").css("background", "#12101A");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
        });
        $('.addEvent').on('tap', function () {
            $('body').html("").css("background", "#66cccc");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/addEvent.html?date=" + dateTime);
        });
    }
}

fuc.init();