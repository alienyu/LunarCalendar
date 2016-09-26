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
        eventType:""
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
                if(data.code == 0) {
//                        console.log(data);
                    var dataList = data.data;
                    that.config.eventType = dataList.eventType;
                    $('.eventName').html(dataList.event.name);
                    if (dataList.eventType == 0) {//提醒事件
                        $('.time .itemCon').html(Dom.transStartTime());
                        $('.avtivityCon').css("display", "none");
                        $('.bottom').css("display", "none");
                        Ajax.getWeather(Dom.getDate(dataList.startTime));
                        Ajax.getPersonalFortune(Dom.getDate(dataList.startTime));
                    } else if (dataList.eventType == 1) {//活动事件
                        $('.suitable').css("display", "none");
                        $('.weather').css("display", "none");
                        var times = Dom.compareTimes(dataList.startTime, dataList.endTime);
                        $('.time .itemCon').html(times);
                        if (dataList.event.location) {//如果有地点
                            $('.site .itemCon').html(dataList.event.location);
                        } else {
                            $('.site').css("display", "none");
                        }
                        if (dataList.event.remarkImgs) {//如果有备注
                            var imgArr = dataList.event.remarkImgs.split(",");//图片数组
                            //todo 填充备注中的图片样式
                            if (dataList.event.remark) {
                                $('.remarkText').html(dataList.event.remark);
                            }
                        } else if (!dataList.event.remarkImgs) {
                            if (dataList.event.remark) {
                                $('.remarkText').html(dataList.event.remark);
                            }
                        } else {
                            $('.remarks').css("display", "none");
                        }
                    }
                    if (!dataList.joiner[0]) {//如果不存在参与者
                        $('.participant').css("display", "none");
                    } else {//存在参与者，则显示参与者头像和昵称
                        if (dataList.owner.headImgUrl) {
                            var html = that.config.template.replace(/{{dataImg}}/g, dataList.owner.headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.owner.nickName);
                        } else {
                            var html = that.config.template.replace(/{{dataImg}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.owner.nickName);
                        }
                        var joinerCount = dataList.joiner.length + 1;//获得参与者数组长度即参与人数
                        $('.joinerCount').html(joinerCount);
                        if (dataList.joiner.length > that.config.rowsCount * 2) {
                            $('.acceptPeople').css("height", "130px");
                            $('.showAll').css("display", "block");
                        }
                        for (var m = 0; m < dataList.joiner.length; m++) {
                            if (dataList.joiner[m].headImgUrl) {
                                html += that.config.template.replace(/{{dataImg}}/g, dataList.joiner[m].headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.joiner[m].nickName);
                            } else {
                                html += that.config.template.replace(/{{dataImg}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, dataList.joiner[m].nickName);
                            }
                        }
                        $('.acceptPeople').append(html);
                    }
                    if (dataList.user == null) {//参与人不存在,没关注过历历
                        $('.bottom').css('display', 'none').animate({'bottom': '-0.72rem'}, 500, function () {
                            $('.bottom3').css('display', 'block').animate({'bottom': '0rem'}, 500);
                        });
                    } else {//参与人存在
                        var isJoiner = false;
                        if (dataList.event.openId != dataList.user.openId) { //用户不是发起者
                            $('.share').css("display", "none");//隐藏分享按钮
                            $('.participant .line').css("display", "none");
                            //隐藏提醒类型和重复类型
                            $('.remind').css("display", "none");
                            $('.othersCon .repetition').css("display", "none");
                            //用户为参与者
                            for (var i = 0; i < dataList.joiner.length; i++) {
                                if (dataList.user.openId == dataList.joiner[i].openId) {
                                    isJoiner = true;
                                }
                            }
                            if (isJoiner) {
                                $('.bottom').css('display', 'none').animate({'bottom': '-0.72rem'}, 500, function () {
                                    $('.bottom4').css('display', 'block').animate({'bottom': '0rem'}, 500);
                                });
                            } else {
                                $('.bottom').css('display', 'none').animate({'bottom': '-0.72rem'}, 500, function () {
                                    $('.bottom3').css('display', 'block').animate({'bottom': '0rem'}, 500);
                                });
                            }
                        } else {//用户是发起者
                            $('.bottom').css('display', 'block').animate({'bottom': '0rem'}, 500);
                        }
                   }
             }
        })
    },

    bindEvent:function(){
        var that = this;
        /*------------点击编辑按钮，跳转至事件添加页--------------*/
        $('.compile').click(function(){
            if(that.config.eventType == 0){//提醒事件

            }else if(that.config.eventType == 1){//活动事件
                window.location.href = "http://www.li-li.cn/wx/activity.html?evnetId"+that.config.eventId;
            }
        });
        /*---------------点击邀请好友-----------------*/
        $('.share').click(function(){

        });
        /*-----------------点击接受邀请----------------*/
        $('.join').click(function(){

        });
        /*------------------点击退出（已加入）-----------------*/
        $('.exit').click(function(){
            $('#dialog1').show();
            $('#cancel').click(function(){
                $('#dialog1').hide();
            });
            $('#confirm').click(function(){
                $('#dialog1').hide();
                $('#loadingToast').show();//显示loading
            });
            $.post(
                "http://www.li-li.cn/llwx/event/exit",
                {
                    "eventId":that.config.eventId
                },
                function(data){
                    if(data.code==0){
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').show();
                        setTimeout(function () {
                            $('#toast').hide();
                        }, 1500);
                        $('.bottom3').css('display','none').animate({'bottom': '-50px'}, 500, function () {
                            $('.bottom2').css('display','block').animate({'bottom': '0'}, 500);
                        });
                    }
                }
            )
        })
    }

}

fuc.init();