const List = new Object();
$(function () {
    List.regEvent();
})

List.regEvent = function () {
    List.initScroll();
    Common.isScrolling();
}

List.initScroll = function () {
    // init controller
    var controller = new ScrollMagic.Controller(), page = 2,isScroll=true;
    // build scene
    var scene = new ScrollMagic.Scene({ triggerElement: "#loader", triggerHook: "onEnter" })
        .addTo(controller)
        .on("start", function (e) {
            if (!$("#loader").hasClass("active")) {
                if(isScroll){
                    $("#loader").addClass("active");
                    setTimeout(() => addBoxes({ "classId": window.location.search.split("classId=")[1], "page": page, size: 20 }), 100);
                }
            }
        });

    // pseudo function to add new content. In real life it would be done through an ajax request.
    function addBoxes(param) {
        console.log("httpGet--");
        Common.httpGet("/app/api/v1/h5/recommend/query/product", param, (err, data) => {
            if (err||data.length===0){
                isScroll = false;
                $("#loader").removeClass("active");
                return console.log(err + "没有更多数据");
             } 
            page++;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                html += `<div class="product-list">
                <a href="/app/web/v1/detail?productId=${data[i].id}">
                <div class="product-header">
                    <div class="product-info">
                        <img class="product-logo" src="${data[i].icon}" />
                        <span class="product-name">${data[i].name}</span>
                    </div>
                    ${data[i].tags.length > 0 ? `<div class="tag">${data[i].tags}</div>` : ""}
                </div>
                <div class="product-body">
                    <div class="productAmounts">
                        <div class="product-amounts">${data[i].limit}</div>
                        <div class="message quotaWrap">额度范围(元)</div>
                    </div>
                    <div class="product-message">
                        ${data[i].staging != null ?`<div class="message" >${data[i].staging}</div>`:""}
                 
                        <div class="message mesloan" >${data[i].dayRate}</div>
                    </div>
                    <div class="product-apply" th:title="${data[i].name}" th:data-id="${data[i].id}">
                       
                            <div class="message meswRap">已申请${data[i].showApplyCount}人</div>
                            <div class="progress_bg hide">
                                <div class="progress_bar"></div>
                            </div>
                            <div class="product-button">立即申请</div>
                       
                    </div>
                </div>
                <div class="product-bottom" >最低${data[i].startLimit}额度 | ${data[i].typeName}</div>
                 </a>
            </div>`;
            }
            $(".container").append(html)
  
        });
        // "loading" done -> revert to normal state
        scene.update(); // make sure the scene gets the new start position
        $("#loader").removeClass("active");
    }
}
