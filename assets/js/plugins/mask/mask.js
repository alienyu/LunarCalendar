require("./mask.less");
var html = require("./mask.html");
var mask = {
    init: function() {
        $("body").append(html);
    },
    open: function() {
        $(".mask").css({"display": "block", "height":($(document).height() < $(window).height()) ? $(window).height() : $(document).height()});
        $('.loading').css("display", "block");
    },
    close: function() {
        $(".mask").css("display", "none");
        $('.loading').css("display", "none");
    }
}

mask.init();
module.exports = mask;