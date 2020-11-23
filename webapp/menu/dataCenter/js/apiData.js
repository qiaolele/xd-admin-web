var ApiData = new Object();
$(function() {
  ApiData.getProductList();
});
ApiData.regEvent = function() {
  $("body").on("click", ".exportBtn", function() {
    let type = 1;
    ApiData.getParams("", "", type);
  });
  $("body").on("click", ".check", function() {
    ApiData.getParams();
  });
};
ApiData.getProductList = function() {
  parent.modal.loaders("block");
  $.get("/admin/v1/productName", {}, function(data) {
    parent.modal.loaders();
    let html = "";
    let d = data.data;
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html +=
            "<option value=" + item.value + ">" + item.title + "</option>";
        });
      }
    }
    $(".productName").html(html);
    $(".productName option:first").prop("selected", "selected");
    ApiData.getParams();
    ApiData.regEvent();
  });
};
ApiData.getConData = function(param) {
  parent.modal.loaders("block");
  $.get("/admin/v1/singleOrder", param, function(data) {
    parent.modal.loaders();
    let html = "";
    let d = data.data.data;
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html +=
            '<div class="item"><p class="title">' +
            item.title +
            "</p>" +
            '<p class="value">' +
            item.value +
            "</p></div>";
        });
      } else {
        html += `<tr><td colspan="10">暂无数据</td></tr>`;
      }
    }
    $(".panel-table .box").html(html);
  });
};
ApiData.getParams = function(page, rows, type) {
  let param = {};
  $(".panel-select")
    .find("input")
    .map(function(item, index) {
      param[$(this).attr("data-param")] = $(this).val();
    });
  param.page = page || 1;
  param.rows = rows || 25;
  param.productId = $(".productName option:selected").val();
  if (type) {
    ApiData.export(param);
  } else {
    ApiData.getConData(param);
  }
};
ApiData.getDataList = function(params) {
  parent.modal.loaders("block");
  $.get("/admin/v1/singleOrder", params, function(data) {
    parent.modal.loaders();
    let html = "";
    let d = data.data.data;
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `<tr>
                  <td>${item.agencyName}</td>
                  <td>${item.productName}</td>
                  <td>${item.orderNumber}</td>
                  <td>${item.pullSuccess}</td>
                  <td>${item.pushSuccess}</td>
                  <td>${item.pushSuccessRate}</td>
                  <td>${item.auditPassNumber}</td>
                  <td>${item.passRate}</td>
                  <td>${item.tiedCardNumber}</td>
                  <td>${item.tiedCardRate}</td>
                  <td>${item.signingNumber}</td>
                  <td>${item.signingRate}</td>
                  <td>${item.loanNumber}</td>
                  <td>${item.inReview}</td>
                  <td>${item.auditPassMoney}</td>
                  <td>${item.forLendMoney}</td>
                  <td>${item.lendMoney}</td>
              </tr>`;
        });
      } else {
        html += `<tr><td colspan="10">暂无数据</td></tr>`;
      }
    }
    $(".panel-table tbody").html(html);
    initPage(
      data.data.total,
      params,
      ApiData,
      "#iframe-content",
      "getDataList"
    );
  });
};
ApiData.export = function(params) {
  delete params.page;
  delete params.rows;
  let arr = [];
  Object.keys(params).map(function(item, index) {
    arr.push(`${item}=${params[item]}`);
  });
  window.open("/admin/v1/singleOrder/export" + "?" + arr.join("&"));
  // window.open('/admin/v1/record/center/api/order/export' + '?' + arr.join('&'))
};
