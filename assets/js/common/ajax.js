var Dom = require("./dom.js");
var Ajax = {
    config:{
        urlArr:""
    },
    init: function() {
        this.config.urlArr = Dom.configuration();
        var that = this;
        setInterval(function () {
            $.get(that.config.urlArr[0]+"/common/heartbeat", function (data) {
                //alert(data);
            });
        }, 20 * 60 * 1000);
    },
    //首页获取用户信息
    getUserInformation2: function() {
        var that = this;
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/user/detail",
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
        var that = this;
        var dateItem = Dom.getDateList();
        //console.log(dateItem);
        var startTime = dateItem.eq(0).attr('id'),
            endTime = dateItem.eq(dateItem.size() - 1).attr('id');
        var html = "<span class='date-dot back6c opa7'></span>";
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/event/hasornot",
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
        var that = this;
        var template = $('#eventListTemplate').html();
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/event/getEventOfDay",
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
                                    // joinerNum = parseInt(eventList[i].joiners.length)+1;
                                    joinerNum =eventList[i].joinersCount+1;
                                    var numStr = "";
                                    if(joinerNum>99){
                                        numStr = "99+人";
                                    }else{
                                        numStr = joinerNum + '人';
                                    }
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, numStr).replace(/{{user}}/g, mark + eventList[i].joiners[0].nickName);
                                }else{
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, "").replace(/{{user}}/g, "");
                                }
                            } else {
                                mark = "#";
                                // joinerNum = parseInt(eventList[i].joiners.length)+1;
                                joinerNum =eventList[i].joinersCount;
                                if(eventList[i].owner)
                                    joinerNum += 1;

                                var numStr = "";
                                if(joinerNum>99){
                                    numStr = "99+人";
                                }else{
                                    numStr = joinerNum + '人';
                                }
                                //if(eventList[i].event.eventType == 2){
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, numStr).replace(/{{user}}/g, mark+eventList[i].owner);
                                //}else{
                                //    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, (eventList[i].owner?joinerNum:joinerNum-1) + "人").replace(/{{user}}/g, mark+eventList[i].owner);
                                //}

                            }

                        }
                        $('.scheduleCon').append(html);
                        $('.list').on('tap', function () {//点击日程跳转至详情页
                            var eventId = $(this).attr('id');
                            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + eventId);
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
        var that = this;
        var dateTime = dateTime + " 08:00:00";
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/fortune/get",
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
        var that = this;
        var date = new Date();
        var years = date.getFullYear(),
            months = date.getMonth() + 1,
            days = date.getDate();
        var dateTime = years + "-" + months + "-" + days + " 08:00:00";
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/user/setBirthday",
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
    //获取天气  日期格式2016-10-13
    getWeather:function(date,time){
        var that = this;
        $.get(
            that.config.urlArr[0]+"/weather/get",
            {
                "date":date,
                "days":1
            },
            function(data) {
                if(data.code ==0){
                    if(data.data && data.data.length>0){
                        var weatherList = data.data[0];
                        var html = "",
                            sunUp = weatherList.sunUp,
                            sunDown = weatherList.sunDown;
                        var dayOrNight = Dom.dayOrnight(time,sunUp,sunDown);
                        if(dayOrNight == "dayTime") {//白天
                            if(weatherList.qlty){
                                html = weatherList.city+"&nbsp;"+weatherList.dTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
                            }else{
                                html = weatherList.city+"&nbsp;"+weatherList.dTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
                            }
                        }else if(dayOrNight == "nightTime"){//黑夜
                            if(weatherList.qlty){
                                html = weatherList.city+"&nbsp;"+weatherList.nTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
                            }else{
                                html = weatherList.city+"&nbsp;"+weatherList.nTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
                            }
                        }
                        $('.weather .itemCon').html("").append(html);
                    }else{
                        $('.weather').css("display","none");
                    }
                }else{
                    $('.weather').css("display","none");
                }
            }
        )
    },
    //获取用户选择地点的天气
    getLocalWeather:function(date,time,latitude,longitude){
        var that = this;
        $.get(
            that.config.urlArr[0]+"/weather/getByCoordinates",
            {
                "longitude":longitude,
                "latitude":latitude,
                "date":date
            },
            function(data){
                if(data.code ==0){
                    if(data.data){
                        var weatherList = data.data;
                        var html = "",
                            sunUp = weatherList.sunUp,
                            sunDown = weatherList.sunDown;
                        var dayOrNight = Dom.dayOrnight(time,sunUp,sunDown);
                        if(dayOrNight == "dayTime"){
                            if(weatherList.qlty){
                                html = weatherList.city+"&nbsp;"+weatherList.dTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
                            }else{
                                html = weatherList.city+"&nbsp;"+weatherList.dTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
                            }
                        }else if(dayOrNight == "nightTime"){
                            if(weatherList.qlty){
                                html = weatherList.city+"&nbsp;"+weatherList.nTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃&nbsp;"+"空气"+weatherList.qlty;
                            }else{
                                html = weatherList.city+"&nbsp;"+weatherList.nTxt+"&nbsp;"+weatherList.minTmp+"℃~"+weatherList.maxTmp+"℃";
                            }
                        }
                        $('.weather .itemCon').html("").append(html);
                    }else{
                        $('.weather').css("display","none");
                    }
                }else{
                    $('.weather').css("display","none");
                }
            }
        )
    },
    //获取私人运势
    getPersonalFortune:function(dateTime){
        var that = this;
        $.get(that.config.urlArr[0]+"/fortune/get", {"dateTime": dateTime + " 08:00:00"}, function (data) {
            if (data.code == 0) {
                var list = data.data;
                if (list.personal) {
                    var html = "";
                    if (list.personal.type3) {
                        var type = list.personal.type3.replace(/\,/g, "&nbsp;");
                        html = "<span>" + type + "</span>";
                        $('.suitable .itemCon').html("").append(html);
                    } else {
                        $('.suitable .itemCon').html("诸事不宜");
                    }
                }else{
                    $('.eventContainer .suitable').css("display","none");
                    $('.eventCon .suitable').css('display','none');
                }
            }
        });
    }
}

Ajax.init();

module.exports = Ajax;