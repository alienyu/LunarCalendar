require("../../css/page/multiImgUpload.less");

var fuc = {
    init: function() {
        this.boxDom = "";
        this.bindEvent();
    },
    checkBoxNum: function() {
        if($(".img_upload_box").length < 9) {
            return true;
        } else {
            return false;
        }
    },
    bindEvent: function() {
        var that = this;
        $("#form").on("change", ".img_upload_btn", function(e) {
            that.btnDom = $(e.target);
            that.boxDom = $(e.target).parent();
            var file = e.target.files[0];
            var reader  = new FileReader();
            reader.addEventListener("load", function () {
                var imgSrc = reader.result;
                var html = "<img src='" + imgSrc + "' class='img_upload_result' />";
                that.boxDom.append(html).removeClass("new_box").find("a").remove();
                if(that.checkBoxNum() && $(".new_box").length < 1) {
                    var newUploadBox = '<div class="img_upload_box new_box"><input type="file" class="img_upload_btn" name="photo"><a href="javascript:;">+</a></div>';
                    $(".img_upload_box").last().after(newUploadBox);
                }
            }, false);
            reader.readAsDataURL(file);
        });

        $("#form").on("tap", ".img_upload_result", function(e) {
            $(e.target).parent().remove();
            if(that.checkBoxNum() && $(".new_box").length < 1) {
                var newUploadBox = '<div class="img_upload_box"><input type="file" class="img_upload_btn" name="photo_' + (that.btnIndex+1) + '"><a href="javascript:;">+</a></div>';
                $(".img_upload_box").last().after(newUploadBox);
            }
        });

        $("#btn").on("tap", function() {
            $("#form").find(".new_box").remove();
            console.log($("#form").length);
            for(var i=0;i<$("#form").length;i++){
                console.log(i);
                var data = new FormData($("#form")[i]);
                $.ajax({
                    type: "post",
                    url: "http://www.li-li.cn/llwx/file/upload",
                    type: 'POST',
                    data: data,
                    dataType: 'JSON',
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        console.log(data);
                    }
                })
            }

        })
    }
}

fuc.init();