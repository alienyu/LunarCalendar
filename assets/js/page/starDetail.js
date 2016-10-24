/**
 * Created by admin on 2016/10/19.
 */
require("../../css/page/starDetail.css");
var Ajax = require("../common/ajax.js");
var Dom = require("../common/dom.js");

var fuc = {
    config:{
        starId:"",
        fansType:"",//是否追TA
        urlArr:"",
        pageNo:"",
        template:$('#dayListTemplate').html(),
        template2:$('#itemListTemplate').html()
    },
    init:function(){
        this.config.starId = Dom.getRequest("starId");
        this.config.urlArr = Dom.configuration();
        this.config.fansType = 0;//表示不追
        this.config.pageNo = 1;
        this.renderPage();
        this.bindEvent();
    },
    renderPage:function(){
        var that = this;
        //that.getStarDetail();
        var screenHeight = $(document.body).height(),
            topHeight = $('.starTop').height();
        var otherHeight = screenHeight - topHeight - 50+"px";
        $('.container').css("min-height",otherHeight);
        $('.line').css("min-height",otherHeight);
        $('.starImg').css("background-image","url('http://pic2.58.com/zp_images/allimg/120619/1_120619163824_1.png')");
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
            },
            async: true,
            success:function(data){
                if(data.code == 0){
                    var starDetail = data.data;
                    $('.starTop').css("background-image","url("+starDetail.star.starPoster+")");//海报
                    $('.starImg').css("background-image","url("+starDetail.star.starHeadPic+")");//头像
                    $('.name').html(starDetail.star.starName);//名字
                    $('.fansCount').html(starDetail.fans.fansCount);//粉丝数
                    that.config.fansType = starDetail.fans.fansType;//粉丝类型
                    if(starDetail.fans.fansType){
                        $('.bottom_item').eq(starDetail.fans.fansType).addClass('active');
                        $('.follow img').removeClass('hide');
                    }else{
                        $('.bottom_item').eq(1).addClass('active');
                    }
                }

            },
            error:function(){

            }
        })
    },
    //获取明星粉丝数量
    getFansCount:function(){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/fans/chaseStar",
            data:{
                "starId":that.config.starId
            },
            async:true,
            success:function(data){
                if(data.code == 0){
                    $('.fansCount').html(data.data.fans.fansCount);
                }
            },
            error:function(){

            }
        })
    },
    //修改追星类型
    changeFansType:function(fansType){
        var that = this;
        $.ajax({
            type:"post",
            url:that.config.urlArr[0]+"/fans/chaseStar",
            data: {
                "starId":that.config.starId,
                "fansType":fansType
            },
            async: true,
            success:function(data){

            },
            error:function(){

            }
        })
    },
    //获取明星行程列表
    getStarTrace:function(){
        var that = this;
        $.ajax({
            type:"get",
            url:that.config.urlArr[0]+"/trace/list",
            data:{
                "starId":that.config.starId,
                "pageNo":that.config.pageNo,
                "pageSize":10
            },
            async: true,
            success:function(data){
                if(data.code == 0){

                }else{

                }
            },
            error:function(){

            }
        })
    },
    bindEvent:function(){
        var that = this;
        $(window).on("touchmove", function (e) {

        });
        /*----------点击提醒我，加入事件-----------*/
        $('.day_item .join').on('tap',function(){
            $(this).css("display","none");
            $(this).parent().find('.hasJoin').css("display","block");
            var eventId = $(this).parents('day_item').attr("data-eventid");
            //加入
        });
        /*------------点击已提醒，退出事件-----------*/
        $('.day_item .hasJoin').on('tap',function(){
            $(this).css("display","none");
            $(this).parent().find('.join').css("display","block");
            var eventId = $(this).parents('day_item').attr("data-eventid");
            //退出
        });
        /*--------点击追TA，显示选择列表------*/
        $('.bottom_btn').on('tap',function(){
            that.config.fansType = $('.bottom_item.active').index();
            that.changeFansType(that.config.fansType);
            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                $('.bottomSelect').css("display","none");
            });
            $('.shadow').css("display","none");
            $('.follow img').removeClass('hide');
            $('.bottomTxt').addClass('hide');
            $('.selected').removeClass('hide');
        });
        /*-----------点击粉丝选择列表逻辑处理------------*/
        $('.bottom_item').on('tap',function(){
            console.log($(this).index());
            if($(this).hasClass("active")){//点击已选中选项，取消关注
                $(this).removeClass('active');
                $('.follow').removeClass('active');
                $('.bottomTxt').removeClass('hide');
                $('.selected').addClass('hide');
                $('.follow img').addClass('hide');
                $('.bottom_item').eq(0).addClass('active');
                that.config.fansType = 0;//不追星
            }else{
                for(var i=0;i<$('.bottom_item').size();i++){
                    $('.bottom_item').eq(i).removeClass('active');
                }
                $(this).addClass('active');
                $('.follow').addClass('active');
                $('.bottomTxt').addClass('hide');
                $('.selected').removeClass('hide');
                $('.follow img').removeClass('hide');
                that.config.fansType = $(this).index();//追星
            }
            //console.log(that.config.fansType);
            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                $('.bottomSelect').css("display","none")
            });
            $('.shadow').css("display","none");
            that.changeFansType(that.config.fansType);
            if(!that.config.fansType){//若用户取消关注，则刷新粉丝人数
                that.getFansCount();
            }
        });
        $('.shadow').on('tap',function(){
            $('.bottomSelect').animate({"bottom":"-300px"},200,function(){
                $('.bottomSelect').css("display","none");
            });
            $('.shadow').css("display","none");
        });
        $('.follow').on('tap',function(){
            $('.shadow').css("display","block");
            $('.bottomSelect').animate({"bottom":"0","display":"block"},200);
        });
    }
}

fuc.init();
