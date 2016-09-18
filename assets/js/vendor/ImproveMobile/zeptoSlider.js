(function ($) {
    $.fn.slideDown = function (duration) {
        // get old position to restore it then
        var position = this.css('position');

        // show element if it is hidden (it is needed if display is none)
        this.show();

        // place it so it displays as usually but hidden
        this.css({
            position: 'absolute',
            visibility: 'hidden'
        });

        // get naturally height
        var height = this.height();

        // set initial css for animation
        this.css({
            position: position,
            visibility: 'visible',
            overflow: 'hidden',
            height: 0
        });

        // animate to gotten height
        this.animate({
            height: height
        }, duration);
    };

    (function ($) {
        $.fn.slideUp = function (duration) {
            // get old position to restore it then
            var position = this.css('position');

            // show element if it is hidden (it is needed if display is none)
            this.show();

            // place it so it displays as usually but hidden
            this.css({
                position: 'absolute',
                visibility: 'hidden'
            });

            // get naturally height
            var height = this.height();

            // set initial css for animation
            this.css({
                position: position,
                visibility: 'visible',
                overflow: 'hidden',
                height: height
            });

            // animate to gotten height
            this.animate({
                height: 0
            }, duration);
        };
    })(Zepto);
})(Zepto);