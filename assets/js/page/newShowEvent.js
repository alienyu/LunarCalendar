/**
 * Created by admin on 2016/9/26.
 */
require("../../css/page/newShowEvent.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
//require("../common/BMap.js");
var Dom = require("../common/dom.js");
var wx = require("../vendor/weChat/wxInit.js");
var Ajax = require("../common/ajax.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");

var fuc = {
    config:{
        eventId: "",
        nickName: "",
    },

    init:function(){
        pageLoad({backgroundColor: "#66cccc"});
        this.config.eventId = Dom.getRequest("eventId");
        this.rem();
        this.renderPage();
        this.bindEvent();
    },

    rem:function(){
        fastClick.attach(document.body);
    },

    shareShadow: function() {
        var shareShadow = $('.shareShadow');
        shareShadow.fadeIn();//显示分享提示层
        shareShadow.click(function(){
            $(this).fadeOut();
            event.stopPropagation();
        });
        var share = document.getElementById('shareShadow');
        share.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },

    renderPage:function(){
        var that = this;
        //wx.wxConfig(1);
        that.getData();
    },

    /*-------------处理时间格式，获取年月日-----------------*/
    transDate:function(time){
        var timeArr = time.split(" ");
        return timeArr[0];
    },

    getData: function() {
        //进入页面时的数据加载
        var that = this;
        //console.log(that.config.eventId);
        $.get(
            "http://www.li-li.cn/llwx/event/detail", {"eventId": that.config.eventId}, function (data) {
                if (data.code == 0) {
//                        console.log(data);
                    var dataList = data.data;
                    $('.eventName').html(dataList.event.name);
                    if(dataList.eventType==0){//提醒事件
                        $('.avtivityCon').css("display","none");
                        $('.bottom').css("display","none");
                        Ajax.getWeather(Dom.getDate(dataList.startTime));
                        Ajax.getPersonalFortune(Dom.getDate(dataList.startTime));
                    }else if(dataList.eventType == 1){//活动事件

                    }
                    console.log(dataList.event.startTime);
                    var theStartTime = Dom.tranDate(dataList.event.startTime);
                    var theEndTime = Dom.tranDate(dataList.event.endTime);
                    var remindNum = dataList.event.tipType,
                        repeatNum = dataList.event.repeatType,
                        remindItem = $('#remind span'),
                        repeatItem = $('#repetition span');
                    $('.startTime').html(theStartTime).attr("id", dataList.event.startTime);
                    $('.endTime').html(theEndTime).attr("id", dataList.event.endTime);
                    $('.remindConStart').html(that.config.remindArr[remindNum]);
                    $('.repetitionConStart').html(that.config.repeatArr[repeatNum]);
                    //若开始时间和结束时间相同，则隐藏结束时间
                    $('.Addendtime').css("display","none");
                    if(theStartTime == theEndTime){
                        $('.endTimeCon').css("height","0px");
                    }
                    if (dataList.event.location) {//如果事件地点存在
                        ac.setInputValue(dataList.event.location);
                        autoTextArea(document.getElementById("site"));
                    } else {
                        $('.site').css("display", "none");
                    }
                    if (dataList.event.remark) {//如果有备注
                        $('.showRemarks').val(dataList.event.remark);
                        autoTextArea(document.getElementById("remarks"));
                    } else {
                        $('.remarks').css("display", "none");
                    }
                    if (!dataList.joiner[0]) {//如果不存在参与者
                        $('.participant').css("display", "none");
                    } else {//存在参与者，则显示参与者头像和昵称
                        if(dataList.owner.headImgUrl){
                            var html = that.config.template.replace(/{{dataImg}}/g,dataList.owner.headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.owner.nickName);
                        }else{
                            var html = that.config.template.replace(/{{dataImg}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.owner.nickName);
                        }
                        var joinerCount = dataList.joiner.length + 1;//获得参与者数组长度即参与人数
                        $('.joinerCount').html(joinerCount);
                        if(dataList.joiner.length> that.config.rowsCount*2){
                            $('.acceptPeople').css("height","130px");
                            $('.showAll').css("display","block");
                        }
                        for (var m = 0; m < dataList.joiner.length; m++) {
                            if (dataList.joiner[m].headImgUrl) {
                                html += that.config.template.replace(/{{dataImg}}/g,dataList.joiner[m].headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.joiner[m].nickName);
                            } else {
                                html += that.config.template.replace(/{{dataImg}}/g,"../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.joiner[m].nickName);
                            }
                        }
                        $('.acceptPeople').append(html);
                    }
                    $('.scrollLoading').scrollLoading();
                    for (var k = 0; k < remindItem.size(); k++) {
                        remindItem.eq(k).removeClass("active");
                        remindItem.eq(remindNum).addClass("active");
                    }
                    for (var j = 0; j < repeatItem.size(); j++) {
                        repeatItem.eq(j).removeClass("active");
                        repeatItem.eq(repeatNum).addClass("active");
                    }
                    if (dataList.event.tipType == 3&&dataList.event.tipTime) {//若用户设置了指定的提醒时间
                        $('.remindTime').html(Dom.tranDate(dataList.event.tipTime)).attr("id", dataList.event.tipTime);
                        $('.remind_time').css('display', 'block');
                    }else{
                        $('.remindTime').html(theStartTime).attr("id",dataList.event.startTime);
                    }
                    if (dataList.user == null) {//参与人不存在,没关注过历历
                        $('.bottom').css('display','none').animate({'bottom': '-0.72rem'}, 500, function () {
                            $('.bottom3').css('display','block').animate({'bottom': '0rem'}, 500);
                        });
                    } else {//参与人存在
                        var isJoiner = false;
                        if (dataList.event.openId != dataList.user.openId) { //用户不是发起者
                            $('.share').css("display","none");//隐藏分享按钮
                            $('.participant .line').css("display","none");
                            //隐藏提醒类型和重复类型
                            $('.remind').css("display","none");
                            $('.othersCon .repetition').css("display","none");
                            //用户为参与者
                            for (var i = 0; i < dataList.joiner.length; i++) {
                                if (dataList.user.openId == dataList.joiner[i].openId) {
                                    isJoiner = true;
                                }
                            }
                            if (isJoiner) {
                                $('.bottom').css('display','none').animate({'bottom': '-0.72rem'}, 500, function () {
                                    $('.bottom4').css('display','block').animate({'bottom': '0rem'}, 500);
                                });
                            } else {
                                $('.bottom').css('display','none').animate({'bottom': '-0.72rem'}, 500, function () {
                                    $('.bottom3').css('display','block').animate({'bottom': '0rem'}, 500);
                                });
                            }
                        } else {//用户是发起者
                            $('.bottom').css('display','block').animate({'bottom': '0rem'}, 500);
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
                        "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/showEvent.html?eventId=" + dataList.event.eventId));
                    $('.eventNone').css("display", "none");
                } else if (data.code == 112) {
                    //若参加者参加的事件不存在
                    $('.eventNone').css("display", "block");
                }
            });
    },

    bindEvent:function(){

    }

}

fuc.init();