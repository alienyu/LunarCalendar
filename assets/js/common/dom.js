var Dom = {
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
    }
}

module.exports = Dom;