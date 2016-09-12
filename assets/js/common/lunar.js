/**
 * Created by admin on 2016/8/17.
 * 获取用户信息
 * 判断当前页面时间范围内的事件
 * 获取一天的事件
 * 获得黄历
 * 设置生日获取私人黄历
 * 添加事件
 */
var LunarCalendar = require("./LunarCalendar.js");

var Lunar = {
    init: function() {
        this.checkUserAgent();
        this.Calendar.init();
    },
    Calendar: {
        hlurl: "http://cdn.tuijs.com/js/",
        hlMinYear: 2008,
        hlMaxYear: 2020,
        minYear: 1891,
        maxYear: 2100,
        HuangLi: {},
        itemTemp: [
            '<div class="date_item<%=itemCls%>" data-index="<%=index%>" id="<%=itemId%>">',
            '	<span class="date_icon<%=iconCls%>"><%=iconText%></span>',
            '	<span class="date_day"><%=day%></span>',
            '	<span class="date_lunar<%=fetvCls%>"><%=lunar%></span>',
            '</div>'
        ],
        now: new Date(),
        current: null,
        DATA: null,
        panel: [0,1],
        pageWidth: 0,
        timer: -1,
        init: function() {
            this.initPageElm();
            this.addEvent();
            this.setCurrentByNow();
            this.showDate();
        },
        initPageElm: function() {
            this.pageWidth = $(document).width();
            $('.date_list').eq(0).css('width', '100%');
            $('.date_list').eq(1).css({'width': '100%', 'left': pageWidth});
            if (Lunar.mobile.platform == 'iOS') {//iOS启用3d，同时将子元素也设置一下，防止BUG
                this.setTranslate(document.getElementById('date_list_0'), 0);
                this.setTranslate(document.getElementById('date_list_1'), 0);
            }
        },
        addEvent: function() {
            var that = this;
            $('.date_list').on('tap', '.date_item', function () {
                var index = $(this).attr('data-index');
                index = parseInt(index, 10);
                var itemData = this.DATA.monthData[index];

                if (index < that.DATA.firstDay) { //上一个月
                    that.pageDate(-1, itemData.year, itemData.month, itemData.day);
                } else if (index >= that.DATA.firstDay + that.DATA.monthDays) {//下一个月
                    that.pageDate(1, itemData.year, itemData.month, itemData.day);
                } else {
                    that.resetInfo();
                    that.setCurrentByNow(itemData.year, itemData.month, itemData.day, index);
                    that.showInfo($(this));
                }
            });

            $('.today').on('tap', function (event) {//回到今天
                $('.today').css("display", "none");
                var dateItem = Lunar.getDateList();
                //console.log(dateItem);
                var today = that.now.getFullYear() + "-" + (that.now.getMonth() + 1) + "-" + that.now.getDate();
                //console.log(today);
                var currentDay = $('#date_list_' + that.panel[0] + ' .date_current').attr("id");//获取滑动日历时默认选中的日期
                var currentDayArr = currentDay.split("-");
                var nowDay = that.now.getMonth() + 1;
                if (currentDayArr[1]==nowDay) {//今天在范围之内
                    //console.log("在范围内");
                    for(var i=0;i<dateItem.size();i++){
                        dateItem.eq(i).removeClass("date_current");
                        if(dateItem.eq(i).attr("id")==today){
                            dateItem.eq(i).addClass('date_current');
                        }
                    }
                } else {//今天不在范围之内
                    that.pageDate(1, that.now.getFullYear(), that.now.getMonth() + 1, that.now.getDate());
                }

                that.getEventOfDay(today);
                that.getFortune(today);
                return false;
            });

            $('.slide_wrap').on('swipeLeft', function (event) {
                that.pageDate(1);
                event.preventDefault();
                return false;
            });

            $('.slide_wrap').on('swipeRight', function (event) {
                that.pageDate(-1);
                event.preventDefault();
                return false;
            });
        },
        formatDayD4: function(month, day) {
            month = month + 1;
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return 'd' + month + day;
        },
        formatDate: function() {
            if (!current)return '';
            var year = this.current.year;
            var month = this.current.month;
            return month + "月" + "·" + year + "年";
        },
        setCurrentByNow: function(year, month, day, pos) {
            this.current = {
                year: year || this.now.getFullYear(),
                month: month || this.now.getMonth() + 1,
                day: day || this.now.getDate(),
                pos: pos || 0
            };
        },
        //黄历
        getHL: function() {
            if (this.HuangLi['y' + this.current.year]) { //该年已有黄历数据
                var hl = this.HuangLi['y' + this.current.year][this.formateDayD4(this.current.month, this.current.day)];
                this.showHL(hl);
            } else if (this.current.year >= this.hlMinYear && this.current.year <= this.hlMaxYear) {
                $.getScript(this.hlurl + 'hl' + this.current.year + '.min.js', function () {
                    var hl = this.HuangLi['y' + current.year][this.formateDayD4(this.current.month, this.current.day)];
                    this.showHL(hl);
                });
            }
        },
        showHL: function(hl) {
            if (hl) {
                $('.hl_y_content').html(hl.y);
                $('.hl_j_content').html(hl.j);
                $('.date_hl').show();
            } else {
                $('.date_hl').hide();
            }
        },
        showInfo: function(_this) {
            $('#toolbar h1').html(this.formatDate());
            if (_this) {
                $('.date_item').removeClass('date_current');
                _this.addClass('date_current');
            }
        },
        //恢复指定日期的状态信息
        resetInfo: function() {
            //今天
            var oldObj = $('#date_list_' + panel[0]).find('.date_item').eq(this.current.pos);
            if (this.now.getFullYear() == this.current.year && this.now.getMonth() + 1 == this.current.month && this.now.getDate() == this.current.day) {
                //oldObj.attr('class','date_item date_today');
                oldObj.addClass('date_today');
            } else {
                //oldObj.attr('class','date_item');
                oldObj.removeClass('date_today');
            }
        },
        showDate: function() {
            DATA = LunarCalendar.calendar(this.current.year, this.current.month, true);
            var dateHtml = '';
            var temp = itemTemp.join('');
            for (var i = 0; i < DATA.monthData.length; i++) {
                var itemData = DATA.monthData[i];
                if (i % 7 == 0) { //某行第一列
                    dateHtml += '<div class="date_row">';
                    if (i > 7 && (i < DATA.firstDay || i >= DATA.firstDay + DATA.monthDays)) { //非本月日期
                        break;
                    }
                }
                ;
                var extendObj = {
                    index: i,
                    itemCls: '',
                    iconCls: itemData.worktime ? (itemData.worktime == 1 ? ' worktime' : ' holiday') : '',
                    iconText: itemData.worktime ? (itemData.worktime == 1 ? '班' : '休') : '',
                    fetvCls: (itemData.lunarFestival || itemData.term) ? ' lunar_fetv' : (itemData.solarFestival ? ' solar_fetv' : ''),
                    lunar: '',
                    itemId: ''
                };
                var itemCls = '';
                if (this.now.getFullYear() == itemData.year && this.now.getMonth() + 1 == itemData.month && now.getDate() == itemData.day) {
                    itemCls = ' date_today';
                }
                if (this.current.year == itemData.year && this.current.month == itemData.month && this.current.day == itemData.day) { //当前选中
                    itemCls = ' date_current';
                    this.current.pos = i;
                }
                if (i < DATA.firstDay || i >= DATA.firstDay + DATA.monthDays) { //非本月日期
                    itemCls = ' date_other';
                }
                extendObj.itemCls = itemCls;
                extendObj.itemId = itemData.year + "-" + itemData.month + '-' + itemData.day;
                //extendObj.itemId = itemData.year;

                var lunar = itemData.lunarDayName;
                //以下判断根据优先级
                if (itemData.solarFestival) lunar = itemData.solarFestival;
                if (itemData.lunarFestival) lunar = itemData.lunarFestival;
                if (itemData.term) lunar = itemData.term;
                extendObj.lunar = lunar;

                $.extend(itemData, extendObj);

                dateHtml += $.template(temp, itemData);

                if (i % 7 == 6) {//某行尾列
                    dateHtml += '</div>';
                    if (i < DATA.firstDay || i >= DATA.firstDay + DATA.monthDays) { //非本月日期
                        break;
                    }
                }
                ;
            }
            ;

            $('#date_list_' + panel[0]).html(dateHtml);
            $('.slide_wrap').css('height', $('#date_list_' + panel[0]).css('height'));//高度随日历高度变化

            this.showInfo();
        },
        pageDate: function(offset, _year, _month, _day) {
            var year, month, day;
            if (_year && _month) { //直接指定
                year = _year;
                month = _month;
            } else {
                if (this.current.month + offset < 1) { //上一年
                    year = this.current.year - 1;
                    month = 12;
                } else if (this.current.month + offset > 12) { //下一年
                    year = this.current.year + 1;
                    month = 1;
                } else {
                    year = this.current.year;
                    month = this.current.month + offset;
                }
            }
            day = _day ? _day : (this.current.day > LunarCalendar.getSolarMonthDays(year,month-1) ? LunarCalendar.getSolarMonthDays(year,month-1) : this.current.day);
            if (year < this.minYear || year > this.maxYear)return; //超过范围

            this.setCurrentByNow(year, month, day);
            this.changePanel();

            this.showDate();
            this.slide(offset);
        },
        changePanel: function() {
            var first = this.panel.shift();
            this.panel.push(first);
        },
        slide: function(offset) {
            this.timer && clearTimeout(timer);
            this.setSlidePos({time: 0, pos: 0});
            $('#date_list_' + this.panel[0]).css({left: offset * this.pageWidth}).addClass("active"); //将要显示
            $('#date_list_' + this.panel[1]).css({left: 0}).removeClass("active"); //当前显示
            Lunar.getEventOfMonth();//判断当前页面时间范围内的事件，并在有时间的日期下方加点
            var currentDay = $('#date_list_' + this.panel[0] + ' .date_current').attr("id");//获取滑动日历时默认选中的日期
            Lunar.getEventOfDay(currentDay);//获取选中日期当天的事件列表
            Lunar.getFortune(currentDay);//获取选中日期当天的运势
            Lunar.clickDate();//获取点击日期并显示当天的事件列表和运势
            /*--------------比较页面中选中那天与今天是否相等，若不相等，则显示今天按钮------------*/
            var today = new Date();
            var dayT = today.getDate();
            var monthT = today.getMonth() + 1;
            var yearT = today.getFullYear();
            var currentDayArr = currentDay.split("-");
            if (dayT == currentDayArr[2] && monthT == currentDayArr[1] && yearT == currentDayArr[0]) {
                $('.today').css("display", "none");
            } else {
                $('.today').css("display", "block");
            }
            /*------------若选择了吉日，则查找对应的日期。点击日期，吉日列表显示成一行---------------*/
            if (selectWord != null && selectWord != "") {
                $('#loadingToast').show();//隐藏loading
                this.showLuckyDay(selectWord);
                this.luckyWordConDown();
            }
            if (offset > 0) {//左滑
                timer = setTimeout(function () {
                    this.setSlidePos({time: 100, pos: this.pageWidth * -1});
                }, 50);
            } else { //右滑
                timer = setTimeout(function () {
                    this.setSlidePos({time: 100, pos: this.pageWidth});
                }, 50);
            }
        },
        setSlidePos: function(opt) {
            var slide = $('.date_slide')[0];
            slide.style.webkitTransitionDuration = opt.time + 'ms';
            this.setTranslate(slide, opt.pos);
        },
        setTranslate: function(obj, pos) {
            if (Lunar.mobile.platform == 'iOS') {//iOS下启用3d加速，安卓下有BUG，使用2d
                obj.style.webkitTransform = 'translate3d(' + pos + 'px,0px,0px)';
            } else {
                obj.style.webkitTransform = 'translate(' + pos + 'px,0px)';
            }
        },
        /*--------------------获取点击日期并显示当天的事件列表和运势-------------------------*/
        clickDate: function() {
            var dateItem = Lunar.getDateList();
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
                        Lunar.getEventOfDay(selectDate);
                        Lunar.getFortune(selectDate);
                    }
                });
            }
        },
        //吉日查询函数
        showLuckyDay: function(selectWord) {
            //选择的吉日，日期数组
            var dateItem = Lunar.getDateList();
            var startTime = dateItem.eq(0).attr("id"),
                endTime = dateItem.eq(dateItem.size() - 1).attr("id");
            $.get("http://www.li-li.cn/llwx/fortune/getLuckDay", {
                "startTime": startTime + " 08:00:00",
                "endTime": endTime + " 08:00:00",
                "luckDaytag": selectWord,
            }, function (data) {
                if (data.code == 0) {
                    $('#loadingToast').fadeOut();//隐藏loading效果
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
        },
        /*--------------------点击日历上方日期，则吉日列表变为一行-------------------------*/
        luckyWordConDown: function() {
            var dateItem = Lunar.getDateList();
            dateItem.on("tap", function (event) {
                if (selectWord != null && selectWord != "") {
                    $('.lucky').animate({'bottom': "-265px"}, 500, function () {
                        $('.lucky02').fadeIn("slow");
                    });
                }
            });
        }
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
    //获取当前显示的日历数组
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
    //首页获取用户信息
    getUserInformation2: function() {
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/user/detail",
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.code == 0) {
                    nickName = data.data.nickName;
                }
            }
        });
    },
    //月历页面的数据加载
    //判断当前页面时间范围内的事件，并在有时间的日期下方加点
    getEventOfMonth: function() {
        var dateItem = this.getDateList();
        //console.log(dateItem);
        var startTime = dateItem.eq(0).attr('id'),
            endTime = dateItem.eq(dateItem.size() - 1).attr('id');
        var html = "<span class='date-dot back6c opa7'></span>";
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/event/hasornot",
            data: {
                startTime: startTime,
                endTime: endTime
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                    var list = data.data;
                    function td(time) {//处理请求到的时间格式
                        var timeArr = time.split(" ");
                        var dateArr = timeArr[0].split("-");
                        return dateArr[0] + "-" + parseInt(dateArr[1]) + "-" + parseInt(dateArr[2]);
                    };
                    for (var i = 0; i < dateItem.size(); i++) {
                        if (dateItem.eq(i).attr('id')) {
                            for (var j = 0; j < list.length; j++) {
                                if (dateItem.eq(i).attr('id') == td(list[j].date) && list[j].flag) {
                                    dateItem.eq(i).append(html);
                                }
                            };
                        }
                    };
                };
            }
        });
    },
    //获取一天的事件
    getEventOfDay: function(dateTime) {
        var template = $('#eventListTemplate').html();
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/event/getEventOfDay",
            data: {
                dateTime: dateTime,
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                    var eventList = data.data;
                    if (eventList.length > 0) {
                        var html = "",mark = "",joinerNum;
                        $('.scheduleBg').css("display", "none");
                        $('.scheduleCon').css("display", "block");
                        $('.scheduleCon').html("");
                        for (var i = 0; i < eventList.length; i++) {
                            if (eventList[i].isOwner) {
                                mark = "@";
                                if (eventList[i].joiners != null && eventList[i].joiners[0]) {
                                    joinerNum = parseInt(eventList[i].joiners.length)+1;
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark + eventList[i].joiners[0].nickName);
                                }else{
                                    html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, "").replace(/{{user}}/g, "");
                                }
                            } else {
                                mark = "#";
                                joinerNum = parseInt(eventList[i].joiners.length)+1;
                                html += template.replace(/{{eventId}}/g, eventList[i].event.eventId).replace(/{{name}}/g, eventList[i].event.name).replace(/{{time}}/g, transHour(eventList[i].event.startTime)).replace(/{{count}}/g, joinerNum + "人").replace(/{{user}}/g, mark+eventList[i].owner.nickName);
                            }

                        }
                        $('.scheduleCon').append(html);
                        $('.list').hammer().on('tap', function (event) {//点击日程跳转至详情页
                            var eventId = $(this).attr('id');
                            window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/showEvent.html?eventId=" + eventId);
                        });
                    } else {
                        $('.scheduleBg').css("display", "block");
                        $('.scheduleCon').css("display", "none");
                    }
                }
                if ($('.almanac').css("left") == "0px") {
                    var almaHeight = parseInt($('.almanac').css('height'));
                    $('.schedule').css('height', 40 + almaHeight + "px");
                } else {
                    var scheHeight = parseInt($('.scheduleList').css('height'));
                    $('.schedule').css('height', 40 + scheHeight + "px");
                }
                //日程日期字符串的截取
                function transHour(time) {
                    var timeArr = time.split(" ");
                    var hourArr = timeArr[1].split(":");
                    return hourArr[0] + ":" + hourArr[1];
                }
            }
        })
    },
    //获得黄历
    getFortune: function(dateTime) {
        var dateTime = dateTime + " 08:00:00";
        $.ajax({
            type: "get",
            url: "http://www.li-li.cn/llwx/fortune/get",
            data: {
                dateTime: dateTime,
            },
            dataType: "json",
            success: function (data) {
                var data = data.data;
                $('.pubSuitMatter').html(" ");
                $('.tabooMatter').html(" ");
                if (data.personal) {
                    $('.alConBg').css("display", "none");
                    $('.content').css("display", "block");
                    $('.alterBirthday').css("display","block");//若用户设置过生日，则修改生日显示
                    $('.suitColor').html("");
                    $('.suitMatter').html("");
                    var personal = data.personal;
                    var personalType2 = personal.type2.replace(/\，/g, "&nbsp;&nbsp;");
                    var personalColor = "<span>" + personalType2 + "</span>";
                    if (personal.type3) {
                        var personalType3 = personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
                        var personalMatter = "";
                        personalMatter += "<span>" + personalType3 + "</span>";
                        $('.suitMatter').append(personalMatter);
                    } else {
                        $('.suitMatter').html("<span>诸事不宜</span>");
                    }
                    $('.suitColor').append(personalColor);
                }
                var public = data.public;
                var pubSuit = "<span>" + public.yi.replace(/\,/g, "&nbsp;&nbsp;") + "</span>";
                var pubTaboo = "<span>" + public.ji.replace(/\,/g, "&nbsp;&nbsp;") + "</span>";
                $('.pubSuitMatter').append(pubSuit);
                $('.tabooMatter').append(pubTaboo);
                if ($('.almanac').css("left") == "0px") {
                    var almaHeight = parseInt($('.almanac').css('height'));
                    $('.schedule').css('height', 40 + almaHeight + "px");
                } else {
                    var scheHeight = parseInt($('.scheduleList').css('height'));
                    $('.schedule').css('height', 40 + scheHeight + "px");
                }
            }
        })
    },
    //设置生日获取私人黄历
    setBirthday: function(birthdayTime) {
        var date = new Date();
        var years = date.getFullYear(),
            months = date.getMonth() + 1,
            days = date.getDate();
        var dateTime = years + "-" + months + "-" + days + " 08:00:00";
        $.ajax({
            type: "post",
            url: "http://www.li-li.cn/llwx/user/setBirthday",
            data: {
                dateTime: dateTime,
                birthday: birthdayTime
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {
                    $('#loadingToast').fadeOut();//隐藏loading
                    var data = data.data;
                    $('.suitColor').html("");
                    $('.suitMatter').html("");
                    var suitColor = data.personal.type2.replace(/\,/g, "&nbsp;&nbsp;"),
                        suitMatter = data.personal.type3.replace(/\,/g, "&nbsp;&nbsp;");
                    if(!suitMatter){
                        suitMatter = "诸事不宜";
                    }
                    var colorHtml = "<span>" + suitColor + "</span>",
                        matterHtml = "<span>" + suitMatter + "</span>";
                    $('.suitColor').append(colorHtml);
                    $('.suitMatter').append(matterHtml);
                    $('.alterBirthday').css("display","block");//修改生日显示
                }else{
                    $('#loadingToast').fadeOut();//隐藏loading
                    var error = data.msg;
                    $('.weui_dialog_bd').html(error);
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
                if ($('.almanac').css("left") == "0px") {
                    var almaHeight = parseInt($('.almanac').css('height'));
                    $('.schedule').css('height', 40 + almaHeight + "px");
                } else {
                    var scheHeight = parseInt($('.scheduleList').css('height'));
                    $('.schedule').css('height', 40 + scheHeight + "px");
                }
            }
        })
    },
    //添加事件页面数据提交
    eventAdd: function(name,tagName, startTime, endTime, tipType, tipTime, repeatType, location, remark) {
        $.ajax({
            type: "post",
            url: "http://www.li-li.cn/llwx/event/add",
            data: {
                name: name,
                tags:tagName,
                startTime: startTime,
                endTime: endTime,
                tipType: tipType,
                tipTime: tipTime,
                repeatType: repeatType,
                location: location,
                remark: remark,
            },
            dataType: "json",
            success: function (data) {
                //console.log(data);
                if (data.code == 0) {//提交成功
                    window.location.href = "http://www.li-li.cn/llwx/common/to?url2=" + encodeURIComponent("http://www.li-li.cn/wx/calendar.html");
                }else{//提交失败提醒错误信息
                    var error = data.msg;
                    $('#dialog2 .weui_dialog_bd').html(error);
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
            }
        })
    },
    //添加事件页面数据提交
    eventAdd2: function(name,tagName,startTime, endTime, tipType, tipTime, repeatType, location, remark) {
        $.ajax({
            type: "post",
            url: "http://www.li-li.cn/llwx/event/add",
            data: {
                name: name,
                tags:tagName,
                startTime: startTime,
                endTime: endTime,
                tipType: tipType,
                tipTime: tipTime,
                repeatType: repeatType,
                location: location,
                remark: remark,
            },
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data);
                if (data.code == 0) {
                    eventId = data.data;
                }else{//提交失败提醒错误信息
                    var error = data.msg;
                    $('#dialog2 .weui_dialog_bd').html(error);
                    $('#dialog2').show().on('click', '.weui_btn_dialog', function () {
                        $('#dialog2').off('click').hide();
                    });
                }
            }
        })
    }
}

Lunar.init();
module.exports = Lunar;