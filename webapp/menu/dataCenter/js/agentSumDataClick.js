var AgentSumData = new Object();
$(function() {
  // AgentSumData.getDataList()
  AgentSumData.regEvent();
});

AgentSumData.regEvent = function() {
  $("body").on("click", ".query", function() {
    AgentSumData.getDataList();
  });
  $("body").on("click", ".exportBtn", function() {
    let type = 1;
    AgentSumData.getDataList("", "", type);
  });
};
AgentSumData.getDataList = function(page, rows, type) {
  let params = {};
  $(".panel-select")
    .find("input")
    .map(function() {
      params[$(this).attr("data-param")] = $(this).val();
    });
  // params.orderBy = $("select").val();
  params.page = page || 1;
  params.rows = rows || 25;
  if (type) {
    AgentSumData.export(params); //导出
  } else {
    AgentSumData.createTable(params);
  }
};
AgentSumData.export = function(params) {
  delete params.page;
  delete params.rows;
  let arr = [];
  Object.keys(params).map(function(item, index) {
    arr.push(`${item}=${params[item]}`);
  });
  window.open("/admin/v1/product/export" + "?" + arr.join("&"));
};
AgentSumData.createTable = function(params) {
  parent.modal.loaders("block");
  $.get("/admin/v1/product/pvuv", params, function(data) {
    parent.modal.loaders();
    let tbody = "";
    if (data.code === 200) {
      let d = data.data.data;
      if (d.length > 0) {
        d.map(function(item, index) {
          tbody += `<tr>
                      <td>${item.partnerParentName}</td>
                      <td>${item.partnerName}</td>
                      <td>${item.productClickUV}</td>
                      <td>${item.productClickPV}</td>
                  </tr>`;
        });
      } else {
        tbody = `<tr><td colspan="13">暂无数据</td></tr>`;
      }
    }
    {
      /* <td>${item.vipMoney}</td>
        <td>${item.vipNumber}</td>
        <td>${item.apiPromote}</td>
        <td>${item.apiMoney}</td> */
    }
    $(".panel-table tbody").html(tbody);
    initPage(
      data.data.total,
      params,
      AgentSumData,
      "#iframe-content",
      "createTable"
    );
  });
};
