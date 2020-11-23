const Index = new Object();
$(function () {
    Index.regEvent();
})

Index.regEvent = function () {
    Index.initScroll();
    Common.isScrolling();
}

/**
 * 从cookie中读取某个值
 * @param c_name cookie中的key
 * @returns {string}
 */
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start > -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return document.cookie.substring(c_start, c_end)
        }
    }
    return null;
}

/**
 * 格式化数字的字符串
 * @param n
 * @returns {*}
 */
function formatNumberString(n) {
    if (n){
        n = n.trim();
        if (/^[0-9]+$/.test(n)){
            return n;
        }
    }
    return null;
}

Index.initScroll = function () {
    // init controller
    var controller = new ScrollMagic.Controller(), page = 2, isScroll = true;
    // build scene
    var scene = new ScrollMagic.Scene({ triggerElement: "#loader", triggerHook: "onEnter" })
        .addTo(controller)
        .on("start", function (e) {
            console.log("11111111111111");
            if (!$("#loader").hasClass("active")) {
                if (isScroll) {
                    console.log("22222222222222");
                    $("#loader").addClass("active");
                    // 先按原来写的方式，从url获取客户id
                    let customerId = window.location.search.split("=")[1];
                    // 如果上一步获取失败，则尝试从cookie获取
                    if (!customerId){
                        customerId = getCookie("uid");
                    }
                    // 格式化上面获取的结果
                    let formatId = formatNumberString(customerId);

                    // 如果确定只含有数字，那么请求
                    if (formatId){
                        setTimeout(() => addBoxes({ "customerId": formatId, "page": page, size: 20 }), 500);
                    } else {
                        console.log("未取得客户id " + customerId);
                    }
                }
            }
        });

    // pseudo function to add new content. In real life it would be done through an ajax request.
    function addBoxes(param) {
        Common.httpGet("/app/api/v1/new/query/product", param, (err, data) => {
            console.log("query/product",data)
            if (err || data.length === 0) {
                isScroll = false;
                console.log("removeClass(active)",$("#loader"))
                $("#loader").removeClass("active");
                return console.log(err + "没有更多数据");
            }
            page++;
            for (let i = 0; i < data.length; i++) {
                if (i % 2 === 1) continue;
                $(`<li class="product">
                <div class="product-item">
                <a  href="/app/web/v1/detail?productId=${data[i].id}">
                    <div class="product-header">
                        <div class="product-info">
                            <img class="product-logo" src="${data[i].icon}"/>
                            <span class="product-name">${data[i].name}</span>
                        </div>
                        ${data[i].tags.length > 0 ? `<div class="tag">${data[i].tags}</div>` : ""}
                    </div>
                    <div class="product-amount">${data[i].limit}</div>
                    <div class="product-tips">
                        <div>${data[i].lendingCycle}</div>
                        ${data[i].staging != '' ? `<div>|&nbsp;${data[i].staging}</div>` : ""}
                    </div>
                    </a>
                </div>
                ${data.length - 1 != i ?
                        `<div class="product-item" >
                        <a  href="/app/web/v1/detail?productId=${data[i + 1].id}">
                <div class="product-header" >
                     <div class="product-info" >
                         <img class="product-logo" src="${data[i + 1].icon}"/>
                         <span class="product-name">${data[i + 1].name}</span>
                     </div>
                     ${data[i + 1].tags.length > 0 ? `<div class="tag">${data[i + 1].tags}</div>` : ""}
                 </div>
                 <div class="product-amount">${data[i + 1].limit}</div>
                 <div class="product-tips">
                     <div>${data[i + 1].lendingCycle}</div>
                     ${data[i + 1].staging != '' ? `<div>|&nbsp;${data[i + 1].staging}</div>` : ""}
                 </div>
                 </a>
             </div>
             `: ""}
            </li>`)
                    // .addClass("box1")
                    .appendTo("#content");
            }
        });
        // "loading" done -> revert to normal state
        scene.update(); // make sure the scene gets the new start position
        console.log("scene.update()")
        $("#loader").removeClass("active");
    }

    // add some boxes to start with.
    // addBoxes(18);
}
