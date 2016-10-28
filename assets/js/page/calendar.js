require("../../css/page/calendar.less");
var pageLoad = require("../common/pageLoad.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var Dom = require("../common/dom.js");
var Ajax = require("../common/ajax.js");
var Lunar = require("../common/lunar.js");
var wx = require("../vendor/weChat/wxInit.js");

var fuc = {
    config: {
        birthday: "",
        urlArr:"",
        isGoodDay: false,
        screenWidth :$(document.body).width()//获取屏幕宽度
    },
    init: function() {
        pageLoad({backgroundColor: "#fff"});
        this.config.urlArr = Dom.configuration();
        this.renderPage();
        this.bindEvent();
    },
    renderPage: function() {
        var screenHeight = $(document.body).height(),
            toolbarHeight = $('#toolbar').height(),
            wrapperHeight = $('.wrapper').height(),
            titleHeight = $('.schedule h1').height();
        this.otherHeight = screenHeight-toolbarHeight-wrapperHeight-titleHeight;
        wx.wxConfig(1);
        setTimeout(function(){
            wx.wxShare("【 历历LilyCalendar】让回忆与温故成为一件轻松的事情", "这是一个简单操作的日历系统，但却能发挥各式各样和生活有关的活用。");
        },1500);
        this.getUserInformation();//获取用户信息，若用户设置了生日，则可获取生日
        Ajax.getEventOfMonth();//判断当前页面的时间中有没有事件，有事件的在下方加点
        /*----------------------------------进入页面时，显示当天的事件列表和运势-------------------------------------------*/
        var theDay = $('.date_current').attr('id');
        Ajax.getEventOfDay(theDay);//获取一天的事件
        Ajax.getFortune(theDay);//获取当天的黄历
        /*--------------------------获取点击日期，显示当天的日程列表和运势--------------------------*/
        Lunar.clickDate();
        this.selectBirthday = this.selectBirthdayDate('#birthday')
        this.selectBirthday.setVal(new Date("1990/01/01"));//选择生日
        var wrapper = document.getElementById('wrapper');
        wrapper.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },
    getUserInformation: function() {
        var that=this;
        console.log(that.config.urlArr[0]+"/user/detail");
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/user/detail",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    that.config.birthday = data.data.birthday;
                    if (that.config.birthday != null && that.config.birthday != "") {
                        var birthdayArr = that.config.birthday.split(" ");
                        var birthdayStr = birthdayArr[0].replace(/\-/g, "/"),
                            birthdayDateArr = birthdayArr[0].split("-");
                        that.selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
                        $('.birthday').html("（"+birthdayDateArr[1]+"月"+birthdayDateArr[2]+"日）");
                    }
                }
            }
        });
    },
    selectBirthdayDate: function(obj) {
        var that = this;
        var selb = mobiScroll.date(obj, {
            theme: 'android-holo-light',
            lang: 'zh',
            display: 'bottom',
            dateFormat: 'yyyy-mm-dd',
            min: new Date(1921, 1, 1),
            max: new Date(2020, 1, 1),
            readonly: false,
            onShow: function (event, inst) {
                var theDate = inst._tempValue;
                Dom.transDate(theDate);
            },
            onSet: function (event, inst) {
                if(that.config.isGoodDay){//跳转吉日
                    that.config.isGoodDay=false;
                    $('.lucky').animate({'bottom': '0px'}, 500);					
                }
                $('#loadingToast').fadeIn();//显示loading
                var selectedDate = inst.getVal();//获取选择时间的标准形式
                var selectedTime = inst._tempValue;//获取选择时间 yyyy-mm-dd
                $('.alConBg').css("display", "none");
                $('.content').css("display", "block");
                Ajax.setBirthday(selectedTime);//将用户设置的生日传至后台
                that.config.birthday = selectedTime + "08:00:00";//保存用户设置的生日
                var birthdayStr = selectedTime.replace(/\-/g,"-"),
                    birthdayArr = selectedTime.split("-");
                that.selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
                $('.birthday').html("（"+birthdayArr[1]+"-"+birthdayArr[2]+"）");
            },
            onChange: function (event, inst) {
                var changeDate = inst._tempValue;
                Dom.transDate(changeDate);
            },
            onCancel: function (event, inst) {
                Dom.slideLeft();
                that.config.isGoodDay = false;
            }
        });
        return selb;
    },
    bindEvent: function() {
        var that = this;
        //添加活动按钮
        $("#addActivity").on('tap', function (e) {
            if ($(e.target).hasClass("open")) {
                $(e.target).removeClass("open");
                $(".select_mask").fadeOut();
                $("#btnDetail").removeClass("move_up").addClass("move_down");
            } else {
                $(e.target).addClass("open");
                $(".select_mask").fadeIn();
                $("#btnDetail").removeClass("move_down").addClass("move_up");
            }
        });
        $('.activity').on('tap',function(){
            var dateCurrent = $('.date_current').attr('id');
            window.location.href= that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/activity.html?date="+dateCurrent);
        });
        $('.remind').on('tap',function(){
            var dateCurrent = $('.date_current').attr('id');
            window.location.href= that.config.urlArr[0]+"/common/to?url2=" + encodeURIComponent(that.config.urlArr[1]+"/wx/view/remind.html?date="+dateCurrent);
        });

        /*--------------点击/滑动的tab切换效果，容器高度随显示内容变化--------------------------*/
        $('.scheduleCon').css("min-height",this.otherHeight+"px");
        var scheHeight = parseInt($('.scheduleList').css('height'));
        $('.schedule').css("height", 40+scheHeight+"px");
        $('.scheBtn').on('tap', function (event) {
            Dom.slideRight();
        });
        $('.almaBtn').on('tap', function (event) {
            Dom.slideLeft();
        });
        $('.scheduleList').on('swipeLeft', function (event) {
            Dom.slideLeft();
            event.preventDefault();
            return false;
        });
        $('.almanac').on('swipeRight', function (event) {
            Dom.slideRight();
            event.preventDefault();
            return false;
        });
        /*--------------------------------吉日-------------------------------*/
        var _btns = $('.lucky .word_item span');
        //var _btnsB = $('.inFrame .word_item span');
        var num02 = 0;
        $('.inFrame').css("width",3*that.config.screenWidth+"px");//底部一行吉日容器的宽度
        /*---------------------------点击上方吉日按钮，若用户设置了生日则显示吉日列表，没有设置则提示用户设置生日-------------*/
        $('.luckyDay').on('tap', function (event) {
            if (that.config.birthday) {
                _btns.each(function () {
                    $(this).removeClass("active");
                });
                $('.lucky').animate({'bottom': '0px'}, 500);
				$('.lucky02').animate({'bottom': "-64px"}, 500);
				$('.close02').animate({'bottom':'-30px'},500);
				$('.calendar_add').removeClass("c_a_open");
            } else {
                $('#dialog2').fadeIn().on('click', '.weui-dialog__btn', function () {
                    $('#dialog2').fadeOut();
                    that.config.isGoodDay = true;
                    that.selectBirthday.show();
                });
            }
        });

        /*------------------一行吉日列表的滑动查看效果-----------------------*/
        var lucky02 = document.getElementById('lucky02');
        lucky02.addEventListener("touchmove", function (e) {
            e.preventDefault();
        });
        var timer1 = null, timer2 = null;
        $('.lucky02').on('swipeLeft', function (event) {
            clearInterval(timer1);
            clearInterval(timer2);
            timer1 = setInterval(function () {
                num02 += 0.05;
                if (num02.toFixed(2) % 1 == 0) {
                    clearInterval(timer1);
                }
                if (num02 > 2) {
                    clearInterval(timer1);
                    num02 = 2;
                }
                $('.inFrame').css('left', -num02 * that.config.screenWidth + 'px');
            }, 15);
            event.preventDefault();
            return false;
        });
        $('.lucky02').on('swipeRight', function (event) {
            clearInterval(timer2);
            clearInterval(timer1);
            timer2 = setInterval(function () {
                num02 -= 0.05;
                if (num02.toFixed(2) % 1 == 0) {
                    clearInterval(timer2);
                }
                if (num02 < 0) {
                    num02 = 0;
                    clearInterval(timer2);
                }
                $('.inFrame').css('left', -num02 * that.config.screenWidth + 'px');
            }, 15);
            event.preventDefault();
            return false;
        });

        /*------------------点击吉日列表中的关闭按钮，列表隐藏，日历中所有日期恢复初始状态-----------------------*/
        $('.close').on('tap', function (event) {
            Lunar.selectWord = "";
            var dateItem = Dom.getDateList();
            var wordItem = $('.luckyWord .word_item span');
            $('.lucky').animate({'bottom': "-265px"}, 500);	
            for (var i = 0; i < dateItem.size(); i++) {
                dateItem.eq(i).removeClass("Not-lucky");
            }
            for (var j = 0; j < wordItem.size(); j++) {
                wordItem.eq(i).removeClass("active");
            }
        });
        $('.close02').on('tap', function (event) {
            Lunar.selectWord = "";
            var dateItem = Dom.getDateList();
            var wordItem = $('.lucky02 .word_item span');
            $('.lucky02').animate({'bottom': "-64px"}, 500);
			$('.calendar_add').removeClass("c_a_open");
            $('.close02').animate({'bottom':'-30px'},500);
            for (var i = 0; i < dateItem.size(); i++) {
                dateItem.eq(i).removeClass("Not-lucky");
            }
            for (var j = 0; j < wordItem.size(); j++) {
                wordItem.eq(j).removeClass("active");
            }
        });
    }
}

fuc.init();