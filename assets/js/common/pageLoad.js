module.exports = function(options) {
    var defaults = {opacity: 0.8, backgroundColor: "#000", delayTime: 500, zindex: 999999999, sleep: 500};
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
    };
}