/**
 * Created by admin on 2016/8/17.
 * 获取用户信息
 * 判断当前页面时间范围内的事件
 * 获取一天的事件
 * 获得黄历
 * 设置生日获取私人黄历
 * 添加事件
 */
var LunarCalendar = require("./LunarCalendar.js");

var Lunar = {
    init: function() {
        this.checkUserAgent();
    },
    Calendar: {
        hlurl: "http://cdn.tuijs.com/js/",
        hlMinYear: 2008,
        hlMaxYear: 2020,
        minYear: 1891,
        maxYear: 2100,
        itemTemp: [
            '<div class="date_item<%=itemCls%>" data-index="<%=index%>" id="<%=itemId%>">',
            '	<span class="date_icon<%=iconCls%>"><%=iconText%></span>',
            '	<span class="date_day"><%=day%></span>',
            '	<span class="date_lunar<%=fetvCls%>"><%=lunar%></span>',
            '</div>'
        ],
        now: new Date(),
        current: null,
        DATA: null,
        panel: [0,1],
        pageWidth: 0,
        timer: -1,
        formatDayD4: function(month, day) {
            month = month + 1;
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return 'd' + month + day;
        },
        formatDate: function() {
            if (!current)return '';
            var year = this.current.year;
            var month = this.current.month;
            return month + "月" + "·" + year + "年";
        },
        setCurrentByNow: function(year, month, day, pos) {
            this.current = {
                year: year || this.now.getFullYear(),
                month: month || this.now.getMonth() + 1,
                day: day || this.now.getDate(),
                pos: pos || 0
            };
        }
    },
    checkUserAgent: function() {
        this.mobile = {
            platform: '',
            version: 0,
            Android: function () {
                return this.platform === 'Android';
            },
            iOS: function () {
                return this.platform === 'iOS';
            },
            init: function () {
                var ua = navigator.userAgent;
                if (ua.match(/Android/i)) {
                    this.platform = 'Android';
                    this.version = parseFloat(ua.slice(ua.indexOf("Android") + 8));
                }
                else if (ua.match(/iPhone|iPad|iPod/i)) {
                    this.platform = 'iOS';
                    this.version = parseFloat(ua.slice(ua.indexOf("OS") + 3));
                }
            }
        };
        this.mobile.init();
    },
    //获取当前显示的日历数组
    getDateList: function() {
        var dateItem = "";
        var theDateList = $('.date_slide .date_list');
        for (var i = 0; i < theDateList.size(); i++) {
            if (theDateList.eq(i).attr("class") == "date_list active") {
                dateItem = theDateList.eq(i).find('.date_item');
            } else {
                dateItem = theDateList.eq(0).find('.date_item');
            }
        }
        return dateItem;
    },
    //首页获取用户信息
    getUserInformation2: function() {
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/user/detail",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.code == 0) {
                    nickName = data.data.nickName;
                }
            }
        });
    },
    //月历页面的数据加载
    //判断当前页面时间范围内的事件，并在有时间的日期下方加点
    getEventOfMonth: function() {
        var dateItem = this.getDateList();
        //console.log(dateItem);
        var startTime = dateItem.eq(0).attr('id'),
            endTime = dateItem.eq(dateItem.size() - 1).attr('id');
        var html = "<span class='date-dot back6c opa7'></span>";
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/event/hasornot",
            data: {
                startTime: startTime,
                endTime: endTime
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                    var list = data.data;
                    function td(time) {//处理请求到的时间格式
                        var timeArr = time.split(" ");
                        var dateArr = timeArr[0].split("-");
                        return dateArr[0] + "-" + parseInt(dateArr[1]) + "-" + parseInt(dateArr[2]);
                    };
                    for (var i = 0; i < dateItem.size(); i++) {
                        if (dateItem.eq(i).attr('id')) {
                            for (var j = 0; j < list.length; j++) {
                                if (dateItem.eq(i).attr('id') == td(list[j].date) && list[j].flag) {
                                    dateItem.eq(i).append(html);
                                }
                            };
                        }
                    };
                };
            }
        });
    },
    //获取一天的事件
    getEventOfDay: function(dateTime) {
        var template = $('#eventListTemplate').html();
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/event/getEventOfDay",
            data: {
                dateTime: dateTime,
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                    var eventList = data.data;
                    if (eventList.length > 0) {
                        var html = "",mark = "",joinerNum;
                        $('.scheduleBg').css("display", "none");
                        $('.scheduleCon').css("display", "block");
                        $('.scheduleCon').html("");
                        for (var i = 0; i < eventList.length; i++) {
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
                                joinerNum = parseInt(eventList[i].joiners.length)+1;
                                html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark+eventList[i].owner.nickName);
                            }

                        }
                        $('.scheduleCon').append(html);
                        $('.list').hammer().on('tap', function (event) {//点击日程跳转至详情页
                            var eventId = $(this).attr('id');
                            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/showEvent.html?eventId=" + eventId);
                        });
                    } else {
                        $('.scheduleBg').css("display", "block");
                        $('.scheduleCon').css("display", "none");
                    }
                }
                if ($('.almanac').css("left") == "0px") {
                    var almaHeight = parseInt($('.almanac').css('height'));
                    $('.schedule').css('height', 40 + almaHeight + "px");
                } else {
                    var scheHeight = parseInt($('.scheduleList').css('height'));
                    $('.schedule').css('height', 40 + scheHeight + "px");
                }
                //日程日期字符串的截取
                function transHour(time) {
                    var timeArr = time.split(" ");
                    var hourArr = timeArr[1].split(":");
                    return hourArr[0] + ":" + hourArr[1];
                }
            }
        })
    },
    //获得黄历
    getFortune: function(dateTime) {
        var dateTime = dateTime + " 08:00:00";
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/fortune/get",
            data: {
                dateTime: dateTime,
            },
            dataType: "json",
            success: function (data) {
                var data = data.data;
                $('.pubSuitMatter').html(" ");
                $('.tabooMatter').html(" ");
                if (data.personal) {
                    $('.alConBg').css("display", "none");
                    $('.content').css("display", "block");
                    $('.alterBirthday').css("display","block");//若用户设置过生日，则修改生日显示
                    $('.suitColor').html("");
                    $('.suitMatter').html("");
                    var personal = data.personal;
                    var personalType2 = personal.type2.replace(/\，/g, "&nbsp;&nbsp;");
                    var personalColor = "<span>" + personalType2 + "</span>";
                    if (personal.type3) {
                        var personalType3 = personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
                        var personalMatter = "";
                        personalMatter += "<span>" + personalType3 + "</span>";
                        $('.suitMatter').append(personalMatter);
                    } else {
                        $('.suitMatter').html("<span>诸事不宜</span>");
                    }
                    $('.suitColor').append(personalColor);
                }
                var public = data.public;
                var pubSuit = "<span>" + public.yi.replace(/\,/g, "&nbsp;&nbsp;") + "</span>";
                var pubTaboo = "<span>" + public.ji.replace(/\,/g, "&nbsp;&nbsp;") + "</span>";
                $('.pubSuitMatter').append(pubSuit);
                $('.tabooMatter').append(pubTaboo);
                if ($('.almanac').css("left") == "0px") {
                    var almaHeight = parseInt($('.almanac').css('height'));
                    $('.schedule').css('height', 40 + almaHeight + "px");
                } else {
                    var scheHeight = parseInt($('.scheduleList').css('height'));
                    $('.schedule').css('height', 40 + scheHeight + "px");
                }
            }
        })
    },
    //设置生日获取私人黄历
    setBirthday: function(birthdayTime) {
        var date = new Date();
        var years = date.getFullYear(),
            months = date.getMonth() + 1,
            days = date.getDate();
        var dateTime = years + "-" + months + "-" + days + " 08:00:00";
        $.ajax({
            type: "post",
            url: "http://www.li-li.cn/llwx/user/setBirthday",
            data: {
                dateTime: dateTime,
                birthday: birthdayTime
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                    $('#loadingToast').fadeOut();//隐藏loading
                    var data = data.data;
                    $('.suitColor').html("");
                    $('.suitMatter').html("");
                    var suitColor = data.personal.type2.replace(/\,/g, "&nbsp;&nbsp;"),
                        suitMatter = data.personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
                    if(!suitMatter){
                        suitMatter = "诸事不宜";
                    }
                    var colorHtml = "<span>" + suitColor + "</span>",
                        matterHtml = "<span>" + suitMatter + "</span>";
                    $('.suitColor').append(colorHtml);
                    $('.suitMatter').append(matterHtml);
                    $('.alterBirthday').css("display","block");//修改生日显示
                }else{
                    $('#loadingToast').fadeOut();//隐藏loading
                    var error = data.msg;
                    $('.weui_dialog_bd').html(error);
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
                if ($('.almanac').css("left") == "0px") {
                    var almaHeight = parseInt($('.almanac').css('height'));
                    $('.schedule').css('height', 40 + almaHeight + "px");
                } else {
                    var scheHeight = parseInt($('.scheduleList').css('height'));
                    $('.schedule').css('height', 40 + scheHeight + "px");
                }
            }
        })
    },
    //添加事件页面数据提交
    eventAdd: function(name,tagName, startTime, endTime, tipType, tipTime, repeatType, location, remark) {
        $.ajax({
            type: "post",
            url: "http://www.li-li.cn/llwx/event/add",
            data: {
                name: name,
                tags:tagName,
                startTime: startTime,
                endTime: endTime,
                tipType: tipType,
                tipTime: tipTime,
                repeatType: repeatType,
                location: location,
                remark: remark,
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {//提交成功
                    window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
                }else{//提交失败提醒错误信息
                    var error = data.msg;
                    $('#dialog2 .weui_dialog_bd').html(error);
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
            }
        })
    },
    //添加事件页面数据提交
    eventAdd2: function(name,tagName,startTime, endTime, tipType, tipTime, repeatType, location, remark) {
        $.ajax({
            type: "post",
            url: "http://www.li-li.cn/llwx/event/add",
            data: {
                name: name,
                tags:tagName,
                startTime: startTime,
                endTime: endTime,
                tipType: tipType,
                tipTime: tipTime,
                repeatType: repeatType,
                location: location,
                remark: remark,
            },
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data);
                if (data.code == 0) {
                    eventId = data.data;
                }else{//提交失败提醒错误信息
                    var error = data.msg;
                    $('#dialog2 .weui_dialog_bd').html(error);
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
            }
        })
    }
}

module.exports = Lunar;