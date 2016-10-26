/**
 * Created by admin on 2016/10/25.
 */
require("../../css/page/newsDetail.less");
var Ajax = require("../common/ajax.js");
var Dom = require("../common/dom.js");

var fuc = {
    config:{
        starId:"",
        newsId:Dom.getRequest("newsId"),
        urlArr:Dom.configuration()
    },
    init:function(){
        this.renderPage();
        this.bindEvent();
    },
    renderPage:function(){
        var that = this;

    },
    getNewsDetail:function(){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/news/detail",
            data:{
                "newsId":that.config.newsId
            },
            success:function(data){
                if(data.code == 0){
                    var newsDetail = data.data;
                    var timeArr = newsDetail.newsPubishTime.split(" ")[0].split("-");
                    that.config.starId = newsDetail.star.starId;
                    $('.name').html(newsDetail.star.starName);
                    $('.newsTitle').html(newsDetail.newsTitle);
                    $('.newsPublishTime').html(newsDetail.newsSource+"&nbsp;·&nbsp;"+timeArr[1]+"月"+timeArr[2]+"日");
                    $('.newsContent').html(newsDetail.newsContent);
                }
            },
            error:function(){

            }
        })
    },
    getRecentSchedule:function(starId){
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

                }
            },
            error:function(data){

            }
        })
    },
    bindEvent:function(){
        var that = this;
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