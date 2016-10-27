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
    /*-------------获取域名，修改接口配置------------------*/
    configuration:function(){
        var host = window.location.host;
        if(host == "wx.li-li.cn"){
            return ["http://wx.li-li.cn/api","http://wx.li-li.cn"];
        }else{
            return ["http://www.li-li.cn/llwx","http://www.li-li.cn"];
        }
    },
    /*------------------明星日程时间显示-----------------------*/
    getStarDate: function(val_time1,val_time2,val_time3,val_type){//当前时间，开始时间，结束时间，重复类型
        var that = this;
        return that.getweek(val_time1) + ' ' + that.getHourMinute(val_time2);
    },
    /*---------------获取时间中的年月日部分--------------------*/
    getDate: function(date) {
        var dateArr = date.split(" ");
        return dateArr[0];
    },
    /* ------获取星期 2015-06-12---- */
    getweek: function(date){
        var week = ['周日','周一','周二','周三','周四','周五','周六']
        var arr1= new Array();
        arr1=date.split(' ')[0].split('-');     //日期为输入日期，格式为 2013-3-10
        var today=new Date(arr1[0],parseInt(arr1[1]-1),arr1[2]);
        return week[today.getDay()];
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
        var that = this;
        var dateArr = date.split(" ");
        var timeArr = dateArr[0].split("-"),
            time = dateArr[0].replace(/\-/g,"/");
        var theDate = new Date(time);
        var ca = new transCalendar(),
            theDay = timeArr[2],
            theMonth = timeArr[1];
        var theNlArr = ca.getls(theDate);
        var theWeek = that.transWeek(theDate);
        var nlDate = theNlArr[2]+"月"+theNlArr[3],
            month = timeArr[0]+"年"+timeArr[1]+"月";
        return [theDay,theWeek,nlDate,month,dateArr[0],theMonth];//返回当天是几日、星期几、农历月日、年月、没有时分秒的日期、月份
    },
    transWeek: function(day) {
        var week = day.getDay();
        switch (week){
            case 0:
                week = "周日";
                break;
            case 1:
                week = "周一";
                break;
            case 2:
                week = "周二";
                break;
            case 3:
                week = "周三";
                break;
            case 4:
                week = "周四";
                break;
            case 5:
                week = "周五";
                break;
            case 6:
                week = "周六";
                break;
        }
        return week;
    },
    transDate: function(date, showWeek) {
        var that = this;
        var ca = new transCalendar();
        var dateArr = date.split(" ");
        var dateTimeArr = dateArr[0].split("-");
        var theDate = new Date(dateArr[0]);
        var theNl = ca.getls(theDate);
        var theNlDate = '',week="";
        if(showWeek){
            week = that.transWeek(theDate);
        }
        if(dateArr[1]){//若时间格式为 yyyy-mm-dd hh:ii
            theNlDate =dateTimeArr[0]+"年"+theNl[2]+"月"+theNl[3]+"&nbsp;&nbsp;"+week+"&nbsp;&nbsp;"+dateArr[1];
        }else{//时间格式为 yyyy-mm-dd
            theNlDate = dateTimeArr[0]+"年"+theNl[2]+"月"+theNl[3];
        }
        $('.mbsc-fr-hdr').html(theNlDate);
    },
    /*--------------------比较开始时间和结束时间，并输出显示格式------------------*/
    compareTimes:function(startTime,endTime){
        var that = this,
            endArr = endTime.split(" ");
        var startYear = parseInt(startTime.split(" ")[0].split("-")[0], 10),
            startMonth = parseInt(startTime.split(" ")[0].split("-")[1], 10),
            startDay = parseInt(startTime.split(" ")[0].split("-")[2], 10),
            endYear = parseInt(endTime.split(" ")[0].split("-")[0], 10),
            endMonth = parseInt(endTime.split(" ")[0].split("-")[1], 10),
            endDay = parseInt(endTime.split(" ")[0].split("-")[2], 10),
            endTimeStr = endArr[1].split(':');
        if(startTime == endTime){
            return that.transStartTime(startTime);
        }else{
            if(startYear==endYear&&startMonth == endMonth&&startDay == endDay){
                return that.transStartTime(startTime)+"-"+endTimeStr[0]+":"+endTimeStr[1];
            }else if(startYear==endYear&&startMonth == endMonth&&startDay != endDay){
                return that.transStartTime(startTime)+"&nbsp;<span class='f12 ccc'>至</span><br>"+that.transStartTime(endTime);
            }else if(startYear==endYear&&startMonth != endMonth){
                return that.transStartTime(startTime)+"&nbsp;<span class='f12 ccc'>至</span><br>"+that.transStartTime(endTime);
            }else if(startYear!=endYear){
                return that.tranDate(startTime)+"&nbsp;<span class='f12 ccc'>至</span><br>"+that.tranDate(endTime);
            }
        }
    },

    /*-------------------转换时间格式，只获取月日，星期和时分-----------------------*/
    transStartTime:function(date){
        var that = this,
            current = new Date();
        var time = date.split(" "),
            currentYear = current.getFullYear();
        var dateArr = time[0].split("-");
        var timeStr = time[0].replace(/\-/g, "/");
        var hourArr = time[1].split(":");//将时分秒分割为数组
        var theDate = new Date(timeStr);//将日期转换成标准格式
        var theWeek = that.transWeek(theDate);//获取当前时间对应的星期
        if(dateArr[0] != currentYear){//若不是当年，则显示年份
            return dateArr[0] + "年"+dateArr[1] + "月" + dateArr[2] + "日" + " " + theWeek + " " + hourArr[0] + ":" + hourArr[1];
        }else{
            return  dateArr[1] + "月" + dateArr[2] + "日" + " " + theWeek + " " + hourArr[0] + ":" + hourArr[1];
        }
    },

    /*-------------------------转换获取的开始时间、结束时间、提醒时间格式---------------*/
    tranDate:function(date){
        var that = this;
        var time = date.split(" ");
        var dateArr = time[0].split("-");
        var timeStr = time[0].replace(/\-/g, "/");
        var hourArr = time[1].split(":");//将时分秒分割为数组
        var theDate = new Date(timeStr);//将日期转换成标准格式
        var theWeek = that.transWeek(theDate);//获取当前时间对应的星期
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
    //比较两个时间
    compareTimeDate: function(time, current) {
        if(current) {
            var curYear = parseInt(current.split(" ")[0].split("-")[0], 10),
                curMonth = parseInt(current.split(" ")[0].split("-")[1], 10),
                curDay = parseInt(current.split(" ")[0].split("-")[2], 10),
                curHour = current.split(" ")[1] ? parseInt(current.split(" ")[1].split(":")[0], 10) : 0,
                curMin = current.split(" ")[1] ? parseInt(current.split(" ")[1].split(":")[1], 10) : 0;
        } else {
            var today = new Date();
            var curYear = today.getFullYear(),
                curMonth = today.getMonth() + 1,
                curDay = today.getDate(),
                curHour = today.getHours(),
                curMin = today.getMinutes();
        }
        var toYear = parseInt(time.split(" ")[0].split("-")[0], 10),
            toMonth = parseInt(time.split(" ")[0].split("-")[1], 10),
            toDay = parseInt(time.split(" ")[0].split("-")[2], 10),
            toHour = time.split(" ")[1] ? parseInt(time.split(" ")[1].split(":")[0], 10) : 0,
            toMin = time.split(" ")[1] ? parseInt(time.split(" ")[1].split(":")[1], 10) : 0;
        //比较
        if(toYear > curYear) {
            return "over";
        } else if(toYear < curYear) {
            return "below";
        } else {
            if(toMonth > curMonth) {
                return "over";
            } else if(toMonth < curMonth) {
                return "below";
            } else {
                if(toDay > curDay) {
                    return "over";
                } else if(toDay < curDay) {
                    return "below";
                } else {
                    if(toHour > curHour) {
                        return "over";
                    } else if(toHour < curHour) {
                        return "below";
                    } else {
                        if(toMin > curMin) {
                            return "over";
                        } else if(toMin < curMin) {
                            return "below";
                        } else {
                            return "equal";
                        }
                    }
                }
            }
        }
    },
    getToday: function(date) {
        var today = new Date();
        var year = today.getFullYear(),
            month = today.getMonth() + 1,
            day = today.getDate();
        var isToday = false;
        if(date) {
            if(year == date.split("-")[0] && month == date.split("-")[1] && day == date.split("-")[2]) {
                isToday = true;
            }
        }
        return {
            year: year,
            month: month,
            day: day,
            weekDay: this.transWeek(today),
            isToday: isToday
        }
    },
    //调用天气接口时，判断当前是白天还是黑夜
    dayOrnight:function(time,sunUp,sunDown){
        var hour = parseInt(time.split(":")[0],10);
        var sunUpArr = sunUp.split(":"),sunDownArr=sunDown.split(":");
        var sunUpHour = parseInt(sunUpArr[0],10),sunDownHour=parseInt(sunDownArr[0],10);
        if(hour>sunUpHour&&hour<sunDownHour){
            return "dayTime";
        }else{
            return "nightTime";
        }
    },
    /*--------------textarea高度自适应---------------*/
    autoTextarea: function (elem, extra, maxHeight) {
        extra = extra || 0;
        var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
            addEvent = function (type, callback) {
                elem.addEventListener ?
                    elem.addEventListener(type, callback, false) :
                    elem.attachEvent('on' + type, callback);
            },
            getStyle = elem.currentStyle ? function (name) {
                var val = elem.currentStyle[name];
                if (name === 'height' && val.search(/px/i) !== 1) {
                    var rect = elem.getBoundingClientRect();
                    return rect.bottom - rect.top -
                        parseFloat(getStyle('paddingTop')) -
                        parseFloat(getStyle('paddingBottom')) + 'px';
                };
                return val;
            } : function (name) {
                return getComputedStyle(elem, null)[name];
            },
            minHeight = parseFloat(getStyle('height'));
        elem.style.resize = 'none';
        var change = function () {
            var scrollTop, height,
                padding = 0,
                style = elem.style;
            if (elem._length === elem.value.length) return;
            elem._length = elem.value.length;
            if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
            }
            ;
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            elem.style.height = minHeight + 'px';
            if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                    height = maxHeight - padding;
                    style.overflowY = 'auto';
                } else {
                    height = elem.scrollHeight - padding;
                    style.overflowY = 'hidden';
                }
                ;
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
            }
            ;
        };
        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
    },
    //点击textarea以外的位置时，textarea失去焦点，软键盘消失
    fixedTextareaBlur:function(){
        var beforelpt = null;
        $('textarea').on("focus",function(e){
            beforelpt = this;
        });
        $(document).on("tap",function(e){
            if(e.target.nodeName.toLocaleLowerCase()!="textarea"){
                if(beforelpt){
                    beforelpt.blur();
                    beforelpt = null;
                }
            }
        })
    }
}

Dom.checkUserAgent();
module.exports = Dom;