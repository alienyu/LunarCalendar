require("../../css/page/calendar.less");
require("../common/pageLoad.js");
require("../common/mobiscroll.js");
require("../common/transCalendar.js");
require("../common/ajax.js");
require("../common/LunarCalendar.js");
require("../common/calendar.js");
require("../common/jweixin.js");
require("../common/wenxinInit.js");

var birthday = "";
var selectWord = "";
var isGoodDay=false;
$(function () {
    var screenHeight = $(document.body).height(),
        toolbarHeight = $('#toolbar').height(),
        wrapperHeight = $('.wrapper').height(),
        titleHeight = $('.schedule h1').height();
    var otherHeight = screenHeight-toolbarHeight-wrapperHeight-titleHeight;
    console.log(otherHeight);
    wxConfig(1);
    getUserInformation();//获取用户信息，若用户设置了生日，则可获取生日
    getEventOfMonth();//判断当前页面的时间中有没有事件，有事件的在下方加点
    /*----------------------------------进入页面时，显示当天的事件列表和运势-------------------------------------------*/
    var theDay = $('.date_current').attr('id');
    getEventOfDay(theDay);//获取一天的事件
    getFortune(theDay);//获取当天的黄历
    /*------------------------------------点击添加事件按钮，跳转至添加事件页面------------------------------------*/
    $('.addEvent').click(function () {
        var dateCurrent = $('.date_current').attr('id');
        $('body').html("").css("background", "#66cccc");
        window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/addEvent.html?date=" + dateCurrent);
        event.preventDefault();
    });
    /*--------------------------获取点击日期，显示当天的日程列表和运势--------------------------*/
    clickDate();
    /*--------------点击/滑动的tab切换效果，容器高度随显示内容变化--------------------------*/
    $('.scheduleCon').css("min-height",otherHeight+"px");
    var scheHeight = parseInt($('.scheduleList').css('height'));
    $('.schedule').css("height", 40+scheHeight+"px");
    $('.scheBtn').hammer().on('tap', function (event) {
        slideRight();
    });
    $('.almaBtn').hammer().on('tap', function (event) {
        slideLeft();
    });
    $('.scheduleList').hammer().on('swipeleft', function (event) {
        slideLeft();
        event.preventDefault();
        event.gesture.preventDefault();
        return false;
    });
    $('.almanac').hammer().on('swiperight', function (event) {
        slideRight();
        event.preventDefault();
        event.gesture.preventDefault();
        return false;
    });
    /*--------------------------------吉日-------------------------------*/
    var _btns = $('.lucky .word_item span');
    var _btnsB = $('.inFrame .word_item span');
    var num02 = 0;
    var screenWidth = $(document.body).width();//获取屏幕宽度
    $('.inFrame').css("width",3*screenWidth+"px");//底部一行吉日容器的宽度
    /*---------------------------点击上方吉日按钮，若用户设置了生日则显示吉日列表，没有设置则提示用户设置生日-------------*/
    $('.luckyDay').hammer().on('tap', function (event) {
        if (birthday) {
            _btns.each(function () {
                $(this).removeClass("active");
            });
            $('.lucky').animate({'bottom': '0px'}, 500);
            $('.lucky02').fadeOut("slow");
        } else {
            $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                $('#dialog2').hide();
                isGoodDay=true;
                selectBirthday.show();
            });
        }
    });
    /*----------------------------------点击吉日列表中的选项---------------------------*/
    _btns.hammer().on('tap', function (event) {
        $('#loadingToast').show();//显示loading效果
        var dateItem = getDateList();
        _btns.each(function () {
            $(this).removeClass("active");
        });
        $(this).addClass('active');//选中项添加样式
        selectWord = $(this).html();//选中吉日类型
        showLuckyDay(selectWord);//调用后台数据，显示合适的日期

        var wordItem = $('.lucky02 .word_item span');
//            console.log(wordItem.size());
        for (var j = 0; j < wordItem.size(); j++) {
            wordItem.eq(j).removeClass("active");
        }
        var num1 = $(this).parent().index();
        num02 = $(this).parent().parent().index();
        var num = num1 + num02 * 6;
        $('.inFrame').css('left', -num02 * screenWidth + 'px');
        $('.inFrame .word_item span').eq(num).attr("class", "active");
        luckyWordConDown();
    });

    /*--------------------点击一行吉日列表中的吉日选项，合适的日期-------------------------*/
    _btnsB.hammer().on("tap", function (event) {
        $('#loadingToast').show();//显示loading效果
        _btnsB.each(function () {
            $(this).removeClass("active");
        });
        $(this).addClass("active");
        selectWord = $(this).html();
        showLuckyDay(selectWord);
    });
    /*------------------一行吉日列表的滑动查看效果-----------------------*/
    var lucky02 = document.getElementById('lucky02');
    lucky02.addEventListener("touchmove", function (e) {
        e.preventDefault();
    });
    var timer1 = null, timer2 = null;
    $('.lucky02').hammer().on('swipeleft', function (event) {
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
        event.gesture.preventDefault();
        return false;
    });
    $('.lucky02').hammer().on('swiperight', function (event) {
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
        event.gesture.preventDefault();
        return false;
    });
});
/*--------------------点击日历上方日期，则吉日列表变为一行-------------------------*/
function luckyWordConDown() {
    var dateItem = getDateList();
    dateItem.hammer().on("tap", function (event) {
        console.log($(this).attr('id'));
        if (selectWord != null && selectWord != "") {
            $('.lucky').animate({'bottom': "-265px"}, 500, function () {
                $('.lucky02').fadeIn("slow");
            });
        }
    })
}
/*------------------点击吉日列表中的关闭按钮，列表隐藏，日历中所有日期恢复初始状态-----------------------*/
$('.close').hammer().on('tap', function (event) {
    selectWord = "";
    var dateItem = getDateList();
    var wordItem = $('.luckyWord .word_item span');
    $('.lucky').animate({'bottom': "-265px"}, 500);
    for (var i = 0; i < dateItem.size(); i++) {
        dateItem.eq(i).removeClass("Not-lucky");
    }
    for (var j = 0; j < wordItem.size(); j++) {
        wordItem.eq(i).removeClass("active");
    }
});
$('.close02').hammer().on('tap', function (event) {
    selectWord = "";
    var dateItem = getDateList();
    var wordItem = $('.lucky02 .word_item span');
    $('.lucky02').fadeOut("slow");
    for (var i = 0; i < dateItem.size(); i++) {
        dateItem.eq(i).removeClass("Not-lucky");
    }
    for (var j = 0; j < wordItem.size(); j++) {
        wordItem.eq(j).removeClass("active");
    }
});
/*----------------获取当前显示的日历数组---------------------*/
function getDateList() {
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
}
/*-----------------------向左滑动时让schedule的高度等于黄历内容的高度------------------------*/
function slideLeft() {
    $('.scheBtn').removeClass('active');
    $('.almaBtn').addClass('active');
    $('.scheduleList').animate({"left": "-100%"}, 500);
    $('.almanac').animate({"left": "0px"}, 500);
    var almaHeight = parseInt($('.almanac').css('height'));
    $('.schedule').css('height', 40 + almaHeight + "px");
}
/*--------------------向右滑动时让schedule的高度等于日程内容的高度-------------------------*/
function slideRight() {
    $('.scheBtn').addClass('active');
    $('.almaBtn').removeClass('active');
    $('.scheduleList').animate({left: "0px"}, 500);
    $('.almanac').animate({left: "100%"}, 500);
    var scheHeight = parseInt($('.scheduleList').css('height'));
    $('.schedule').css('height', 40 + scheHeight + "px");
}
/*--------------------获取点击日期并显示当天的事件列表和运势-------------------------*/
function clickDate() {
    var dateItem = getDateList();
    for (var i = 0; i < dateItem.size(); i++) {
        dateItem.eq(i).hammer().on('tap', function (event) {
            var index = $(this).index();
            var selectDate = $(this).parent().find('.date_item').eq(index).attr('id');
//                    console.log(selectDate);
            if (selectDate) {
                /*--------------比较页面中选中那天与今天是否相等，若不相等，则显示今天按钮------------*/
                var today = new Date();
                var dayT = today.getDate();
                var monthT = today.getMonth()+1;
                var yearT = today.getFullYear();
                var currentDayArr = selectDate.split("-");
                if (dayT == currentDayArr[2] && monthT == currentDayArr[1] && yearT == currentDayArr[0]) {
                    $('.today').css("display", "none");
                } else {
                    $('.today').css("display", "block");
                }
                getEventOfDay(selectDate);
                getFortune(selectDate);
            }
        });
    }
}
//吉日查询函数
function showLuckyDay(selectWord) {//选择的吉日，日期数组
    var dateItem = getDateList();
    var startTime = dateItem.eq(0).attr("id"),
        endTime = dateItem.eq(dateItem.size() - 1).attr("id");
    $.get("http://www.li-li.cn/llwx/fortune/getLuckDay", {
        "startTime": startTime + " 08:00:00",
        "endTime": endTime + " 08:00:00",
        "luckDaytag": selectWord,
    }, function (data) {
        if (data.code == 0) {
            $('#loadingToast').fadeOut();//隐藏loading效果
//                console.log(data);
            var data = data.data;
            for (var i = 0; i < dateItem.size(); i++) {
                dateItem.eq(i).removeClass("Not-lucky");
                if (dateItem.eq(i).attr('id')) {
                    for (var j = 0; j < data.length; j++) {
                        if (dateItem.eq(i).attr("id") == data[j].date && data[j].falg == 0) {
                            dateItem.eq(i).addClass("Not-lucky");
                        }
                    }
                }
            }
        }else{
            $('#loadingToast').fadeOut();//显示loading效果

        }
    })
}
var wrapper = document.getElementById('wrapper');
wrapper.addEventListener('touchmove', function (e) {
    e.preventDefault();
});
/*--------------------------点击设置生日、修改生日时弹出日期选择器-------------------------------*/
var selectBirthday = selectBirthdayDate('#birthday');//选择生日
selectBirthday.setVal(new Date("1990/01/01"));
function selectBirthdayDate(obj) {
    var selb = mobiscroll.date(obj, {
        theme: 'android-holo-light',
        lang: 'zh',
        display: 'bottom',
        dateFormat: 'yyyy-mm-dd',
        min: new Date(1921, 1, 1),
        max: new Date(2020, 1, 1),
        readonly: false,
        onShow: function (event, inst) {
            var theDate = inst._tempValue;
            transDate(theDate);
        },
        onSet: function (event, inst) {
            if(isGoodDay){//跳转吉日
                isGoodDay=false;
                $('.lucky').animate({'bottom': '0px'}, 500);
            }
            $('#loadingToast').show();//显示loading
            var selectedDate = inst.getVal();//获取选择时间的标准形式
            var selectedTime = inst._tempValue;//获取选择时间 yyyy-mm-dd
//                console.log(selectedTime);
            $('.alConBg').css("display", "none");
            $('.content').css("display", "block");
            setBirthday(selectedTime);//将用户设置的生日传至后台
            birthday = selectedTime + "08:00:00";//保存用户设置的生日
            var birthdayStr = selectedTime.replace(/\-/g,"-"),
                birthdayArr = selectedTime.split("-");
            selectBirthdayDate('#alterBirthday').setVal(new Date(birthdayStr));
            $('.birthday').html("（"+birthdayArr[1]+"-"+birthdayArr[2]+"）");
        },
        onChange: function (event, inst) {
            var changeDate = inst._tempValue;
            transDate(changeDate);
        },
        onCancel: function (event, inst) {
            slideLeft();
            isGoodDay=false;
        }
    });
    return selb;
}
function transDate(date) {
    var ca = new tranCalendar();
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
}
function transWeek(day) {
    var week = day.getDay();
    switch (week) {
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
}
//首页获取用户信息
function getUserInformation() {
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
}