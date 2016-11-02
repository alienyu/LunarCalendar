/**
 * Created by admin on 2016/9/22.
 */

require("../../css/page/activity.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
var Dom = require("../common/dom.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var wx = require("../vendor/weChat/wxInit.js");
var Ajax = require("../common/ajax.js");
require("../vendor/ImproveMobile/autoTextArea.js");
require("../vendor/dropLoad/dropLoad.js");

var fuc = {
    config: {
        eventId: "",
        nickName: "",
        headImg:"",
        tagId: "",//用户选择的快捷标签Id
        time: "",
        timeArr: "",
        remindSelect: "",
        repeatSelect: "",
        map: "",
        bgColor: "",//背景颜色
        themeId: "",//背景图id
        themeName: "",
        themeColor: "",
        remarkText: "",
        remarkImgs: "",
        urlArr:""
    },
    mapConfig: {
        cityName:"上海",
        map: "",
        moveendPoint: "",
        page: "",
        template: $('#addressListTemplate').html(),
        pois: [],
        locaName: "",//地址名称
        locaAddress: "",//详细地址
        latitude: "",//纬度
        longitude: ""//经度
    },
    imgConfig: {
        count: 0
    },

    init: function () {
        pageLoad({backgroundColor: "#fff"});
        this.config.time = this.ifTimeExist(Dom.getRequest("date"));
        this.config.timeArr = this.transTime(this.config.time);
        this.config.eventId = Dom.getRequest("eventId");
        this.config.remindSelect = document.getElementById("select1");
        this.config.repeatSelect = document.getElementById('select');
        this.mapConfig.latitude = 0;
        this.mapConfig.longitude = 0;
        this.config.map = {//颜色与其名称的键值对
            '#66cccc': '默认颜色',
            '#0b8043': '罗勒绿',
            '#33b679': '鼠尾草绿',
            '#039be5': '孔雀蓝',
            '#4285f4': '钴蓝',
            '#8e24aa': '葡萄紫',
            '#9e69af': '水晶紫',
            '#d50000': '番茄红',
            '#f4511e': '橘红',
            '#795548': '可可棕',
            '#616161': '石墨黑'
        };
        this.boxDom = "";
        this.config.bgColor = '#66cccc';
        this.config.urlArr = Dom.configuration();
        this.renderPage();
        this.bindEvent();
        this.initMap();
        this.searchNearByResult();
        this.initDropLoad();
        Dom.fixedTextareaBlur();
    },

    selectTimes: function (obj1, obj2) {
        var that = this;
        var selb = mobiScroll.datetime(obj1, {
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'bottom',
            timeWheels: 'yy-mm-dd HHii',
            dateFormat: 'yy-mm-dd HH:ii',
            min: new Date(1921, 1, 1),
            max: new Date(2020, 1, 1),
            readonly: false,
            onShow: function (event, inst) {
                var theDate = inst._tempValue;
                Dom.transDate(theDate, true);
            },
            onSet: function (event, inst) {
                var selectedDate = inst.getVal();//获取选择时间的标准形式
                var selectedTime = inst._tempValue;//获取选择时间 yyyy/mm/dd  hh:ii
                var selectedDateArr = inst._wheelArray;//获取选择时间的数组 [yy,mm,dd,hh,ii]
                var selectedTimeArr = selectedTime.split(" ");
                var theWeek = Dom.transWeek(selectedDate);
                $(obj2).html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                var theId = selectedDateArr[0] + "-" + that.tf(parseInt(selectedDateArr[1]) + 1) + "-" + that.tf(selectedDateArr[2]) + " " + selectedTimeArr[1] + ":00";
                $(obj2).attr("id", theId);
                if (obj2 == '.startCon') {//若修改的是开始时间的日期，则指定提醒时间日期等于开始时间，结束时间等于开始时间
                    $('.remindTime').html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    $(".remindTime").attr("id", theId);
                    $('.endCon').html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    $('.endCon').attr("id", theId);
                    that.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));//重新设置结束时间的初始值
                    that.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));//重新设置提醒时间的初始值
                    if(!Dom.smallerDate(selectedTimeArr[0])){
                        $('.weather').css("display","-webkit-box");
                        if(that.mapConfig.longitude){
                            Ajax.getLocalWeather(selectedTimeArr[0],selectedTimeArr[1],that.mapConfig.latitude,that.mapConfig.longitude);
                        }else{
                            Ajax.getWeather(selectedTimeArr[0],selectedTimeArr[1]);
                        }
                    }else{
                        $('.weather').css("display","none");
                    }
                }
            },
            onChange: function (event, inst) {
                var changeDate = inst._tempValue;
                Dom.transDate(changeDate, true);
            }
        });
        return selb;
    },

    shareShadow: function () {
        var shareShadow = $('.shareShadow');
        shareShadow.fadeIn();//显示分享提示层
        shareShadow.on("tap",function (event) {
            $(this).fadeOut();
            event.stopPropagation();
        });
        var share = document.getElementById('shareShadow');
        share.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },

    /*----------------------若日期中的数组小于10，则在前面加0-------------------*/
    tf: function (time) {
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    },

    /*-------------------------------转换日期格式，开始时间加10分钟-------------------------------------*/
    ifTimeExist: function (time) {
        var that = this;
        if (!time) {
            var d = new Date();//获得当天日期
            var years = d.getFullYear();
            var months = d.getMonth() + 1;
            var days = that.tf(d.getDate());
            return years + "-" + months + "-" + days;
        } else {
            return time;
        }
    },

    transTime: function (time) {
        var that = this;
        var date = new Date();
        var timeArr = time.split('-');
        var theTime = time.replace(/\-/g, "/");
        var theDate = new Date(theTime);
        var theWeek = Dom.transWeek(theDate);
        var startHour = date.getHours(), startMinute = date.getMinutes() + 10;
        if (startMinute >= 60) {
            startHour = startHour + 1;
            if (startMinute - 60 >= 10) {
                startMinute = startMinute - 60;
            } else {
                startMinute = "0" + (startMinute - 60);
            }
            if (startHour == 24) {
                startHour = 23;
                startMinute = date.getMinutes();
            }
        }
        var startId = timeArr[0] + "-" + that.tf(parseInt(timeArr[1])) + "-" + timeArr[2] + " " + startHour + ":" + startMinute + ":00";
        //给开始时间，结束时间，提醒时间设置ID，提交数据时只需要提交id内容即可
        $('.startCon').attr("id", startId);
        $('.endCon').attr("id", startId);
        $('.remindTime').attr("id", startId);
        var startTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + startHour + ":" + startMinute,
            endTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + startHour + ":" + startMinute;
        return [startTime, endTime];
    },

    /*---------------------修改开始时间、结束时间、指定提醒时间样式，为其设置时间选择器的初始值---------------------*/
    setInitTime: function (obj) {
        var time = obj.attr("id");
        var date = time.split(" ");
        var theDate = date[0].replace(/\-/g, "/"),
            theTime = date[1].split(":");
        return theDate + " " + theTime[0] + ":" + theTime[1];
    },

    /*----------------获取用户选择快捷标签对应的主题-------------------*/
    getTemplate: function (templateId) {
        var that = this;
        console.log(templateId);
        if (templateId != "null") {
            $.get(
                that.config.urlArr[0]+"/template/detail",
                {
                    'tid': templateId
                },
                function (data) {
                    if (data.code == 0) {
                        var list = data.data;
                        if(list){
                            //设置重复类型
                            var repeatOptions = that.config.repeatSelect.getElementsByTagName("option");
                            for (var j = 0; j < repeatOptions.length; j++) {
                                if(repeatOptions[j].value == list.repeatType){
                                    repeatOptions[j].selected = true;
                                }
                            }
                            if (list.theme) {//若对应的是背景图片
                                that.config.bgColor = "";
                                that.config.themeId = list.theme.themeId;
                                that.config.themeName = list.theme.themeName;
                                that.config.themeColor = list.theme.themeColor;
                                $('.colorShow').css("background", that.config.themeColor);
                                $('.colorText').html(that.config.themeName);
                            }else if (list.bgColor) {//若对应的是背景颜色
                                that.config.bgColor = list.bgColor;
                                $('.colorShow').css("background", list.bgColor);
                                $('.colorText').html(that.config.map[list.bgColor]);
                            }
                            that.setInitTheme();
                        }
                    }
                }
            )
        }
    },

    hideTags: function () {
        var that = this;
        $('.tipsCon a').on("touchend",function (event) {
            $('.eventName').val($(this).html());
            that.config.tagId = $(this).attr("data-tag");//保存用户选择的标签id
            that.getTemplate($(this).attr("data-template"));
            $('.topTips').slideUp();
            event.preventDefault();
            event.stopPropagation();
        });
    },

    getTags: function () {
        var that = this;
        var template = $('#tagListTemplate').html();
        var html = "";
        $.get(
            that.config.urlArr[0]+"/tag/list",
            {"type": 2, "all": true},
            function (data) {
//                console.log(data);
                if (data.code == 0) {
                    var list = data.data;
                    for (var i = 0; i < list.length; i++) {//显示标签对应的内容及模板ID
                        html += template.replace(/{{templateId}}/g, list[i].templateId).replace(/{{tagId}}/g, list[i].tagId).replace(/{{tagName}}/g, list[i].tagName);
                    }
                    $('.tipsCon').html("").append(html);
                    that.hideTags();
                } else {//数据加载失败显示错误提示框
                    var error = data.msg;
                    $('#dialog2 .weui_dialog_bd').html(error);
                    $('#dialog2').fadeIn().on('click', '.weui_btn_dialog', function () {
                        event.stopPropagation();
                        $('#dialog2').off('click').fadeOut();
                    });
                }
            }
        )
    },

    renderPage: function () {
        var that = this;
        $('.eventCon').css("visibility","visible");
        that.getTags();
        that.colorInit();
        that.getUserInformation();
        Dom.autoTextarea(document.getElementById("eventTitle"));
        /*---------------------------------开始时间、结束时间、指定提醒时间三个地方的日期选择功能---------------------------------*/
        this.selectTimes('#startTime', '.startCon').setVal(new Date(that.setInitTime($('.startCon'))));
        this.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));
        this.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));

        if (that.config.eventId) {//若用户是通过编辑按钮进入 页面，则拉取事件ID对应的信息
            that.getData();
            that.setInitTheme();
        } else {
            var obj = new Object();
            obj.title = "【 历历LilyCalendar】让回忆与温故成为一件轻松的事情";
            obj.desc = "这是一个简单操作的日历系统，但却能发挥各式各样和生活有关的活用。";
            obj.link = null;
            obj.img = null;
            wx.wxConfig(2,obj);
            /*--------------设置颜色初始值------------------*/
            $('.colorShow').css("background", that.config.bgColor);
            $('.colorText').html(that.config.map[that.config.bgColor]);
            that.setInitTheme();
            /*---------------------开始时间、结束时间、指定提醒时间的时间显示---------------------*/
            $('.startCon').html(that.config.timeArr[0]);
            $('.endCon').html(that.config.timeArr[1]);
            $('.remindTime').html(that.config.timeArr[0]);
            //进入页面时，显示当时当地的天气
            var startDate = $('.startCon').attr("id");
            $('.weather').css("display","-webkit-box");
            Ajax.getWeather(Dom.getDate(startDate),Dom.getHourMinute(startDate));
        }
        /*---------提醒类型选择的监听事件---------*/
        var select = document.getElementById('select1');
        select.onchange = function () {
            if (select.value == 3) {
                $('.remindTime').animate({"height": "30px"}, 200);
                $('#remindTime').css("display", "block");
            } else {
                $('.remindTime').animate({"height": "0px"}, 200);
                $('#remindTime').css("display", "none");
            }
        }
    },

    /*--------------通过eventID拉去页面数据------------------*/
    getData: function () {
        var that = this;
        $('.delete').css("display", "block");//用户可删除事件
        $(".topTips").css("display", "none");//隐藏头部的快捷标签
        $.get(
            that.config.urlArr[0]+"/event/detail",
            {
                "eventId": that.config.eventId
            },
            function (data) {
                if (data.code == 0) {
                    that.getShareImg();//获取分享事件的图片
                    var eventList = data.data;
                    $('.eventName').val(eventList.event.name);//标题内容
                    Dom.autoTextarea(document.getElementById("eventTitle"));
                    var theStartTime = Dom.tranDate(eventList.event.startTime),
                        theEndTime = Dom.tranDate(eventList.event.endTime),
                        tipType = eventList.event.tipType,
                        repeatType = eventList.event.repeatType;
                    that.config.bgColor = eventList.event.bgColor;
                    that.config.themeId = eventList.event.themeId;

                    if(eventList.event.theme){
                        that.config.themeId = eventList.event.theme.themeId;//获取用户设置的背景图id
                    }
                    that.config.remarkText = eventList.event.remark;
                    that.config.remarkImgs = eventList.event.remarkImgs;
                    that.config.nickName = eventList.user;//当前用户昵称
                    that.mapConfig.locaName = eventList.event.location;
                    that.mapConfig.locaAddress = eventList.event.address;
                    that.mapConfig.latitude = eventList.event.latitude;
                    that.mapConfig.longitude = eventList.event.longitude;
                    that.mapConfig.moveendPoint = new AMap.LngLat(that.mapConfig.longitude, that.mapConfig.latitude);
                    $('.startCon').html(theStartTime).attr("id", eventList.event.startTime);
                    $('.endCon').html(theEndTime).attr("id", eventList.event.endTime);
                    /*------------若开始时间和结束时间不相等，则显示结束时间-------------*/
                    if(eventList.event.startTime != eventList.event.endTime){
                        $(".timeIcon").addClass("active");
                        $('.endTime').animate({'height': '30px','padding-bottom':'15px'}, 300);
                        $('.timeText').animate({"width": "33px"}, 300);
                        $('#endTime').css("display", "block");
                    }
                    /*------------设置重复类型----------------*/
                    var repeatOptions = that.config.repeatSelect.getElementsByTagName("option");
                    for (var j = 0; j < repeatOptions.length; j++) {
                        if(repeatOptions[j].value == repeatType){
                            repeatOptions[j].selected = true;
                        }
                    }
                    /*-------------设置提醒类型------------------*/
                    var remindOption = that.config.remindSelect.getElementsByTagName('option');
                    for (var i = 0; i < remindOption.length; i++) {
                        if(remindOption[i].value == tipType){
                            remindOption[i].selected = true;
                        }
                    }
                    if (tipType == 3) {
                        $('.remindTime').html(Dom.tranDate(eventList.event.tipTime)).attr("id",eventList.event.tipTime);
                        $('.remindTime').animate({"height": "30px"}, 200);
                        $('#remindTime').css("display", "block");
                    }else{
                        $('.remindTime').html(Dom.tranDate(eventList.event.startTime));
                    }
                    that.selectTimes('#startTime', '.startCon').setVal(new Date(that.setInitTime($('.startCon'))));
                    that.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));
                    that.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));
                    if (that.mapConfig.locaName) {
                        $('.siteName').removeClass('ccc').html(that.mapConfig.locaName);
                        $('.siteAddress').html(that.mapConfig.locaAddress);
                        $('.deleteAddress').css("display","block");//显示删除地图按钮
                    }
                    if(!Dom.smallerDate(eventList.event.startTime)){//显示天气
                        $('.weather').css("display","-webkit-box");
                        Ajax.getLocalWeather(Dom.getDate(eventList.event.startTime),Dom.getHourMinute(eventList.event.startTime),eventList.event.latitude,eventList.event.longitude);
                    }else{
                        $('.weather').css("display","none");
                    }
                    if (that.config.remarkText) {
                        $('.remarkCon .remarkText').removeClass('ccc').html(that.config.remarkText);
                        $('#remarkText').val(that.config.remarkText.replace(/<br>/g,"\n"));
                    }
                    if(that.config.remarkImgs){//设置备注图片显示
                           var imgArr = that.config.remarkImgs.split(","),
                               imgHtml = "",
                               inputImg = "";
                            $('#form').empty();
                            for(var i=0;i<imgArr.length;i++){
                                imgHtml += "<img src="+imgArr[i]+" >";
                                inputImg += '<div class="img_upload_box">'+
                                            '<input type="file" class="img_upload_btn hide" name="photo" disabled="disabled" accept="image/*"><img src="'+imgArr[i]+'" class="img_upload_result">'+
                                            $('.delUpImgSrc').html()+
                                            '</div>';
                            }
                            if(imgArr.length < 9){
                                inputImg += '<div class="img_upload_box new_box"><input type="file" class="img_upload_btn" name="photo" accept="image/*"><a href="javascript:;">+</a></div>';
                            }
                            $('#form').prepend(inputImg);
                            $('.remark .remarkImgs').append(imgHtml);
                    }
                    if (that.config.bgColor) {
                        $('.colorShow').css("background", that.config.bgColor);
                        $('.colorText').html(that.config.map[that.config.bgColor]);
                    }
                    if(that.config.themeId){
                        that.config.themeName = eventList.event.theme.themeName;
                        that.config.themeColor = eventList.event.theme.themeColor;
                        $('.colorShow').css("background", that.config.themeColor);
                        $('.colorText').html(that.config.themeName);
                    }
                    that.setInitTheme();
                    var obj = new Object();
                    obj.title = eventList.owner.nickName + " 邀请您参加 「" + eventList.event.name + "」";
                    obj.desc = Dom.tranDate(eventList.event.startTime);
                    obj.link = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + eventList.event.eventId);
                    obj.img = that.config.headImg;
                    wx.wxConfig(2,obj);
                } else if(data.code == 112){
                    //若参加者参加的事件不存在
                    $('.eventNone').css("display", "block");
                }
            }
        )
    },

    /*----------获取用户分享的图片------------*/
    getShareImg: function () {
        var that = this;
        $.get(
            that.config.urlArr[0]+"/share/genPic",
            {
                "eventId": that.config.eventId
            },
            function (data) {
                if (data.code == 0) {
                    var imgUrl = data.data;
                    that.config.shareImg = data.data;
                    $('.shadowImg img').attr("src", imgUrl);


                }
            }
        )
    },
    /*---------------弹层效果------------------*/
    shadow: function (obj, shadow, container) {
        obj.on("tap",function () {
            $('.shadowBg').fadeIn();
            shadow.show();
            container.animate({"top": "10%"}, 200);
        });
        $(".colorShadow .shadowClose").on("tap",function () {
            container.animate({"top": "100%"}, 200, function () {
                shadow.hide();
            });
            $('.shadowBg').fadeOut();
        });
    },

    mapinputshow:function(){
        $('.tipinput').addClass("onfocus");
        $('.mapCon').addClass("hide");
        $('.imgCon').addClass("hide");
        $('.tipfinished').removeClass("hide");
        var listHeight = parseInt($(document.body).height() * 0.9 - 40) + "px";
        $(".addressCon").css("height", listHeight);
        $(".addressCon").css("top", "40px");
    },

    mapinputhide:function(){
        $('.tipinput').removeClass("onfocus");
        $('.mapCon').removeClass("hide");
        $('.imgCon').removeClass("hide");
        $('.tipfinished').addClass("hide");
        var listHeight = parseInt($(document.body).height() * 0.9 - 300) + "px";
        $(".addressCon").css("height", listHeight);
        $(".addressCon").css("top", "0px");
        $('.tipinput').val("");
    },

    mapinput:function(){
        var that = this;
        $(".tipinput").on("tap", function(){
            that.mapinputshow();
        });
        $(".tipinput").on("input", function(){
            // that.mapConfig.map

            var autoOptions = {
                city: that.mapConfig.cityName
            };
            // console.log(that.mapConfig.cityName)
            autocomplete= new AMap.Autocomplete(autoOptions);
            autocomplete.search($(".tipinput").val(), function(status, result){
                //TODO:开发者使用result自己进行下拉列表的显示与交互功能
                console.log(result);
                if(result.tips){
                    that.mapConfig.pois = result.tips;
                    $('.listCon').html("");
                    var html = "", addressList = "";
                    for (var i = 0; i < that.mapConfig.pois.length; i++) {
                        html += that.mapConfig.template.replace(/{{name}}/g, that.mapConfig.pois[i].name).replace(/{{address}}/g, that.mapConfig.pois[i].address).replace(/{{jw}}/g, that.mapConfig.pois[i].location);
                    }
                    $('.listCon').append(html);
                }

                // 附近点显示方式
                // if(result.tips){
                //     var poiArr = result.tips;
                //     if(poiArr.length!=0){
                //         for(var i = 0 ; i< poiArr.length;i++){
                //             if(poiArr[0].location != ""){
                //                 var lngX = poiArr[0].location.getLng();
                //                 var latY = poiArr[0].location.getLat();
                //                 that.mapConfig.map.setCenter(new AMap.LngLat(lngX, latY));
                //                 break;
                //             }
                //         }
                //     }else{
                //         $('.listCon').empty();
                //     }
                // }
                
            })
        });

        $(".tipfinished").on("touchend", function(){
            $('.tipinput').blur();
            if($('.tipinput').val() == ""){
                that.mapinputhide();
                setTimeout(function(){
                    $('.tipinput').blur();
                },500);
                return;
            }

            var jw = $('.addressItem').first().attr('data-jw');
            if(jw == undefined){
                that.mapConfig.latitude = 0;
                that.mapConfig.longitude = 0;

            }else{
                console.log(jw);
                that.mapConfig.latitude = jw.split(",")[1];
                that.mapConfig.longitude = jw.split(",")[0];
            }   
            that.mapConfig.locaName = $('.tipinput').val();
            that.mapConfig.locaAddress = '';
            that.mapConfig.moveendPoint = new AMap.LngLat(that.mapConfig.longitude, that.mapConfig.latitude);
            $(".siteName").removeClass("ccc").html(that.mapConfig.locaName);
            $('.siteAddress').html(that.mapConfig.locaAddress);
            $('.deleteAddress').css("display","block");//显示删除地址按钮
            //todo 显示选择地点的天气
            var startTime = $('.startCon').attr("id");
            if(!Dom.smallerDate(startTime)){
                $('.weather').css("display","-webkit-box");
                Ajax.getLocalWeather(Dom.getDate(startTime),Dom.getHourMinute(startTime),that.mapConfig.latitude,that.mapConfig.longitude);
            }else{
                $('.weather').css("display","none");
            }
            event.preventDefault();
            event.stopPropagation();
            setTimeout(function(){
                $(".mapShadow .container").animate({"top": "100%"}, 200, function () {
                    $(this).parent().hide();
                });
                $('.shadowBg').fadeOut();
            },500);

        });
    },

    /*---------------地图弹层效果------------------*/
    mapShadow: function (obj, shadow, container) {
        var that = this;
        obj.on("tap",function () {
            if (that.mapConfig.latitude && that.mapConfig.longitude) {//地址存在,直接弹出
                that.mapinputhide();
                that.mapMove();
                $('.shadowBg').fadeIn();
                shadow.show();
                container.animate({"top": "10%"}, 200);
                if($(".siteAddress").html()=="" && $(".siteName").html() != "" && $(".siteName").html() != "添加地点" ){
                    $('.tipinput').addClass("onfocus");
                    $('.tipinput').val($(".siteName").html());
                }
            } else if($(".siteAddress").html()=="" && $(".siteName").html() != "" && $(".siteName").html() != "添加地点" ){
                that.mapinputshow();
                $('.tipinput').val($(".siteName").html());
                $('.shadowBg').fadeIn();
                shadow.show();
                container.animate({"top": "10%"}, 200);
            }else {//获取地址
                wx.getWx().getLocation({
                    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        console.log("getlocation");
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        //var speed = res.speed; // 速度，以米/每秒计
                        //var accuracy = res.accuracy; // 位置精度
                        that.mapConfig.latitude = latitude;
                        that.mapConfig.longitude = longitude;
                        that.mapConfig.moveendPoint = new AMap.LngLat(that.mapConfig.longitude, that.mapConfig.latitude);
                        console.log(that.mapConfig.moveendPoint);
                        that.mapinputhide();
                        that.mapMove();
                        $('.shadowBg').fadeIn();
                        shadow.show();
                        container.animate({"top": "10%"}, 200);
                    },
                    cancel: function (res) {

                    }
                });
            }
        });
        $('.mapShadow .shadowClose').on("touchend",function (event) {
            $('.tipinput').blur();
            container.animate({"top": "100%"}, 200, function () {
                $(this).parent().hide();
            });
            $('.shadowBg').fadeOut();
            event.preventDefault();
            event.stopPropagation();
        });
    },

    /*--------------颜色弹层中的颜色初始化--------------*/
    colorInit: function () {
        var that = this,
            colorTemplate = $('#colorsListTemplate').html(),
            imgTemplate = $('#imgListTemplate').html(),
            colorHtml = "",
            colorArr = [];
        //颜色列表初始化
        for (var i in that.config.map) {
            colorHtml += colorTemplate.replace(/{{color}}/g, i).replace(/{{colorName}}/g, that.config.map[i]);
            colorArr.push(i);
        }
        $('.colorCon').append(colorHtml);
        var theBigger = $('.bigger');
        for (var k = 0; k < theBigger.size(); k++) {
            theBigger.eq(k).css("background", colorArr[k]);
        }
        //图片列表初始化
        $.get(
            that.config.urlArr[0]+"/theme/list",
            {
                "all": true
            },
            function (data) {
                if (data.code == 0) {
                    var imgList = data.data.list, imgHtml = "";
                    console.log(imgList);
                    for (var n = 0; n < imgList.length; n++) {
                        //console.log(n);
                        imgHtml += imgTemplate.replace(/{{themeId}}/g, imgList[n].themeId).replace(/{{themeName}}/g, imgList[n].themeName).replace(/{{themeColor}}/g, imgList[n].themeColor);
                    }
                    $('.imageCon').append(imgHtml);
                    that.selectColor();
                    var imgName = $('.imgItem .imgName');
                    console.log(imgName);
                    for (var p = 0; p < imgName.size(); p++) {
                        imgName.eq(p).css({
                            "background-image": "url(" + imgList[p].themeUrl + ")",
                            "background-color": imgList[p].themeColor
                        });
                    }
                    that.setInitTheme();
                }
            }
        )
    },
    /*-------------------设置初始时的选中状态--------------------*/
    setInitTheme: function () {
        var that = this;
        //设置选中的颜色
        var colorItem = $('.colorCon .colorItem');
        for (var m = 0; m < colorItem.size(); m++) {
            if (colorItem.eq(m).attr("data-colors") == that.config.bgColor) {
                $('.items').removeClass("active");
                colorItem.eq(m).addClass("active");
                colorItem.eq(m).find(".smaller").css("background", that.config.bgColor);
            }
        }
        //设置选中的背景图片
        var imgItem = $('.imgItem');
        for (var j = 0; j < imgItem.size(); j++) {
            if (imgItem.eq(j).attr("data-id") == that.config.themeId) {
                $('.items').removeClass("active");
                imgItem.eq(j).addClass("active");
                $('.colorCon .colorItem').find("smaller").css("background", "#fff");
            }
        }
    },
    /*-----------------选择颜色或图片后的显示--------------------*/
    selectColor: function () {
        var that = this;
        var items = $('.colorShadow  .items'),
            smaller = $('.bigger .smaller');
        items.on("tap",function (event) {
            for (var i = 0; i < items.size(); i++) {
                items.eq(i).removeClass("active");
            }
            for (var j = 0; j < smaller.size(); j++) {
                smaller.eq(j).css("background", "#fff");
            }
            $(this).addClass("active");
            if ($(this).attr("class") == "colorItem items active") {//若点击的是颜色
                that.config.bgColor = $(this).attr("data-colors");
                that.config.themeId = "";
                $(this).find(".smaller").css("background", that.config.bgColor);
                //设置显示页面的颜色显示
                $('.colorShow').css("background", that.config.bgColor);
                $('.colorText').html(that.config.map[that.config.bgColor]);
            } else {
                that.config.bgColor = "";
                that.config.themeId = $(this).attr("data-id");
                that.config.themeColor = $(this).attr("data-color");
                that.config.themeName = $(this).attr("data-name");
                //设置显示页面的颜色显示
                $('.colorShow').css("background", that.config.themeColor);
                $('.colorText').html(that.config.themeName);
            }
            event.preventDefault();
            event.stopPropagation();
            setTimeout(function(){
                $(".colorShadow .container").animate({"top": "100%"}, 200, function () {
                    $(this).parent().hide();
                });
                $('.shadowBg').fadeOut();
            },200);
        });
    },
    share:function(name,date,address,eventId){
        var that = this;
        wx.wxShare(that.config.nickName + " 邀请您参加 「" + name + "」", "来自 #"+that.config.nickName+"的诚邀\r\n"+date+"\r\n"+address,
            that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + that.config.eventId),that.config.headImg);
    },
    bindEvent: function () {
        var that = this;
        $('.eventName').focus(function () {
            $('.topTips').slideUp(800);
        });

        /*-------------点击开始时间后面的展开按钮---------*/
        $('.timeIconCon').on("tap",function () {
            if ($(".timeIcon").attr("class") == "timeIcon active") {
                $(".timeIcon").removeClass("active");
                $('.endTime').animate({'height': '0px','padding-bottom':'0px'}, 300);
                $('.timeText').animate({"width": "0px"}, 300);
                $('#endTime').css("display", "none");
            } else {
                $(".timeIcon").addClass("active");
                $('.endTime').animate({'height': '30px','padding-bottom':'15px'}, 300);
                $('.timeText').animate({"width": "33px"}, 300);
                $('#endTime').css("display", "block");
            }
        })
        /*-----------展开顶部的快捷标签-------------*/
        $('.showAll').on("tap",function () {
            if ($('.showAll span').attr("class") == "active") {
                $('.showAll span').removeClass("active");
                $('.tipsCon').animate({"height": "94px"}, 300);
            } else {
                $('.showAll span').addClass("active");
                $('.tipsCon').animate({"height": "auto"}, 300);
            }
        });

        /*--------------点击地址后的按钮，删除地址-------------*/
        $('.deleteAddress').on("tap",function(event){
            $('.siteName').addClass("ccc").html("添加地点");
            $('.siteAddress').html("");
            that.mapConfig.locaName = "";
            that.mapConfig.locaAddress = "";
            that.mapConfig.latitude = 0;
            that.mapConfig.longitude = 0;
            $(this).css("display","none");
            event.stopPropagation();
            //$('.weather').css("display","none");
            //删除地图后，显示当时当地的天气
            $('.weather').css("display","-webkit-box");
            var startDate = $('.startCon').attr("id");
            Ajax.getWeather(Dom.getDate(startDate),Dom.getHourMinute(startDate));
        });

        $('.listCon').on('tap', '.addressItem', function (event) {
            var jw = $(this).attr('data-jw');
            that.mapConfig.latitude = jw.split(",")[1];
            that.mapConfig.longitude = jw.split(",")[0];
            that.mapConfig.locaName = $(this).find(".name").html();
            that.mapConfig.locaAddress = $(this).find(".address").html();
            that.mapConfig.moveendPoint = new AMap.LngLat(that.mapConfig.longitude, that.mapConfig.latitude);
            $(".siteName").removeClass("ccc").html(that.mapConfig.locaName);
            $('.siteAddress').html(that.mapConfig.locaAddress);
            $('.deleteAddress').css("display","block");//显示删除地址按钮
            //todo 显示选择地点的天气
            var startTime = $('.startCon').attr("id");
            if(!Dom.smallerDate(startTime)){
                $('.weather').css("display","-webkit-box");
                Ajax.getLocalWeather(Dom.getDate(startTime),Dom.getHourMinute(startTime),that.mapConfig.latitude,that.mapConfig.longitude);
            }else{
                $('.weather').css("display","none");
            }
            event.preventDefault();
            event.stopPropagation();
            setTimeout(function(){
                $(".mapShadow .container").animate({"top": "100%"}, 200, function () {
                    $(this).parent().hide();
                });
                $('.shadowBg').fadeOut();
            },500);
        });

        /*---------------点击分享弹层中的按钮-----------------*/
        $('.shareImgClose').on("touchend",function (event) {
            $('#loadingToast').fadeIn();//显示loading
            event.preventDefault();
            $.get(
                that.config.urlArr[0]+"/share/seePic",
                {
                    "picUrl": that.config.shareImg
                },
                function (data) {
                    if (data.code == 0) {//请求成功
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('.shareShadow').fadeOut();
                        WeixinJSBridge.call("closeWindow");
                    }
                }
            )
        });

        /*----------弹层----------*/
        that.mapinput();
        that.mapShadow($('.site'), $('.mapShadow'), $('.mapShadow .container'));
        that.shadow($('.colors'), $('.colorShadow'), $('.colorShadow .container'));
        that.shadow($('.remark'), $('.remarkShadow'), $('.remarkShadow .container'));
        /*----------备注弹层中的点击事件-------------*/
        $('.remarkShadow .cancel').on("touchend",function (event) {
            $('.remarkShadow .container').animate({"top": "100%"}, 200, function () {
                $('.remarkShadow').hide();
            });
            var remarkTexts = $('.remarkCon .remarkText').html();//若用户已设置备注，点击取消，则备注内容恢复成原内容
            if(remarkTexts != "添加备注"){
                $('.remarkShadow .textCon #remarkText').val(remarkTexts.replace(/<br>/g,"\n"));
            }
            $('.shadowBg').fadeOut();
            if (that.config.eventId) {
                $('#form').empty();
                var inputImg = "";
                for(var i=0;i<$('.remarkImgs img').length;i++){
                     inputImg += '<div class="img_upload_box">'+
                                '<input type="file" class="img_upload_btn hide" name="photo" disabled="disabled" accept="image/*"><img src="'+$('.remarkImgs img').eq(i).attr('src')+'" class="img_upload_result">'+
                                $('.delUpImgSrc').html()+
                                '</div>';
                }
                if($('.remarkImgs img').length < 9){
                    inputImg += '<div class="img_upload_box new_box"><input type="file" class="img_upload_btn" name="photo" accept="image/*"><a href="javascript:;">+</a></div>';
                }
                $('#form').prepend(inputImg);
            }
            event.preventDefault();
        });
        $('.remarkShadow .finished').on("touchend",function (event) {
            //$("#form").find(".new_box").remove();
            $('.remarkImgs').empty();
            that.config.remarkImgs = "";
            that.imgConfig.count = 0;
            var imgcount = 0;
            for(var i=0;i<$("#form").children().length;i++){
                if($($("#form").children()[0]).has('img').length != 0){
                    var fileData = new FormData();
                    fileData.append("photo",$('.img_upload_btn').eq(i).prop('files')[0]);
                    // console.log("this is a filedata");
                    // console.log(fileData);
                    var imgurl = $('.img_upload_result').eq(i).attr("src");
                    if(imgurl != undefined){
                        var str = '<img src="'+$('.img_upload_result').eq(i).attr("src")+'">';
                        $('.remarkImgs').append(str);
                    }
                    if(imgurl != undefined && imgurl.indexOf('base64,') == -1 ){
                        if(that.config.remarkImgs == ""){
                            that.config.remarkImgs = $('.img_upload_result').eq(i).attr("src");
                       }else{
                            that.config.remarkImgs = that.config.remarkImgs + "," + $('.img_upload_result').eq(i).attr("src");
                       }
                        
                    }else if(imgurl != undefined && imgurl.indexOf('base64,') > -1 ){
                        $('#loadingToast').fadeIn();
                        that.imgConfig.count ++;
                        $.ajax({
                           type: "post",
                           url: that.config.urlArr[0]+"/file/upload",
                           data: fileData,
                           dataType: "json",
                           cache: false,
                           processData: false,
                           contentType: false,
                           //async: false,
                           success: function (data) {
                               console.log(data);
                               $('.img_upload_result').eq(i).attr("src", data.data);
                               if(that.config.remarkImgs == ""){
                                    that.config.remarkImgs = data.data;
                               }else{
                                    that.config.remarkImgs = that.config.remarkImgs + "," + data.data;
                               }
                               imgcount++;
                               if(imgcount == that.imgConfig.count){
                                    $('#loadingToast').fadeOut();
                                    //上传未成功则停留在本页面。
                                    // console.log('上传完毕'+that.config.remarkImgs);
                                    that.config.remarkText = $('#remarkText').val().replace(/\n/g,"<br>");
                                    $('.remarkCon .remarkText').removeClass("ccc").html(that.config.remarkText);
                                    $('#remarkText').attr("autofocus");
                                    $('.remarkShadow .container').animate({"top": "100%"}, 200, function () {
                                        $('.remarkShadow').hide();
                                    });
                                    $('.shadowBg').fadeOut();
                               }
                           },
                            error: function() {
                                $('#loadingToast').fadeOut();
                                $('#dialog2 .weui-dialog__bd').html("有未上传完成的图片，请检查网络环境~");
                                $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                                    $('#dialog2').fadeOut();
                                });
                            }
                        });
                    }
                    
                }
                
            }

            if(that.imgConfig.count ==0){
                // console.log('未上传'+that.config.remarkImgs);
                that.config.remarkText = $('#remarkText').val().replace(/\n/g,"<br>");
                //console.log(that.config.remarkText);
                $('.remarkCon .remarkText').removeClass("ccc").html(that.config.remarkText);
                $('#remarkText').attr("autofocus");
                $('.remarkShadow .container').animate({"top": "100%"}, 200, function () {
                    $('.remarkShadow').hide();
                });
                $('.shadowBg').fadeOut();
            }
            
            event.preventDefault();
        });
        /*------------点击分享--------------*/
        $('.share').on("tap",function (event) {
            $('#loadingToast').fadeIn();//显示loading
            var name = $('#eventTitle').val().replace(/\s+/, ""),
                startTime = $('.startCon').attr("id"),
                endTime = $('.endCon').attr("id"),
                repeatType = that.config.repeatSelect.value,
                tipType = that.config.remindSelect.value,
                tipTime = "";
            if (tipType == 3) {
                tipTime = $('.remindTime').attr("id");
            }
            if (that.config.eventId) {
                if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                    $('#loadingToast').fadeOut();//隐藏loading
                    // 提醒用户设置名称
                    $('.titleNone').html("缺少事件名称");
                    $('.titleNone').animate({"height":"36px"},300);
                    setTimeout(function () {
                        $('.titleNone').animate({"height":"0px"},300);
                    }, 500);
                }else if(name.length >=30){
                    $('#loadingToast').fadeOut();
                    $('.titleNone').html("事件名称不能超过30个字");
                    $('.titleNone').animate({"height":"36px"},300);
                    setTimeout(function () {
                        $('.titleNone').animate({"height":"0px"},300);
                    }, 1000);
                }  else if(that.config.remarkText.length >=1000) {//备注内容不能超过1000字
                    $('#loadingToast').fadeOut();
                    $('.titleNone').html("备注内容不能超过1000个字");
                    $('.titleNone').animate({"height":"36px"},300);
                    setTimeout(function () {
                        $('.titleNone').animate({"height":"0px"},300);
                    }, 1000);
                }else  {
                    that.eventModify2(that.config.eventId, name, that.config.tagId, startTime, endTime, tipType, tipTime, repeatType,  that.mapConfig.locaName, that.mapConfig.locaAddress ,that.mapConfig.longitude, that.mapConfig.latitude, that.config.remarkText, that.config.remarkImgs, that.config.bgColor, that.config.themeId);
                }
            } else {
                if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                    $('#loadingToast').fadeOut();//隐藏loading
                    // 醒用户设置名称
                    $('.titleNone').html("缺少事件名称");
                    $('.titleNone').animate({"height":"36px"},300);
                    setTimeout(function () {
                        $('.titleNone').animate({"height":"0px"},300);
                    }, 1000);
                }else if(name.length >=30){
                    $('#loadingToast').fadeOut();
                    $('.titleNone').html("事件名称不能超过30个字");
                    $('.titleNone').animate({"height":"36px"},300);
                    setTimeout(function () {
                        $('.titleNone').animate({"height":"0px"},300);
                    }, 1000);
                } else if(that.config.remarkText.length >=1000) {//备注内容不能超过1000字
                    $('#loadingToast').fadeOut();
                    $('.titleNone').html("备注内容不能超过1000个字");
                    $('.titleNone').animate({"height":"36px"},300);
                    setTimeout(function () {
                        $('.titleNone').animate({"height":"0px"},300);
                    }, 1000);
                }else {
                    that.eventAdd2(name, 1, that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, that.mapConfig.locaName, that.mapConfig.locaAddress, that.mapConfig.longitude, that.mapConfig.latitude, that.config.remarkText, that.config.remarkImgs, that.config.bgColor, that.config.themeId);
                }
            }

        });

        /*------------点击保存--------------*/
        $('.saveBtn').on("tap",function () {
            //alert(that.config.bgColor);
            //alert(that.config.themeId);
            $('#loadingToast').fadeIn();//显示loading
            var name = $('#eventTitle').val().replace(/\s+/, ""),
                startTime = $('.startCon').attr("id"),
                endTime = $('.endCon').attr("id"),
                repeatType = that.config.repeatSelect.value,
                tipType = that.config.remindSelect.value,
                tipTime = "";
            if (tipType == 3) {
                tipTime = $('.remindTime').attr("id");
            }
            if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                $('#loadingToast').fadeOut();
                // 提示用户设置名称
                $('.titleNone').html("缺少事件名称");
                $('.titleNone').animate({"height":"36px"},300);
                setTimeout(function () {
                    $('.titleNone').animate({"height":"0px"},300);
                }, 1000);
            } else if (name.length >=30){
                $('#loadingToast').fadeOut();
                $('.titleNone').html("事件名称不能超过30个字");
                $('.titleNone').animate({"height":"36px"},300);
                setTimeout(function () {
                    $('.titleNone').animate({"height":"0px"},300);
                }, 1000);
            } else if(that.config.remarkText.length >=1000) {
                $('#loadingToast').fadeOut();
                $('.titleNone').html("备注内容不能超过1000个字");
                $('.titleNone').animate({"height":"36px"},300);
                setTimeout(function () {
                    $('.titleNone').animate({"height":"0px"},300);
                }, 1000);
            } else {
                if (that.config.eventId) {//若事件已保存，则调用修改事件
                    that.eventModify(that.config.eventId, name, that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, that.mapConfig.locaName, that.mapConfig.locaAddress, that.mapConfig.longitude, that.mapConfig.latitude, that.config.remarkText, that.config.remarkImgs, that.config.bgColor, that.config.themeId);
                } else {
                    that.eventAdd(name, 1, that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, that.mapConfig.locaName, that.mapConfig.locaAddress, that.mapConfig.longitude, that.mapConfig.latitude, that.config.remarkText, that.config.remarkImgs, that.config.bgColor, that.config.themeId);
                }
            }

        });
        /*---------------点击删除---------------*/
        $('.delete').on("tap",function () {
            $('#dialog1 .weui-dialog__bd').html("确定要删除该事件吗？");
            $('#dialog1').fadeIn();
            $('.confirm').on('touchend', function (event) {//点击确定按钮
                event.preventDefault();
                event.stopPropagation();
                setTimeout(function(){
                    $('#dialog1').fadeOut();
                },300);
                $('#loadingToast').fadeIn();//显示loading
                $.get(that.config.urlArr[0]+"/event/del", {"eventId": that.config.eventId}, function (data) {
                    if (data.code == 0) {//删除成功
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').fadeIn();
                        setTimeout(function () {
                            $('#toast').fadeOut();
                            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newSchedule.html");
                        }, 1500);
                    } else {//删除失败弹出提示框
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui-dialog__bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                })
            });
            $('.default').on('touchend', function (event) {//点击取消按钮
                event.preventDefault();
                event.stopPropagation();
                setTimeout(function(){
                    $('#dialog1').fadeOut();
                },300);
            });
        });

        /*上传图片*/
        $("#form").on("change", ".img_upload_btn", function (e) {
            that.btnDom = $(e.target);
            that.boxDom = $(e.target).parent();
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var imgSrc = reader.result;
                var html = "<img src='" + imgSrc + "' class='img_upload_result' />";
                html += $('.delUpImgSrc').html();
                that.boxDom.append(html).removeClass("new_box").find("a").remove();
                $(e.target).attr("disabled", "disabled"); 
                $(e.target).addClass('hide');
                if (that.checkBoxNum() && $(".new_box").length < 1) {
                    var newUploadBox = '<div class="img_upload_box new_box"><input type="file" class="img_upload_btn" name="photo" accept="image/*"><a href="javascript:;">+</a></div>';
                    $(".img_upload_box").last().after(newUploadBox);
                }
            }, false);
            reader.readAsDataURL(file);
        });

        $("#form").on("touchend", ".delUpImg", function (e) {
             $(e.target).parent().remove();
            if (that.checkBoxNum() && $(".new_box").length < 1) {
                var newUploadBox = '<div class="img_upload_box new_box"><input type="file" class="img_upload_btn" accept="image/*" name="photo_' + (that.btnIndex + 1) + '"><a href="javascript:;">+</a></div>';
                $(".img_upload_box").last().after(newUploadBox);
            }
            event.preventDefault();
        });

        $("#form").on("tap", ".img_upload_result", function (e) {
            var imgArr = [];
            for(var i=0;i<$(".img_upload_result").length;i++){
                imgArr.push($('.img_upload_result').eq(i).attr("src"));
            }
            wx.getWx().previewImage({
                current: this.src, // 当前显示图片的http链接
                urls: imgArr // 需要预览的图片http链接列表
            });
        });
    },

    /*----------初始化地图----------------------*/
    initMap: function () {
        var that = this;
        that.mapConfig.page = 1;
        that.mapConfig.map = new AMap.Map("mapCon", {
            resizeEnable: true,
            dragEnable: true,
            keyboardEnable: false,
            doubleClickZoom: true,
            zoom: 15
        });
        that.mapConfig.moveendPoint = that.mapConfig.map.getCenter();

        that.mapConfig.map.on("moveend", function (e) {//地图平移结束后触发。如地图有拖拽缓动效果，则在缓动结束后触发
            that.mapMarkerJump();
            that.mapConfig.moveendPoint = that.mapConfig.map.getCenter();
            that.searchNearByResult();
        });
    },

    initDropLoad: function () {
        var listHeight = parseInt($(document.body).height() * 0.9 - 300) + "px";
        $(".addressCon").css("height", listHeight);
        var that = this;
        /*--------------------------上拉刷新、下拉刷新------------------------*/
        $('.addressCon').dropload({
            scrollArea: window,
            domUp: {
                domClass: 'dropload-up',
                domRefresh: '<div class="dropload-refresh">↓下拉加载更多</div>',
                domUpdate: '<div class="dropload-update">↑释放加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            },
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">暂无数据</div>'
            },
            autoLoad: false,//关闭自动加载
            loadUpFn: function (me) {
                that.mapConfig.page = 1;
                that.searchNearByResult(me);
            },
            loadDownFn: function (me) {
                that.mapConfig.page++;
                that.searchNearByResult(me);
            },
            threshold: 20//提前加载距离
        });
    },

    searchNearByResult: function (me) {
        var that = this;
        $.ajax({
            type: "get",
            url: "http://restapi.amap.com/v3/place/around",
            data: {
                key: "731b7210e04aaa581c04576a4fc3ae5a",
                location: that.mapConfig.moveendPoint.getLng() + "," + that.mapConfig.moveendPoint.getLat(),
                // types: "地铁|大学|高中|商场|景点|电影院",
                radius: 800,
                page: that.mapConfig.page
            },
            dataType: "json",
            success: function (data) {
                // console.log(data)
                if (data.pois.length == 0 && me) {
                    me.lock();
                    me.noData();
                }

                if(data.pois.length>0){
                    that.mapConfig.cityName = data.pois[0].cityname;
                    // console.log(that.mapConfig.cityName)
                }

                if (that.mapConfig.page == 1) {
                    that.mapConfig.pois.length = 0;
                }
                that.mapConfig.pois = that.mapConfig.pois.concat(data.pois);
                $('.listCon').html("");
                var html = "", addressList = "";
                for (var i = 0; i < that.mapConfig.pois.length; i++) {
                    html += that.mapConfig.template.replace(/{{name}}/g, that.mapConfig.pois[i].name).replace(/{{address}}/g, that.mapConfig.pois[i].address).replace(/{{jw}}/g, that.mapConfig.pois[i].location);
                }
                $('.listCon').append(html);
                
                if (me) {
                    console.log("me");
                    me.resetload();
                }
            },
            error: function (xhr, type) {
                if (me) {
                    me.resetload();
                }
            }
        });
    },

    /*滑动地图后图标跳动*/
    mapMarkerJump: function () {
        $('.imgCon').addClass('active');
        setTimeout(function () {
            $('.imgCon').removeClass('active');
        }, 600);
    },

    /**地图移动指定位置*/
    mapMove: function () {
        console.log("mapMove");
        var that = this;
        console.log(that.mapConfig.moveendPoint.getLng() + "");
        that.mapConfig.map.panTo([that.mapConfig.moveendPoint.getLng(), that.mapConfig.moveendPoint.getLat()]);
        that.mapConfig.page = 1;
        that.searchNearByResult();
    },

    checkBoxNum: function () {
        if ($(".img_upload_box").length < 9) {
            return true;
        } else {
            return false;
        }
    },
    //添加事件页面数据提交
    eventAdd: function (name, eventType, tagId, startTime, endTime, tipType, tipTime, repeatType, location, address, longitude, latitude, remark, remarkImgs, bgColor, themeId) {
        var that = this;
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/event/add",
            data: {
                "name": name,
                "eventType": eventType,
                "tagId": tagId,
                "startTime": startTime,
                "endTime": endTime,
                "tipType": tipType,
                "tipTime": tipTime,
                "repeatType": repeatType,
                "location": location,
                "address":address,
                "longitude": longitude,
                "latitude": latitude,
                "remark": remark,
                "remarkImgs": remarkImgs,
                "bgColor": bgColor,
                "theme.themeId": themeId
            },
            dataType: "json",
            success: function (data) {
                try{
                    //alert(data);
                    if (data.code == 0) {//提交成功
                        that.config.eventId = data.data;
                        $('#loadingToast').fadeOut();
                        window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + that.config.eventId);
                    } else {//提交失败提醒错误信息
                        $('#loadingToast').fadeOut();
                        var error = data.msg;
                        $('#dialog2 .weui-dialog__bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            event.stopPropagation();
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }catch(e){
                    $('#loadingToast').fadeOut();
                    alert("提交失败，请稍后重试"+e);
                }
            }
        })
    },
    eventAdd2: function (name, eventType, tagId, startTime, endTime, tipType, tipTime, repeatType, location, address, longitude, latitude, remark, remarkImgs, bgColor, themeId) {
        var that = this;
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/event/add",
            data: {
                "name": name,
                "eventType": eventType,
                "tagId": tagId,
                "startTime": startTime,
                "endTime": endTime,
                "tipType": tipType,
                "tipTime": tipTime,
                "repeatType": repeatType,
                "location": location,
                "address":address,
                "longitude": longitude,
                "latitude": latitude,
                "remark": remark,
                "remarkImgs": remarkImgs,
                "bgColor": bgColor,
                "theme.themeId": themeId
            },
            dataType: "json",
            success: function (data) {
                try{
                    //console.log(data);
                    if (data.code == 0) {//提交成功
                        that.config.eventId = data.data;
                        that.share(name,Dom.tranDate(startTime),address,that.config.eventId);
                        that.getShareImg();
                        $('#loadingToast').fadeOut();
                        //todo 弹出蒙层
                        that.shareShadow(); //显示分享提示弹出层，点击后隐藏
                    } else {//提交失败提醒错误信息
                        $('#loadingToast').fadeOut();
                        var error = data.msg;
                        $('#dialog2 .weui-dialog__bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            event.stopPropagation();
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }catch (e){
                    $('#loadingToast').fadeOut();
                    alert("提交失败，请稍后重试"+e);
                }

            }
        })
    },
    //修改事件页面数据提交
    eventModify: function(eventId,name,tagId, startTime, endTime, tipType, tipTime, repeatType, location,address,longitude,latitude, remark,remarkImgs,bgColor,themeId) {
        var that = this;
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/event/modify",
            data: {
                "eventId":eventId,
                "name":name,
                "tagId":tagId,
                "startTime":startTime,
                "endTime":endTime,
                "tipType":tipType,
                "tipTime":tipTime,
                "repeatType":repeatType,
                "location":location,
                "address":address,
                "longitude":longitude,
                "latitude":latitude,
                "remark":remark,
                "remarkImgs":remarkImgs,
                "bgColor":bgColor,
                "theme.themeId":themeId
            },
            dataType: "json",
            success: function (data) {
                try{
                    if (data.code == 0) {
                        $('#loadingToast').fadeOut();
                        window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId="+that.config.eventId);
                    } else {//修改失败弹出提示框
                        $('#loadingToast').fadeOut();
                        var error = data.msg;
                        $('#dialog2 .weui_dialog_bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            event.stopPropagation();
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }catch(e){
                    $('#loadingToast').fadeOut();
                    alert("提交失败，请稍后重试"+e);
                }
            }
        })
    },
    eventModify2: function(eventId,name,tagId, startTime, endTime, tipType, tipTime, repeatType, location,address,longitude,latitude, remark,remarkImgs,bgColor,themeId) {
        var that = this;
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/event/modify",
            data: {
                "eventId":eventId,
                "name":name,
                "tagId":tagId,
                "startTime":startTime,
                "endTime":endTime,
                "tipType":tipType,
                "tipTime":tipTime,
                "repeatType":repeatType,
                "location":location,
                "address":address,
                "longitude":longitude,
                "latitude":latitude,
                "remark":remark,
                "remarkImgs":remarkImgs,
                "bgColor":bgColor,
                "theme.themeId":themeId
            },
            dataType: "json",
            success: function (data) {
                try{
                    if (data.code == 0) {
                        $('#loadingToast').fadeOut();
                        that.shareShadow(); //显示分享提示弹出层，点击后隐藏
                        that.getShareImg();
                        that.share(name,Dom.tranDate(startTime),address,that.config.eventId);
                    } else {//修改失败弹出提示框
                        $('#loadingToast').fadeOut();
                        var error = data.msg;
                        $('#dialog2 .weui_dialog_bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            event.stopPropagation();
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }catch(e){
                    $('#loadingToast').fadeOut();
                    alert("提交失败，请稍后重试"+e);
                }
            }
        })
    },
    //首页获取用户信息
    getUserInformation: function () {
        // var that = this;
        // $.ajax({
        //     type: "get",
        //     url: that.config.urlArr[0]+"/user/detail",
        //     dataType: "json",
        //     async: false,
        //     success: function (data) {
        //         if (data.code == 0) {
        //             that.config.nickName = data.data.nickName;
        //             that.config.headImg = data.data.headImgUrl;
        //         }
        //     }
        // });
    }
}

fuc.init();
