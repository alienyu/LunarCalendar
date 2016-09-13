/**
 * Created by admin on 2016/8/17.
 * 微信分享
 */
var wx = require("./jweixin.js");
var imageUrl = "http://www.li-li.cn/app/icon.png";
function wxConfig(type) {
    wxConfig(type, "", "", "")
}

function wxConfig(type, title, desc, link) {
    var url = window.location.href;
    var urlArr = url.split("#");
    var noncestr = "";
    var signature = "";
    var timestamp = "";
    console.log(encodeURIComponent(urlArr[0]));
    $.ajax({
        type: "get",
        url: "http://www.li-li.cn/llwx/wx/jsOauth",
        data: {
            url: urlArr[0]
        },
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.code == 0) {
                console.log(data);
                var data = data.data;
                noncestr = data.noncestr;
                signature = data.signature;
                timestamp = data.timestamp;
            }
        }
    });
    wx.config({
        debug: false,
        appId: "wx82c10b61c95e9f30",
        timestamp: timestamp,//时间戳
        nonceStr: noncestr,//随机串
        signature: signature,//签名
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'hideAllNonBaseMenuItem',
            'showMenuItems'
        ]
    });

    wx.ready(function () {
        switch (type) {
            case 1://隐藏其他选项
                wx.hideAllNonBaseMenuItem();
                break;
            case 2://显示分享功能并设置分享内容
                wx.showMenuItems({
                    menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"] // 要显示的菜单项，所有menu项见附录3
                });
                //获取"分享给朋友"按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imageUrl,
                    type: "link",//分享类型，music、video或link，不填默认为link
                });
                //获取"分享到朋友圈"按钮点击状态及自定义分享内容接口
                wx.onMenuShareTimeline({
                    title: title,
                    link: link,
                    imgUrl: imageUrl
                });
                break;
        }
        //$('#onMenuShareTimeline').click(function () {
        //    //获取"分享到朋友圈"按钮点击状态及自定义分享内容接口
        //    wx.onMenuShareTimeline({
        //        title: "分享标题",
        //        link: "分享的URL",
        //        imgUrl: "",
        //    });
        //})
    })
}
