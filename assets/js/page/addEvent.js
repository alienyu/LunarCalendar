require("../../css/page/addEvent.less");
var pageLoad = require("../common/pageLoad.js");
var touchSlider = require("../vendor/ImproveMobile/touchSlider.js");
//require("http://api.map.baidu.com/api?v=2.0&ak=Nv4xifhhDjKpB1DP6uDwd3cNbHeH2PaV");
require("../vendor/ImproveMobile/zeptoSlider.js");
require("../common/BMap.js");
var Dom = require("../common/dom.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var wx = require("../vendor/weChat/wxInit.js");
var Ajax = require("../common/ajax.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");
var autoTextArea = require("../vendor/ImproveMobile/autoTextArea.js");

var fuc = {
    config: {
        site: document.getElementById("site"),
        remark: document.getElementById("remarks"),
        eventTitle: document.getElementById("eventTitle"),
        eventId: "",
        nickName: "",
        tagName: "",
        time: "",
        timeArr: ""
},
    init: function() {
        pageLoad({backgroundColor: "#66cccc"});
        this.config.time = this.getRequest("date");
        this.config.timeArr = this.transTime(this.config.time);
        this.rem();
        this.hackTextArea();
        this.renderPage();
        this.addRemind();
        this.bindEvent();
    },
    rem: function() {
        fastClick.attach(document.body);
        (function($,undefined){"use strict";var pluginName='scojs_message';$[pluginName]=function(message,type){clearTimeout($[pluginName].timeout);var $selector=$('#'+$[pluginName].options.id);if(!$selector.length){$selector=$('<div/>',{id:$[pluginName].options.id}).appendTo($[pluginName].options.appendTo)}$selector.html(message);if(type===undefined||type==$[pluginName].TYPE_ERROR){$selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass)}else if(type==$[pluginName].TYPE_OK){$selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass)}$selector.slideDown('fast',function(){$[pluginName].timeout=setTimeout(function(){$selector.slideUp('fast')},$[pluginName].options.delay)})};$.extend($[pluginName],{options:{id:'page_message',okClass:'page_mess_ok',errClass:'page_mess_error',delay:500,appendTo:'body'},TYPE_ERROR:1,TYPE_OK:2})})($);
    },
    selectTimes: function(obj1, obj2) {
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
                Dom.transDate(theDate,true);
            },
            onSet: function (event, inst) {
                var selectedDate = inst.getVal();//获取选择时间的标准形式
                var selectedTime = inst._tempValue;//获取选择时间 yyyy/mm/dd  hh:ii
                var selectedDateArr = inst._wheelArray;//获取选择时间的数组 [yy,mm,dd,hh,ii]
                var selectedTimeArr = selectedTime.split(" ");
                var theWeek = Dom.transWeek(selectedDate);
                $(obj2).html(selectedDateArr[0] + "年" + that.tf(parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                var theId = selectedDateArr[0] + "-" + that.tf(parseInt(selectedDateArr[1]) + 1) + "-" + that.tf(selectedDateArr[2]) + " " + selectedTimeArr[1] + ":00";
                $(obj2).attr("id", theId);
                if(obj2 =='.startTime'){//若修改的是开始时间的日期，则指定提醒时间日期等于开始时间，结束时间比开始时间大10分钟
                    $('.remindTime').html(selectedDateArr[0] + "年" + that.tf(parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    $(".remindTime").attr("id", theId);
                    var endMinute = selectedDateArr[4]+10,endHour = selectedDateArr[3];
                    if(endMinute>=60){
                        endHour = endHour+1;
                        if(endMinute-60>=10){
                            endMinute = endMinute-60;
                        }else{
                            endMinute = that.tf(endMinute-60);
                        }
                        if(endHour==24){
                            endHour = 23;
                            endMinute = selectedDateArr[4];
                        }
                    }
                    $('.endTime').html(selectedDateArr[0] + "年" + that.tf(parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " +endHour+":"+endMinute);
                    var theEndId = selectedDateArr[0] + "-" + that.tf(parseInt(selectedDateArr[1]) + 1) + "-" + that.tf(selectedDateArr[2]) + " " + endHour+":"+endMinute + ":00";
                    $('.endTime').attr("id",theEndId);
                    that.selectTimes('#endTime', '.endTime').setVal(new Date(that.setInitTime($('.endTime'))));//重新设置结束时间的初始值
                    that.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));//重新设置提醒时间的初始值
                }
            },
            onChange: function (event, inst) {
                var changeDate = inst._tempValue;
                Dom.transDate(changeDate,true);
            }
        });
        return selb;
    },
    hackTextArea: function() {
        autoTextArea(this.config.site);// 调用
        autoTextArea(this.config.remark);
        autoTextArea(this.config.eventTitle);
    },
    shareShadow: function() {
        var shareShadow = $('.shareShadow');
        shareShadow.css("display","block");//显示分享提示层
        shareShadow.click(function(){
            $(this).fadeOut();
        });
        var share = document.getElementById('shareShadow');
        share.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },
    //url处理
    getRequest: function(name) {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                //就是这句的问题
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
                //之前用了unescape()
                //才会出现乱码
            }
        }
        return theRequest[name];
    },
    /*----------------------若日期中的数组小于10，则在前面加0-------------------*/
    tf: function(time) {
        if(time<10){
            time = "0"+time;
        }
        return time;
    },
    /*-------------------------------转换日期格式，开始时间加10分钟，结束时间加20分钟-------------------------------------*/
    transTime: function(time) {
        var date = new Date();
        var timeArr = time.split('-');
        var theTime = time.replace(/\-/g, "/");
        var theDate = new Date(theTime);
        var theWeek = Dom.transWeek(theDate);
        var startHour = date.getHours(),startMinute = date.getMinutes()+10;
        var endHour = date.getHours(),endMinute = date.getMinutes()+20;
        if(startMinute>=60){
            startHour = startHour+1;
            if(startMinute-60>=10){
                startMinute = startMinute-60;
            }else{
                startMinute = "0"+(startMinute-60);
            }
            if(startHour==24){
                startHour = 23;
                startMinute = date.getMinutes();
            }
        }
        if(endMinute>=60){
            endHour = endHour+1;
            if(endMinute-60>=10){
                endMinute = endMinute-60;
            }else{
                endMinute = "0"+(endMinute-60);
            }
            if(endHour==24){
                endHour = 23;
                endMinute = date.getMinutes();
            }
        }
        var startId = time + " " + startHour + ":" + startMinute + ":00";
        var endId = time + " " + endHour + ":" + endMinute + ":00";
        //给开始时间，结束时间，提醒时间设置ID，提交数据时只需要提交id内容即可
        $('.startTime').attr("id", startId);
        $('.endTime').attr("id", endId);
        $('.remindTime').attr("id", startId);
        var startTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + startHour + ":" + startMinute,
            endTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + endHour + ":" + endMinute;
        return [startTime,endTime];
    },
    /*---------------------修改开始时间、结束时间、指定提醒时间样式，为其设置时间选择器的初始值---------------------*/
    setInitTime: function(obj) {
        var time = obj.attr("id");
        var date = time.split(" ");
        var theDate = date[0].replace(/\-/g,"/"),
            theTime = date[1].split(":");
        return theDate+" "+theTime[0]+":"+theTime[1];
    },
    hideTags: function() {
        var that = this;
        $('.tipsCon a').click(function (event) {
            $('.eventName').val($(this).html());
            that.config.tagName  = $(this).html();
            $('.tips').slideUp();
            event.preventDefault();
        });
    },
    getTags: function() {
        var that = this;
        var template = $('#tagListTemplate').html();
        var html = "";
        $.get("http://www.li-li.cn/llwx/tag/list",function(data){
//                console.log(data);
            if(data.code==0) {
                $('#loadingToast').fadeOut();//隐藏loading
                var list = data.data;
                for (var i = 0; i < list.length; i++) {
                    html += template.replace(/{{tagName}}/g, list[i].tagName);
                }
                $('.tipsCon').html("").append(html);
                that.hideTags();
            }else{//数据加载失败显示错误提示框
                $('#loadingToast').fadeOut();//隐藏loading
                var error = data.msg;
                $('#dialog2 .weui_dialog_bd').html(error);
                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                    $('#dialog2').off('click').hide();
                });
            }
        })
    },
    renderPage: function() {
        var that = this;
        wx.wxConfig(1);
        /*----------------------底部按钮动态显示------------------------*/
        setTimeout(function(){
            $('.bottom').animate({"bottom":"0px"},500);
        },500);
        this.getTags();
        /*---------------------开始时间、结束时间、指定提醒时间的时间显示---------------------*/
        $('.startTime').html(that.config.timeArr[0]);
        $('.endTime').html(that.config.timeArr[1]);
        $('.remindTime').html(that.config.timeArr[0]);
        /*---------------------------------开始时间、结束时间、指定提醒时间三个地方的日期选择功能---------------------------------*/
        this.selectTimes('#startTime', '.startTime').setVal(new Date(that.setInitTime($('.startTime'))));
        this.selectTimes('#endTime', '.endTime').setVal(new Date(that.setInitTime($('.endTime'))));
        this.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));
    },
    /*----------------------------------------提醒、重复下方的滑动选择效果-------------------------------*/
    addRemind: function() {
        var active = 0,
            re = document.getElementById('addRemind').getElementsByTagName('span');
        for (var i = 0; i < re.length; i++) {
            (function () {
                var j = i;
                re[i].onclick = function () {
                    remind.slide(j);
                    return false;
                }
            })();
        }
        var remind = new touchSlider('addRemind', {
            duration: 1000,
            direction: 0,
            start: 2,
            align: 'center',
            mouse: true,
            mousewheel: false,
            arrowkey: false,
            fullsize: false,
            autoplay: false
        });
        remind.on('before', function (m, n) {
            re[m].className = '';
            re[n].className = 'active';
            if (n == 3) {
                $('.remind_time').slideDown();
            } else {
                $('.remind_time').css({'display': 'none'});
            }
        });
        var repe = document.getElementById('addRepetition').getElementsByTagName('span');
        for (var k = 0; k < repe.length; k++) {
            (function () {
                var l = k;
                repe[l].onclick = function () {
                    repetition.slide(l);
                    return false;
                }
            })();
        }
        var repetition = new touchSlider('addRepetition', {
            duration: 1000,
            direction: 0,
            start: 0,
            align: 'center',
            mouse: true,
            mousewheel: false,
            arrowkey: false,
            fullsize: false,
            autoplay: false
        });
        repetition.on('before', function (m, n) {
            repe[m].className = '';
            repe[n].className = 'active';
        });
    },
    bindEvent: function() {
        var that = this;

        $('.eventName').focus(function () {
            $('.tips').slideUp(800);
        });

        /*-------------------------页面加载时，点击换一批时像后台请求事件标签------------------------*/

        $('.change').on("tap", function(){
            $('#loadingToast').show();
            that.getTags();
        });

        /*-----------------------------------显示隐藏部分---------------------------------------*/
        $('.othersShadow').on("tap", function () {
            $('.othersShadow').css({'display': 'none'});
            $('.othersCon').css({'height': 'auto'});
        });

        /*--------------------------------------------点击完成按钮，提交数据，提交成功后跳转至月历页面-----------------------------------------*/
        $('.finished').on("tap", function () {
            $('#loadingToast').show();//显示loading
            var name = $('.eventName').val().replace(/\s+/, ""),
                startTime = $('.startTime').attr('id'),
                endTime = $('.endTime').attr('id'),
                tipType = $('.remindCon .choice .active').index(),
                repeatType = $('.repetitionCon .choice .active').index(),
                remark = $('#remarks').val(),
                location = $('#site').val(),
                tipTime = "";
            if (tipType == 3) {
                tipTime = $('.remindTime').attr("id");
            }
            if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                $.scojs_message('缺少事件名称', $.scojs_message.TYPE_ERROR);
                $('#loadingToast').fadeOut();
            } else {
                if (that.config.eventId) {
                    var data = sessionStorage.getItem(that.config.eventId);//获得存储的事件信息
                    if (name == data[0] && that.config.tagName ==data[1] &&startTime == data[2] && endTime == data[3] && tipType == data[4] && repeatType == data[5] && remark == data[6] && location == data[7] && tipTime == data[8]) {//事件未修改
                        $('#loadingToast').fadeOut();
                        window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
                    } else {
                        $.post('http://www.li-li.cn/llwx/event/modify', {
                                "eventId": eventId,
                                "name": name,
                                "tags":tagName,
                                "startTime": startTime,
                                "endTime": endTime,
                                "tipType": tipType,
                                "repeatType": repeatType,
                                "location": location,
                                "remark": remark,
                            }, function (data) {
                                if (data.code == 0) {//修改成功弹出提示框
                                    $('#loadingToast').fadeOut();
                                    window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
                                } else {//修改失败弹出提示框
                                    $('#loadingToast').fadeOut();
                                    var error = data.msg;
                                    $('#dialog2 .weui_dialog_bd').html(error);
                                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                                        $('#dialog2').off('click').hide();
                                    });
                                }
                            }
                        )
                    }
                } else {
                    Ajax.eventAdd(name,that.config.tagName,startTime, endTime, tipType, tipTime, repeatType, location, remark);
                }
            }
        });
        /*-----------------------------------------------点击取消按钮，跳转至月历页面/上一页------------------------------------------*/
        $('.cancel').on("tap", function () {
//            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
            window.location.href = document.referrer;//返回上一个页面并刷新
        });

        /*------------------------点击分享------------------------*/
        $(".share").on("tap", function () {
            if (that.config.eventId) {
                //todo 弹出蒙层
                that.shareShadow(); //显示分享提示弹出层，点击后隐藏
            } else {
                var name = $('.eventName').val().replace(/\s+/, ""),
                    startTime = $('.startTime').attr('id'),
                    endTime = $('.endTime').attr('id'),
                    tipType = $('.remindCon .choice .active').index(),
                    repeatType = $('.repetitionCon .choice .active').index(),
                    remark = $('#remarks').val(),
                    location = $('#site').val(),
                    tipTime = "";
                if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
//                    $('.errorTips').css("display", "block");
                    $.scojs_message('缺少事件名称', $.scojs_message.TYPE_ERROR);
                }else {
                    $('#dialog1').show();
                    $('#dialog1 .confirm').on("tap", function () {//点击确定
                        Ajax.eventAdd2(name,that.config.tagName,startTime, endTime, tipType, tipTime, repeatType, location, remark);
                        Ajax.getUserInformation2();
                        wx.wxConfig(2, that.config.nickName + " 邀请您参加 「" + name+"」", $('.startTime').html(),
                            "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/showEvent.html?eventId=" + that.config.eventId));
                        sessionStorage.setItem(that.config.eventId, [name, that.config.tagName,startTime, endTime, tipType, repeatType, remark, location, tipTime]);
                        $('#dialog1').hide();
                        //todo 弹出蒙层
                        that.shareShadow(); //显示分享提示弹出层，点击后隐藏
                    });
                    $('.default').on("tap", function () {
                        $('#dialog1').hide();
                    });
                }
            }
        });
    }
}

fuc.init();