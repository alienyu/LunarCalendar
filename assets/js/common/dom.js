var transCalendar = require("../vendor/LunarCalendar/transCalendar.js");
var Dom = {
    getRequest: function(name) {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                //就是这句的问题
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
                //之前用了unescape()
                //才会出现乱码
            }
        }
        return theRequest[name];
    },
    /*---------------获取时间中的年月日部分--------------------*/
    getDate: function(date) {
        var dateArr = date.split(" ");
        return dateArr[0];
    },
    /*--------------------------得到事件时间中去掉年月日和秒的时间------------------------------*/
    getHourMinute: function(date) {
        var dateArr = date.split(" ");
        var timeArr = dateArr[1].split(":");
        var time = timeArr[0]+":"+timeArr[1];
        return time;
    },
    /*------------------------比较时间是否相等-------------------------*/
    compareDate: function(time) {
        var today = new Date();
        var theYear = today.getFullYear(),
            theMonth = today.getMonth()+ 1,
            theDay = today.getDate();
        var timeArr = time.split("-");
        if(theYear == timeArr[0] && theMonth == parseInt(timeArr[1]) && theDay == parseInt(timeArr[2])){
            return true;
        }else{
            return false;
        }
    },
    /*----------------比较时间大小----------------*/
    smallerDate:function(time){
        var today = new Date();
        var theYear = today.getFullYear(),
            theMonth = today.getMonth()+ 1,
            theDay = today.getDate();
        var timeStr = time.replace(/\-/g,"/");
        var theDate = new Date(timeStr),
            todayDate = new Date(theYear+"/"+theMonth+"/"+theDay);
        if(todayDate.getTime()-theDate.getTime()>0){
            return true;
        }else{
            return false;
        }
    },
    /*--------------------处理事件的日期----------------------*/
    tranDayDate: function(date) {
        var dateArr = date.split(" ");
        var timeArr = dateArr[0].split("-"),
            time = dateArr[0].replace(/\-/g,"/");
        var theDate = new Date(time);
        var ca = new transCalendar(),
            theDay = timeArr[2];
        var theNlArr = ca.getls(theDate);
        var theWeek = transWeek(theDate);
        var nlDate = theNlArr[2]+"月"+theNlArr[3],
            month = timeArr[0]+"年"+timeArr[1]+"月";
        return [theDay,theWeek,nlDate,month,dateArr[0]];//返回当天是几日、星期几、农历月日、年月、没有时分秒的日期
    },
    transWeek: function(day) {
        var week = day.getDay();
        switch (week){
            case 0:
                week = "星期日";
                break;
            case 1:
                week = "星期一";
                break;
            case 2:
                week = "星期二";
                break;
            case 3:
                week = "星期三";
                break;
            case 4:
                week = "星期四";
                break;
            case 5:
                week = "星期五";
                break;
            case 6:
                week = "星期六";
                break;
        }
        return week;
    },
    transDate: function(date, showWeek) {
        var ca = new transCalendar();
        var dateArr = date.split(" ");
        var dateTimeArr = dateArr[0].split("-");
        var theDate = new Date(dateArr[0]);
        var theNl = ca.getls(theDate);
        var theNlDate = '',week="";
        if(showWeek){
            week = this.transWeek(theDate);
        }
        if(dateArr[1]){//若时间格式为 yyyy-mm-dd hh:ii
            theNlDate =dateTimeArr[0]+"年"+theNl[2]+"月"+theNl[3]+"&nbsp;&nbsp;"+week+"&nbsp;&nbsp;"+dateArr[1];
        }else{//时间格式为 yyyy-mm-dd
            theNlDate = dateTimeArr[0]+"年"+theNl[2]+"月"+theNl[3];
        }
        $('.mbsc-fr-hdr').html(theNlDate);
    },
    /*-------------------------转换获取的开始时间、结束时间、提醒时间格式---------------*/
    tranDate:function(date){
        var time = date.split(" ");
        var dateArr = time[0].split("-");
        var timeStr = time[0].replace(/\-/g, "/");
        var hourArr = time[1].split(":");//将时分秒分割为数组
        var theDate = new Date(timeStr);//将日期转换成标准格式
        var theWeek = Dom.transWeek(theDate);//获取当前时间对应的星期
        return dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日" + " " + theWeek + " " + hourArr[0] + ":" + hourArr[1];
    },
    getDateList: function() {
        var dateItem = "";
        var theDateList = $('.date_slide .date_list');
        for (var i = 0; i < theDateList.size(); i++) {
            if (theDateList.eq(i).attr("class") == "date_list active") {
                dateItem = theDateList.eq(i).find('.date_item');
            } else {
                dateItem = theDateList.eq(0).find('.date_item');
            }
        }
        return dateItem;
    },
    checkUserAgent: function() {
        this.mobile = {
            platform: '',
            version: 0,
            Android: function () {
                return this.platform === 'Android';
            },
            iOS: function () {
                return this.platform === 'iOS';
            },
            init: function () {
                var ua = navigator.userAgent;
                if (ua.match(/Android/i)) {
                    this.platform = 'Android';
                    this.version = parseFloat(ua.slice(ua.indexOf("Android") + 8));
                }
                else if (ua.match(/iPhone|iPad|iPod/i)) {
                    this.platform = 'iOS';
                    this.version = parseFloat(ua.slice(ua.indexOf("OS") + 3));
                }
            }
        };
        this.mobile.init();
    },
    /*-----------------------向左滑动时让schedule的高度等于黄历内容的高度------------------------*/
    slideLeft: function() {
        $('.scheBtn').removeClass('active');
        $('.almaBtn').addClass('active');
        $('.scheduleList').animate({"left": "-100%"}, 500);
        $('.almanac').animate({"left": "0px"}, 500);
        var almaHeight = parseInt($('.almanac').css('height'));
        $('.schedule').css('height', 40 + almaHeight + "px");
    },
    /*--------------------向右滑动时让schedule的高度等于日程内容的高度-------------------------*/
    slideRight: function() {
        $('.scheBtn').addClass('active');
        $('.almaBtn').removeClass('active');
        $('.scheduleList').animate({left: "0px"}, 500);
        $('.almanac').animate({left: "100%"}, 500);
        var scheHeight = parseInt($('.scheduleList').css('height'));
        $('.schedule').css('height', 40 + scheHeight + "px");
    },
}

Dom.checkUserAgent();
module.exports = Dom;