const Common = {
    regEvent() {
        $("body").on("click", ".banner", function () {//广告banner统计
            Common.getParams(window.location.href.indexOf("new") > -1 ? 'ReCmdLIst' : 'HelpCenter');
        })
        $('body').on("click", ".product-list .product-apply", function () {//推荐位产品列表/详情
            Common.getParams('ReCmdLIst');
        });
        $('body').on("click", ".product .product-item", function () {//全部列表产品
            Common.getParams('Find');
        });
    },
    isScrolling($el = $("#content .product")) {
        Common.onresize($el)
        Common.regEvent();
        $(window).on('scroll', function () {
            log();
        });
        var timer = null, oldTop = newTop = $(window).scrollTop();

        function log() {
            if (timer) clearTimeout(timer);
            newTop = $(window).scrollTop();
            if (newTop === oldTop) {
                clearTimeout(timer);
                //已停止，写入业务代码
                Common.listener($el);
            } else {
                oldTop = newTop;
                timer = setTimeout(log, 1000);
            }
        }
    },
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    },
    listener($el) {
        const list = new Array();
        $el.forEach(el => {
            const bool = Common.isElementInViewport(el);
            if (bool) {
                list.push({
                    title: $(el).find('.product-item').attr("title"),
                    id: $(el).find('.product-item').attr("data-id"),
                    page: window.location.href.indexOf("new") > -1 ? 'Find' : 'ReCmdLIst'
                })
            }
        })
        const param = {
            list: list,
            type: 1
        }
        Common.logCount(param);
    },
    onresize($el) {
        window.onorientationchange = window.onresize = window.onload = function () {
            setTimeout(() => {
                Common.listener($el);
            }, 1000)

            var c = document.getElementsByTagName("html"),
                d = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (d > 750) {
                d = 750
            } else {
                if (d < 320) {
                    d = 320
                }
            }
            c[0].style.fontSize = (d / 750) * 625 + "%";
            document.getElementsByTagName("body")[0].style.visibility="visible";
        };
    },
    logCount(param) {
        let url = "http://dc-app-web.lifengkong.cn/app/api/v1/log";
        $.post(url, {"param":JSON.stringify(param)}, function (data,status,xhr) {
            console.log(data,status);
        });
    },
    httpGet(url,param,callback){
        $.ajax({data:param,url:url,success:function(data,status,xhr){
            console.log(data,status);
            if(status=="success"){
                callback(null,data)
            }else{
                callback("err",null)
            }
        },error:function(error){
            console.log(error);
            callback("err",error)
        }})
    },
    getParams(page) {
        const param = {
            list: [{
                id: $(this).attr("data-id"),
                title: $(this).attr("title"),
                page: page
            }], type: 0
        }
        Common.logCount(param);
    }
}
