/**
 * Created by admin on 2016/9/22.
 */
require("../../css/page/remind.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
var Dom = require("../common/dom.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var wx = require("../vendor/weChat/wxInit.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");

var fuc = {
    config: {
        eventId: "",
        eventType: "",
        tagId: "",
        time: "",
        timeArr: "",
        repeatSelect: "",
        bgColor: "",//背景颜色
        themeId: ""//背景图id
    },
    init: function () {
        pageLoad({backgroundColor: "#fff"});
        this.config.time = this.ifTimeExist(Dom.getRequest("date"));
        this.config.timeArr = this.transTime(this.config.time);
        this.config.eventId = Dom.getRequest("eventId");
        this.config.eventType = 0;
        this.config.bgColor = "#66cccc";
        this.config.repeatSelect = document.getElementById('select');
        this.rem();
        this.renderPage();
        this.getTags();
        this.bindEvent();
    },
    rem: function () {
        fastClick.attach(document.body);
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
        return timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + startHour + ":" + startMinute;
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
        if (templateId != "null") {
            $.get(
                "http://www.li-li.cn/llwx/template/detail",
                {
                    'tid': templateId
                },
                function (data) {
                    if (data.code == 0) {
                        var list = data.data;
                        that.config.repeatSelect.value = list.repeatType;//设置关联的重复类型
                        if(list.theme){
                            that.config.bgColor = "";
                            that.config.themeId = list.theme.themeId;
                            console.log(that.config.themeId);
                        }else if(list.bgColor){
                            that.config.bgColor = list.bgColor;
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
            that.getTemplate($(this).attr("data-template"));
            $('.topTips').slideUp();
            event.preventDefault();
        });
    },
    getTags: function () {
        var that = this;
        var template = $('#tagListTemplate').html();
        var html = "";
        $.get(
            "http://www.li-li.cn/llwx/tag/list",
            {"type": 1, "all": true},
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
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
            }
        )
    },

    renderPage: function () {
        var that = this;
        wx.wxConfig(1);
        Dom.autoTextarea(document.getElementById("eventTitle"));
        if (that.config.eventId) {
            that.getData();
        } else {
            /*---------------------开始时间的时间显示---------------------*/
            $('.startCon').html(that.config.timeArr);
        }
        /*---------------------------------开始时间的日期选择功能---------------------------------*/
        this.selectTimes('#startTime', '.startCon').setVal(new Date(that.setInitTime($('.startCon'))));
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
                        that.config.tagId = eventList.event.tagId;
                        that.config.bgColor = eventList.event.bgColor;
                        $('.eventName').val(eventList.event.name);//标题内容
                        Dom.autoTextarea(document.getElementById("eventTitle"));
                        var theStartTime = Dom.tranDate(eventList.event.startTime),
                            repeatType = eventList.event.repeatType;
                        $('.startCon').html(theStartTime).attr("id", eventList.event.startTime);
                        /*------------设置重复类型----------------*/
                        var repeatOptions = that.config.repeatSelect.getElementsByTagName("option");
                        for (var j = 0; j < repeatOptions.length; j++) {
                            if(repeatOptions[j].value == repeatType){
                                repeatOptions[j].selected = true;
                            }
                        }
                    } else if(data.code == 112){
                        //若参加者参加的事件不存在
                        $('.eventNone').css("display", "block");
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
        /*-----------展开顶部的快捷标签-------------*/
        $('.showAll').click(function () {
            if ($('.showAll span').attr("class") == "active") {
                $('.showAll span').removeClass("active");
                $('.tipsCon').animate({"height": "80px"}, 300);
            } else {
                $('.showAll span').addClass("active");
                $('.tipsCon').animate({"height": "auto"}, 300);
            }
        });
        /*------------点击保存--------------*/
        $('.saveBtn').click(function () {
            //alert(that.config.bgColor);
            $('#loadingToast').fadeIn();//显示loading
            var name = $('#eventTitle').val().replace(/\s+/, ""),
                startTime = $('.startCon').attr("id"),
                repeatType = that.config.repeatSelect.value;
            if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                $('#loadingToast').fadeOut();
                // todo  提示用户设置名称
                $('.titleNone').animate({"height":"36px"},300);
                setTimeout(function () {
                    $('.titleNone').animate({"height":"0px"},300);
                }, 500);
            } else {
                if (that.config.eventId) {//若事件已保存，则调用修改事件
                    $.post(
                        "http://www.li-li.cn/llwx/event/modify",
                        {
                            "eventId":that.config.eventId,
                            "name": name,
                            "eventType": that.config.eventType,
                            "tagId": that.config.tagId,
                            "startTime": startTime,
                            "repeatType": repeatType,
                            "bgColor": that.config.bgColor,
                            "theme.themeId": that.config.themeId
                        },
                        function (data) {
                            if (data.code == 0) {//提交成功
                                $('#loadingToast').fadeOut();
                                window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + that.config.eventId);
                            } else {//提交失败提醒错误信息
                                $('#loadingToast').fadeOut();
                                var error = data.msg;
                                $('#dialog2 .weui-dialog__bd').html(error);
                                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                                    $('#dialog2').off('click').hide();
                                });
                            }
                        }
                    )
                } else {
                    $.post(
                        "http://www.li-li.cn/llwx/event/add",
                        {
                            "name": name,
                            "eventType": that.config.eventType,
                            "tagId": that.config.tagId,
                            "startTime": startTime,
                            "repeatType": repeatType,
                            "bgColor": that.config.bgColor,
                            "theme.themeId": that.config.themeId
                        },
                        function (data) {
                            if (data.code == 0) {
                                $('#loadingToast').fadeOut();
                                that.config.eventId = data.data;
                                window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + that.config.eventId);
                            } else {
                                $('#loadingToast').fadeOut();
                                var error = data.msg;
                                $('#dialog2 .weui-dialog__bd').html(error);
                                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                                    $('#dialog2').off('click').hide();
                                });
                            }
                        }
                    )
                }
            }
        })
        /*---------------点击删除---------------*/
        $('.delete').click(function () {
            $('#dialog1').fadeIn();
            $('.confirm').on('tap', function () {//点击确定按钮
                $('#dialog1').fadeOut();
                $('#loadingToast').fadeIn();//显示loading
                $.get("http://www.li-li.cn/llwx/event/del", {"eventId": that.config.eventId}, function (data) {
                    if (data.code == 0) {//删除成功
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').fadeIn();
                        setTimeout(function () {
                            $('#toast').fadeOut();
                            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newSchedule.html");
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
            $('.default').on('tap', function () {//点击取消按钮
                $('#dialog1').fadeOut();
            });
        })
    }
}

fuc.init();
