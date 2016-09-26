/**
 * Created by admin on 2016/9/22.
 */
require("../../css/page/activity.less");
var pageLoad = require("../common/pageLoad.js");
require("../vendor/ImproveMobile/zeptoSlider.js");
//require("../common/BMap.js");
var Dom = require("../common/dom.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var wx = require("../vendor/weChat/wxInit.js");
var Ajax = require("../common/ajax.js");
var fastClick = require("../vendor/ImproveMobile/fastClick.js");
var autoTextArea = require("../vendor/ImproveMobile/autoTextArea.js");

var fuc = {
    config: {
        eventId: "",
        nickName: "",
        tagId: "",//用户选择的快捷标签Id
        time: "",
        timeArr: "",
        remindSelect:"",
        repeatSelect:"",
        map:"",
        bgColor:"",//背景颜色
        bgImg:"",//背景图片
        materialId:"",//背景图id
        remarkText:"",
        remarkImgs:""
    },

    init:function(){
        pageLoad({backgroundColor: "#66cccc"});
        this.config.time = this.ifTimeExist(Dom.getRequest("date"));
        this.config.timeArr = this.transTime(this.config.time);
        this.config.eventId = Dom.getRequest("eventId");
        this.config.remindSelect = document.getElementById("select");
        this.config.repeatSelect = document.getElementById('select1');
        this.config.map = {//颜色与其名称的键值对
            '#66cccc':'默认颜色',
            '#0b8043':'罗勒绿',
            '#33b679':'鼠尾草绿',
            '#039be5':'孔雀蓝',
            '#4285f4':'钴蓝',
            '#8e24aa':'葡萄紫',
            '#9e69af':'水晶紫',
            '#d50000':'番茄红',
            '#f4511e':'橘红',
            '#795548':'可可棕',
            '#616161':'石墨黑'
        };
        this.config.bgColor = '#66cccc';
        this.rem();
        this.renderPage();
        this.getTags();
        this.uploaderImg();
        this.bindEvent();
    },

    rem: function() {
        fastClick.attach(document.body);
        (function($,undefined){"use strict";var pluginName='scojs_message';$[pluginName]=function(message,type){clearTimeout($[pluginName].timeout);var $selector=$('#'+$[pluginName].options.id);if(!$selector.length){$selector=$('<div/>',{id:$[pluginName].options.id}).appendTo($[pluginName].options.appendTo)}$selector.html(message);if(type===undefined||type==$[pluginName].TYPE_ERROR){$selector.removeClass($[pluginName].options.okClass).addClass($[pluginName].options.errClass)}else if(type==$[pluginName].TYPE_OK){$selector.removeClass($[pluginName].options.errClass).addClass($[pluginName].options.okClass)}$selector.slideDown('fast',function(){$[pluginName].timeout=setTimeout(function(){$selector.slideUp('fast')},$[pluginName].options.delay)})};$.extend($[pluginName],{options:{id:'page_message',okClass:'page_mess_ok',errClass:'page_mess_error',delay:500,appendTo:'body'},TYPE_ERROR:1,TYPE_OK:2})})($);
    },

    selectTimes: function(obj1, obj2) {
        var that = this;
        var selb = mobiScroll.datetime(obj1, {
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'bottom',
            timeWheels: 'yy-mm-dd HHii',
            dateFormat: 'yy-mm-dd HH:ii',
            min: new Date(1921, 1, 1),
            max: new Date(2020, 1, 1),
            readonly: false,
            onShow: function (event, inst) {
                var theDate = inst._tempValue;
                Dom.transDate(theDate,true);
            },
            onSet: function (event, inst) {
                var selectedDate = inst.getVal();//获取选择时间的标准形式
                var selectedTime = inst._tempValue;//获取选择时间 yyyy/mm/dd  hh:ii
                var selectedDateArr = inst._wheelArray;//获取选择时间的数组 [yy,mm,dd,hh,ii]
                var selectedTimeArr = selectedTime.split(" ");
                var theWeek = Dom.transWeek(selectedDate);
                $(obj2).html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                var theId = selectedDateArr[0] + "-" + that.tf(parseInt(selectedDateArr[1]) + 1)+ "-" + that.tf(selectedDateArr[2]) + " " + selectedTimeArr[1] + ":00";
                $(obj2).attr("id", theId);
                if(obj2 =='.startCon'){//若修改的是开始时间的日期，则指定提醒时间日期等于开始时间，结束时间比开始时间大10分钟
                    $('.remindTime').html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    $(".remindTime").attr("id", theId);
                    $('.endCon').html(selectedDateArr[0] + "年" + (parseInt(selectedDateArr[1]) + 1) + "月" + that.tf(selectedDateArr[2]) + "日" + " " + theWeek + " " + selectedTimeArr[1]);
                    $('.endCon').attr("id",theId);
                    that.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));//重新设置结束时间的初始值
                    that.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));//重新设置提醒时间的初始值
                }
            },
            onChange: function (event, inst) {
                var changeDate = inst._tempValue;
                Dom.transDate(changeDate,true);
            }
        });
        return selb;
    },

    shareShadow: function() {
        var shareShadow = $('.shareShadow');
        shareShadow.fadeIn();//显示分享提示层
        var qrcodeImg = $('.qrcodeImgBox');
        qrcodeImg.click(function () {
            $(this).addClass("q-big");
            event.stopPropagation();
        });//放大二维码
        shareShadow.click(function(){
            $(this).fadeOut();
            event.stopPropagation();
        });
        var share = document.getElementById('shareShadow');
        share.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },

    /*----------------------若日期中的数组小于10，则在前面加0-------------------*/
    tf: function(time) {
        if(time<10){
            time = "0"+time;
        }
        return time;
    },

    /*-------------------------------转换日期格式，开始时间加10分钟-------------------------------------*/
    ifTimeExist:function(time){
        var that = this;
        if(!time){
            var d = new Date();//获得当天日期
            var years = d.getFullYear();
            var months = d.getMonth() + 1;
            var days = that.tf(d.getDate());
            return years + "-" + months + "-" + days;
        }else{
            return time;
        }
    },

    transTime: function(time) {
        var that = this;
        var date = new Date();
        var timeArr = time.split('-');
        var theTime = time.replace(/\-/g, "/");
        var theDate = new Date(theTime);
        var theWeek = Dom.transWeek(theDate);
        var startHour = date.getHours(), startMinute = date.getMinutes() + 10;
        if (startMinute >= 60) {
            startHour = startHour + 1;
            if (startMinute - 60 >= 10) {
                startMinute = startMinute - 60;
            } else {
                startMinute = "0" + (startMinute - 60);
            }
            if (startHour == 24) {
                startHour = 23;
                startMinute = date.getMinutes();
            }
        }
        var startId = timeArr[0] + "-" + that.tf(parseInt(timeArr[1])) + "-" + timeArr[2] + " " + startHour + ":" + startMinute + ":00";
        //给开始时间，结束时间，提醒时间设置ID，提交数据时只需要提交id内容即可
        $('.startCon').attr("id", startId);
        $('.endCon').attr("id", startId);
        $('.remindTime').attr("id", startId);
        var startTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + startHour + ":" + startMinute,
            endTime = timeArr[0] + "年" + timeArr[1] + "月" + timeArr[2] + "日" + " " + theWeek + " " + startHour + ":" + startMinute;
        return [startTime, endTime];
    },

    /*---------------------修改开始时间、结束时间、指定提醒时间样式，为其设置时间选择器的初始值---------------------*/
    setInitTime: function(obj) {
        var time = obj.attr("id");
        var date = time.split(" ");
        var theDate = date[0].replace(/\-/g,"/"),
            theTime = date[1].split(":");
        return theDate+" "+theTime[0]+":"+theTime[1];
    },

    /*----------------获取用户选择快捷标签对应的主题-------------------*/
    getTemplate:function(templateId){
        if(tamplateId){
            $.get(
                "http://www.li-li.cn/llwx/template/detail",
                {
                    'tid':templateId
                },
                function(data){
                    if(data.code == 0){
                        var list = data.data;
                        if(list.color){//若对应的是背景颜色
                            $('.colorShow').css("background",list.color);
                            $('.colorText').html(that.config.map.list.color);
                        }else if(list.material){//若对应的是背景图片
                            //未完成

                        }
                    }
                }
            )
        }
    },

    hideTags: function() {
        var that = this;
        $('.tipsCon a').click(function (event) {
            $('.eventName').val($(this).html());
            that.config.tagId  = $(this).attr("data-tag");//保存用户选择的标签id
            that.getTemplate();
            $('.tips').slideUp();
            event.preventDefault();
        });
    },

    getTags: function() {
        var that = this;
        var template = $('#tagListTemplate').html();
        var html = "";
        $.get("http://www.li-li.cn/llwx/tag/list",{"all":true},function(data){
//                console.log(data);
            if(data.code==0) {
                var list = data.data;
                for (var i = 0; i < list.length; i++) {//显示标签对应的内容及模板ID
                    html += template.replace(/{{templateId}}/g,list[i].templateId).replace(/{{tagId}}/g,list[i].tagId).replace(/{{tagName}}/g, list[i].tagName);
                }
                $('.tipsCon').html("").append(html);
                that.hideTags();
            }else{//数据加载失败显示错误提示框
                var error = data.msg;
                $('#dialog2 .weui_dialog_bd').html(error);
                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                    $('#dialog2').off('click').hide();
                });
            }
        })
    },

    renderPage:function(){
        var that = this;
        //wx.wxConfig(1);
        if(that.config.eventId){//若用户是通过编辑按钮进入 页面，则拉取事件ID对应的信息
            that.getData();
            that.colorInit();
        }else{
            /*--------------设置颜色初始值------------------*/
            $('.colorShow').css("background",that.config.bgColor);
            $('.colorText').html(that.config.map[that.config.bgColor]);
            that.colorInit();
            /*---------------------开始时间、结束时间、指定提醒时间的时间显示---------------------*/
            $('.startCon').html(that.config.timeArr[0]);
            $('.endCon').html(that.config.timeArr[1]);
            $('.remindTime').html(that.config.timeArr[0]);
        }
        that.selectColor();
        /*---------提醒类型选择的监听事件---------*/
        var select = document.getElementById('select1');
        select.onchange = function(){
            if(select.value == 3){
                $('.remindTime').animate({"height":"30px"},200);
                $('#remindTime').css("display","block");
            }else{
                $('.remindTime').animate({"height":"0px"},200);
                $('#remindTime').css("display","none");
            }
        }
        /*---------------------------------开始时间、结束时间、指定提醒时间三个地方的日期选择功能---------------------------------*/
        this.selectTimes('#startTime', '.startCon').setVal(new Date(that.setInitTime($('.startCon'))));
        this.selectTimes('#endTime', '.endCon').setVal(new Date(that.setInitTime($('.endCon'))));
        this.selectTimes('#remindTime', '.remindTime').setVal(new Date(that.setInitTime($('.remindTime'))));
    },

    /*--------------通过eventID拉去页面数据------------------*/
    getData:function(){
        var that = this;
        $('.delete').css("display","block");//用户可删除事件
        $(".topTips").css("display","none");//隐藏头部的快捷标签
        $.get(
            "http://www.li-li.cn/llwx/event/detail",
            {
                "eventId":that.config.eventId
            },
            function(data){
                if(data.code == 0){
                    var eventList = data.data;
                    $('.eventName').val(eventList.name);//标题内容
                    autoTextArea(document.getElementById("eventTitle"));
                    var theStartTime = Dom.tranDate(eventList.startTime),
                            theEndTime = Dom.tranDate(eventList.endTime),
                            tipType = eventList.tipType,
                            repeatType = eventList.repeatType,
                            location = eventList.location;
                    that.config.bgColor = eventList.bgColor;
                    that.config.materialId = eventList.material.materialId;//获取用户设置的背景图id
                    that.config.remarkText = eventList.remark;
                    that.config.remarkImgs = eventList.remarkImgs;
                    that.config.nickName = eventList.user;//当前用户昵称
                    $('.startCon').html(theStartTime).attr("id",eventList.startTime);
                    $('.endCon').html(theEndTime).attr("id",eventList.endTime);
                        /*------------设置重复类型----------------*/
                    var repeatOptions = that.config.repeatSelect.getElementByTagName("option");
                    for(var j=0;j<repeatOptions.length;j++){
                        repeatOptions[j].setAttribute("selected",false);
                    }
                    repeatOptions[repeatType].setAttribute("selected",true);
                        /*-------------设置提醒类型------------------*/
                    var remindOption = that.config.remindSelect.getElementsByTagName('option');
                    for(var i=0;i<remindOption.length;i++){
                        remindOption[i].setAttribute("selected",false);
                    }
                    remindOption[tipType].setAttribute("selected",true);//设置默认选中值
                    if(tipType==3){
                        $('.remindTime').animate({"height":"30px"},200);
                        $('#remindTime').css("display","block");
                    }
                    if(location){
                        $('.site').removeClass('ccc');
                        $('.siteText').html(location);
                    }
                    if(that.config.remarkText){
                        $('.remarkCon .remarkText').removeClass('ccc').html(that.config.remarkText);
                        $('#remarkText').val(that.config.remarkText);
                    }
                    if(that.config.bgColor){
                        $('.colorShow').css("background",that.config.bgColor);
                        $('.colorText').html(that.config.map[that.config.bgColor]);
                    }
                }else{

                }
            }
        )
    },

    /*---------------弹层效果------------------*/
    shadow:function(obj,shadow,container){
        obj.click(function(){
            $('.shadowBg').fadeIn();
            shadow.show();
            container.animate({"top":"10%"},200);
        });
        $('.shadowClose').click(function(){
            container.animate({"top":"100%"},200,function(){
                $(this).parent().hide();
            });
            $('.shadowBg').fadeOut();
        });
    },

    /*--------------颜色弹层中的颜色初始化--------------*/
    colorInit:function(){
        var that = this,
            colorTemplate = $('#colorsListTemplate').html(),
            imgTemplate = $('#imgListTemplate').html(),
            colorHtml="",
            colorArr = [];
        //颜色列表初始化
        for(var i in that.config.map){
            colorHtml += colorTemplate.replace(/{{color}}/g,i).replace(/{{colorName}}/g,that.config.map[i]);
            colorArr.push(i);
        }
        $('.colorCon').append(colorHtml);
        var theBigger = $('.bigger');
        for(var k= 0;k<theBigger.size();k++){
            theBigger.eq(k).css("background",colorArr[k]);
        }
        //设置选中的颜色
        var colorItem = $('.colorCon .colorItem');
        for(var m=0;m<colorItem.size();m++){
            if(colorItem.eq(m).attr("data-colors") ==that.config.bgColor){
                colorItem.eq(m).addClass("active");
                colorItem.eq(m).find(".smaller").css("background",that.config.bgColor);
            }
        }
        //图片列表初始化
        $.get(
            "http://www.li-li.cn/llwx/material/list",
            {
                "all":true
            },
            function(data){
                if(data.code == 0){
                    var imgList = data.data.list,imgHtml="";
                    console.log(imgList);
                    for(var n=0;n<imgList.length;n++){
                        console.log(n);
                        imgHtml+=imgTemplate.replace(/{{materialId}}/g,imgList[n].materialId);
                    }
                    $('.imageCon').append(imgHtml);
                    var imgName = $('.imgItem .imgName');
                    for(var p=0;p<imgName.size();p++){
                        console.log(imgList[p].url);
                        imgName.eq(p).css({"background-image":"url("+imgList[p].url+")"});
                    }
                }
            }
        )
    },

    /*-----------------选择颜色--------------------*/
    selectColor:function(){
        var that = this;
        var items = $('.colorShadow .items'),
            smaller = $('.bigger .smaller');
        items.click(function(){
            for(var i=0;i<items.size();i++){
                items.eq(i).removeClass("active");
            }
            for(var j=0;j<smaller.size();j++){
                smaller.eq(j).css("background","#fff");
            }
            $(this).addClass("active");
            if($(this).find(".smaller")){//若点击的是颜色
                that.config.bgColor = $(this).attr("data-colors");
                $(this).find(".smaller").css("background",that.config.bgColor);
                //设置显示页面的颜色显示
                $('.colorShow').css("background",that.config.bgColor);
                $('.colorText').html(that.config.map[that.config.bgColor]);
            }else{
                that.config.bgImg = $(this).attr("data-img");
            }
        })
    },

    /*------------------------备注中上传图片-------------------------*/
    uploaderImg:function(){
        var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
            $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
            $uploaderInput = $("#uploaderInput"),
            $uploaderFiles = $("#uploaderFiles");

        $uploaderInput.on("change", function(e){
            var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
            for (var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];
                console.log(file);
                console.log(file.name);
                var reader = new FileReader();
                if (url) {
                    src = url.createObjectURL(file);
                } else {
                    src = e.target.result;
                }
                console.log(typeof src);
                //$.ajax({
                //    type: "post",
                //    url: "http://www.li-li.cn/llwx/file/upload",
                //    data:{
                //        "file":reader.readAsDataURL(src)
                //    },
                //    dataType: "json",
                //    success: function (data) {
                //        console.log(data);
                //    }
                //})
                $uploaderFiles.append($(tmpl.replace('#url#', src)));
            }
        });
        $uploaderFiles.on("click", "li", function(){
            $galleryImg.attr("style", this.getAttribute("style"));
            $gallery.fadeIn(100);
        });
        $gallery.on("click", function(){
            $gallery.fadeOut(100);
        });
    },

    bindEvent:function(){
        var that = this;
        $('.eventName').focus(function () {
            $('.topTips').slideUp(800);
        });
        /*------------点击地图，图标跳动------------*/
        $('.mapCon').click(function(){
            $('.imgCon').addClass('active');
            setTimeout(function(){
                $('.imgCon').removeClass('active');
            },600);
        })
        /*-------------点击开始时间后面的展开按钮---------*/
        $('.timeIconCon').click(function(){
            if($(".timeIcon").attr("class")=="timeIcon active"){
                $(".timeIcon").removeClass("active");
                $('.endTime').animate({'height':'0px'},300);
                $('.timeText').animate({"width":"0px"},300);
            }else{
                $(".timeIcon").addClass("active");
                $('.endTime').animate({'height':'60px'},300);
                $('.timeText').animate({"width":"33px"},300);
            }
        })
        /*-----------展开顶部的快捷标签-------------*/
        $('.showAll').click(function(){
            if($('.showAll span').attr("class")=="active"){
                $('.showAll span').removeClass("active");
                $('.tipsCon').animate({"height":"60px"},300);
            }else{
                $('.showAll span').addClass("active");
                $('.tipsCon').animate({"height":"auto"},300);
            }
        })
        /*----------弹层----------*/
        that.shadow($('.site'),$('.mapShadow'),$('.mapShadow .container'));
        that.shadow($('.colors'),$('.colorShadow'),$('.colorShadow .container'));
        that.shadow($('.remark'),$('.remarkShadow'),$('.remarkShadow .container'));
        /*----------备注弹层中的点击事件-------------*/
        $('.remarkShadow .cancel').click(function(){
            $('.remarkShadow .container').animate({"top":"100%"},200,function(){
                $('.remarkShadow').hide();
            });
            $('.shadowBg').fadeOut();
        });
        $('.remarkShadow .finished').click(function(){
            that.config.remarkText = $('#remarkText').val();
            //that.config.remarkImgs = ;
            $('.remarkCon .remarkText').removeClass("ccc").html(that.config.remarkText);
            $('.remarkShadow .container').animate({"top":"100%"},200,function(){
                $('.remarkShadow').hide();
            });
            $('.shadowBg').fadeOut();
        });
        /*------------点击分享--------------*/
        $('.share').click(function(){
            var name = $('#eventTitle').val().replace(/\s+/, ""),
                startTime = $('.startCon').attr("id"),
                endTime = $('.endCon').attr("id"),
                repeatType = that.config.repeatSelect.value,
                location = $('.siteText').html(),
                tipType = that.config.remindSelect.value,
                tipTime = "";
            if(tipType == 3){
                tipTime =$('.remindTime').attr("id");
            }
            if (that.config.eventId) {
                if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                    $.scojs_message('缺少事件名称', $.scojs_message.TYPE_ERROR);
                }else{
                    Ajax.eventModify(that.config.eventId,name,that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, location,'longitude','latitude', that.config.remarkText,that.config.remarkImgs,that.config.bgColor,that.config.materialId);
                    //todo 弹出蒙层
                    that.shareShadow(); //显示分享提示弹出层，点击后隐藏
                }
            }else{
                if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                    $.scojs_message('缺少事件名称', $.scojs_message.TYPE_ERROR);
                }else{
                    $('#dialog1').show();
                    $('#dialog1 .confirm').on("tap", function () {//点击确定
                        Ajax.eventAdd2(name,1,that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, location,'longitude','latitude', that.config.remarkText,that.config.remarkImgs,that.config.bgColor,that.config.materialId);
                        Ajax.getUserInformation2();
                        wx.wxConfig(2, that.config.nickName + " 邀请您参加 「" + name+"」", $('.startTime').html(),
                            "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/showEvent.html?eventId=" + that.config.eventId));
                        sessionStorage.setItem(that.config.eventId, [name, that.config.tagName,startTime, endTime, tipType, repeatType, remark, location, tipTime]);
                        $('#dialog1').hide();
                        //todo 弹出蒙层
                        if(!$('.qrcodeImg').html()){
                            that.createQrcode(that.config.eventId);
                        }
                        that.shareShadow(); //显示分享提示弹出层，点击后隐藏
                    });
                    $('.default').on("tap", function () {
                        $('#dialog1').hide();
                    });
                }
            }
        })
        /*------------点击保存--------------*/
        $('.saveBtn').click(function(){

            $('#loadingToast').show();//显示loading
            var name = $('#eventTitle').val().replace(/\s+/, ""),
                startTime = $('.startCon').attr("id"),
                endTime = $('.endCon').attr("id"),
                repeatType = that.config.repeatSelect.value,
                location = $('.siteText').html(),
                tipType = that.config.remindSelect.value,
                tipTime = "";
            if(tipType == 3){
                tipTime =$('.remindTime').attr("id");
            }
            if (name == "") {//如果没有填写事件名称，不提交事件，提醒用户填写名称
                $.scojs_message('缺少事件名称', $.scojs_message.TYPE_ERROR);
                $('#loadingToast').fadeOut();
            }else{
                if(that.config.eventId){//若事件已保存，则调用修改事件
                    Ajax.eventModify(that.config.eventId,name,that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, location,'longitude','latitude', that.config.remarkText,that.config.remarkImgs,that.config.bgColor,that.config.materialId);
                }else{
                    Ajax.eventAdd(name,1,that.config.tagId, startTime, endTime, tipType, tipTime, repeatType, location,'longitude','latitude', that.config.remarkText,that.config.remarkImgs,that.config.bgColor,that.config.materialId);
                }
            }

        })
        /*---------------点击删除---------------*/
        $('.delete').click(function(){
            $('#dialog1').show();
            $('#confirm').on('tap', function () {//点击确定按钮
                $('#dialog1').hide();
                $('#loadingToast').show();//显示loading
                $.get("http://www.li-li.cn/llwx/event/del", {"eventId": that.config.eventId}, function (data) {
                    if (data.code == 0) {//删除成功
                        $('#loadingToast').fadeOut();//隐藏loading
                        $('#toast').show();
                        setTimeout(function () {
                            $('#toast').hide();
                            if(document.referrer==""){
                                WeixinJSBridge.call("closeWindow");
                            }else{
                                window.location.href = document.referrer;//返回上一个页面
                            }
                        }, 1500);
                    } else {//删除失败弹出提示框
                        $('#loadingToast').fadeOut();//隐藏loading
                        var error = data.msg;
                        $('#dialog2 .weui_dialog_bd').html(error);
                        $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                            $('#dialog2').off('click').hide();
                        });
                    }
                })
            });
            $('#cancel').on('tap', function () {//点击取消按钮
                $('#dialog1').hide();
            });
        })
    }
}

fuc.init();
