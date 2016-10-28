/**
 * Created by admin on 2016/10/25.
 */
require("../../css/page/newsDetail.less");
var Ajax = require("../common/ajax.js");
var Dom = require("../common/dom.js");
var wx = require("../vendor/weChat/wxInit.js");
var pageLoad = require("../common/pageLoad.js");

var fuc = {
    config:{
        starId:"",
        newsId:Dom.getRequest("newsId"),
        urlArr:Dom.configuration()
    },
    init:function(){
        pageLoad({backgroundColor: "#fff"});
        this.renderPage();
        this.bindEvent();
    },
    renderPage:function(){
        var that = this;
        wx.wxConfig(1);
        that.getNewsDetail();
        //console.log(that.config.newsId);
    },
    getNewsDetail:function(){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/news/detail",
            data:{
                "newsId":that.config.newsId
                //"newsId":10
            },
            success:function(data){
                if(data.code == 0){
                    //console.log(data);
                    var newsDetail = data.data;
                    var dateArr = newsDetail.newsPublishTime.split(" ")[0].split("-");
                    if(newsDetail.star.starId){//如果有明星信息
                        $('.toStars').css("display","block");
                        that.config.starId = newsDetail.star.starId;
                        $('.name').html(newsDetail.star.starName);
                        $('.toStars').attr("data-starid",that.config.starId).css("display","inline-block");
                        $(".recentSchedule").css("display","block");
                        that.getRecentSchedule(that.config.starId);
                    }else{//没有明星信息
                        that.config.starId = "";
                        $('.toStars').css("display","none");
                        $(".recentSchedule").css("display","none");
                    }
                    $('.newsTitle').html(newsDetail.newsTitle);
                    if(newsDetail.newsSource&&newsDetail.newsSource != ""){
                        $('.newsPublishTime').html(newsDetail.newsSource+"&nbsp;·&nbsp;"+dateArr[1]+"月"+dateArr[2]+"日");
                    }else{
                        $('.newsPublishTime').html(dateArr[1]+"月"+dateArr[2]+"日");
                    }
                    $('.newsContent').html(newsDetail.newsContent);
                    var shareTime = dateArr[1]+"月"+dateArr[2]+"日&nbsp;"+Dom.getweek(newsDetail.newsPublishTime.split(" ")[0])+"&nbsp;"+Dom.getHourMinute(newsDetail.newsPublishTime),
                        newsImg = newsDetail.newsPoster;
                    wx.wxShare(newsDetail.newsTitle,newsDetail.newsSource+"<br>"+shareTime,
                        that.config.urlArr[0]+"/common/to?url2="+encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId="+that.config.starId),newsImg)
                }
            },
            error:function(){

            }
        })
    },
    getRecentSchedule:function(starId){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/trace/list",
            data:{
                "starId":starId,
                "pageNo":1,
                pageSize:1
            },
            success:function(data){
                if(data.code == 0){
                    if(data.data.traceList.length>0){
                        $('.recentSchedule').css("display","block");
                        var traceDetail = data.data.traceList[0].list[0];
                        //console.log(traceDetail);
                        $('.day_item').attr("data-eventid",traceDetail.trace.eventId);
                        $('.itemTitle').html(traceDetail.trace.name);
                        $('.itemTime').html(Dom.getStarDate(data.data.traceList[0].date,traceDetail.trace.startTime));
                        $('.itemLocation').html(traceDetail.trace.location+"&nbsp;"+(traceDetail.trace.address==null?"":traceDetail.trace.address));
                        $('.joinerCount').html(traceDetail.joinersCount);
                        if(traceDetail.trace.theme){
                            $('.item_detail').css("background","url('"+traceDetail.trace.theme.themeUrl+"') no-repeat center center;background-size:cover;")
                        }else{
                            $('.item_detail').css("background",traceDetail.trace.bgColor);
                        }
                    }else{
                        $('.recentSchedule').css("display","none");
                    }
                }
            },
            error:function(data){

            }
        })
    },
    bindEvent:function(){
        var that = this;
        $('.day_item').on('tap',function(){
            var eventId = $(this).attr('data-eventid');
            console.log(eventId);
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newShowEvent.html?eventId="+eventId);
        });
        $('.toSchedule').on('tap',function(){
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starIndex.html");
        });
        $('.toNews').on('tap',function(){
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starNewsList.html");
        });
        $('.toStars').on('tap',function(){
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starDetail.html?starId="+that.config.starId);
        });
    }
}
fuc.init();