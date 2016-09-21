require("../../css/page/schedule.less");
var pageLoad = require("../common/pageLoad.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");
require("../vendor/dropLoad/dropLoad.js");
var wx = require("../vendor/weChat/wxInit.js");
var Dom = require("../common/dom.js");

var fuc = {
    config: {
        pageUp: 0,
        pageDown: 0,
        scheduleData: [],
        template: $('#eventListTemplate').html(),
        template2: $('#dayEventListTemplate').html()
    },
    init: function() {
        pageLoad({backgroundColor: "#66cccc"});
        this.rem();
        this.renderPage();
        this.getData();
        this.initDropLoad();
        this.bindEvent();
    },
    rem: function() {
        fastClick.attach(document.body);
        (function($,undefined){"use strict";var pluginName='scojs_message';$[pluginName]=function(message,type){clearTimeout($[pluginName].timeout);var $selector=$('#'+$[pluginName].options.id);if(!$selector.length){$selector=$('<div/>',{id:$[pluginName].options.id}).appendTo($[pluginName].options.appendTo)}$selector.html(message);if(type===undefined||type==$[pluginName].TYPE_ERROR){$selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass)}else if(type==$[pluginName].TYPE_OK){$selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass)}$selector.slideDown('fast',function(){$[pluginName].timeout=setTimeout(function(){$selector.slideUp('fast')},$[pluginName].options.delay)})};$.extend($[pluginName],{options:{id:'page_message',okClass:'page_mess_ok',errClass:'page_mess_error',delay:500,appendTo:'body'},TYPE_ERROR:1,TYPE_OK:2})})($);
    },
    renderPage: function() {
        setInterval(function () {
            $.get("http://www.li-li.cn/llwx/common/heartbeat", function (data) {
                //alert(data);
            });
        }, 20 * 60 * 1000);

        wx.wxConfig(1);
    },
    getData: function() {
        var that = this;
        $.ajax({
            type:"get",
            url:"http://www.li-li.cn/llwx/event/getSchedule",
            data:{
                pageNo:0,
                pageSize:10,
                isAll:false,
            },
            dataType:"json",
            success:function(data){
                //console.log(data);
                if(data.code ==0){
                    if(data.data.length==0){//若用户没有创建事件，则显示遮罩层
                        $('.containerShadow').css("display","block");
                    }else{
                        that.config.scheduleData=that.config.scheduleData.concat(data.data);
                        that.setView(that.config.scheduleData,that.config.template,that.config.template2);
                    }
                }
            }
        });
    },
    initDropLoad: function() {
        var that = this;
        /*--------------------------上拉刷新、下拉刷新------------------------*/
        $('.container').dropload({
            scrollArea:window,
            domUp:{
                domClass   : 'dropload-up',
                domRefresh : '<div class="dropload-refresh">↓下拉加载更多</div>',
                domUpdate  : '<div class="dropload-update">↑释放加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            },
            domDown : {
                domClass   : 'dropload-down',
                domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData  : '<div class="dropload-noData">暂无数据</div>'
            },
            autoLoad:false,//关闭自动加载
            loadUpFn:function(me){
                that.config.pageUp--;
                var theFirstDate = Dom.getDate(that.config.scheduleData[0].date);//保存数组中的第一个日期，以便定位
                $.ajax({
                    type:"get",
                    url:"http://www.li-li.cn/llwx/event/getSchedule",
                    data:{
                        pageNo:that.config.pageUp,
                        pageSize:10,
                        isAll:false,
                        direction:"down",
                        lastDate:that.config.scheduleData.length==0?"":Dom.getDate(that.config.scheduleData[0].date)
                    },
                    dataType:"json",
                    success:function(data){
                        //console.log(data);
                        var scd=[];
                        if(data.data.length==0){
                            me.lock();
                            me.noData();
                        }
                        for (var i=data.data.length-1;i>=0;i--){
                            scd.push(data.data[i]);
                        }
                        that.config.scheduleData=scd.that.config.concat(scheduleData);
                        //console.log(scheduleData);
                        that.setView(that.config.scheduleData,that.config.template,that.config.template2);
                        me.resetload();
                    },
                    error:function(xhr,type){
                        me.resetload();
                    }
                });
            },
            loadDownFn:function(me){
                that.config.pageDown++;
                $.ajax({
                    type:"get",
                    url:"http://www.li-li.cn/llwx/event/getSchedule",
                    data:{
                        pageNo:that.config.pageDown,
                        pageSize:10,
                        isAll:false,
                        direction:"up",
                        lastDate:that.config.scheduleData.length==0?"":Dom.getDate(that.config.scheduleData[that.config.scheduleData.length-1].date)
                    },
                    dataType:"json",
                    success:function(data){
                        if(data.data.length==0){
                            me.lock();
                            me.noData();
                        }
                        that.config.scheduleData=that.config.scheduleData.concat(data.data);
                        that.setView(that.config.scheduleData,that.config.template,that.config.template2);
                        me.resetload();
                    },
                    error:function(xhr,type){
                        me.resetload();
                    }
                });
            },
            threshold : 50//提前加载距离
        });
    },
    bindEvent: function() {
        /*---------------------点击添加事件跳转至添加事件页面------------------------*/
        $('.addEvent').on("tap", function (e) {
            var today = new Date();
            var dateCurrent = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
            $('body').html("").css("background", "#66cccc");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/addEvent.html?date=" + dateCurrent);
            e.preventDefault();
        });
    },
    setView: function(scheduleData,template,template2) {
        var that = this;
        var curTime="";
        $('.listCon').html("");
        for(var i=0;i<scheduleData.length;i++){
            var html = "",eventList = "";
            var timeArr = Dom.tranDayDate(scheduleData[i].date);
            if (curTime==timeArr[3]){
                html = template.replace(/{{month}}/g,"").replace(/{{date}}/g,timeArr[4]).replace(/{{day}}/g,timeArr[0]).replace(/{{week}}/g,timeArr[1]).replace(/{{nlDate}}/g,timeArr[2]);
            }else {
                html = template.replace(/{{month}}/g,timeArr[3]).replace(/{{date}}/g,timeArr[4]).replace(/{{day}}/g,timeArr[0]).replace(/{{week}}/g,timeArr[1]).replace(/{{nlDate}}/g,timeArr[2]);
            }
            curTime=timeArr[3];
            $('.listCon').append(html);
            var joinerNum,user;
            for(var j=0;j<scheduleData[i].events.length;j++){
                if(scheduleData[i].events[j].isOwner){
                    if(scheduleData[i].events[j].joiners[0]){
                        joinerNum = parseInt(scheduleData[i].events[j].joiner.length)+1;
                        user = scheduleData[i].events[j].joiners[0].nickName;
                        eventList += that.config.template2.replace(/{{eventId}}/g,scheduleData[i].events[j].event.eventId).replace(/{{name}}/g,scheduleData[i].events[j].event.name).replace(/{{time}}/g,getHourMinute(scheduleData[i].events[j].event.startTime)).replace(/{{count}}/g,"<span>"+joinerNum+"</span><span>人</span>").replace(/{{user}}/g,"@"+user);
                    }else{
                        eventList += that.config.template2.replace(/{{eventId}}/g,scheduleData[i].events[j].event.eventId).replace(/{{name}}/g,scheduleData[i].events[j].event.name).replace(/{{time}}/g,getHourMinute(scheduleData[i].events[j].event.startTime)).replace(/{{count}}/g,"").replace(/{{user}}/g,"");
                    }
                }else{
                    joinerNum = parseInt(scheduleData[i].events[j].joiner.length)+1;
                    user=scheduleData[i].events[j].owner.nickName;
                    eventList += that.config.template2.replace(/{{eventId}}/g,scheduleData[i].events[j].event.eventId).replace(/{{name}}/g,scheduleData[i].events[j].event.name).replace(/{{time}}/g,getHourMinute(scheduleData[i].events[j].event.startTime)).replace(/{{count}}/g,"<span>"+joinerNum+"</span><span>人</span>").replace(/{{user}}/g,"#"+user);
                }
            }
            $('.eventList').eq(i).append(eventList);
            if($('.list .num').html()=="0"){
                $(this).parent().css("display","none");
            }
            var listDate = $('.singleCon').eq(i).attr("data-date");
            if(Dom.compareDate(listDate)){
                $('.singleCon .left').eq(i).css("color","#66cccc");//改变列表中当天事件列表的时间颜色
            }
            if(Dom.smallerDate(listDate)){//已过期事件添加透明度
                $('.singleCon').eq(i).addClass("opa8");
            }
        }
        $('.singleCon .right .eventList .list').on("tap", function(){//点击事件跳转至事件详情页
            var eventId = $(this).attr("id");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/view/showEvent.html?eventId=" + eventId);
        })
    }
}

fuc.init();