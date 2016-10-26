/**
 * Created by admin on 2016/10/21.
 */
require("../../css/page/starNewsList.css");
var Ajax = require("../common/ajax.js");
var Dom = require("../common/dom.js");

var fuc = {
    config:{
        starId:"",
        pageNo:1,
        urlArr:[],
        addMore:false,
        template:$('#newsListTemplate').html()
    },
    init:function(){
        this.config.starId = Dom.getRequest("starId");
        this.config.urlArr = Dom.configuration();
        this.renderPage();
        this.bindEvent();
    },
    renderPage:function(){
        var that = this;
        if(!that.config.starId){//若url中没有starId, 则查询所有明星的新闻
            that.config.starId = 0;
        }
        that.getData(that.config.starId);

    },
    getData:function(starId){
        var that = this;
        $.ajax({
            type:"get",
            //url:that.config.urlArr[0]+"/news/list",
            url:"../../mockData/star/newsList.json",
            data:{
                "starId":starId,
                "pageNo":that.config.pageNo,
                "pageSize":10
            },
            success:function(data){
                if(data.code == 0){
                    var newsList =data.data.list;
                    if(newsList.length>0){
                        var html = "";
                        for(var i=0;i<newsList.length;i++){
                            html += that.config.template.replace(/{{newsId}}/g,newsList[i].newsId).replace(/{{newsTitle}}/g,newsList[i].newsTitle).replace(/{{imgSrc}}/g,newsList[i].newsPoster)
                                .replace(/{{newsSource}}/g,newsList[i].newsSource).replace(/{{starName}}/g,newsList[i].star.starName);
                        }
                        $('.news').append(html);
                        that.commentEnd();
                        if(newsList.length>=10){
                            that.config.addMore = true;
                        }else{
                            that.config.addMore = false;
                        }
                    }else{
                        //没有数据
                        that.commentEnd();
                        that.config.addMore = false;
                    }
                }else{
                    //报错
                    that.commentEnd();
                }
            },
            error:function(){
                //报错
            }
        })
    },
    commentLoad:function(){
        $('.commentMore').show();
    },

    commentEnd:function(){
        $('.commentMore').hide();
    },
    bindEvent:function(){
        var that = this;
        $(window).on('scroll', function (e) {
            if ($(document).height() - $(this).scrollTop() - $(this).height()<100){
                if(that.config.addMore){//加载更多评论
                    that.config.addMore = false;
                    //请求数据
                    that.getData();
                    that.commentLoad();
                }
            }
        });
        $('.back').on('tap',function(){
            if(document.referrer==""){
                WeixinJSBridge.call("closeWindow");
            }else{
                window.location.href = document.referrer;//返回上一个页面
            }
        });
        //点击新闻跳转至新闻详情页
        $('.news').on('tap','.news_item',function(){
            var newsId = $(this).attr("data-newsid");
            console.log(newsId);
            //window.location.href =  that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/newsDetail.html"+newsId);
        });
    }
}
fuc.init();
