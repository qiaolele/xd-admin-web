var GameManage = new Object();
var strengthCode = "";
var platformCode = "";
var locationCode = "";
var orderNum = "";
var gameId = "";
$(function () {
  // $('body').on('click', '.edit', function() {
  //   $('.editInput').attr('disabled', false)
  // })
  GameManage.regEvent();
  GameManage.getQueryParam();
});
GameManage.addGameTypeList = function (name, code) {
  let param = {
    name: name,
    code: code,
  };
  let type = "post";
  if (code) {
    //编辑
    type = "put";
  }
  $.ajax({
    url: "/admin/game_admin/category",
    type: type,
    dataType: "JSON",
    contentType: "application/x-www-form-urlencoded",
    data: param,
    success: function (data) {
      if (data.code === 200) {
        if (code) {
          parent.modal.operModal({
            info: "修改分类成功",
            className: "GameManage",
          });
        } else {
          parent.modal.operModal({
            info: "添加分类成功",
            className: "GameManage",
          });
        }
        GameManage.getGameTypeList();
      } else {
        parent.modal.operModal({
          info: "失败",
          className: "GameManage",
        });
      }
    },
  });
};
GameManage.addUpdateInfo = function (param, obj) {
  $.ajax({
    url: "/admin/dict_admin/dict/game",
    type: "post",
    dataType: "JSON",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(param),
    success: function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: "成功",
          className: "GameManage",
        });
      } else {
        parent.modal.operModal({
          info: "失败",
          className: "GameManage",
        });
      }
    },
  });
};
GameManage.getQueryParam = function (page, rows, type) {
  //获取查询参数
  let params = {};
  params.page = page || 1;
  params.rows = rows || 25;
  let input = $(".panel-select").find("input");
  let select = $(".panel-select").find("select");
  input.map(function () {
    params[$(this).attr("data-param")] = $(this).val();
  });
  select.map(function () {
    params[$(this).attr("data-param")] = $(this).val();
  });
  GameManage.createTable(params);
};
GameManage.createTable = function (params) {
  parent.modal.loaders("block");
  $.get("/admin/game_admin/games", params, function (data) {
    parent.modal.loaders();
    let html = "";
    if (data.code === 200) {
      if (data.data.data.length > 0) {
        data.data.data.map(function (item, index) {
          html += ` <tr data_id="${item.id}" data-json="${item}">
                <td>
                    <img src="${item.icon}" style="width: 200px;height: 100px;">
                </td>
                <td>${item.name}</td>
                <td>${item.categoryName}</td>
                <td>${item.hot === 1 ? "是" : "否"}</td>
                <td>${item.userNum}</td>
                <td>
                ${
                  index === 0
                    ? `<button class="btn btn-enter" data-type="down">
                        <span class="glyphicon glyphicon-arrow-down"></span>
                      </button> `
                    : index === data.data.pageSiz - 1
                    ? `<button class="btn btn-enter" data-type="up">
                       <span class="glyphicon glyphicon-arrow-up"></span>
                        </button>`
                    : `<button class="btn btn-enter" data-type="down">
                        <span class="glyphicon glyphicon-arrow-down"></span>
                       </button><button class="btn btn-enter" data-type="up">
                       <span class="glyphicon glyphicon-arrow-up"></span>
                        </button>`
                }
                </td>
                <td>
                    <button class="btn editBtn" data-size="${
                      item.imgSize
                    }" data-id="${item.id}" data-orderNum="${
            item.orderNum
          }" data-locationCode="${item.locationCode}" data-platformCode="${
            item.platformCode
          }" data-strengthCode="${
            item.strengthCode
          }" data-toggle="modal" data-target="#myModal">编辑</button>
                </td>
              </tr>`;
        });
      } else {
        html += `<tr><td colspan="8">暂无数据</td><tr/>`;
      }
    } else {
      html += `<tr><td colspan="8">暂无数据</td><tr/>`;
    }
    $(".panel-table tbody").html(html);
    initPage(
      data.data.total,
      params,
      GameManage,
      "#iframe-content",
      "createTable"
    );
  });
};
GameManage.Verify = function () {
  let num = 0;
  $(".otherModal")
    .find(".verify:not(.hide) input")
    .map(function () {
      if ($(this).val() === "") {
        num++;
        $(this).addClass("required-input");
      }
    });
  if (!$(".fileUpload").attr("url")) {
    num++;
    $(".fileUpload").addClass("required-input");
  }
  return num;
};
