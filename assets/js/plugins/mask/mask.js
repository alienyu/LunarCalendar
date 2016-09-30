require("./mask.less");
var html = require("./mask.html");


var mask = {
    init: function() {
        $("body").append(html);
    },
    open: function() {
        $('#loadingPage').fadeIn();
    },
    close: function() {
        $("#loadingPage").fadeOut();
    }
}

mask.init();
module.exports = mask;