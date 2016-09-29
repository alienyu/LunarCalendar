/**
 * Created by admin on 2016/9/26.
 */
require("../../css/page/newShowEvent.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
var Dom = require("../common/dom.js");
var wx = require("../vendor/weChat/wxInit.js");
var Ajax = require("../common/ajax.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");

var fuc = {
    config:{
        eventId: "",
        nickName: "",
        eventType:"",
        shareImg:""
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

    renderPage:function(){
        var that = this;
        wx.wxConfig(1);
        that.getJoiner();
        that.getData();
    },

    /*----------获取用户分享的图片------------*/
    getShareImg:function(){
        $.get(
            "http://www.li-li.cn/llwx/share/genPic",
            {
                "eventId":that.config.eventId
            },
            function(data){
                if(data.code == 0){
                    var imgUrl = data.data;
                    that.config.shareImg = data.data;
                    $('.shadowImg img').attr("src",imgUrl);
                }
            }
        )
    },

    /*-----------------获取事件参与者-------------------*/
    getJoiner:function(){
        var that = this;
        var peopleTemplate = $('#peopleListTemplate').html();
        $.get(
            "http://www.li-li.cn/llwx/event/joiner/list",
            {
                "pageNo":1,
                "pageSize":10,
                "eventId":that.config.eventId
            },
            function(data){
                if(data.code == 0){
                    var list = data.data,html="";
                    var peopleCount = list.pagination.totalCount +1;
                    $('.count').html(peopleCount);
                    if(list.list.length == 0){
                        $('.morePeople').css("display","none");
                    }else if(list.list.length < 10){
                        $('.morePeople').css("display","none");
                    }else{
                        for(var i=0;i<list.list.length;i++){
                            html += peopleTemplate.replace(/{{imgUrl}}/g,list.list[i].headImgUrl).replace(/{{nickName}}/g,list.list[i].nickName);
                        }
                        $('.peopleList').prepend(html,$('.morePeople'));
                        var joiner = $('.joinerItem');
                        if(joiner.size()==list.pagination.totalCount){
                            $('.morePeople').css("display","none");
                        }
                    }
                }
            }
        )
    },

    getData: function() {
        //进入页面时的数据加载
        var that = this;
        //console.log(that.config.eventId);
        $.get(
            "http://www.li-li.cn/llwx/event/detail",
            {"eventId": that.config.eventId},
            function (data) {
                if(data.code == 0) {
                        console.log(data);
                        var dataList = data.data;
                        that.config.eventType = dataList.event.eventType;
                        $('.eventName').html(dataList.event.name);
                        if(dataList.event.bgColor){//若用户设置了背景颜色
                            $('.topCon').css("height","100px");
                        }else if(dataList.event.theme){//若用户没有设置背景颜色，则从主题中选择
                            $('.topCon').css({"height":"200px","background-image":"url("+dataList.event.theme.themeUrl+")"});
                            $('.compile').css("background",dataList.event.theme.themeColor);
                        }
                        if (dataList.event.eventType == 0) {//提醒事件
                            wx.wxConfig(1);
                            $('.time .itemCon').html(Dom.transStartTime(dataList.event.startTime));
                            $('.avtivityCon').css("display", "none");
                            $('.bottom').css("display", "none");
                            Ajax.getWeather(Dom.getDate(dataList.event.startTime));
                            Ajax.getPersonalFortune(Dom.getDate(dataList.event.startTime));
                        } else if(dataList.event.eventType == 1) {//活动事件
                            that.getShareImg();
                            $('.suitable').css("display", "none");
                            $('.weather').css("display", "none");
                            var times = Dom.compareTimes(dataList.event.startTime, dataList.event.endTime);
                            $('.time .itemCon').html(times);
                            if (dataList.event.location) {//如果有地点
                                $('.site .itemCon').html(dataList.event.location);
                            } else {
                                $('.site').css("display", "none");
                            }
                            //if(dataList.event.bgColor){//若用户设置了背景颜色
                            //    $('.topCon').css("height","100px");
                            //}else if(dataList.event.theme){//若用户没有设置背景颜色，则从主题中选择
                            //    $('.topCon').css({"height":"200px","background-image":"url("+dataList.event.theme.themeUrl+")"});
                            //    $('.compile').css("background",dataList.event.theme.themeColor);
                            //}
                            if (dataList.event.remarkImgs !="") {//如果有备注
                                var imgArr = dataList.event.remarkImgs.split(",");//图片数组
                                //todo 填充备注中的图片样式
                                if (dataList.event.remark != "") {
                                    $('.remarkText').html(dataList.event.remark);
                                }
                            } else{
                                if (dataList.event.remark !="") {
                                    $('.remarkText').html(dataList.event.remark);
                                }else{
                                    $('.remark').css("display", "none");
                                }
                            }
                            if(dataList.isOwner){//如果是发起者
                                $('.bottom').css("display","block").animate({"bottom":"0"},200);
                            }else{
                                $('.compile').css("display","none");
                            }
                            if(dataList.isJoiner){//如果用户已参与该事件
                                $('.bottom3').css("display","block").animate({"bottom":"0"},200);
                            }else{//用户未参与该事件
                                $('.bottom2').css("display","block").animate({"bottom":"0"},200);
                            }
                            //事件创建者头像及昵称显示
                            $('.eventOwner').attr("src",dataList.owner.headImgUrl);
                            $('.ownerNickName .nickName').html(dataList.owner.nickName);
                            if(dataList.user){
                                wx.wxShare(dataList.user + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                                "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
                            }else{//用户没有关注历历
                                wx.wxShare(dataList.owner.nickName + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                                "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
                            }
                        }
                }
            }
        )
    },

    bindEvent:function(){
        var that = this;
        /*------------点击编辑按钮，跳转至事件添加页--------------*/
        $('.compile').click(function(){
            console.log(that.config.eventType);
            if(that.config.eventType == 0){//提醒事件
                window.location.href="http://www.li-li.cn/llwx/common/to?url2="+encodeURIComponent("http://www.li-li.cn/wx/view/remind.html?eventId="+that.config.eventId);
            }else if(that.config.eventType == 1){//活动事件
                window.location.href = "http://www.li-li.cn/llwx/common/to?url2="+encodeURIComponent("http://www.li-li.cn/wx/view/activity.html?eventId="+that.config.eventId);
            }
        });
        /*----------------点击更多---------------------*/
        $('.morePeople').click(function(){
            that.getJoiner();
        });
        /*---------------点击邀请好友-----------------*/
        $('.share').click(function(){
            //that.showShareShadow;
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
        });
        /*---------------点击分享弹层中的按钮-----------------*/
        $('.shareImgClose').click(function(){
            event.preventDefault();
            $.get(
                "http://www.li-li.cn/llwx/share/seePic",
                {
                    "picUrl":that.config.shareImg
                },
                function(data){
                    if(data.code == 0){//请求成功
                        $('.shareShadow').fadeOut();
                    }
                }
            )
        });
        /*-----------------点击接受邀请----------------*/
        $('.join').click(function(){
            $('#loadingToast').fadeIn();//显示loading
            $.get("http://www.li-li.cn/llwx/wx/isSubscribe", function (data) {
                if (data.code == 0) {
                    if (data.data) {//已经关注了我们
                        //数据提交
                        $.post(
                            'http://www.li-li.cn/llwx/event/accept',
                            {
                                "eventId": that.config.eventId
                            },
                            function (data) {
                                if (data.code == 0) {//加入成功后弹出
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    $('#toast').fadeIn();
                                    setTimeout(function () {
                                        $('#toast').fadeOut();
                                    }, 1500);
                                    $('.bottom2').css('display','none').animate({'bottom': '-0.72rem'}, 500, function () {
                                        $('.bottom3').css('display','block').animate({'bottom': '0rem'}, 500);
                                    });
                                    // todo 修改该方法
                                    that.refreshJoiner();//刷新参与人数量
                                } else {//加入失败收弹出
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    var error = data.msg;
                                    $('#dialog2 .weui-dialog__bd').html(error);
                                    $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                                        $('#dialog2').off('click').fadeOut();
                                    });
                                }
                            }
                        )
                    } else {//没有关注我们，弹出二维码
                        $.get(
                            "http://www.li-li.cn/llwx/wx/qrcode/ticket",
                            {"sceneId": that.config.eventId},
                            function (data) {//获取带参数的二维码
                                if (data.code == 0) {
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    var ticket = data.data.ticket;
                                    var html = "<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket + "' />";
                                    $('.qrcodeImg').html("");
                                    $('.qrcodeImg').append(html);
                                    $('.wxQrcode').css("display", "block");
                                }
                            }
                        );
                    }
                }
            });
        });
        /*--------------------关闭二维码弹层----------------------*/
        $('.wxQrcodeClose').click(function () {
            $('.wxQrcode').css("display", "none");
        });
        /*------------------点击退出（已加入）-----------------*/
        $('.exit').click(function(){
            $('#dialog1').fadeIn();
            $('#cancel').click(function(){
                $('#dialog1').fadeOut();
            });
            $('#confirm').click(function(){
                $('#dialog1').hide();
                $('#loadingToast').fadeIn();//显示loading
            });
            $.post(
                "http://www.li-li.cn/llwx/event/exit",
                {
                    "eventId":that.config.eventId
                },
                function(data){
                    if(data.code==0){
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').fadeIn();
                        setTimeout(function () {
                            $('#toast').fadeOut();
                        }, 1500);
                        $('.bottom3').css('display','none').animate({'bottom': '-50px'}, 500, function () {
                            $('.bottom2').css('display','block').animate({'bottom': '0'}, 500);
                        });
                        that.refreshJoiner();
                    }else{
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui-dialog__bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }
            )
        })
    },

    /*-----------------------局部刷新参与人---------------------*/
    refreshJoiner: function() {
        var that = this;
        $.get("http://www.li-li.cn/llwx/event/detail", {"eventId": that.config.eventId}, function (data) {
            if (data.code == 0) {
                var list = data.data;
                if (list.joiner[0]) {//如果存在参与者
                    $('.participant').css("display", "block");
                    if(list.owner.headImgUrl){
                        var html = that.config.template.replace(/{{dataImg}}/g,list.owner.headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.owner.nickName);
                    }else{
                        var html = that.config.template.replace(/{{dataImg}}/g,"../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.owner.nickName);
                    }
                    var joinerCount = list.joiner.length + 1;//获得参与者数组长度即参与人数
                    $('.joinerCount').html(joinerCount);
                    if(list.joiner.length> this.config.rowsCount*2){
                        $('.acceptPeople').css("height","130px");
                        $('.showAll').css("display","block");
                    }
                    for (var m = 0; m < list.joiner.length; m++) {
                        if (list.joiner[m].headImgUrl) {
                            html += that.config.template.replace(/{{dataImg}}/g,list.joiner[m].headImgUrl).replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.joiner[m].nickName);
                        } else {
                            html += that.config.template.replace(/{{dataImg}}/g,"../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{img}}/g, "../img/b69e19980b6eee6a71cad41fc96bf669.png").replace(/{{joinerName}}/g, list.joiner[m].nickName);
                        }
                    }
                    $('.acceptPeople').html("").append(html);
                    $('.scrollLoading').scrollLoading();
                } else {
                    $('.participant').css("display", "none");
                }
            } else {//数据获取失败

            }
        });
    },
    /*------------------分享提示层---------------------*/
    showShareShadow: function() {
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
    }
}

fuc.init();