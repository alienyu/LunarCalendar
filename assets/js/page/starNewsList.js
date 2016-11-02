/**
 * Created by admin on 2016/10/21.
 */
require("../../css/page/starNewsList.css");
var Ajax = require("../common/ajax.js");
var Dom = require("../common/dom.js");
var pageLoad = require("../common/pageLoad.js");
var wx = require("../vendor/weChat/wxInit.js");

var fuc = {
    config:{
        starId:"",
        pageNo:1,
        urlArr:[],
        addMore:false,
        template:$('#newsListTemplate').html()
    },
    init:function(){
        pageLoad({backgroundColor: "#fff"});
        this.config.starId = Dom.getRequest("starId");
        this.config.urlArr = Dom.configuration();
        this.renderPage();
        this.bindEvent();
    },
    renderPage:function(){
        var that = this;
        if(!that.config.starId){//若url中没有starId, 则查询所有明星的新闻
            that.config.starId ="";
        }
        //从新闻详情页进入娱乐新闻页面，显示上方div，返回首页，否则不显示
        if(document.referrer.split("?")[0] == that.config.urlArr[1]+"/wx/view/newsDetail.html"){
            $('.back').css("display","block");
        }else{
            $('.back').css("display","none");
        }
        that.getData(that.config.starId);
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/user/detail",
            success:function(data){
                if(data.code == 0){
                    var name = data.data.nickName,
                        headImg = data.data.headImgUrl,
                        obj = new Object();
                    obj.title = "【 历历LilyCalendar】为粉丝提供明星行程，让追星更简单";
                    obj.desc = "来自 #"+name+" 的分享\r\n微信公众号：历历LilyCalendar";
                    obj.img = headImg;
                    if(!that.config.starId){
                        obj.link = that.config.urlArr[0]+"/common/to?url2="+encodeURIComponent(that.config.urlArr[1]+"/wx/view/starNewsList.html");
                    }else{
                        obj.link = that.config.urlArr[0]+"/common/to?url2="+encodeURIComponent(that.config.urlArr[1]+"/wx/view/starNewsList.html?starId="+that.config.starId);
                    }
                    wx.wxConfig(2,obj);
                }else{
                    var error = data.msg;
                    that.tipShow(error);
                }
            },
            error:function(){
                that.tipShow('网络连接错误，请检查网络~');
            }
        });
    },
    getData:function(starId){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/news/list",
            //url:"../../mockData/star/newsList.json",
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
                                    .replace(/{{newsSource}}/g,newsList[i].newsSource == null ? "":newsList[i].newsSource).replace(/{{starName}}/g,newsList[i].star.starName == null ?"":newsList[i].star.starName);
                        }
                        $('.newsContainer').append(html);
                        if(newsList.length>=10){
                            that.commentEnd();
                            that.config.addMore = true;
                            that.config.pageNo++;
                        }else{
                            that.getStarNewsOver();
                            that.config.addMore = false;
                        }
                    }else{
                        //没有数据
                        that.getStarNewsOver();
                        that.config.addMore = false;
                    }
                }else{
                    //报错
                    that.commentEnd();
                    var error = data.msg;
                    that.tipShow(error);
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
        $('.news').css("padding-bottom","0px");
        $('.commentAdd').html('木有更多内容啦').addClass("ccc fs12").css({"height":"auto","line-height":"1.5"});
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
            if ($(document).height() - $(this).scrollTop() - $(this).height()<300){
                if(that.config.addMore){//加载更多评论
                    that.config.addMore = false;
                    //请求数据
                    that.commentLoad(); 
                    that.getData();
                }
            }
        });
        $('.back').on('tap',function(){
            window.location.href = that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/starIndex.html");
        });
        //点击新闻跳转至新闻详情页
        $('.news').on('tap','.news_item',function(){
            var newsId = $(this).attr("data-newsid");
            console.log(newsId);
            window.location.href =  that.config.urlArr[1]+"/wx/view/newsDetail.html?newsId="+newsId;
        });
    }
}
fuc.init();
