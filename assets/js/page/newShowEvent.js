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
    config: {
        eventId: "",
        nickName: "",
        eventType: "",
        shareImg: "",
        pageNo:"",
        lastId:""
    },
    mapConfig: {
        map: "",
        latitude: "",//纬度
        longitude: ""//经度
    },

    init: function () {
        pageLoad({backgroundColor: "#fff"});
		this.config.pageNo = 1;
        this.config.eventId = Dom.getRequest("eventId");
        this.config.lastId = "";
        this.rem();
        this.renderPage();
        this.bindEvent();
    },

    rem: function () {
        fastClick.attach(document.body);
    },

    renderPage: function () {
        var that = this;
        wx.wxConfig(1);
        $('.eventContainer').css("visibility","visible");
        setTimeout(function(){
            that.getJoiner();
            that.getData();
        },300);
    },

    /*----------获取用户分享的图片------------*/
    getShareImg: function () {
        var that = this;
        $.get(
            "http://www.li-li.cn/llwx/share/genPic",
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

    /*-----------------获取事件参与者-------------------*/
    getJoiner: function () {
        var that = this;
        var peopleTemplate = $('#peopleListTemplate').html();
        $.get(
            "http://www.li-li.cn/llwx/event/joiner/list",
            {
                "pageNo": that.config.pageNo,
                "pageSize": 20,
                "eventId": that.config.eventId,
                "lastId":that.config.lastId
            },
            function (data) {
                if (data.code == 0) {
                    console.log(that.config.pageNo);
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
                        console.log(that.config.lastId);
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
            "http://www.li-li.cn/llwx/event/detail",
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
                    } else if (dataList.event.eventType == 1) {//活动事件
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
                        //事件创建者头像及昵称显示
                        $('.eventOwner').attr("src", dataList.owner.headImgUrl);
                        $('.ownerNickName .nickName').html(dataList.owner.nickName);
                        if (dataList.user) {
                            wx.wxShare(dataList.user + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                                "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
                        } else {//用户没有关注历历
                            wx.wxShare(dataList.owner.nickName + " 邀请您参加 「" + dataList.event.name + "」", Dom.tranDate(dataList.event.startTime),
                                "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/newShowEvent.html?eventId=" + dataList.event.eventId));
                        }
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
        /*------------点击编辑按钮，跳转至事件添加页--------------*/
        $('.compile').click(function () {
            console.log(that.config.eventType);
            if (that.config.eventType == 0) {//提醒事件
                window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/remind.html?eventId=" + that.config.eventId);
            } else if (that.config.eventType == 1) {//活动事件
                window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/activity.html?eventId=" + that.config.eventId);
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
        /*----------------点击更多---------------------*/
        $('.morePeople').click(function () {
            that.getJoiner();
        });
        /*---------------点击邀请好友-----------------*/
        $('.share').click(function () {
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
        });
        /*---------------点击分享弹层中的按钮-----------------*/
        $('.shareImgClose').click(function () {
            event.preventDefault();
            $.get(
                "http://www.li-li.cn/llwx/share/seePic",
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
        /*----------点击我要发布--------------*/
        $('.postEvent').click(function(){
                $('#loadingToast').fadeIn();//显示loading
                $.get("http://www.li-li.cn/llwx/wx/isSubscribe", function (data) {
                    if(data.code ==0){
                        if(data.data){//已经关注我们，跳转至添加活动页面
                            window.location.href ="http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/activity.html");
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
        })
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
                "http://www.li-li.cn/llwx/event/exit",
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

    /*-----------------------局部刷新参与人---------------------*/
    refreshJoiner: function () {
        var that = this;
        that.config.pageNo = 1;
        $('.peopleList').children(".joinerItem").remove();
        var peopleTemplate = $('#peopleListTemplate').html();
        $.get(
            "http://www.li-li.cn/llwx/event/joiner/list",
            {
                "pageNo": that.config.pageNo,
                "pageSize": 10,
                "eventId": that.config.eventId
            },
            function (data) {
                if (data.code == 0) {
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