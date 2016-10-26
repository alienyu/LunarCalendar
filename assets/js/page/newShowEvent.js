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
var likeimg = require('../../imgs/page/newShowEvent/icon_btn_praise_pre.png');
var dislikeimg = require('../../imgs/page/newShowEvent/icon_btn_praise.png');
var defaultHeadImg = require('../../imgs/page/newShowEvent/default_photo.png');

var fuc = {
    config: {
        eventId: "",
        nickName: "",
        eventType: "",
        shareImg: "",
        pageNo:"",
        lastId:"",
        urlArr:""
    },
    mapConfig: {
        map: "",
        latitude: "",//纬度
        longitude: ""//经度
    },
    commentConfig: {
        pageSize: 5,
        commentsId: 0,
        addMore: false,
        type: 1,
        openId: "",
        nickName: "",
        headImgUrl:""
    },

    init: function () {
        pageLoad({backgroundColor: "#fff"});
		this.config.pageNo = 1;
        this.config.eventId = Dom.getRequest("eventId");
        this.config.lastId = "";
        this.config.urlArr = Dom.configuration();
        this.rem();
        this.renderPage();
        this.bindEvent();
        console.log($('.fansList').width());
        var num = Math.floor($('.fansList').width()/35) - 2;
        var str = "";
        for(var i=0;i<num;i++){
            str += '<img src="../../assets/imgs/page/showEvent/default_photo.png" alt="" class="fl">';
        }
        $('.fansItem').append(str);
        
        
    },

    loginTag: function(){
        that = this;
        if(that.commentConfig.openId == ""){
            console.log('用户未登录');
            return false;
        }else{
            return true;
        }
    },

    jsDateDiff: function(publishTime){//publishTime为时间的秒数   
        var d_minutes,d_hours,d_days;
        var timeNow = parseInt(new Date().getTime()/1000);
        var d;
        publishTime = publishTime.replace(new RegExp("-","gm"),"/");
        publishTime = (new Date(publishTime)).getTime()/1000;
        d = timeNow - publishTime;
        d_days = parseInt(d/86400);
        d_hours = parseInt(d/3600);
        d_minutes = parseInt(d/60);
        if(d_days>0 && d_days<2){
            return "昨天";
        }else if(d_days>1 && d_days<4){
            return d_days+"天前";
        }else if(d_days<=0 && d_hours>0){
            return d_hours+"小时前";
        }else if(d_hours<=0 && d_minutes>0){       
            return d_minutes+"分钟前";
        }else{
            var s = new Date(publishTime*1000);
            // s.getFullYear()+"年";
            return (s.getMonth()+1)+"月"+s.getDate()+"日";
        }
    },

    rem: function () {
        fastClick.attach(document.body);
    },

    renderPage: function () {
        var that = this;
        wx.wxConfig(1);
        $('.eventContainer').css("visibility","visible");
        setTimeout(function(){
            // that.getJoiner();
            that.getData();
        },300);
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
    /* ————————————获取评论—————————————————— */
    getComments: function() {
        var that = this;
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/comments/get",
            data: {
                "fkId": that.config.eventId,
                "pageSize": that.commentConfig.pageSize,
                "commentsId": that.commentConfig.commentsId
            }, 
            success: function (data) {
               if (data.code == 0) {
                    data = data.data;
                    $(".commentCount span").html(data.pagination.totalCount);
                    if(data.self != null){
                        that.commentConfig.openId = data.self.openId;
                        that.commentConfig.headImgUrl = data.self.headImgUrl;
                        that.commentConfig.nickName = data.self.nickName;
                    }
                    if(data.hotList != null && data.hotList.length > 0){
                        var str = "";
                        for(var ii = 0; ii<data.hotList.length; ii++){
                            str += '<div class="commentItem fl comment_'+ data.hotList[ii].comments.commentsId +'">'+
                                        '<img src="'+ data.hotList[ii].user.headImgUrl +'" class="fl">'+
                                        '<div class="commentNickName fl">'+
                                            '<div class="nickName">'+ data.hotList[ii].user.nickName +'</div>'+
                                            '<div class="commentLike like_'+ data.hotList[ii].comments.commentsId +'" data-id="'+ data.hotList[ii].comments.commentsId + '">'+
                                                '<img class="commentLikePng fl" src="'+ (data.hotList[ii].isHasFavour==1?likeimg:dislikeimg) +'" alt="">'+
                                               ' <span>'+ data.hotList[ii].favourCount +'</span>'+
                                            '</div>'+
                                            '<div class="commentContent fs12" data-name="'+ data.hotList[ii].user.nickName +'">'+
                                                 (data.hotList[ii].comments.isSysDel==1?'该条评论已被删除':data.hotList[ii].comments.content) +
                                            '</div>'+
                                            '<div class="commentime fs12 fl">'+ that.jsDateDiff(data.hotList[ii].comments.addTime) +'</div>' +
                                            '<div class="commentDel fs12 fr '+ (data.hotList[ii].user.openId==that.commentConfig.openId?'':'hide') +'" data-id="'+ data.hotList[ii].comments.commentsId + '">删除</div>' +
                                       '</div>'+
                                   '</div>';
                        }
                        $('.hotComments').prepend(str);
                        $('.hotComments').show();
                    }
                    if(data.list.length > 0){
                        var str = "";
                        if(data.list.length>=that.commentConfig.pageSize){
                            that.commentConfig.addMore = true;
                            that.commentEnd();
                        }else{
                            that.commentNone();
                        }
                        for(var i = 0; i<data.list.length; i++){
                            str += '<div class="commentItem fl comment_'+ data.list[i].comments.commentsId +'">'+
                                        '<img src="'+ data.list[i].user.headImgUrl +'" class="fl">'+
                                        '<div class="commentNickName fl">'+
                                            '<div class="nickName">'+ data.list[i].user.nickName +'</div>'+
                                            '<div class="commentLike like_'+ data.list[i].comments.commentsId +'" data-id="'+ data.list[i].comments.commentsId + '">'+
                                                '<img class="commentLikePng fl" src="'+ (data.list[i].isHasFavour==1?likeimg:dislikeimg) +'" alt="">'+
                                               ' <span>'+ data.list[i].favourCount +'</span>'+
                                            '</div>'+
                                            '<div class="commentContent fs12" data-name="'+ data.list[i].user.nickName +'">'+
                                                 (data.list[i].comments.isSysDel==1?'该条评论已被删除':data.list[i].comments.content) +
                                            '</div>'+
                                            '<div class="commentime fs12 fl">'+ that.jsDateDiff(data.list[i].comments.addTime) +'</div>' +
                                            '<div class="commentDel fs12 fr '+ (data.list[i].user.openId==that.commentConfig.openId?'':'hide') +'" data-id="'+ data.list[i].comments.commentsId + '">删除</div>' +
                                       '</div>'+
                                   '</div>';
                            that.commentConfig.commentsId = data.list[i].comments.commentsId;
                        }
                        $('.newComments').append(str);
                        $('.newComments').show();
                    }else{
                        $('.commentNone').show();
                    }
                }else{
                    //接口有问题
                }
            },
            error: function() {
                //网络有问题
            }
        });
    },

    commentLoad:function(){
        $('.commentMore').show();
        $('.commentMore .txt').html('加载中...'); 
        $('.commentMore img').show();
    },

    commentEnd:function(){
        $('.commentMore').hide();
    },

    commentNone:function(){
        $('.commentMore').show();
        $('.commentMore img').hide();
        $('.commentMore .txt').html('没有更多评论了。');        
    },

    addacomment: function(data){

    },

    tipshow: function(text){
        $('#dialog2 .weui-dialog__bd').html(text);
        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
            $('#dialog2').fadeOut();
        });
    },

    loadingshow: function(){
        $('#loadingToast').fadeIn();//显示loading
    },

    loadinghide: function(){
        $('#loadingToast').fadeOut();
    },

    sendComments: function() {
        var that = this;
        if(!that.loginTag()){
            return;
        }
        that.loadingshow();
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/comments/add",
            data: {
                "fkId": that.config.eventId,
                "type": that.commentConfig.type,
                "content": $('.commentText').val()
            }, 
            success: function (data) {
               if (data.code == 0) {
                    $('.addComment').fadeOut();
                    var str = '<div class="commentItem fl comment_'+ data.data +'">'+
                                        '<img src="'+ that.commentConfig.headImgUrl +'" class="fl">'+
                                            '<div class="commentNickName fl">'+
                                            '<div class="nickName">'+ that.commentConfig.nickName +'</div>'+
                                            '<div class="commentLike like_'+ data.data +'" data-id="'+ data.data + '">'+
                                                '<img class="commentLikePng fl" src="'+ dislikeimg +'" alt="">'+
                                               ' <span>0</span>'+
                                            '</div>'+
                                            '<div class="commentContent fs12" data-name="'+ that.commentConfig.nickName +'">'+
                                                 $('.commentText').val()+
                                            '</div>'+
                                            '<div class="commentime fs12 fl">刚刚</div>' +
                                            '<div class="commentDel fs12 fr " data-id="'+ data.data + '">删除</div>' +
                                       '</div>'+
                                   '</div>';
                  $('.newComments').prepend(str);
                  $('.commentText').val('');
                  if($('.commentItem').lenth == 0){
                    $('.commentNone').show();
                  }
                }else{
                    //接口有问题
                    that.tipshow('评论失败，请稍后重试~');
                }
                that.loadinghide();
            },
            error: function() {
                that.loadinghide();
                that.tipshow('网络连接错误，请检查网络~');
            }
        });
    },

    delComments: function(val_id) {
        var that = this;
        if(!that.loginTag()){
            return;
        }
        that.loadingshow();
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/comments/del",
            data: {
                "commentsId": val_id
            }, 
            success: function (data) {
               if (data.code == 0 || data.code == 117) {
                    $('.comment_'+val_id).remove();
                    if($('.commentItem').lenth == 0){
                    $('.commentNone').hide();
                  }
                }else{
                    //接口有问题
                    that.tipshow('删除失败，请稍后重试~');
                }
                that.loadinghide();
            },
            error: function() {
                //网络链接错误
                that.loadinghide();
                that.tipshow('网络连接错误，请检查网络~');
            }
        });
    },

    addLikes: function(val_id) {
        var that = this;
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/favour/add",
            data: {
                "commentsId": val_id
            }, 
            success: function (data) {
               if (data.code == 0) {
                    $('.like_'+val_id + 'img').attr('src',likeimg);
                }else{
                    //接口有问题
                }
                that.loadinghide();
            },
            error: function() {
                //网络链接错误
            }
        });
    },

    delLikes: function(val_id) {
        var that = this;
        $.ajax({
            type: "post",
            url: that.config.urlArr[0]+"/favour/del",
            data: {
                "commentsId": val_id
            }, 
            success: function (data) {
               if (data.code == 0) {
                    $('.like_'+val_id + 'img').attr('src',dislikeimg);
                }else{
                    //接口有问题
                }
                that.loadinghide();
            },
            error: function() {
                //网络链接错误
            }
        });
    },



    /*-----------------获取事件参与者-------------------*/
    getJoiner: function () {
        var that = this;
        var peopleTemplate = $('#peopleListTemplate').html();
        $.get(
            that.config.urlArr[0]+"/event/joiner/list",
            {
                "pageNo": that.config.pageNo,
                "pageSize": 20,
                "eventId": that.config.eventId,
                "lastId":that.config.lastId
            },
            function (data) {
                if (data.code == 0) {
                    //console.log(that.config.pageNo);
                    $('#loadingToast').fadeOut();
                    that.config.pageNo ++;
                    var list = data.data, html = "";
                    var peopleCount = list.pagination.totalCount + 1;
                    if(that.config.eventType == 1){
                        $('.count').html(peopleCount);
                    }else if(that.config.eventType == 2){
                        $('.count').html(peopleCount-1);
                    }
                    
                    if (list.list.length == 0) {
                        $('.morePeople').css("display", "none");
                    } else {
                        for (var i = 0; i < list.list.length; i++) {
                            html += peopleTemplate.replace(/{{imgUrl}}/g, list.list[i].headImgUrl).replace(/{{nickName}}/g, list.list[i].nickName);
                        }
                        that.config.lastId = list.list[list.list.length-1].openId;
                        //console.log(that.config.lastId);
                        //console.log(html);
                        $('.morePeople').before(html);
                        var joiner = $('.joinerItem');
                        if (list.list.length < 10) {
                            $('.morePeople').css("display", "none");
                        }else if (joiner.size() == list.pagination.totalCount) {
                            $('.morePeople').css("display", "none");
                        }else{
                            $('.morePeople').css("display", "block");
                        }
                    }
                }
            }
        )
    },

    getData: function () {
        //进入页面时的数据加载
        var that = this;
        //console.log(that.config.eventId);
        $.get(
            that.config.urlArr[0]+"/event/detail",
            {"eventId": that.config.eventId},
            function (data) {
                if (data.code == 0) {
                    console.log(data);
                    var dataList = data.data;
                    that.config.eventType = dataList.event.eventType;
                    that.config.nickName = dataList.owner.nickName;
                    $('.eventName').html(dataList.event.name);
                    if (dataList.event.bgColor) {//若用户设置了背景颜色
                        $('.topCon').css({"height": "120px", "padding-top":"60px","background": dataList.event.bgColor});
                        $('.compile').css("background",dataList.event.bgColor);
                    } else if (dataList.event.theme) {//若用户没有设置背景颜色，则从主题中选择
                        $('.topCon').css({
                            "height": "200px",
                            "padding-top": "100px",
                            "background-image": "url(" + dataList.event.theme.themeUrl + ")"
                        });
                        $('.compile').css("background", dataList.event.theme.themeColor);
                    }
                    if (dataList.event.eventType == 0) {//提醒事件
                        wx.wxConfig(1);
                        $('.time .itemCon').html(Dom.transStartTime(dataList.event.startTime));
                        $('.avtivityCon').css("display", "none");
                        $('.remark').css("display", "none");
                        $('.site').css("display", "none");
                        $('.bottom').css("display", "none");
                        if (!Dom.smallerDate(Dom.getDate(dataList.event.startTime))) {
                            Ajax.getWeather(Dom.getDate(dataList.event.startTime),Dom.getHourMinute(dataList.event.startTime));
                        } else {
                            $('.weather').css('display', 'none');
                        }
                        Ajax.getPersonalFortune(Dom.getDate(dataList.event.startTime));
                    } else if (dataList.event.eventType == 1 || dataList.event.eventType == 2 ) {//1为活动事件,2为明星事件
                        that.config.eventType = dataList.event.eventType;
                        // that.config.eventType = 2;
                        that.getJoiner();//获取参与人数
                        if(that.config.eventType == 2){
                            $('.avtivityCon').css("display", "none");
                            $('.starAvatar').show();
                            that.refreshJoiner();
                        }
                        that.getShareImg();
                        $('.suitable').css("display", "none");
                        $('.weather').css("display", "none");
                        var times = Dom.compareTimes(dataList.event.startTime, dataList.event.endTime);
                        $('.time .itemCon').html(times);
                        if (dataList.event.location) {//如果有地点
                            $('.site .itemCon .siteName').html(dataList.event.location);
                            $('.site .itemCon .siteAddress').html(dataList.event.address);
                            that.mapConfig.latitude = dataList.event.latitude;
                            that.mapConfig.longitude = dataList.event.longitude;
                            that.initMap();
                        } else {
                            $('.site').css("display", "none");
                        }
                        if(!Dom.smallerDate(dataList.event.startTime)){//显示天气
                            $('.weather').css("display","-webkit-box");
                            if(dataList.event.location){
                                Ajax.getLocalWeather(Dom.getDate(dataList.event.startTime),Dom.getHourMinute(dataList.event.startTime),dataList.event.latitude,dataList.event.longitude);
                            }else{
                                Ajax.getWeather(Dom.getDate(dataList.event.startTime),Dom.getHourMinute(dataList.event.startTime));
                            }
                        }else{
                            $('.weather').css("display","none");
                        }
                        if (dataList.event.remarkImgs) {//如果有备注
                            var imgArr = dataList.event.remarkImgs.split(","),//图片数组
                                imgHtml = "";
                            for (var i = 0; i < imgArr.length; i++) {
                                imgHtml += "<img src=" + imgArr[i] + ">";
                            }
                            $('.remark .remarkImgs').append(imgHtml);
                            /* ---------------图片预览---------------  */
                            $('.remarkImgs img').on("tap",function () {
                                console.log('--------'+this.src);
                                wx.getWx().previewImage({
                                    current: this.src, // 当前显示图片的http链接
                                    urls: imgArr // 需要预览的图片http链接列表
                                });
                            });
                            //todo 填充备注中的图片样式
                            if (dataList.event.remark != "") {
                                $('.remarkText').html(dataList.event.remark);
                            }
                        } else {
                            if (dataList.event.remark != "") {
                                $('.remarkText').html(dataList.event.remark);
                            } else {
                                $('.remark').css("display", "none");
                            }
                        }
                        if($('.remarkText').height()>180){
                            $('.remarkMore').show();
                            $('.remarkRetract').hide();
                            $('.remarkText').addClass('textMore');
                        }//是否显示全文按钮
                        if(that.config.eventType == 1){
                            if (dataList.isOwner) {//如果是发起者
                                $('.bottom1').css("display", "block").animate({"bottom": "0"}, 200);
                            } else {
                                $('.compile').css("display", "none");
                                if (dataList.isJoiner) {//如果用户已参与该事件
                                    $('.bottom1').css("display", "none").animate({"bottom": "-50px"}, 200, function () {
                                        $('.bottom3').css("display", "block").animate({"bottom": "0"}, 200);
                                    });
                                } else {//用户未参与该事件
                                    $('.bottom1').css("display", "none").animate({"bottom": "-50px"}, 200, function () {
                                        $('.bottom2').css("display", "block").animate({"bottom": "0"}, 200);
                                    });
                                }
                            }
                        }else if(that.config.eventType == 2){
                            $('.starFooter').css("display", "block").animate({"bottom": "0"}, 200);
                        }
                        
                        //事件创建者头像及昵称显示
                        $('.eventOwner').attr("src", dataList.owner.headImgUrl);
                        $('.ownerNickName .nickName').html(dataList.owner.nickName);
                        if (dataList.user) {
                            wx.wxShare(dataList.user + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                                that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
                        } else {//用户没有关注历历
                            wx.wxShare(dataList.owner.nickName + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                                that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
                        }
                        $('.commentCon').show();
                         that.getComments();
                    }
                    
                } else if (data.code == 112) {
                    //若参加者参加的事件不存在
                    $('.eventNone').css("display", "block");
                }
            }
        )
    },

    bindEvent: function () {
        var that = this;
        /*----------------------底部自动刷新-----------------------*/
        $(window).on('scroll', function (e) {
            if ($(document).height() - $(this).scrollTop() - $(this).height()<100){
                if(that.commentConfig.addMore){//加载更多评论
                    that.commentConfig.addMore = false;
                    that.getComments();
                    that.commentLoad();
                }
            }
        });
        /*------------点击编辑按钮，跳转至事件添加页--------------*/
        $('.compile').click(function () {
            //console.log(that.config.eventType);
            if (that.config.eventType == 0) {//提醒事件
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/remind.html?eventId=" + that.config.eventId);
            } else if (that.config.eventType == 1) {//活动事件
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/activity.html?eventId=" + that.config.eventId);
            }
        });
        $('.starAvatar').click(function () {
            //console.log(that.config.eventType);
            var str = $(this).attr('data-src');
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId=" + str);
            }
        });
        /*----------全文 收起----------*/
        $('.remarkMore').on("tap",function () {
           $('.remarkRetract').show();
           $('.remarkMore').hide();
           $('.remarkText').removeClass('textMore');
        });
        $('.remarkRetract').on("tap",function () {
           $('.remarkMore').show();
           $('.remarkRetract').hide();
           $('.remarkText').addClass('textMore');
        });
        /* ---------更多粉丝----------- */
        $('.fansMore').on("tap",function () {
           // console.log('更多粉丝');
        });

        /*    -----------关于评论-----------    */
        $('.commentBtn').on("click",function () {
            if(!that.loginTag()){
                return;
            }
            $('.commentText').val('');
            $('.addComment').fadeIn();
            $('.commentText').trigger('focus');
            // $('.commentText').attr("autofocus");
            // $(".commentText")[0].focus();
            event.preventDefault();
            event.stopPropagation();
        });
        $('.addComment .cancel').on("tap",function () {
           $('.addComment').fadeOut();
        });
        $('.shadow').on("tap",function (e) {
            if($(e.target).attr('class')=='addComment shadow')
            $('.addComment').fadeOut();
           // console.log(e.target);
           // console.log($(e.target).attr('class'));
        });
        $('.addComment .finished').on("tap",function () {
            if($('.commentText').val().trim() == ""){
                return;
            }
           $('.addComment').fadeOut();
           that.sendComments();
        });
        $('.commentList').on("tap",'.commentDel',function () {
            var dataid = $(this).attr('data-id');
            // console.log('.comment_'+dataid);
            // $('.comment_'+$(this).attr('data-id')).remove();
            that.delComments(dataid);
        });
        $('.commentList').on("click",'.commentContent',function () {
            if(!that.loginTag()){
                return;
            }
           // $('.commentText').val('回复'+$(this).attr('data-name')+': ');
           $('.addComment').fadeIn();
           // $('.commentText').trigger('focus');
           $('.commentText').val("").focus().val('回复'+$(this).attr('data-name')+': '); 
           // $('.commentText').attr("autofocus");
           // $(".commentText")[0].focus();
            event.preventDefault();
            event.stopPropagation();
        });
        $('.commentList').on("tap",'.commentLike',function () {
            if(!that.loginTag()){
                return;
            }
            var dataid = $(this).attr('data-id');
            var str = $('.like_'+dataid+' img').attr('src');
            if(str.indexOf(likeimg) == -1){//未点赞
                that.addLikes(dataid);
                $('.like_'+dataid+' img').attr('src', likeimg);
                $('.like_'+dataid+' span').html(parseInt($('.like_'+dataid+' span').html())+1);
            }else{
                //that.delLikes(dataid);
            }
        })
        /*----------------点击更多---------------------*/
        $('.morePeople').click(function () {
            $('#loadingToast').fadeIn();
            that.getJoiner();
        });
        /*---------------点击邀请好友-----------------*/
        $('.share').click(function () {
            that.shareTo();
        });
        /*  --------------明星分享以及提醒--------------- */
        $('.starFooter .postEventStar').click(function () {
            event.preventDefault();
            var str = $(this).attr('data-src');
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId=" + str);
            }
        });

        $('.starFooter .shareStar').click(function () {
            that.shareTo();
        });

        $('.starFooter .joinStar').click(function () {
            event.preventDefault();
            // $('.starFooter .joinStar').hide();
            // $('.starFooter .exitStar').show();
            // $('.starFooter .shareStar').show();

            $('#loadingToast').fadeIn();//显示loading
            $.get(that.config.urlArr[0]+"/wx/isSubscribe", function (data) {
                if (data.code == 0) {
                    if (data.data) {//已经关注了我们
                        //数据提交
                        $.post(
                            that.config.urlArr[0]+'/event/accept',
                            {
                                "eventId": that.config.eventId
                            },
                            function (data) {
                                $('#loadingToast').fadeOut();//隐藏loading
                                if (data.code == 0) {//加入成功后弹出
                                    $('.starFooter .joinStar').hide();
                                    $('.starFooter .exitStar').show();
                                    $('.starFooter .shareStar').show();
                                    // todo 修改该方法
                                    that.refreshJoiner();//刷新参与人数量
                                } else {//加入失败收弹出
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
                            that.config.urlArr[0]+"/wx/qrcode/ticket",
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

        $('.starFooter .exitStar').click(function () {
            event.preventDefault();
            // $('.starFooter .joinStar').show();
            // $('.starFooter .exitStar').hide();
            // $('.starFooter .shareStar').hide();

            $('#loadingToast').fadeIn();//显示loading
            $.post(
                that.config.urlArr[0]+"/event/exit",
                {
                    "eventId": that.config.eventId
                },
                function (data) {
                    $('#loadingToast').fadeOut();//隐藏loading
                    if (data.code == 0) {
                        $('.starFooter .joinStar').show();
                        $('.starFooter .exitStar').hide();
                        $('.starFooter .shareStar').hide();
                        that.refreshJoiner();
                    } else {
                        var error = data.msg;
                        $('#dialog2 .weui-dialog__bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }
            )
        });

        /*---------------点击分享弹层中的按钮-----------------*/
        $('.shareImgClose').click(function () {
            event.preventDefault();
            $.get(
                that.config.urlArr[0]+"/share/seePic",
                {
                    "picUrl": that.config.shareImg
                },
                function (data) {
                    if (data.code == 0) {//请求成功
                        $('.shareShadow').fadeOut();
                        WeixinJSBridge.call("closeWindow");
                    }
                }
            )
        });
        /*-----------------点击接受邀请----------------*/
        $('.join').click(function () {
            $('#loadingToast').fadeIn();//显示loading
            $.get(that.config.urlArr[0]+"/wx/isSubscribe", function (data) {
                if (data.code == 0) {
                    if (data.data) {//已经关注了我们
                        //数据提交
                        $.post(
                            that.config.urlArr[0]+'/event/accept',
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
                                    $('.bottom2').css('display', 'none').animate({'bottom': '-50px'}, 500, function () {
                                        $('.bottom3').css('display', 'block').animate({'bottom': '0px'}, 500);
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
                            that.config.urlArr[0]+"/wx/qrcode/ticket",
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
        /*----------点击我要发布--------------*/
        $('.postEvent').click(function(){
                $('#loadingToast').fadeIn();//显示loading
                $.get(that.config.urlArr[0]+"/wx/isSubscribe", function (data) {
                    if(data.code ==0){
                        if(data.data){//已经关注我们，跳转至添加活动页面
                            window.location.href =that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/activity.html");
                        }else{//没有关注我们，弹出历历微信号二维码
                            $('#loadingToast').fadeOut();//隐藏loading
                            $('.liLi').css("display","block");
                        }
                    }
                });
        })
        /*--------------------关闭二维码弹层----------------------*/
        $('.wxQrcodeClose').click(function () {
            $('.wxQrcode').css("display", "none");
        });
        $('.liLi_close').click(function(){
            $('.liLi').css("display","none");
        });
        /*------------------点击退出（已加入）-----------------*/
        $('.exit').click(function () {
            $('#dialog1').fadeIn();
            $('#cancel').click(function () {
                $('#dialog1').fadeOut();
            });
        });
        /*-------------確定退出----------*/
        $('#confirm').click(function () {
            $('#dialog1').fadeOut();
            $('#loadingToast').fadeIn();//显示loading
            $.post(
                that.config.urlArr[0]+"/event/exit",
                {
                    "eventId": that.config.eventId
                },
                function (data) {
                    if (data.code == 0) {
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').fadeIn();
                        setTimeout(function () {
                            $('#toast').fadeOut();
                        }, 1500);
                        $('.bottom2 .ownerName').html(that.config.nickName);
                        $('.bottom3').css('display', 'none').animate({'bottom': '-50px'}, 500, function () {
                            $('.bottom2').css('display', 'block').animate({'bottom': '0'}, 500);
                        });
                        that.refreshJoiner();
                    } else {
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui-dialog__bd').html(error);
                        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                            $('#dialog2').off('click').fadeOut();
                        });
                    }
                }
            )
        });
        /*----------地图弹层----------*/
        that.mapShadow($('.site'), $('.mapShadow'), $('.mapShadow .container'));
    },

    //分享给好友
    shareTo: function(){
        var shareShadow = $('.shareShadow');
        shareShadow.fadeIn();//显示分享提示层
        shareShadow.click(function () {
            $(this).fadeOut();
            event.stopPropagation();
        });
        var share = document.getElementById('shareShadow');
        share.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },

    /*-----------------------局部刷新参与人---------------------*/
    refreshJoiner: function () {
        var that = this;
        that.config.pageNo = 1;
        that.config.lastId = "";
        $('.peopleList').children(".joinerItem").remove();
        var peopleTemplate = $('#peopleListTemplate').html();
        $.get(
            that.config.urlArr[0]+"/event/joiner/list",
            {
                "pageNo": that.config.pageNo,
                "pageSize": 20,
                "eventId": that.config.eventId,
                "lastId":that.config.lastId
            },
            function (data) {
                if (data.code == 0) {
                    if(that.config.eventType == 1){//个人活动
                        //console.log(that.config.pageNo);
                        that.config.pageNo ++;
                        var list = data.data, html = "";
                        var peopleCount = list.pagination.totalCount + 1;
                        $('.count').html(peopleCount);
                        if (list.list.length == 0) {
                            $('.morePeople').css("display", "none");
                        } else {
                            for (var i = 0; i < list.list.length; i++) {
                                html += peopleTemplate.replace(/{{imgUrl}}/g, list.list[i].headImgUrl).replace(/{{nickName}}/g, list.list[i].nickName);
                            }
                            that.config.lastId = list.list[list.list.length-1].openId;
                            //console.log(html);
                            $('.morePeople').before(html);
                            var joiner = $('.joinerItem');
                            if (list.list.length < 10) {
                                $('.morePeople').css("display", "none");
                            }else if (joiner.size() == list.pagination.totalCount) {
                                $('.morePeople').css("display", "none");
                            }else{
                                $('.morePeople').css("display", "block");
                            }
                        }
                    }else if(that.config.eventType == 2){ //明星活动
                        var list = data.data;
                        if(list.list.length>0){
                            $('.fansCon').show();
                            console.log('----'+$('.fansList').width());
                            var num = Math.floor($('.fansList').width()/35) - 2;
                            if(num > list.list.length){
                                num = list.list.length;
                            }
                            var str = "";
                            for(var i=0;i<num;i++){
                                str += '<img src="'+list.list[i].headImgUrl+'" alt="" class="fl">';
                            }
                            $('.fansItem').append(str);
                        }
                    }
                    
                }
            }
        )
    },


    /*---------------地图弹层效果------------------*/
    mapShadow: function (obj, shadow, container) {
        var that = this;
        obj.click(function () {
            if(that.mapConfig.longitude != 0 && that.mapConfig.latitude != 0){
                that.mapMove();
                $('.shadowBg').fadeIn();
                shadow.show();
                container.animate({"top": "10%"}, 200);
            }
        });
        $('.shadowClose').click(function () {
            container.animate({"top": "100%"}, 200, function () {
                $(this).parent().hide();
            });
            $('.shadowBg').fadeOut();
        });
    },

    /*----------初始化地图----------------------*/
    initMap: function () {
        var that = this;
        that.mapConfig.map = new AMap.Map("mapCon", {
            resizeEnable: true,
            dragEnable: true,
            keyboardEnable: false,
            doubleClickZoom: true,
            zoom: 16
        });
        var marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [that.mapConfig.longitude, that.mapConfig.latitude]
        });
        marker.setMap(that.mapConfig.map);
        that.mapMove();
    },
    /**地图移动指定位置*/
    mapMove: function () {
        var that = this;
        that.mapConfig.map.panTo([that.mapConfig.longitude, that.mapConfig.latitude]);
    },

}

fuc.init();