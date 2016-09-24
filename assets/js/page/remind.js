/**
 * Created by admin on 2016/9/22.
 */
require("../../css/page/activity.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
//require("../common/BMap.js");
var Dom = require("../common/dom.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var wx = require("../vendor/weChat/wxInit.js");
var Ajax = require("../common/ajax.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");
var autoTextArea = require("../vendor/ImproveMobile/autoTextArea.js");

var fuc = {
    config: {
        eventId: "",
        nickName: "",
        tagId: "",
        time: "",
        timeArr: "",
        repeatSelect: "",
    },
    init: function () {
        pageLoad({backgroundColor: "#66cccc"});
        this.config.time = this.ifTimeExist(Dom.getRequest("date"));
        this.config.timeArr = this.transTime(this.config.time);
        this.config.eventId = Dom.getRequest("eventId");
        this.config.repeatSelect = document.getElementById('select');
        this.rem();
        this.renderPage();
        this.getTags();
        this.bindEvent();
    },
    rem: function () {
        fastClick.attach(document.body);
        (function ($, undefined) {
            "use strict";
            var pluginName = 'scojs_message';
            $[pluginName] = function (message, type) {
                clearTimeout($[pluginName].timeout);
                var $selector = $('#' + $[pluginName].options.id);
                if (!$selector.length) {
                    $selector = $('<div/>', {id: $[pluginName].options.id}).appendTo($[pluginName].options.appendTo)
                }
                $selector.html(message);
                if (type === undefined || type == $[pluginName].TYPE_ERROR) {
                    $selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass)
                } else if (type == $[pluginName].TYPE_OK) {
                    $selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass)
                }
                $selector.slideDown('fast', function () {
                    $[pluginName].timeout = setTimeout(function () {
                        $selector.slideUp('fast')
                    }, $[pluginName].options.delay)
                })
            };
            $.extend($[pluginName], {
                options: {
                    id: 'page_message',
                    okClass: 'page_mess_ok',
                    errClass: 'page_mess_error',
                    delay: 500,
                    appendTo: 'body'
                }, TYPE_ERROR: 1, TYPE_OK: 2
            })
        })($);
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
                if (obj2 == '.startCon') {//若修改的是开始时间的日期，则指定提醒时间日期等于开始时间，结束时间比开始时间大10分钟
                    $('.endCon').html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    $('.endCon').attr("id", theId);
                    that.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));//重新设置结束时间的初始值
                }
            },
            onChange: function (event, inst) {
                var changeDate = inst._tempValue;
                Dom.transDate(changeDate, true);
            }
        });
        return selb;
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
        if (tamplateId) {
            $.get(
                "http://www.li-li.cn/llwx/template/detail",
                {
                    'tid': templateId
                },
                function (data) {
                    if (data.code == 0) {
                        var list = data.data;
                        if (list.color) {
                            $('.colorShow').css("background", list.color);
                            $('.colorText').html(that.config.map.list.color);
                        }
                    }
                }
            )
        }
    },
    hideTags: function () {
        var that = this;
        $('.tipsCon a').click(function (event) {
            $('.eventName').val($(this).html());
            that.config.tagId = $(this).attr("data-tag");//保存用户选择的标签id
            that.getTemplate();
            $('.tips').slideUp();
            event.preventDefault();
        });
    },
    getTags: function () {
        var that = this;
        var template = $('#tagListTemplate').html();
        var html = "";
        $.get("http://www.li-li.cn/llwx/tag/list", {"all": true}, function (data) {
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
                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                    $('#dialog2').off('click').hide();
                });
            }
        })
    },
    renderPage: function () {
        var that = this;
        wx.wxConfig(1);
        if (that.config.eventId) {
            that.getData();
        } else {
            /*---------------------开始时间、结束时间、指定提醒时间的时间显示---------------------*/
            $('.startCon').html(that.config.timeArr[0]);
            $('.endCon').html(that.config.timeArr[1]);
        }
        /*---------------------------------开始时间、结束时间、指定提醒时间三个地方的日期选择功能---------------------------------*/
        this.selectTimes('#startTime', '.startCon').setVal(new Date(that.setInitTime($('.startCon'))));
        this.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));
    },
    /*--------------页面内容初始化------------------*/
    getData: function () {
        var that = this;
        if (that.config.eventId) {//若用户点击事件详情页的编辑按钮进入此页面
            $('.delete').css("display", "block");//用户可删除事件
            $(".topTips").css("display", "none");//隐藏头部的快捷标签
            $.get(
                "http://www.li-li.cn/llwx/event/detail",
                {
                    "eventId": that.config.eventId
                },
                function (data) {
                    if (data.code == 0) {
                        var eventList = data.data;
                        $('.eventName').val(eventList.name);//标题内容
                        autoTextArea(document.getElementById("eventTitle"));
                        var theStartTime = Dom.tranDate(eventList.startTime),
                            theEndTime = Dom.tranDate(eventList.endTime),
                            repeatType = eventList.repeatType
                        $('.startCon').html(theStartTime).attr("id", eventList.startTime);
                        $('.endCon').html(theEndTime).attr("id", eventList.endTime);
                        /*------------设置重复类型----------------*/
                        var repeatOptions = that.config.repeatSelect.getElementByTagName("option");
                        for (var j = 0; j < repeatOptions.length; j++) {
                            repeatOptions[j].setAttribute("selected", false);
                        }
                        repeatOptions[repeatType].setAttribute("selected", true);
                    } else {

                    }
                }
            )
        }
    },
    bindEvent: function () {
        var that = this;
        $('.eventName').focus(function () {
            $('.topTips').slideUp(800);
        });
        /*------------点击地图，图标跳动------------*/
        $('.mapCon').click(function () {
            $('.imgCon').addClass('active');
            setTimeout(function () {
                $('.imgCon').removeClass('active');
            }, 600);
        })
        /*-------------点击开始时间后面的展开按钮---------*/
        $('.timeIconCon').click(function () {
            if ($(".timeIcon").attr("class") == "timeIcon active") {
                $(".timeIcon").removeClass("active");
                $('.endTime').animate({'height': '0px'}, 300);
                $('.timeText').animate({"width": "0px"}, 300);
            } else {
                $(".timeIcon").addClass("active");
                $('.endTime').animate({'height': '60px'}, 300);
                $('.timeText').animate({"width": "33px"}, 300);
            }
        })
        /*-----------展开顶部的快捷标签-------------*/
        $('.showAll').click(function () {
            if ($('.showAll span').attr("class") == "active") {
                $('.showAll span').removeClass("active");
                $('.tipsCon').animate({"height": "60px"}, 300);
            } else {
                $('.showAll span').addClass("active");
                $('.tipsCon').animate({"height": "auto"}, 300);
            }
        })
        /*----------点击地图，地图弹层从右侧进入----------*/
        $('.site').click(function () {
            $('.mapShadow').animate({"top": "0px"}, 300);
        })
        /*------------点击分享--------------*/
        $('.share').click(function () {
            that.shareShadow(); //显示分享提示弹出层，点击后隐藏
            if (that.config.eventId) {
                //todo 弹出蒙层
                that.shareShadow(); //显示分享提示弹出层，点击后隐藏
            }
        })
        /*-------点击颜色，显示颜色选择弹层-------*/
        $('.color').click(function () {

        })
        /*------------点击保存--------------*/
        $('.saveBtn').click(function () {
            var that = this;
            $.post(
                "http://www.li-li.cn/llwx/event/add",
                {
                    //"name":;
                    //"eventType":
                },
                function (data) {
                    if (data.code == 0) {

                    } else {

                    }
                }
            )
        })
        /*---------------点击删除---------------*/
        $('.delete').click(function () {
            var that = this;
            $.get("http://www.li-li.cn/llwx/event.del", {"eventId": that.config.eventId}, function (data) {
                if (data.code == 0) {

                } else {

                }
            })
        })
    }
}

fuc.init();
