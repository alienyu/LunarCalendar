var transCalendar = require("../vendor/LunarCalendar/transCalendar.js");
var Dom = {
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