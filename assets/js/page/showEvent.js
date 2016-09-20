require("../../css/page/showEvent.less");
var pageLoad = require("../common/pageLoad.js");
var touchSlider = require("../vendor/ImproveMobile/touchSlider.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
var ac = require("../common/BMap.js");
var Dom = require("../common/dom.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var wx = require("../vendor/weChat/wxInit.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");
var autoTextArea = require("../vendor/ImproveMobile/autoTextArea.js");

var fuc = {
    config: {
        eventId: Dom.getRequest("eventId"),
        template: $('#joinerListTemplate').html(),
        remindArr:  ["不提醒", "前一天", "当天", "指定时间"],
        repeatArr: ["不重复", "每天", "每周", "每工作日", "每月", "每年"]
    },
    init: function() {
        pageLoad({backgroundColor: "#66cccc"});
        this.rem();
        this.renderPage();
        this.bindEvent();
    },
    rem: function() {
        fastClick.attach(document.body);
        (function($,undefined){"use strict";var pluginName='scojs_message';$[pluginName]=function(message,type){clearTimeout($[pluginName].timeout);var $selector=$('#'+$[pluginName].options.id);if(!$selector.length){$selector=$('<div/>',{id:$[pluginName].options.id}).appendTo($[pluginName].options.appendTo)}$selector.html(message);if(type===undefined||type==$[pluginName].TYPE_ERROR){$selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass)}else if(type==$[pluginName].TYPE_OK){$selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass)}$selector.slideDown('fast',function(){$[pluginName].timeout=setTimeout(function(){$selector.slideUp('fast')},$[pluginName].options.delay)})};$.extend($[pluginName],{options:{id:'page_message',okClass:'page_mess_ok',errClass:'page_mess_error',delay:500,appendTo:'body'},TYPE_ERROR:1,TYPE_OK:2})})($);
    },
    renderPage: function() {
        wx.wxConfig(1);
        $('input').attr("readonly", true);
        $('textarea').attr('readonly', true);
        this.getData();
        /*--------------------------------出现遮罩层时，页面不可以滑动---------------------------------*/
        var share = document.getElementById('shareShadow');
        var shadow = document.getElementById('eventNone');
        share.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
        shadow.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },
    getData: function() {
        //进入页面时的数据加载
        var that = this;
        $.get(
            "http://www.li-li.cn/llwx/event/detail", {"eventId": that.config.eventId}, function (data) {
                if (data.code == 0) {
                    sessionStorage.setItem(that.config.eventId, JSON.stringify(data.data));//将请求到的数据存在session中，当用户取消编辑是拉去此数据显示
//                        console.log(data);
                    var dataList = data.data;
                    $('.eventName').val(dataList.event.name);
                    console.log(dataList.event.startTime);
                    var theStartTime = Dom.tranDate(dataList.event.startTime);
                    var theEndTime = Dom.tranDate(dataList.event.endTime);
                    var remindNum = dataList.event.tipType,
                        repeatNum = dataList.event.repeatType,
                        remindItem = $('#remind span'),
                        repeatItem = $('#repetition span');
                    $('.startTime').html(theStartTime).attr("id", dataList.event.startTime);
                    $('.endTime').html(theEndTime).attr("id", dataList.event.endTime);
                    $('.remindConStart').html(remindArr[remindNum]);
                    $('.repetitionConStart').html(repeatArr[repeatNum]);
                    if (dataList.event.location) {//如果事件地点存在
                        ac.setInputValue(dataList.event.location);
                    } else {
                        $('.othersCon .line').eq(0).css("display", "none");
                        $('.site').css("display", "none");
                    }
                    if (dataList.event.remark) {//如果有备注
                        $('.showRemarks').val(dataList.event.remark);
                    } else {
                        $('.othersCon .line').eq(1).css("display", "none");
                        $('.remarks').css("display", "none");
                    }
                    if (!dataList.joiner[0]) {//如果不存在参与者
                        $('.others .othersCon .line').eq(2).css("display", "none");
                        $('.participant').css("display", "none");
                    } else {//存在参与者，则显示参与者头像和昵称
                        var html = template.replace(/{{img}}/g, dataList.owner.headImgUrl).replace(/{{joinerName}}/g, dataList.owner.nickName);
                        var joinerCount = dataList.joiner.length + 1;//获得参与者数组长度即参与人数
                        $('.joinerCount').html(joinerCount);
                        for (var m = 0; m < dataList.joiner.length; m++) {
                            if (dataList.joiner[m].headImgUrl) {
                                html += that.config.template.replace(/{{img}}/g, dataList.joiner[m].headImgUrl).replace(/{{joinerName}}/g, dataList.joiner[m].nickName);
                            } else {
                                html += that.config.template.replace(/{{img}}/g, "images/default_photo.png").replace(/{{joinerName}}/g, dataList.joiner[m].nickName);
                            }
                        }
                        $('.acceptPeople').append(html);
                    }
                    for (var k = 0; k < remindItem.size(); k++) {
                        remindItem.eq(k).removeClass("active");
                        remindItem.eq(remindNum).addClass("active");
                    }
                    for (var j = 0; j < repeatItem.size(); j++) {
                        repeatItem.eq(j).removeClass("active");
                        repeatItem.eq(repeatNum).addClass("active");
                    }
                    if (dataList.event.tipType == 3) {//若用户设置了指定的提醒时间
                        $('.remindTime').html(Dom.tranDate(dataList.event.tipTime)).attr("id", dataList.event.tipTime);
                        $('.remind_time').css('display', 'block');
                    }else{
                        $('.remindTime').html(theStartTime).attr("id",dataList.event.startTime);
                    }
                    if (dataList.user == null) {//参与人不存在,没关注过历历
                        $('.bottom').animate({'bottom': '-0.72rem'}, 500, function () {
                            $('.bottom3').animate({'bottom': '0rem'}, 500);
                        });
                    } else {//参与人存在
                        var isJoiner = false;
                        if (dataList.event.openId != dataList.user.openId) { //用户不是发起者
                            //用户为参与者
                            for (var i = 0; i < dataList.joiner.length; i++) {
                                if (dataList.user.openId == dataList.joiner[i].openId) {
                                    isJoiner = true;
                                }
                            }
                            if (isJoiner) {
                                $('.bottom').animate({'bottom': '-0.72rem'}, 500, function () {
                                    $('.bottom4').animate({'bottom': '0rem'}, 500);
                                });
                            } else {
                                $('.bottom').animate({'bottom': '-0.72rem'}, 500, function () {
                                    $('.bottom3').animate({'bottom': '0rem'}, 500);
                                });
                            }
                        } else {//用户是发起者
                            $('.bottom').animate({'bottom': '0rem'}, 500);
                        }
                    }
                    //提醒、重复选择标签的滑动效果
                    var active = 0,
                        re = document.getElementById('remind').getElementsByTagName('span');
                    for (var i = 0; i < re.length; i++) {
                        (function () {
                            var j = i;
                            $(re[i]).on("tap", function() {
                                remind.slide(j);
                                return false;
                            })
                        })();
                    }
                    var remind = new touchSlider('remind', {
                        duration: 1000,
                        direction: 0,
                        start: remindNum,
                        align: 'center',
                        mouse: true,
                        mousewheel: false,
                        arrowkey: false,
                        fullsize: false,
                        autoplay: false,
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
                    var repe = document.getElementById('repetition').getElementsByTagName('span');
                    for (var k = 0; k < repe.length; k++) {
                        (function () {
                            var l = k;
                            $(repe[l]).on('tap', function() {
                                repetition.slide(l);
                                return false;
                            });
                        })();
                    }
                    var repetition = new touchSlider('repetition', {
                        duration: 1000,
                        direction: 0,
                        start: repeatNum,
                        align: 'center',
                        mouse: true,
                        mousewheel: false,
                        arrowkey: false,
                        fullsize: false,
                        autoplay: false,
                    });
                    repetition.on('before', function (m, n) {
                        repe[m].className = '';
                        repe[n].className = 'active';
                    });
                    wx.wxConfig(2, dataList.owner.nickName + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                        "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/showEvent.html?eventId=" + dataList.event.eventId));
                    $('.eventNone').css("display", "none");
                } else if (data.code == 112) {
                    //若参加者参加的事件不存在
                    $('.eventNone').css("display", "block");
                }
            });
    },
    bindEvent: function() {
        var that = this;
        //点击编辑按钮
        $('.redact').on("tap", function (e) {
            e.preventDefault();
            that.showBottom2();
            that.remindSliderShow();//显示提醒、重复的滑动选择功能
            $('.othersCon .line').eq(0).css("display", "block");
            $('.site').css("display", "block");
            $('.othersCon .line').eq(1).css("display", "block");
            $('.remarks').css("display", "block");
            that.dateAndMap();//可编辑时间
        });

        /*-----------------------------点击完成---------------------------------*/
        $('.finished').on("tap", function () {
            $('#loadingToast').show();//显示loading
            //获取编辑后的数据
            var name = $('.eventName').val(),
                startTime = $('.startTime').attr("id"),
                endTime = $('.endTime').attr("id"),
                tipType = $('#remind span.active').index(),
                tipTime = "",
                repeatType = $('#repetition span.active').index(),
                location = $('.showSite').val(),
                remark = $('#remarks').val();
            //将提醒、重复处改为不可编辑状态
            that.remindSliderHide();
            if (tipType == 3) {//若用户选择了自定义提醒时间，则通过id获取用户设定的时间
                tipTime = $('.remindTime').attr("id");
            }
            //数据提交
            $.post('http://www.li-li.cn/llwx/event/modify', {
                    "eventId": eventId,
                    "name": name,
                    "startTime": startTime,
                    "endTime": endTime,
                    "tipType": tipType,
                    "tipTime": tipTime,
                    "repeatType": repeatType,
                    "location": location,
                    "remark": remark,
                }, function (data) {
                    if (data.code == 0) {//修改成功弹出提示框
                        $('#loadingToast').fadeOut();//隐藏loading
                        that.showBottom();//事件信息提交成功，底部按钮替换为编辑和删除
                        //显示编辑后的数据
                        that.resetEvent(name, startTime, endTime, tipType, tipTime, repeatType, location, remark);
                        $('#toast').show();
                        setTimeout(function () {
                            $('#toast').hide();
                        }, 1500);
                    } else {//修改失败弹出提示框
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui_dialog_bd').html(error);
                        $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                            $('#dialog2').off('click').hide();
                        });
                    }
                }
            )
        });

        //点击取消,从sessionStorage中拉去数据并显示
        $('.cancel').on("tap", function () {
            that.showBottom();
            that.remindSliderHide();
            var data = JSON.parse(sessionStorage.getItem(eventId));//获得存储的事件信息
            //重新显示事件信息
            that.resetEvent(data.event.name, data.event.startTime, data.event.endTime, data.event.tipType, data.event.tipTime, data.event.repeatType, data.event.location, data.event.remark);
        });

        //点击删除
        $('.delete').on("tap", function () {
            $('#dialog1').show();
            $('#confirm').on('tap', function () {//点击确定按钮
                $('#dialog1').hide();
                $('#loadingToast').show();//显示loading
                $.get("http://www.li-li.cn/llwx/event/del", {"eventId": that.config.eventId}, function (data) {
                    if (data.code == 0) {//删除成功
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').show();
                        setTimeout(function () {
                            $('#toast').hide();
                            window.location.href = document.referrer;//返回上一个页面并刷新
                        }, 1500);
                    } else {//删除失败弹出提示框
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui_dialog_bd').html(error);
                        $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                            $('#dialog2').off('click').hide();
                        });
                    }
                })
            });
            $('#cancel').on('tap', function () {//点击取消按钮
                $('#dialog1').hide();
            });
        });

        //加入
        $(".join").on("tap", function () {
            $('#loadingToast').show();//显示loading
            $.get("http://www.li-li.cn/llwx/wx/isSubscribe", function (data) {
                if (data.code == 0) {
                    if (data.data) {//已经关注了我们
                        //数据提交
                        $.post('http://www.li-li.cn/llwx/event/accept', {
                                "eventId": that.config.eventId,
                            }, function (data) {
                                if (data.code == 0) {//加入成功后弹出
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    $('#toast').show();
                                    setTimeout(function () {
                                        $('#toast').hide();
                                    }, 1500);
                                    $('.bottom3').animate({'bottom': '-0.72rem'}, 500, function () {
                                        $('.bottom4').animate({'bottom': '0rem'}, 500);
                                    });
                                    that.refreshJoiner();//刷新参与人数量
                                } else {//加入失败收弹出
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    var error = data.msg;
                                    $('#dialog2 .weui_dialog_bd').html(error);
                                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                                        $('#dialog2').off('click').hide();
                                    });
                                }
                            }
                        )
                    } else {//没有关注我们，弹出二维码
                        $.get("http://www.li-li.cn/llwx/wx/qrcode/ticket", {"sceneId": eventId}, function (data) {//获取带参数的二维码
                            if (data.code == 0) {
                                $('#loadingToast').fadeOut();//隐藏loading
                                var ticket = data.data.ticket;
                                var html = "<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket + "' />";
                                $('.qrcodeImg').html("");
                                $('.qrcodeImg').append(html);
                                $('.wxQrcode').css("display", "block");
                            }
                        });
                    }
                }
            });
        });

        /*-----------------------点击二维码弹出层上的关闭按钮，隐藏弹出层--------------------------*/
        $('.wxQrcodeClose').on("tap", function () {
            $('.wxQrcode').css("display", "none");
        });

        /*-------------------点击退出------------------------*/
        $(".exit").on("tap",function () {
            $('#loadingToast').show();//显示loading
            //数据提交
            $.post('http://www.li-li.cn/llwx/event/exit', {
                    "eventId": that.config.eventId,
                }, function (data) {
                    if (data.code == 0) {//退出成功后弹出
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').show();
                        setTimeout(function () {
                            $('#toast').hide();
                        }, 1500);
                        $('.bottom4').animate({'bottom': '-0.72rem'}, 500, function () {
                            $('.bottom3').animate({'bottom': '0rem'}, 500);
                        });
                        that.refreshJoiner();
                    } else {//退出失败收弹出
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui_dialog_bd').html(error);
                        $('#dialog2').show().on('tap', '.weui_btn_dialog', function () {
                            $('#dialog2').off('tap').hide();
                        });
                    }
                }
            )
        });

        /*--------------------------------点击分享--------------------------------*/
        $(".share").on("tap", function () {
            that.shareShadow();
        });
    },
    showBottom: function() {
        $('textarea').attr('readonly', true);
        $('.bottom2').animate({'bottom': '-0.72rem'}, 500, function () {
            $('.bottom').animate({'bottom': '0rem'}, 500);
        });
    },
    /*-------------------点击编辑，底部显示取消和完成选项---------------------*/
    showBottom2: function() {
        $('textarea').attr('readonly', false);
        $('.bottom').animate({'bottom': '-0.72rem'}, 500, function () {
            $('.bottom2').animate({'bottom': '0rem'}, 500);
        })
    },
    /*-----------------------显示可选择的提醒、重复类型，此状态下信息可编辑------------------------*/
    remindSliderShow: function() {
        $(".remindConStart").css("display", "none");
        $(".remindCon").css("height", "40px");
        $(".repetitionConStart").css("display", "none");
        $(".repetitionCon").css("height", "40px");
    },
    /*--------------------------隐藏可选择的提醒、重复类型，只显示用户选择的类型，此状态下信息不可编辑-------------------------------*/
    remindSliderHide: function() {
        $(".remindConStart").css("display", "block");
        $(".remindCon").css("height", "0px");
        $(".repetitionConStart").css("display", "block");
        $(".repetitionCon").css("height", "0px");
    },
    /*-----------------------------选择开始时间、结束时间、提醒时间---------------------------*/

    dateAndMap: function() {
        //日期选择
        selectTimes('#startTime', '.startTime');
        selectTimes('#endTime', '.endTime');
        selectTimes('#remindTime', '.remindTime');
        function selectTimes(obj1, obj2) {
            mobiScroll.datetime(obj1, {
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
                    $(obj2).html(selectedDateArr[0] + "年" + tf(parseInt(selectedDateArr[1]) + 1) + "月" + tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    var theId = selectedDateArr[0] + "-" + tf(parseInt(selectedDateArr[1]) + 1) + "-" + tf(selectedDateArr[2]) + " " + selectedTimeArr[1] + ":00";
                    $(obj2).attr("id", theId);
                },
                onChange: function (event, inst) {
                    var changeDate = inst._tempValue;
                    Dom.transDate(changeDate,true);
                }
            });
        }
    },
    /*-------------------------点击取消按钮，事件内容恢复至初始状态----------------------------*/
    resetEvent: function(name, startTime, endTime, tipType, tipTime, repeatType, location, remark) {
        $('.eventName').val(name);
        var theStartTime = Dom.tranDate(startTime), theEndTime = Dom.tranDate(endTime);
        $('.startTime').html(theStartTime).attr("id", startTime);
        $('.endTime').html(theEndTime).attr("id", endTime);
        $('.remindConStart').html(remindArr[tipType]);
        $('.repetitionConStart').html(repeatArr[repeatType]);
        if (tipTime) {
            $('.remindTime').css("display", "block").val(Dom.tranDate(tipTime)).attr("id", tipTime);
        }
        if (location) {//如果事件地点存在
            ac.setInputValue(location);
        } else {
            $('.othersCon .line').eq(0).css("display", "none");
            $('.site').css("display", "none");
        }
        if (remark) {//如果有备注
            $('.showRemarks').val(remark);
        } else {
            $('.othersCon .line').eq(1).css("display", "none");
            $('.remarks').css("display", "none");
        }
    },
    /*------------------------------局部刷新参与人-------------------------------------*/

    refreshJoiner: function() {
        $.get("http://www.li-li.cn/llwx/event/detail", {"eventId": eventId}, function (data) {
            if (data.code == 0) {
                var list = data.data;
                if (list.joiner[0]) {//如果存在参与者
                    $('.others .othersCon .line').eq(2).css("display", "block");
                    $('.participant').css("display", "block");
                    var html = that.config.template.replace(/{{img}}/g, list.owner.headImgUrl).replace(/{{joinerName}}/g, list.owner.nickName);
                    var joinerCount = list.joiner.length + 1;//获得参与者数组长度即参与人数
                    $('.joinerCount').html(joinerCount);
                    for (var m = 0; m < list.joiner.length; m++) {
                        if (list.joiner[m].headImgUrl) {
                            html += that.config.template.replace(/{{img}}/g, list.joiner[m].headImgUrl).replace(/{{joinerName}}/g, list.joiner[m].nickName);
                        } else {
                            html += that.config.template.replace(/{{img}}/g, "images/default_photo.png").replace(/{{joinerName}}/g, list.joiner[m].nickName);
                        }
                    }
                    $('.acceptPeople').html("").append(html);
                } else {
                    $('.others .othersCon .line').eq(2).css("display", "none");
                    $('.participant').css("display", "none");
                }
            } else {//数据获取失败

            }
        });
    },
    /*-----------------------------弹出分享提示层，点击并隐藏----------------------------*/
    shareShadow: function() {
        var shareShadow = $('.shareShadow');
        shareShadow.css("display", "block");//显示分享提示层
        shareShadow.click(function () {
            $(this).fadeOut();
        })
    }
}

fuc.init();
