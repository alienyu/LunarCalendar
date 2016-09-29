var Dom = require("./dom.js");
var Ajax = require("./ajax.js");
var LunarCalendar = require("../vendor/LunarCalendar/LunarCalendar.js");
var FootPrint = {
    templateSettings: {
        evaluate : /<%([\s\S]+?)%>/g,
        interpolate : /<%=([\s\S]+?)%>/g
    },
    compile: function(str, settings) {
        var c = settings || this.templateSettings;
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
            'with(obj||{}){__p.push(\'' +
            str.replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(c.interpolate, function(match, code) {
                    return "'," + code.replace(/\\'/g, "'") + ",'";
                })
                .replace(c.evaluate || null, function(match, code) {
                    return "');" + code.replace(/\\'/g, "'")
                            .replace(/[\r\n\t]/g, ' ') + "__p.push('";
                })
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n')
                .replace(/\t/g, '\\t')
            + "');}return __p.join('');";
        return new Function('obj', tmpl);
    },
    template: function(str, data) {
        var compilied = this.compile(str);
        return compilied(data);
    }
}

var Lunar = {
    hlurl: "http://cdn.tuijs.com/js/",
    hlMinYear: 2008,
    hlMaxYear: 2020,
    minYear: 1891,
    maxYear: 2100,
    HuangLi: {},
    btns: $('.lucky .word_item span'),
    btnsB: $('.inFrame .word_item span'),
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
    selectWord: "",
    init: function() {
        this.initPageElm();
        this.addEvent();
        this.setCurrentByNow();
        this.showDate();
        this.clickDate();
    },
    initPageElm: function() {
        this.pageWidth = $(document).width();
        $('.date_list').eq(0).css('width', '100%');
        $('.date_list').eq(1).css({'width': '100%', 'left': this.pageWidth});
        if (Dom.mobile.platform == 'iOS') {//iOS启用3d，同时将子元素也设置一下，防止BUG
            this.setTranslate(document.getElementById('date_list_0'), 0);
            this.setTranslate(document.getElementById('date_list_1'), 0);
        }
    },
    addEvent: function() {
        var that = this;
        $('.date_list').on('tap', '.date_item', function () {
            var index = $(this).attr('data-index');
            index = parseInt(index, 10);
            var itemData = that.DATA.monthData[index];

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
            var dateItem = Dom.getDateList();
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
            Ajax.getEventOfDay(today);
            Ajax.getFortune(today);
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

        /*----------------------------------点击吉日列表中的选项---------------------------*/
        this.btns.on('tap', function (event) {
            $('#loadingToast').show();//显示loading效果
            //var dateItem = getDateList();
            that.btns.each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass('active');//选中项添加样式
            that.selectWord = $(this).html();//选中吉日类型
            that.showLuckyDay(that.selectWord);//调用后台数据，显示合适的日期

            var wordItem = $('.lucky02 .word_item span');
//            console.log(wordItem.size());
            for (var j = 0; j < wordItem.size(); j++) {
                wordItem.eq(j).removeClass("active");
            }
            var num1 = $(this).parent().index();
            num02 = $(this).parent().parent().index();
            var num = num1 + num02 * 6;
            var screenWidth=$(document.body).width()//获取屏幕宽度
            $('.inFrame').css('left', -num02 * screenWidth + 'px');
            $('.inFrame .word_item span').eq(num).attr("class", "active");
            that.luckyWordConDown();
        });

        /*--------------------点击一行吉日列表中的吉日选项，合适的日期-------------------------*/
        this.btnsB.on("tap", function (event) {
            $('#loadingToast').show();//显示loading效果
            that.btnsB.each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
            that.selectWord = $(this).html();
            that.showLuckyDay(that.selectWord);
        });
    },
    formatDayD4: function(month, day) {
        month = month + 1;
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return 'd' + month + day;
    },
    formatDate: function() {
        if (!this.current)return '';
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
        var oldObj = $('#date_list_' + this.panel[0]).find('.date_item').eq(this.current.pos);
        if (this.now.getFullYear() == this.current.year && this.now.getMonth() + 1 == this.current.month && this.now.getDate() == this.current.day) {
            //oldObj.attr('class','date_item date_today');
            oldObj.addClass('date_today');
        } else {
            //oldObj.attr('class','date_item');
            oldObj.removeClass('date_today');
        }
    },
    showDate: function() {
        this.DATA = LunarCalendar.calendar(this.current.year, this.current.month, true);
        var dateHtml = '';
        var temp = this.itemTemp.join('');
        for (var i = 0; i < this.DATA.monthData.length; i++) {
            var itemData = this.DATA.monthData[i];
            if (i % 7 == 0) { //某行第一列
                dateHtml += '<div class="date_row">';
                if (i > 7 && (i < this.DATA.firstDay || i >= this.DATA.firstDay + this.DATA.monthDays)) { //非本月日期
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
            if (this.now.getFullYear() == itemData.year && this.now.getMonth() + 1 == itemData.month && this.now.getDate() == itemData.day) {
                itemCls = ' date_today';
            }
            if (this.current.year == itemData.year && this.current.month == itemData.month && this.current.day == itemData.day) { //当前选中
                itemCls = ' date_current';
                this.current.pos = i;
            }
            if (i < this.DATA.firstDay || i >= this.DATA.firstDay + this.DATA.monthDays) { //非本月日期
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

            dateHtml += FootPrint.template(temp, itemData);

            if (i % 7 == 6) {//某行尾列
                dateHtml += '</div>';
                if (i < this.DATA.firstDay || i >= this.DATA.firstDay + this.DATA.monthDays) { //非本月日期
                    break;
                }
            }
            ;
        }
        ;

        $('#date_list_' + this.panel[0]).html(dateHtml);
        $('.slide_wrap').css('height', $('#date_list_' + this.panel[0]).css('height'));//高度随日历高度变化

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
        var that = this;
        this.timer && clearTimeout(this.timer);
        this.setSlidePos({time: 0, pos: 0});
        $('#date_list_' + this.panel[0]).css({left: offset * this.pageWidth}).addClass("active"); //将要显示
        $('#date_list_' + this.panel[1]).css({left: 0}).removeClass("active"); //当前显示
        Ajax.getEventOfMonth();//判断当前页面时间范围内的事件，并在有时间的日期下方加点
        var currentDay = $('#date_list_' + this.panel[0] + ' .date_current').attr("id");//获取滑动日历时默认选中的日期
        Ajax.getEventOfDay(currentDay);//获取选中日期当天的事件列表
        Ajax.getFortune(currentDay);//获取选中日期当天的运势
        this.clickDate();//获取点击日期并显示当天的事件列表和运势
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
        if (that.selectWord != null && that.selectWord != "") {
            $('#loadingToast').show();//隐藏loading
            this.showLuckyDay(that.selectWord);
            this.luckyWordConDown();
        }
        if (offset > 0) {//左滑
            that.timer = setTimeout(function () {
                that.setSlidePos({time: 100, pos: that.pageWidth * -1});
            }, 50);
        } else { //右滑
            that.timer = setTimeout(function () {
                that.setSlidePos({time: 100, pos: that.pageWidth});
            }, 50);
        }
    },
    setSlidePos: function(opt) {
        var slide = $('.date_slide')[0];
        slide.style.webkitTransitionDuration = opt.time + 'ms';
        this.setTranslate(slide, opt.pos);
    },
    setTranslate: function(obj, pos) {
        if (Dom.mobile.platform == 'iOS') {//iOS下启用3d加速，安卓下有BUG，使用2d
            obj.style.webkitTransform = 'translate3d(' + pos + 'px,0px,0px)';
        } else {
            obj.style.webkitTransform = 'translate(' + pos + 'px,0px)';
        }
    },
    /*--------------------获取点击日期并显示当天的事件列表和运势-------------------------*/
    clickDate: function() {
        var dateItem = Dom.getDateList();
        for (var i = 0; i < dateItem.size(); i++) {
            dateItem.eq(i).on('tap', function (event) {
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
                    Ajax.getEventOfDay(selectDate);
                    Ajax.getFortune(selectDate);
                }
            });
        }
    },
    //吉日查询函数
    showLuckyDay: function(selectWord) {
        //选择的吉日，日期数组
        var dateItem = Dom.getDateList();
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
        var that = this;
        var dateItem = Dom.getDateList();
        dateItem.on("tap", function () {
            if (that.selectWord != null && that.selectWord != "") {
                $('.lucky').animate({'bottom': "-265px"}, 500, function () {
                    //if(!$('.lucky02').is(':animated')){
                        $('.lucky02').animate({'bottom': "0px"}, 500);
						$('.calendar_add').addClass("c_a_open");
                    //}
                    //if(!$('.close02').is(':animated')){
                        $('.close02').animate({'bottom':'66px'},500);
						
                    //}
                });
            }
        });
    }
}

Lunar.init();

module.exports = Lunar;