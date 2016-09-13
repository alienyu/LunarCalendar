require("../../css/page/calendar.less");
var transCalendar = require("../vendor/LunarCalendar/transCalendar.js");
var mobiScroll = require("../vendor/mobiScroll/mobiScroll.js");
var Lunar = require("../common/lunar.js");
//require("../vendor/weChat/wxInit.js");

var fuc = {
    config: {
        birthday: "",
        isGoodDay: false
    },
    init: function() {
        this.pageLoad({backgroundColor: "#12101A"});
        this.renderPage();
        this.bindEvent();
    },
    pageLoad: function(options) {
        var defaults = {opacity: 1, backgroundColor: "#000", delayTime: 500, zindex: 999, sleep: 500};
        var options = $.extend(defaults, options);
        var _PageHeight = document.documentElement.clientHeight, _PageWidth = document.documentElement.clientWidth;
        var _LLLoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _PageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';"><div class="ll_loading_con"><div class="ll-loading"><div class="ll-load-inner"><div class="ll-load-container"><div class="ll-load-scale-multiple la-2x"><div></div><div></div><div></div></div></div></div><div class="ll-load-logo"><span class="ll-logo-1"></span><span class="ll-logo-2"></span><span class="ll-logo-3"></span></div></div></div></div>';
        $("body").append(_LLLoadingHtml);
        document.onreadystatechange = PageLoaded;
        function PageLoaded() {
            if (document.readyState == "complete") {
                var loadingMask = $('#loadingPage');
                setTimeout(function () {
                    loadingMask.animate({"opacity": 0}, options.delayTime, function () {
                        $(this).remove()
                    })
                }, options.sleep)
            }
        }
    },
    renderPage: function() {
        var screenHeight = $(document.body).height(),
            toolbarHeight = $('#toolbar').height(),
            wrapperHeight = $('.wrapper').height(),
            titleHeight = $('.schedule h1').height();
        this.otherHeight = screenHeight-toolbarHeight-wrapperHeight-titleHeight;
        //wxConfig(1);
        this.getUserInformation();//获取用户信息，若用户设置了生日，则可获取生日
        Lunar.getEventOfMonth();//判断当前页面的时间中有没有事件，有事件的在下方加点
        /*----------------------------------进入页面时，显示当天的事件列表和运势-------------------------------------------*/
        var theDay = $('.date_current').attr('id');
        Lunar.getEventOfDay(theDay);//获取一天的事件
        Lunar.getFortune(theDay);//获取当天的黄历
        /*--------------------------获取点击日期，显示当天的日程列表和运势--------------------------*/
        Lunar.Calendar.clickDate();
        this.selectBirthday = this.selectBirthdayDate('#birthday')
        this.selectBirthday.setVal(new Date("1990/01/01"));//选择生日
        var wrapper = document.getElementById('wrapper');
        wrapper.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
    },
    getUserInformation: function() {
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/user/detail",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    birthday = data.data.birthday;
                    if (birthday != null && birthday != "") {
                        var birthdayArr = birthday.split(" ");
                        var birthdayStr = birthdayArr[0].replace(/\-/g, "/"),
                            birthdayDateArr = birthdayArr[0].split("-");
                        selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
                        $('.birthday').html("（"+birthdayDateArr[1]+"-"+birthdayDateArr[2]+"）");
                    }
                }
            }
        });
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
    transDate: function(date) {
        var ca = new transCalendar();
        var dateArr = date.split(" ");
        var dateTimeArr = dateArr[0].split("-");
        var theDate = new Date(dateArr[0]);
        var theNl = ca.getls(theDate);
        var theNlDate = '';
        if (dateArr[1]) {
            theNlDate = dateTimeArr[0] + "年" + theNl[2] + "月" + theNl[3] + " " + dateArr[1];
        } else {
            theNlDate = dateTimeArr[0] + "年" + theNl[2] + "月" + theNl[3];
        }
        $('.mbsc-fr-hdr').html(theNlDate);
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
                that.transDate(theDate);
            },
            onSet: function (event, inst) {
                if(that.config.isGoodDay){//跳转吉日
                    that.config.isGoodDay=false;
                    $('.lucky').animate({'bottom': '0px'}, 500);
                }
                $('#loadingToast').show();//显示loading
                var selectedDate = inst.getVal();//获取选择时间的标准形式
                var selectedTime = inst._tempValue;//获取选择时间 yyyy-mm-dd
                $('.alConBg').css("display", "none");
                $('.content').css("display", "block");
                Lunar.setBirthday(selectedTime);//将用户设置的生日传至后台
                that.config.birthday = selectedTime + "08:00:00";//保存用户设置的生日
                var birthdayStr = selectedTime.replace(/\-/g,"-"),
                    birthdayArr = selectedTime.split("-");
                that.selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
                $('.birthday').html("（"+birthdayArr[1]+"-"+birthdayArr[2]+"）");
            },
            onChange: function (event, inst) {
                var changeDate = inst._tempValue;
                that.transDate(changeDate);
            },
            onCancel: function (event, inst) {
                that.slideLeft();
                that.config.isGoodDay = false;
            }
        });
        return selb;
    },
    bindEvent: function() {
        var that = this;
        /*------------------------------------点击添加事件按钮，跳转至添加事件页面------------------------------------*/
        $('.addEvent').on('tap', function (event) {
            var dateCurrent = $('.date_current').attr('id');
            $('body').html("").css("background", "#66cccc");
            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/addEvent.html?date=" + dateCurrent);
            event.preventDefault();
        });

        /*--------------点击/滑动的tab切换效果，容器高度随显示内容变化--------------------------*/
        $('.scheduleCon').css("min-height",this.otherHeight+"px");
        var scheHeight = parseInt($('.scheduleList').css('height'));
        $('.schedule').css("height", 40+scheHeight+"px");
        $('.scheBtn').on('tap', function (event) {
            that.slideRight();
        });
        $('.almaBtn').on('tap', function (event) {
            that.slideLeft();
        });
        $('.scheduleList').on('swipeLeft', function (event) {
            that.slideLeft();
            event.preventDefault();
            return false;
        });
        $('.almanac').on('swipeRight', function (event) {
            that.slideRight();
            event.preventDefault();
            return false;
        });
        /*--------------------------------吉日-------------------------------*/
        var _btns = $('.lucky .word_item span');
        //var _btnsB = $('.inFrame .word_item span');
        var num02 = 0;
        var screenWidth = $(document.body).width();//获取屏幕宽度
        $('.inFrame').css("width",3*screenWidth+"px");//底部一行吉日容器的宽度
        /*---------------------------点击上方吉日按钮，若用户设置了生日则显示吉日列表，没有设置则提示用户设置生日-------------*/
        $('.luckyDay').on('tap', function (event) {
            if (that.config.birthday) {
                _btns.each(function () {
                    $(this).removeClass("active");
                });
                $('.lucky').animate({'bottom': '0px'}, 500);
                $('.lucky02').fadeOut("slow");
            } else {
                $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                    $('#dialog2').hide();
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
                $('.inFrame').css('left', -num02 * screenWidth + 'px');
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
                $('.inFrame').css('left', -num02 * screenWidth + 'px');
            }, 15);
            event.preventDefault();
            return false;
        });

        /*------------------点击吉日列表中的关闭按钮，列表隐藏，日历中所有日期恢复初始状态-----------------------*/
        $('.close').on('tap', function (event) {
            selectWord = "";
            var dateItem = Lunar.getDateList();
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
            that.config.selectWord = "";
            var dateItem = Lunar.getDateList();
            var wordItem = $('.lucky02 .word_item span');
            $('.lucky02').fadeOut("slow");
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