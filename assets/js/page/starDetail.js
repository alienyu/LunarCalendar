/**
 * Created by admin on 2016/10/19.
 */
require("../../css/page/starDetail.css");
var Ajax = require("../common/ajax.js");
var Dom = require("../common/dom.js");
var wx = require("../vendor/weChat/wxInit.js");
var pageLoad = require("../common/pageLoad.js");

var fuc = {
    config:{
        starId:"",
        fansType:"",//是否追TA
        starName:"",
        urlArr:"",
        pageNo:"",
        num:0,
        addMore:false,
        template:$('#dayListTemplate').html(),
        template2:$('#itemListTemplate').html(),
        nowYear:new Date().getFullYear()
    },
    init:function(){
        pageLoad({backgroundColor: "#fff"});
        this.config.starId = Dom.getRequest("starId");
        this.config.urlArr = Dom.configuration();
        this.config.fansType = 0;//表示不追
        this.config.pageNo = 1;
        this.renderPage();
        this.bindEvent();
    },
    renderPage:function(){
        var that = this;
        wx.wxConfig(1);
        that.getStarDetail();
        var screenHeight = parseInt($(document.body).height()),
            topHeight = parseInt($('.starTop').height());
        var otherHeight = screenHeight - topHeight - 50 +"px";
        $('.container').css("min-height",otherHeight);
        that.getStarTrace();
    },
    //获取明星详情
    getStarDetail:function(){
        var that = this;
        //获取明星详情
        $.ajax({
            type:"get",
            url: that.config.urlArr[0]+"/star/detail",
            data: {
                "starId":that.config.starId
                //"starId":"88f4ee9118bc413da76e8a83b422e5b0"
            },
            async: true,
            success:function(data){
                if(data.code == 0){
                    var starDetail = data.data;
                    if(starDetail.star.starPoster){
                        $('.starTop').css("background-image","url("+starDetail.star.starPoster+")");//海报
                    }
                    $('.starImg').css("background-image","url("+starDetail.star.starHeadPic+")");//头像
                    that.config.starName = starDetail.star.starName;
                    that.share(that.config.starName,starDetail.star.starHeadPic);//设置分享样式
                    $('.name').html(starDetail.star.starName);//名字
                    document.title = that.config.starName;
                    $('.fansCount').html(starDetail.fans.fansCount);//粉丝数
                    that.config.fansType = starDetail.fans.fansType;//粉丝类型=
                    if(that.config.fansType){
                        var bottomItem = $('.bottom_item');
                        for(var i=0;i<bottomItem.size();i++){
                            //console.log(i);
                            bottomItem.eq(i).removeClass('active');
                        }
                        bottomItem.eq(that.config.fansType-1).addClass('active');
                        $('.follow img').removeClass('hide');
                        $('.bottomTxt').addClass('hide');
                        $('.selected').removeClass('hide');
                    }else{
                        $('.bottom_item').eq(0).addClass('active');
                    }
                }else{
                    var error = data.msg;
                    that.tipShow(error);
                }
            },
            error:function(){
                that.tipShow('网络连接错误，请检查网络~');
            }
        })
    },
    share:function(starName,starImg){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/user/detail",
            success:function(data){
                if(data.code == 0){
                    var name = data.data.nickName;
                    var obj = new Object();
                    obj.title = "【 "+starName+"】最新消息动态…";
                    obj.desc = "来自 #"+name+" 的分享\r\n微信公众号：历历LilyCalendar";
                    obj.link = that.config.urlArr[0]+"/common/to?url2="+encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId="+that.config.starId);
                    obj.img = starImg;
                    wx.wxConfig(2,obj);
                }else{
                    //todo
                    var error = data.msg;
                    that.tipShow(error);
                }
            },
            error:function(){
                that.tipShow('网络连接错误，请检查网络~');
            }
        });
    },
    //修改追星类型
    changeFansType:function(fansType){
        var that = this;
        $.ajax({
            type:"post",
            url:that.config.urlArr[0]+"/fans/chaseStar",
            data: {
                "starId":that.config.starId,
                "fansType":that.config.fansType
            },
            async: true,
            success:function(data){
                if(data.code == 0){
                    $('#loadingToast').fadeOut();//显示loading
                }else{
                    var error = data.msg;
                    that.tipShow(error);
                }
            },
            error:function(){
                $('#loadingToast').fadeOut();//显示loading
                that.tipShow('网络连接错误，请检查网络~');
            }
        })
    },
    //获取明星行程列表
    getStarTrace:function(){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/trace/list",
            //url:"../../mockData/star/traceList.json",
            data:{
                "starId":that.config.starId,
                "pageNo":that.config.pageNo,
                "pageSize":10
            },
            async: true,
            success:function(data){
                //console.log(data);
                if(data.code == 0){
                    //$('#loadingToast').fadeOut();//隐藏Loading
                    var html = "",newsStr = "",traceList = data.data.traceList,dateLineStr = "";
                    if(that.config.pageNo == 1){
                        if(data.data.newsList.length>0){
                            for(var m=0;m<data.data.newsList.length;m++){//获取新闻内容
                                if(m<5){//最多显示五条新闻
                                    if(data.data.newsList[m].newsTag){
                                        newsStr +=  "<div class='news_list newsTitle' data-newsid='"+data.data.newsList[m].newsId+"'><div class='starNewsLeft'>"+data.data.newsList[m].newsTag+"</div>"+data.data.newsList[m].newsTitle+"</div>";
                                    }else{
                                        newsStr +=  "<div class='news_list newsTitle' data-newsid='"+data.data.newsList[m].newsId+"'>"+data.data.newsList[m].newsTitle+"</div>";
                                    }
                                }
                            }
                        }
                    }
                    if(traceList.length>0){
                        for(var i=0;i<traceList.length;i++){//遍历父层，显示每天
                            var dayList="";
                            if(traceList[i].list.length>0){
                                var timeArr = traceList[i].date.split("-");
                                if(parseInt(timeArr[0]) != that.config.nowYear){
                                    that.config.nowYear = parseInt(timeArr[0]);
                                    dateLineStr = '<span class="yearLine">'+that.config.nowYear+'年明星行程</span>';
                                }else{
                                    dateLineStr = "";
                                }
                                html = that.config.template.replace(/{{dateLine}}/g,dateLineStr).replace(/{{date}}/g,traceList[i].date).replace(/{{day}}/g,timeArr[2]).replace(/{{month}}/g,timeArr[1]+"月");
                                $('.scheduleCon').append(html);
                            }
                            for(var j=0;j<traceList[i].list.length;j++){
                                var traceDetail = traceList[i].list[j].trace;

                                var times = Dom.getStarDate(traceList[i].date,traceDetail.startTime);
                                //console.log(times);
                                if(traceList[i].list[j].hasJoin){//已加入事件
                                    if(traceDetail.theme){
                                        var url = "background:url('"+traceDetail.theme.themeUrl+"') center center no-repeat;background-size:cover;";
                                        dayList += that.config.template2.replace(/{{eventId}}/g,traceDetail.eventId).replace(/{{name}}/g,traceDetail.name).replace(/{{time}}/g,times).replace(/{{location}}/g,traceDetail.location+"&nbsp;"+(traceDetail.address==null?"":traceDetail.address))
                                            .replace(/{{joinerCount}}/g,traceList[i].list[j].joinersCount).replace(/{{join}}/g,"none").replace(/{{hasJoin}}/g,"block").replace(/{{background}}/g,url);
                                    }else{
                                        if(traceDetail.bgColor.indexOf("#")>=0){
                                            var background = "background:"+traceDetail.bgColor;
                                        }else if(traceDetail.bgColor.indexOf("http")>=0){
                                            var background = "background:url('"+traceDetail.bgColor+"') center center no-repeat;background-size:cover;";
                                        }
                                        dayList += that.config.template2.replace(/{{eventId}}/g,traceDetail.eventId).replace(/{{name}}/g,traceDetail.name).replace(/{{time}}/g,times).replace(/{{location}}/g,traceDetail.location+"&nbsp;"+(traceDetail.address==null?"":traceDetail.address))
                                            .replace(/{{joinerCount}}/g,traceList[i].list[j].joinersCount).replace(/{{join}}/g,"none").replace(/{{hasJoin}}/g,"block").replace(/{{background}}/g,background);
                                    }
                                }else{//未加入事件
                                    if(traceDetail.theme){
                                        var backgroundImg = "background:url('"+traceDetail.theme.themeUrl+"') center center no-repeat;background-size:cover;";
                                        dayList += that.config.template2.replace(/{{eventId}}/g,traceDetail.eventId).replace(/{{name}}/g,traceDetail.name).replace(/{{time}}/g,times).replace(/{{location}}/g,traceDetail.location+"&nbsp;"+(traceDetail.address==null?"":traceDetail.address))
                                            .replace(/{{joinerCount}}/g,traceList[i].list[j].joinersCount).replace(/{{join}}/g,"block").replace(/{{hasJoin}}/g,"none").replace(/{{background}}/g,backgroundImg);
                                    }else{
                                        if(traceDetail.bgColor.indexOf("#")>=0){
                                            var backgrounds = "background:"+traceDetail.bgColor;
                                        }else if(traceDetail.bgColor.indexOf("http")>=0){
                                            var backgrounds = "background:url('"+traceDetail.bgColor+"') center center no-repeat;background-size:cover;";
                                        }
                                        dayList += that.config.template2.replace(/{{eventId}}/g,traceDetail.eventId).replace(/{{name}}/g,traceDetail.name).replace(/{{time}}/g,times).replace(/{{location}}/g,traceDetail.location+"&nbsp;"+(traceDetail.address==null?"":traceDetail.address))
                                            .replace(/{{joinerCount}}/g,traceList[i].list[j].joinersCount).replace(/{{join}}/g,"block").replace(/{{hasJoin}}/g,"none").replace(/{{background}}/g,backgrounds);
                                    }

                                }
                            }
                            $('.dayCon').eq(that.config.num).append(dayList);
                            that.config.num++;
                        }
                        if(that.config.pageNo == 1){
                            var firstDate = $('.dayCon').eq(0).attr("data-date");
                            if(Dom.compareDate(firstDate)){//第一条数据的日期为当天
                                $('.date').eq(0).addClass("today");
                                var newsCon = "<div class='news_con c99 fs12'>"+newsStr+"<div class='news_list toMore'>查看"+that.config.starName+"相关新闻</div></div></div>";
                                $('.dayCon').eq(0).append(newsCon);
                            }else{//第一条数据的日期不是当天，则添加一个当天的dayCon
                                var today = new Date();
                                var day = today.getDate(),month = today.getMonth()+1,year = today.getFullYear();
                                var todayCon = "<div class='dayCon' data-date='"+(year+"-"+month+"-"+day)+"'><div class='date today'><div class='day fs18'>"+day+"</div><div class='month fs12'>"+month+"月"+"</div></div><div class='news_con c33 fs12'>"+newsStr+"<div class='news_list toMore'>查看"+that.config.starName+"相关新闻</div></div></div></div>";
                                $('.scheduleCon').prepend(todayCon);
                            }
                        }
                        if(traceList.length != 0){
                            that.config.addMore = true;
                            that.commentEnd();
                        }else{
                            that.config.addMore = false;
                            that.getStarNewsOver();
                        }
                        that.config.pageNo++;
                    }else{
                        if(that.config.pageNo == 1){
                            var today = new Date();
                            var day = today.getDate(),month = today.getMonth()+1,year = today.getFullYear();
                            var todayCon = "<div class='dayCon' data-date='"+(year+"-"+month+"-"+day)+"'><div class='date today'><div class='day fs18'>"+day+"</div><div class='month fs12'>"+month+"月"+"</div></div><div class='news_con c33 fs12'>"+newsStr+"<div class='news_list toMore'>查看"+that.config.starName+"相关新闻</div></div></div></div>";
                            $('.scheduleCon').prepend(todayCon);
                        }
                        that.config.addMore = false;
                        that.getStarNewsOver();
                    }
                }else{
                    //报错
                    var error = data.msg;
                    that.tipShow(error);
                    that.getStarNewsOver();
                }
            },
            error:function(){
                //报错
                that.tipShow('网络连接错误，请检查网络~');
            }
        })
    },
    commentLoad:function(){
        $('.commentMore').show();
    },
    getStarNewsOver: function(){
        $('.commentAdd').html('木有啦，请耐心等待吧').addClass("ccc fs12").css({"height":"auto","line-height":"1.5"});
        $('.commentAdd').show();
    },
    commentEnd:function(){
        $('.commentMore').hide();
    },
    tipShow: function(text){
        $('#dialog2 .weui-dialog__bd').html(text);
        $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
            $('#dialog2').fadeOut();
        });
    },
    bindEvent:function(){
        var that = this;
        $(window).on('scroll', function (e) {
            if ($(document).height() - $(this).scrollTop() - $(this).height()<100){
                if(that.config.addMore){//加载更多评论
                    that.config.addMore = false;
                    //请求数据
                    that.commentLoad();
                    that.getStarTrace();
                }
            }
        });
        /*----------点击提醒我，加入事件-----------*/
        $('.container').on('tap','.join',function(){
            $('#loadingToast').fadeIn();//显示loading
            var domId = this;
            var eventId = $(domId).parents('.day_item').attr("data-eventid");
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
                                        var error = data.msg;
                                        that.tipShow(error);
                                    }
                                },
                                error:function(){
                                    //网络问题
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    that.tipShow('网络连接错误，请检查网络~');
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
                                    }else{
                                        $('#loadingToast').fadeOut();//隐藏loading
                                        var error = data.msg;
                                        that.tipShow(error);
                                    }
                                },
                                error:function(){
                                    $('#loadingToast').fadeOut();//隐藏loading
                                    that.tipShow('网络连接错误，请检查网络~');
                                }
                            });
                        }
                    }
                },
                error:function(){
                    //网络问题
                    $('#loadingToast').fadeOut();//隐藏loading
                    that.tipShow('网络连接错误，请检查网络~');
                }
            });
        });
        /*------------点击已提醒，退出事件-----------*/
        $('.container').on('tap','.hasJoin',function(){
            $('#loadingToast').fadeIn();//显示loading
            var domId = this;
            var eventId = $(domId).parents('.day_item').attr("data-eventid");
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
                        var error = data.msg;
                        that.tipShow(error);
                    }
                },
                error:function(){
                    $('#loadingToast').fadeOut();//隐藏loading
                    that.tipShow('网络连接错误，请检查网络~');
                }
            })
        });
        /*---------点击明星行程，跳转至行程详情页----------*/
        $('.container').on('tap','.item_detail',function(){
            var eventId = $(this).parents(".day_item").attr("data-eventid");
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId="+eventId);
        });
        /*-------------点击查看明星相关新闻---------------*/
        $('.container').on('tap','.toMore',function(){
            window.location.href =  that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starNewsList.html?starId="+that.config.starId);
        });
        /*--------------点击新闻标题跳转着新闻详情页----------------*/
        $('.container').on('tap','.newsTitle',function(){
            var newsId = $(this).attr("data-newsid");
            window.location.href = that.config.urlArr[1]+"/wx/view/newsDetail.html?newsId="+newsId;
        });
        /*--------点击追TA的选择列表中的确定按钮------*/
        $('.bottom_btn').on('tap',function(){
            $('#loadingToast').fadeIn();//显示loading
            $.ajax({
                type:"get",
                url:that.config.urlArr[0]+"/wx/isSubscribe",
                async:true,
                success:function(data){
                    if(data.code == 0){
                        if(data.data){
                            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                                $('.bottomSelect').css("display","none");
                            });
                            $('.shadow').css("display","none");
                            $('.follow img').removeClass('hide');
                            $('.bottomTxt').addClass('hide');
                            $('.selected').removeClass('hide');
                            if(that.config.fansType == 0){
                                var fansNum = parseInt($('.fansCount').html());
                                $('.fansCount').html(fansNum+1);
                            }
                            that.config.fansType = $('.bottom_item.active').index();
                            that.changeFansType(that.config.fansType);
                        }else{
                            $('#loadingToast').fadeOut();
                            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                                $('.bottomSelect').css("display","none")
                            });
                            $('.shadow').css("display","none");
                            $('.liLi').css("display", "block");
                        }
                    }else{
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        that.tipShow(error);
                    }
                },
                error:function(){
                    $('#loadingToast').fadeOut();//隐藏loading
                    that.tipShow('网络连接错误，请检查网络~');
                }
            })
        });
        /*-----------点击粉丝选择列表逻辑处理------------*/
        $('.bottom_item').on('tap',function(){
            $('#loadingToast').fadeIn();//显示loading
            //console.log($(this).index());
            var domId = this;
            $.ajax({
                type: "get",
                url: that.config.urlArr[0] + "/wx/isSubscribe",
                async: true,
                success: function (data) {
                    if(data.code == 0){
                        if(data.data){//已经关注了我们
                            if($(domId).hasClass("active")){//点击已选中选项，取消关注
                                $(domId).removeClass('active');
                                $('.follow').removeClass('active');
                                $('.bottomTxt').removeClass('hide');
                                $('.selected').addClass('hide');
                                $('.follow img').addClass('hide');
                                $('.bottom_item').eq(0).addClass('active');
                                if(that.config.fansType !=0){
                                    var fansNum = parseInt($('.fansCount').html());
                                    //console.log(that.config.fansType);
                                    $('.fansCount').html(fansNum-1);
                                }
                                that.config.fansType = 0;//不追星
                            }else{
                                for(var i=0;i<$('.bottom_item').size();i++){
                                    $('.bottom_item').eq(i).removeClass('active');
                                }
                                $(domId).addClass('active');
                                $('.follow').addClass('active');
                                $('.bottomTxt').addClass('hide');
                                $('.selected').removeClass('hide');
                                $('.follow img').removeClass('hide');
                                if(that.config.fansType == 0){
                                    var fansNum = parseInt($('.fansCount').html());
                                    //console.log(that.config.fansType);
                                    $('.fansCount').html(fansNum+1);
                                }
                                that.config.fansType = $(domId).index();//追星
                            }
                            //console.log(that.config.fansType);
                            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                                $('.bottomSelect').css("display","none")
                            });
                            $('.shadow').css("display","none");
                            that.changeFansType(that.config.fansType);
                            //that.getFansCount();
                        }else{
                            $('#loadingToast').fadeOut();
                            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                                $('.bottomSelect').css("display","none")
                            });
                            $('.shadow').css("display","none");
                            $('.liLi').css("display", "block");
                        }
                    }else{
                        $('#loadingToast').fadeOut();
                        var error = data.msg;
                        that.tipShow(error);
                    }
                },
                error:function(){
                    $('#loadingToast').fadeOut();
                    that.tipShow('网络连接错误，请检查网络~');
                }
            })

        });
        $('.shadow').on('tap',function(){
            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                $('.bottomSelect').css("display","none");
            });
            $('.shadow').css("display","none");
        });
        $('.follow').on('tap',function(){
            $('.shadow').css("display","block");
            $('.bottomSelect').animate({"display":"block"},5,function(){
                $('.bottomSelect').animate({"bottom":"0"},200);
            });
        });
        /*--------------------关闭二维码弹层----------------------*/
        $('.wxQrcodeClose').on('tap',function () {
            $('.wxQrcode').css("display", "none");
        });
        $('.liLi_close').click(function(){
            $('.liLi').css("display","none");
        });
    }
}

fuc.init();
