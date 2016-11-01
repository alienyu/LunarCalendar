/**
 * Created by admin on 2016/8/17.
 * 微信分享
 */
var wx = require("./jweixin.js");
var configArr = urlConfiguration();
var imageUrl = configArr[1]+"/app/icon.png";
function urlConfiguration(){
    var host = window.location.host;
    if(host == "wx.li-li.cn"){
        return ["http://wx.li-li.cn/api","http://wx.li-li.cn","wx82c10b61c95e9f30"];
    }else{
        return ["http://www.li-li.cn/llwx","http://www.li-li.cn","wxd8c1d6ab5eb3c981"];
    }
}
var wxConfig = {
    wxConfig: function (type,obj) {
        var that = this;
        var url = window.location.href;
        var urlArr = url.split("#");
        var noncestr = "";
        var signature = "";
        var timestamp = "";
        $.ajax({
            type: "get",
            url: configArr[0]+"/wx/jsOauth",
            data: {
                url: urlArr[0]
            },
            dataType: "json",
            async: false,
            success: function (data) {
                //console.log(configArr[0]);
                if (data.code == 0) {
                    //console.log(data);
                    var data = data.data;
                    noncestr = data.noncestr;
                    signature = data.signature;
                    timestamp = data.timestamp;
                    wx.config({
                        debug: false,
                        //appId: "wx82c10b61c95e9f30",//正式
                        //appId: "wxd8c1d6ab5eb3c981",//测试
                        appId:configArr[2],
                        timestamp: timestamp,//时间戳
                        nonceStr: noncestr,//随机串
                        signature: signature,//签名
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'hideMenuItems',
                            'showMenuItems',
                            'getLocation'
                        ]
                    });

                    wx.ready(function () {
                        //隐藏其他选项
                        wx.hideMenuItems({
                            menuList: [
                                "menuItem:share:qq",
                                "menuItem:share:weiboApp",
                                "menuItem:favorite",
                                "menuItem:share:facebook",
                                "menuItem:share:QZone",
                                "menuItem:editTag",
                                "menuItem:delete",
                                "menuItem:copyUrl",
                                "menuItem:originPage",
                                "menuItem:readMode",
                                "menuItem:openWithQQBrowser",
                                "menuItem:openWithSafari",
                                "menuItem:share:email",
                                "menuItem:share:brand"
                            ] // 要显示的菜单项，所有menu项见附录3
                        });

                        if(type == 2){
                            that.wxShare(obj.title, obj.desc, obj.link, obj.img);
                        }
                    })
                }
            }
        });

    },

    wxShare: function (title, desc, link,img) {
        if(!img){
            img = imageUrl;
        }
        if(!link){
            link = "http://mp.weixin.qq.com/s?__biz=MzI5NzQwODk4OA==&mid=2247484668&idx=1&sn=3f9820b761c761d3af7566f7e08260bd&chksm=ecb4c44fdbc34d59896e171ffda9e783192c4f83f2c1411827a747339454fc7060cbce56f7f4#rd";
        }
        //获取"分享给朋友"按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: link,
            imgUrl: img,
            type: "link"//分享类型，music、video或link，不填默认为link
        });
        //获取"分享到朋友圈"按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: title,
            link: link,
            imgUrl: img
        });
    },

    getWx: function () {
        return wx;
    },

    wxLocation: function () {
        wx.getLocation({
            success: function (res) {
                return res.latitude + "," + res.longitude;
            },
            cancel: function (res) {
                //alert('用户拒绝授权获取地理位置');
            }
        });
    }

}

module.exports = wxConfig;