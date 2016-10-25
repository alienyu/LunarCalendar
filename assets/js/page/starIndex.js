require("../../css/page/starIndex.less");
require("../common/swiper.min.js");
var Dom = require("../common/dom.js");
var pageLoad = require("../common/pageLoad.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");

var moreStrImg = require("../../imgs/page/star/userBg_moreStar.png");

var fuc = {
    config: {
        eventId: "",
        nickName: "",
        eventType: "",
        shareImg: "",
        pageNo:"",
        lastId:"",
        urlArr:"",
        addMore:false
    },

    starConfig:{
        addMore: false,
        pageSize: 10,
        all: true,
        pageNo: 1
    },

    swiper: null,
    swiper2: null,

    init: function() {
        pageLoad({backgroundColor: "#fff"});
        this.config.urlArr = Dom.configuration();
        this.bindEvent();
        this.rem();
        this.swiper = new Swiper('.starList', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto',
            // centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true
        });

        this.swiper2 = new Swiper('.starNewsRight', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            loop: true,
            direction: 'vertical'
        });
        this.getStars();
        this.getStarNews();
        this.getStarNewsLoad();

    },

    rem: function () {
        fastClick.attach(document.body);
    },
   
    bindEvent: function() {
        var that = this;
        /*----------------------底部自动刷新-----------------------*/
        $(window).on('scroll', function (e) {
            if ($(document).height() - $(this).scrollTop() - $(this).height()<100){
                if(that.config.addMore){//加载更多评论
                    that.config.addMore = false;
                    that.getStarNews();
                    that.getStarNewsLoad();
                }
            }
        });
        /* -----------点击去明星详细页面-------- */
        $('.starList').on('click', '.starItem',function(){
            // console.log($(this).attr('data-src'));
            //window.location.href = "http://baidu.com";
            var str = $(this).attr('data-src');
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId=" + str);
            }  
        });
        /*----------点击提醒我，加入事件-----------*/
        $('.starNewsList').on('tap','.join',function(){
            $(this).css("display","none");
            $(this).parent().find('.hasJoin').css("display","block");
            var eventId = $(this).parents('day_item').attr("data-eventid");
            //加入
        });
        /*------------点击已提醒，退出事件-----------*/
        $('.starNewsList').on('tap','.hasJoin',function(){
            $(this).css("display","none");
            $(this).parent().find('.join').css("display","block");
            var eventId = $(this).parents('day_item').attr("data-eventid");
            //退出
        });
        /*------------点击进入事件详情-----------*/
        $('.starNewsList').on('tap','.item_detail',function(){
            console.log('这里是事件详情');
            var str = $(this).attr('data-eventid');
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + str);
            }
        });
       /*------------点击进入事件详情-----------*/
        $('.starNewsList').on('tap','.starLink',function(event){
            console.log('这里是明星详情');
            var str = $(this).attr('data-src');
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId=" + str);
            } 

        });
       
    },

    getStars: function() {
        var that = this;
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/star/list",
            data: {
                "pageNo": 1,
                "pageSize": 10,
                "all": true
            }, 
            success: function (data) {
               if (data.code == 0) {
                    data = data.data;
                    var starArr = [];
                    for(var i=0;i<data.list.length;i++){
                        var str =   '<div class="starItem swiper-slide" data-src="'+data.list[i].star.starId+'">'+
                                    '<img src="'+data.list[i].star.starHeadPic+'" alt="">'+
                                    '<br><span>'+data.list[i].star.starName+'</span>'+
                                '</div>';
                        starArr.push(str);
                    }
                    var str =   '<div class="starItem swiper-slide" data-src="">'+
                                    '<img src="'+moreStrImg+'" alt="">'+
                                    '<br><span style="font-size: 8px;">其他明星，陆续开启...</span>'+
                                '</div>';
                    starArr.push(str);
                    that.swiper.appendSlide(starArr);
                }else{
                    //接口有问题
                    // that.tipshow('明星列表拉取失败，请稍后重试~');
                }
                // that.loadinghide();
            },
            error: function() {
                // that.loadinghide();
                // that.tipshow('网络连接错误，请检查网络~');
            }
        });
    },

    getStarNewsLoad: function(){
        $('.commentAdd').show();
    },

    getStarNewsLoaded: function(){
        $('.commentAdd').hide();
    },

    getStarNews: function() {
        var that = this;
        $.ajax({
            type: "get",
            // url: that.config.urlArr[0]+"/trace/list",
            url: '../../mockData/traceList.json',
            data: {
                "starId": 0,
                "pageNo": 1,
                "pageSize": 10,
                "all": true
            }, 
            success: function (data) {              
               if (data.code == 0) {
                    data = data.data;
                    //添加明星八卦
                    var starArr = [];
                    for(var i=0;i<data.newsList.length;i++){
                        var str =   '<div class="news swiper-slide" data-id="'+data.newsList[i].newsId+'">'+
                                        (data.newsList[i].newsType == ""?'':('<div class="starNewsLeft">'+data.newsList[i].newsType+'</div>'))+
                                    data.newsList[i].newsTitle+'</div>';
                        starArr.push(str);
                    }
                    // console.log(data.newsList.length+'===='+starArr)
                    that.swiper2.appendSlide(starArr);
                    //添加明星行程
                    var strtemp = "";
                    for(var i = 0;i<data.traceList.length;i++){
                        var str = "";
                        for(var j=0;j<data.traceList[i].list.length;j++){
                            str +=  '<div class="day_item" data-eventId = "'+data.traceList[i].list[j].trace.eventId+'">'+
                                        '<div class="item_detail cff">'+
                                            '<h1 class="itemTitle">'+ data.traceList[i].list[j].trace.name +'</h1>'+
                                            '<div class="itemTime fs12">周三 全天</div>'+
                                            '<div class="itemLocation fs12">'+data.traceList[i].list[j].trace.location+' '+data.traceList[i].list[j].trace.address+'</div>'+
                                        '</div>'+
                                        '<div class="starLink" data-src="">'+
                                            '<div class="starAvatar">'+
                                                '<img src="../../assets/imgs/page/newShowEvent/default_photo.png" alt="">'+
                                            '</div>'+
                                            '<div class="starName"><div class="name">宋仲基</div></div>'+
                                        '</div>'+
                                        '<div class="item_tips fs12">'+
                                            '<div class="c99">共<span class="joinerCount">'+data.traceList[i].list[j].trace.joinersCount+'</span>人在追</div>'+
                                            '<div class="join c6c" style="display: '+(data.traceList[i].list[j].hasJoin == true?'none':'')+'">'+
                                                '<img src="../../assets/imgs/page/newShowEvent/icon_btn_remind.png" alt="">'+
                                                '<span>提醒我</span>'+
                                            '</div>'+
                                            '<div class="hasJoin c6c" style="display: '+(data.traceList[i].list[j].hasJoin == true?'':'none')+'">'+
                                                '<img src="../../assets/imgs/page/newShowEvent/icon_btn_remind_pre.png" alt="">'+
                                                '<span class="opa5">已提醒</span>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                        }
                        strtemp +=  '<div class="dayCon">'+
                                        '<div class="date '+(Dom.compareDate(data.traceList[i].date)?'today':'')+'">'+
                                           '<div class="day fs18">'+data.traceList[i].date.split('-')[2]+'</div>'+
                                            '<div class="month fs12">'+data.traceList[i].date.split('-')[1]+'月</div>'+
                                        '</div>'+
                                        str +
                                    '</div>';
                    }
                    $('.scheduleCon').append(strtemp);
                    that.config.addMore = true;
                }else{
                    //接口有问题
                    // that.tipshow('明星列表拉取失败，请稍后重试~');
                }
                that.getStarNewsLoaded();
            },
            error: function() {
                that.getStarNewsLoaded();
                // that.tipshow('网络连接错误，请检查网络~');
            }
        });
    }
}

fuc.init();