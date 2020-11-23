var AgentSumData = new Object();
$(function () {
  // AgentSumData.getDataList()
  AgentSumData.regEvent();
});

AgentSumData.regEvent = function () {
  $("body").on("click", ".query", function () {
    AgentSumData.getDataList();
  });
  $("body").on("click", ".exportBtn", function () {
    let type = 1;
    AgentSumData.getDataList("", "", type);
  });
};

AgentSumData.getDataList = function (page, rows, type) {
  let params = {};
  $(".panel-select")
    .find("input")
    .map(function () {
      params[$(this).attr("data-param")] = $(this).val();
    });
  params.orderBy = $("select").val();
  params.page = page || 1;
  params.rows = rows || 25;
  if (type) {
    AgentSumData.export(params); //导出
  } else {
    AgentSumData.createTable(params);
  }
};
AgentSumData.export = function (params) {
  delete params.page;
  delete params.rows;
  let arr = [];
  Object.keys(params).map(function (item, index) {
    arr.push(`${item}=${params[item]}`);
  });
  window.open(
    "/app/admin/v1/new/record/center/channel/export" + "?" + arr.join("&")
  );
};
AgentSumData.createTable = function (params) {
  parent.modal.loaders("block");
  $.get(
    "/app/admin/v1/record/center/channel/query/timeSharing",
    params,
    function (data) {
      parent.modal.loaders();
      let tbody = "";
      if (data.code === 200) {
        console.log(data);
        let d = data.data.data;
        console.log(d);
        if (d.length > 0) {
          d.map(function (item, index) {
            tbody += `<tr>
                      <td>${item.partnerParentName}</td>
                      <td>${item.partnerName}</td>
                      <td>${item.landingPageUV}</td>
                      <td>${item.landingPageRegistration}</td>
                      <td>${item.effectiveRegistration}</td>
                      <td>${item.appActivation}</td>
                      <td>${item.authPeopleNumber}</td>
                      <td>${item.robJustFew}</td>
                      <td>${item.prepaidPhoneNumber}</td>
                      <td>${item.prepaidMoneyCount}</td>
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
    }
  );
};
