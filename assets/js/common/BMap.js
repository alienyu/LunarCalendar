/*------------------------------地点输入提示功能-----------------------------------*/
//百度地图API功能
function G(id) {
    return document.getElementById(id);
}
var ac = new BMap.Autocomplete({
    "input": "site"
});
ac.setLocation("上海");
ac.addEventListener("onhightlight", function (e) {
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br/>index=" + e.fromitem.index + "<br/>value=" + value;
    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br/>ToItem<br/>index=" + e.toitem.index + "<br/>value=" + value;
    G("searchResultPanel").innerHTML = str;
});
var myValue;
ac.addEventListener("onconfirm", function (e) {
    var _value = e.item.value;
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
});

module.exports = ac;