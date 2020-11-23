var ChannelData = new Object();
$(function() {
  // ChannelData.getParams();
  ChannelData.regEvent();
});
ChannelData.regEvent = function() {
  $("body").on("click", ".saveBtn", function() {
    let params = {};
    let num = 0;
    params.id = $(this).attr("data-id");
    $(this)
      .parent()
      .parent()
      .find("input")
      .map(function(item, index) {
        params[$(this).attr("data-param")] = $(this).val();
        if ($(this).val() === "") num++;
        if (num > 0) {
          parent.modal.operModal({
            info: "数据不能为空",
            className: "OperatingAndH5"
          });
          return false;
        }
      });
    $.get("/admin/v1/record/center/agency/api/update", params, function(data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: data.message,
          className: "ChannelData"
        });
      } else {
        parent.modal.operModal({
          info: data.message,
          className: "ChannelData"
        });
      }
      ChannelData.getParams();
    });
  });
  $("body").on("click", ".exportBtn", function() {
    let type = 1;
    ChannelData.getParams("", "", type);
  });
  $("body").on("click", ".check", function() {
    ChannelData.getParams();
  });
};
ChannelData.export = function(params) {
  delete params.page;
  delete params.rows;
  let arr = [];
  Object.keys(params).map(function(item, index) {
    arr.push(`${item}=${params[item]}`);
  });
  window.open(
    "/admin/v1/partner/statistics/user-data/export" + "?" + arr.join("&")
  );
};
ChannelData.getParams = function(page, rows, type) {
  let param = {};
  $(".panel-select")
    .find("input")
    .map(function(item, index) {
      param[$(this).attr("data-param")] = $(this).val();
    });
  $(".panel-select")
    .find("select")
    .map(function(item, index) {
      param[$(this).attr("data-param")] = $(this).val();
    });
  param.page = page || 1;
  param.rows = rows || 25;
  param.startDate = param.startDate.substring(0, 10);
  param.endDate = param.endDate.substring(0, 10);
  console.log(param.startDate);
  param.timestamp = new Date().getTime();
  if (type) {
    ChannelData.export(param);
  } else {
    ChannelData.getDataList(param);
  }
};
ChannelData.getDataList = function(param) {
  parent.modal.loaders("block");
  $.get("/admin/v1/partner/statistics/user-data", param, function(data) {
    parent.modal.loaders();
    let html = "";
    let d = data.data.data;
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `
                  <tr>
                    <td>${item.date}</td>
                    <td>${item.parentName}</td>
                    <td>${item.partnerName}</td>
                    <td>${item.uv}</td>
                    <td>${item.totalRegister}</td>
                    <td>${item.effectiveRegister}</td>
                    <td>${item.effectiveActivation}</td>
                    <td>${item.jxwClickUserNum}</td>
                    <td>${item.jxwClickNum}</td>
                    <td>${item.jxwUserNum}</td>
                    <td>${item.jxwRewardUserNum}</td>
                    <td>${item.jxwRewardNum}</td>
                    <td>${item.jxwRewardAmount}</td>
                    <td>${item.jxwSettleAmount}</td>
                    <td>${item.jxwProfitAmount}</td>
                    <td>${item.jxwWithdrawalAmount}</td>
                    <td>${item.dhNewUserNum}</td>
                    <td>${item.dhNum}</td>
                    <td>${item.dhUserNum}</td>
                </tr>`;
        });
      } else {
        html += `<tr><td colspan="19">暂无数据</td></tr>`;
      }
    }
    $(".panel-table tbody").html(html);
    // initPage(
    //   data.data.total,
    //   param,
    //   ChannelData,
    //   "#iframe-content",
    //   "getDataList"
    // );
  });
};
