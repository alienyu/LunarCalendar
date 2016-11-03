require("../../css/page/starIndex.less");
require("../common/swiper.min.js");
var Dom = require("../common/dom.js");
var pageLoad = require("../common/pageLoad.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");
var wx = require("../vendor/weChat/wxInit.js");
var moreStrImg = require("../../imgs/page/star/userBg_moreStar.png");
var joinImg = require("../../imgs/page/newShowEvent/icon_btn_remind.png");
var unjoinImg = require("../../imgs/page/newShowEvent/icon_btn_remind_pre.png");


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

    starConfig:{
        addMore: false,
        pageSize: 4,
        all: true,
        pageNo: 1
    },

    traceConfig:{
        nowYearBefore: new Date().getFullYear(),
        nowYearAfter: new Date().getFullYear(),
        addMore: false,
        starId:"",
        pageSize: 10,
        all: false,
        pageNo: 1
    },

    swiper: null,
    swiper2: null,

    init: function() {
        var that = this;
        pageLoad({backgroundColor: "#fff"});
        // wx.wxConfig(1);
        this.config.urlArr = Dom.configuration();
        this.bindEvent();
        this.rem();
        this.swiper = new Swiper('.starList', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto',
            // centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true,
            onReachEnd: function(swiper){
              // console.log('到了最后一个slide');
              if(that.starConfig.addMore){
                $('.starListLoading').show();
                that.getStars();
              }
              
            }
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
        this.share();
    },

    share: function(){
        var that = this;
        $.ajax({
            type:"get",
            url: that.config.urlArr[0]+"/user/detail",
            data:{
                
            },
            async: true,
            success:function(data){
                var str = "历历LilyCalendar";
                var header = null;
                var adress = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starIndex.html"); 
                if(data.code == 0){
                    data = data.data;
                    str = data.nickName;
                    header = data.headImgUrl;
                }
                var obj = new Object();
                obj.title = "【历历LilyCalendar】为粉丝提供明星行程，让追星更简单" ;
                obj.desc  = "来自 #"+str+" 的分享\r\n微信公众号:历历LilyCalendar";
                obj.link = adress;
                obj.img = header;
                wx.wxConfig(2,obj);
            },
            error:function(){
                
            }
        })
    },

    rem: function () {
        fastClick.attach(document.body);
    },
   
    bindEvent: function() {
        var that = this;
        /*----------------------底部自动刷新-----------------------*/
        $(window).on('scroll', function (e) {
            if ($(document).height() - $(this).scrollTop() - $(this).height()<300){
                if(that.traceConfig.addMore){//加载更多
                    that.traceConfig.addMore = false;
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
        /* -----------点击去明星八卦页面-------- */
        $('.starNews').on('click', '.news',function(){
            // console.log($(this).attr('data-src'));
            //window.location.href = "http://baidu.com";
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starNewsList.html");
            // var str = $(this).attr('data-id');
            // if(str != ""){
            //     window.location.href = that.config.urlArr[1]+"/wx/view/newsDetail.html?newsId=" + str;
            // }  
        });
        /*----------点击提醒我，加入事件-----------*/
        $('.starNewsList').on('tap','.join',function(){
            // $(this).css("display","none");
            // $(this).parent().find('.hasJoin').css("display","block");
            // var eventId = $(this).parents('day_item').attr("data-eventid");

            $('#loadingToast').fadeIn();//显示loading
            var eventId = $(this).parents('.day_item').attr("data-eventid");
            // console.log(eventId)
            var domId = this;
            //加入
            $.ajax({
                type:"get",
                url:that.config.urlArr[0]+"/wx/isSubscribe",
                async: true,
                success:function(data){
                    if(data.code == 0){
                        if(data.data){//已经关注了我们
                            //数据提交
                            $.ajax({
                                type:"post",
                                url:that.config.urlArr[0]+"/event/accept",
                                data:{
                                    "eventId":eventId
                                },
                                async: true,
                                success:function(data){
                                    if(data.code == 0){
                                        $('#loadingToast').fadeOut();//隐藏loading
                                        $(domId).css("display","none");
                                        $(domId).parent().find('.hasJoin').css("display","block");
                                        var joinerCount = $(domId).parent().find(".joinerCount").html();
                                        $(domId).parent().find(".joinerCount").html(parseInt(joinerCount)+1);
                                    }else{
                                        //报错
                                        $('#loadingToast').fadeOut();//隐藏loading
                                    }
                                },
                                error:function(){
                                    //网络问题
                                    $('#loadingToast').fadeOut();//隐藏loading
                                }
                            })
                        }else{//没有关注我们，弹出二维码
                            $.ajax({
                                type:"get",
                                url:that.config.urlArr[0]+"/wx/qrcode/ticket",
                                data:{
                                    "sceneId":eventId
                                },
                                async: true,
                                success:function(data){
                                    if (data.code == 0) {
                                        $('#loadingToast').fadeOut();//隐藏loading
                                        var ticket = data.data.ticket;
                                        var html = "<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket + "' />";
                                        $('.qrcodeImg').html("");
                                        $('.qrcodeImg').append(html);
                                        $('.wxQrcode').css("display", "block");
                                    }else if(data.code == 112){
                                        //事件已经被删除
                                    }
                                },
                                error:function(){
                                    $('#loadingToast').fadeOut();//隐藏loading
                                }
                            });
                        }
                    }
                },
                error:function(){
                    //网络问题
                    $('#loadingToast').fadeOut();//隐藏loading
                }
            });
            
        });
        /*------------点击已提醒，退出事件-----------*/
        $('.starNewsList').on('tap','.hasJoin',function(){
            // $(this).css("display","none");
            // $(this).parent().find('.join').css("display","block");
            // var eventId = $(this).parents('day_item').attr("data-eventid");

            $('#loadingToast').fadeIn();//显示loading
            var eventId = $(this).parents('.day_item').attr("data-eventid");
            var domId = this;
            //退出
            $.ajax({
                type:"post",
                url:that.config.urlArr[0]+"/event/exit",
                data:{
                    "eventId": eventId
                },
                async: true,
                success:function(data){
                    if(data.code == 0){
                        $('#loadingToast').fadeOut();//隐藏loading
                        $(domId).css("display","none");
                        $(domId).parent().find('.join').css("display","block");
                        var joinerCount = $(domId).parent().find(".joinerCount").html();
                        $(domId).parent().find(".joinerCount").html(parseInt(joinerCount)-1);
                    }else{
                        $('#loadingToast').fadeOut();//隐藏loading
                    }
                },
                error:function(){
                    $('#loadingToast').fadeOut();//隐藏loading
                }
            })
        });
        /*------------点击进入事件详情-----------*/
        $('.starNewsList').on('tap','.item_detail',function(){
            // console.log('这里是事件详情');
            var str = $(this).parents('.day_item').attr("data-eventid");
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId=" + str);
            }
        });
       /*------------点击进入事件详情-----------*/
        $('.starNewsList').on('tap','.starLink',function(event){
            // console.log('这里是明星详情');
            var str = $(this).attr('data-src');
            if(str != ""){
                window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId=" + str);
            } 

        });
       
       /*--------------------关闭二维码弹层----------------------*/
        $('.wxQrcodeClose').on('tap',function () {
            $('.wxQrcode').css("display", "none");
        });
    },

    getStars: function() {
        var that = this;
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/star/list",
            data: {
                "pageNo": that.starConfig.pageNo,
                "pageSize": that.starConfig.pageSize,
                "all": that.starConfig.all
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
                    if(data.list.length>=that.starConfig.pageSize){
                        that.starConfig.addMore = true;
                    }

                    if(that.starConfig.all == true || data.list.length<that.starConfig.pageSize){
                        that.starConfig.addMore = false;
                            var str =   '<div class="starItem swiper-slide" data-src="">'+
                                        '<img src="'+moreStrImg+'" alt="">'+
                                        '<br><span>陆续添加中</span>'+
                                    '</div>';
                        starArr.push(str);
                    }
                    
                    that.swiper.appendSlide(starArr);
                    that.starConfig.pageNo ++;
                }else{
                    //接口有问题
                    // that.tipshow('明星列表拉取失败，请稍后重试~');
                }
                $('.starListLoading').hide();
            },
            error: function() {
                $('.starListLoading').hide();
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

    getStarNewsOver: function(){
        $('.commentAdd').html('木有啦，请耐心等待吧').addClass('ccc fs12').css({"height":"auto","line-height":"1.5"});;
        $('.commentAdd').show();
    },

    getStarNews: function() {
        var that = this;
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/trace/list",
            // url: '../../mockData/traceList.json',
            data: {
                "starId": that.traceConfig.starId,
                "pageNo": that.traceConfig.pageNo,
                "pageSize": that.traceConfig.pageSize,
                "all": that.traceConfig.all
            }, 
            success: function (data) {              
               if (data.code == 0) {
                    that.getStarNewsLoaded();
                    data = data.data;
                    //添加明星八卦
                    if(data.newsList!= null){
                        var starArr = [];
                        var num = data.newsList.length;
                        if(num > 3)
                            num = 3;
                        for(var i=0;i<num;i++){
                            var str =   '<div class="news swiper-slide" data-id="'+data.newsList[i].newsId+'">'+
                                            (data.newsList[i].newsTag == "" || data.newsList[i].newsTag == undefined ?'':('<div class="starNewsLeft">'+data.newsList[i].newsTag+'</div>'))+
                                        data.newsList[i].newsTitle+'</div>';
                            starArr.push(str);
                        }
                        if(num == 0){
                            var str =   '<div class="news swiper-slide" data-id="">获取更多娱乐新闻</div>';
                            starArr.push(str);
                        }
                        // console.log(data.newsList.length+'===='+starArr);
                        that.swiper2.appendSlide(starArr);
                        that.swiper2.slideTo(1, 1000, false);
                    }
                    
                    //添加明星行程
                    var strtemp = "";
                    for(var i = 0;i<data.traceList.length;i++){
                        if(data.traceList[i].list.length == 0)
                            continue;
                        var str = "";
                        for(var j=0;j<data.traceList[i].list.length;j++){
                            str +=  '<div class="day_item" data-eventId = "'+data.traceList[i].list[j].trace.eventId+'">'+
                                        '<div class="item_detail cff" style="'+
                                            (data.traceList[i].list[j].trace.theme == null ? (data.traceList[i].list[j].trace.bgColor.indexOf('#')>-1 ? 'background-color: '+ data.traceList[i].list[j].trace.bgColor : 'background-image: url('+ data.traceList[i].list[j].trace.bgColor +')' +';' ): 'background-image: url('+ data.traceList[i].list[j].trace.theme.themeUrl +');')
                                        +'"><div class="starShadow">'+
                                            '<h1 class="itemTitle">'+ data.traceList[i].list[j].trace.name +'</h1>'+
                                            '<div class="itemTime fs12">'+Dom.getStarDate(data.traceList[i].date, data.traceList[i].list[j].trace.startTime, data.traceList[i].list[j].trace.endTime, data.traceList[i].list[j].trace.repeatType)+'</div>'+
                                            '<div class="itemLocation fs12">'+data.traceList[i].list[j].trace.location+' '+ (data.traceList[i].list[j].trace.address == null?'':data.traceList[i].list[j].trace.address)+'</div>'+
                                        '</div>'+
                                        '<div class="starLink" data-src="'+data.traceList[i].list[j].star.starId+'">'+
                                            '<div class="starAvatar"  style="background-image:url('+data.traceList[i].list[j].star.starHeadPic+')">'+
                                                //'<img src="'+data.traceList[i].list[j].star.starHeadPic+'" alt="">'+
                                            '</div>'+
                                            '<div class="starName"><div class="name">'+data.traceList[i].list[j].star.starName+'</div></div>'+
                                        '</div></div>'+
                                        '<div class="item_tips fs12">'+
                                            '<div class="c99">共<span class="joinerCount">'+data.traceList[i].list[j].joinersCount+'</span>人在追</div>'+
                                            '<div class="join c6c" style="display: '+(data.traceList[i].list[j].hasJoin == true?'none':'')+'">'+
                                                '<img src="'+joinImg+'" alt="">'+
                                                '<span>提醒我</span>'+
                                            '</div>'+
                                            '<div class="hasJoin c6c" style="display: '+(data.traceList[i].list[j].hasJoin == true?'':'none')+'">'+
                                                '<img src="'+unjoinImg+'" alt="">'+
                                                '<span class="opa5">已加入</span>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                        }
                        var dateline = "";
                        if(data.traceList[i].date.split('-')[0] != that.traceConfig.nowYearAfter){
                            that.traceConfig.nowYearAfter = data.traceList[i].date.split('-')[0];
                            dateline = '<span class="yearLine">'+that.traceConfig.nowYearAfter+'年明星行程</span>';
                        }
                        strtemp +=  dateline+
                                    '<div class="dayCon">'+
                                        '<div class="date '+(Dom.compareDate(data.traceList[i].date)?'today':'')+'">'+
                                           '<div class="day fs18">'+data.traceList[i].date.split('-')[2]+'</div>'+
                                            '<div class="month fs12">'+data.traceList[i].date.split('-')[1]+'月</div>'+
                                        '</div>'+
                                        str +
                                    '</div>';
                    }
                    $('.scheduleCon').append(strtemp);
                    that.traceConfig.pageNo ++;
                    // if(data.traceList >= that.traceConfig.pageSize){
                        // if(Math.ceil(data.pagination.totalCount/data.pagination.pageSize) >= data.pagination.pageNo){
                            // that.traceConfig.addMore = true;
                        // }else{
                        //     that.traceConfig.addMore = false;
                        // }
                    if(data.traceList.length <= 0){
                        that.traceConfig.addMore = false;
                        that.getStarNewsOver();
                    }else{
                        that.traceConfig.addMore = true;
                    }
                    //console.log(that.traceConfig.addMore);
                }else{
                    //接口有问题
                    // that.tipshow('明星列表拉取失败，请稍后重试~');
                }
                
            },
            error: function() {
                that.getStarNewsLoaded();
                // that.tipshow('网络连接错误，请检查网络~');
            }
        });
    }
}

fuc.init();