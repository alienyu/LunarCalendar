require("../../css/page/starIndex.less");
require("../common/swiper.min.js");
var Dom = require("../common/dom.js");

var fuc = {
    config: {
        eventId: "",
        nickName: "",
        eventType: "",
        shareImg: "",
        pageNo:"",
        lastId:"",
        urlArr:""
    },

    swiper: null,

    init: function() {
        this.config.urlArr = Dom.configuration();
        this.bindEvent();
        this.swiper = new Swiper('.starList', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto',
            // centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true
        });

        var swiper2 = new Swiper('.starNewsRight', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            loop: true,
            direction: 'vertical'
        });
        this.getStars();

    },
   
    bindEvent: function() {
        var that = this;
       
    },

    checkBoxNum: function() {
        if($(".img_upload_box").length < 9) {
            return true;
        } else {
            return false;
        }
    },

    getStars: function() {
        var that = this;

        var str =   '<div class="starItem swiper-slide" data-src="http://www.baidu.com">'+
                        '<img src="../../assets/imgs/page/showEvent/default_photo.png" alt="">'+
                        '<br><span>李易峰22222333333333</span>'+
                    '</div>';
        that.swiper.appendSlide([
            str
        ]);

        // that.loadingshow();
        $.ajax({
            type: "get",
            url: that.config.urlArr[0]+"/star/list",
            data: {
                "pageNo": 1,
                "pageSize": 10,
                "all": true
            }, 
            success: function (data) {
                console.log('-----'+data);
                
               if (data.code == 0) {
                    
                }else{
                    //接口有问题
                    // that.tipshow('明星列表拉取失败，请稍后重试~');
                }
                // that.loadinghide();
            },
            error: function() {
                // that.loadinghide();
                // that.tipshow('网络连接错误，请检查网络~');
            }
        });
    }
}

fuc.init();