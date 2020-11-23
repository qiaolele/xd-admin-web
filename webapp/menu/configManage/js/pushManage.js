var PushManage = new Object();
$(function () {
  PushManage.regEvent();
  PushManage.getQueryParam();
});
PushManage.regEvent = function () {
  $("body").on("click", ".query", function () {
    PushManage.getQueryParam();
  });
  $("body").on("click", "#myModal .fileUpload", function () {
    $("#fileload").click();
  });
  $("body").on("change", "#fileload", function () {
    //图片上传
    let $this = this;
    let type = $this.files[0].type;
    var formData = new FormData();
    formData.append("file", $("#fileload")[0].files[0]);
    $.ajax({
      url: "/admin/file/upload",
      type: "post",
      // 告诉jQuery不要去处理发送的数据
      processData: false,
      // 告诉jQuery不要去设置Content-Type请求头
      contentType: false,
      data: formData,
      success: function (data) {
        if (data.code === 200) {
          $("#myModal .fileUpload").html(`<img src="${data.data}">`);
          $("#myModal .fileUpload").attr("url", data.data);
        }
      },
    });
  });
  $("body").on("click", ".addBtn", function () {
    $("#myModal h4").html("新增");
  });
  $("body").on("click", ".editBtn", function () {
    //编辑
    $("#myModal h4").html("编辑");
    let id = $(this).parent().parent().attr("data_id");
    $(".otherModal").attr("data-id", id);
    let param = {
      id: id,
    };
    $.get("/admin/v1/push/getById", param, function (data) {
      if (data.code === 200) {
        let d = data.data;
        $(".templateKey").val(d.templateKey);
        $(".title").val(d.title);
        $(".content").val(d.content);
        $("#myModal")
          .find("input[type=radio]")
          .map(function () {
            if ($(this).val() == d[$(this).attr("name")]) {
              $(this).prop("checked", true);
              $(this).trigger("click");
            }
          });
        $("#myModal").modal("show");
      }
    });
  });
  $("body").on("click", "#myModal .affirmBtn", function () {
    //确认添加/修改
    if (PushManage.Verify() > 0) {
      return false;
    }
    let param = {};
    let input = $("#myModal").find("input:not(.hidden)");
    input.map(function () {
      param[$(this).attr("data-param")] = $(this).val();
    });
    $("#myModal")
      .find("input[type=radio]:checked")
      .map(function () {
        param[$(this).attr("name")] = $(this).val();
      });
    param.id = $(".otherModal").attr("data-id");
    console.log(JSON.stringify(param));
    let url = "/admin/v1/push/update";
    if (!param.id) {
      url = "/admin/v1/push/insert";
    }
    delete param.undefined;
    let type = "post";
    //编辑
    $.ajax({
      url: url,
      type: type,
      dataType: "JSON",
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify(param),
      success: function (data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: "成功",
            className: "PushManage",
          });
          $("#myModal").modal("hide");
          PushManage.getQueryParam();
        } else {
          parent.modal.operModal({
            info: "失败",
            className: "PushManage",
          });
        }
      },
    });
  });
  $("#myModal").on("hidden.bs.modal", function () {
    let input = $("#myModal").find("input[type=text]");
    let radio = $("#myModal").find("input[type=radio]");
    let select = $("#myModal").find("select");
    let textarea = $("#myModal").find("textarea");
    input.map(function () {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    select.map(function () {
      $(this).val("");
    });
    textarea.map(function () {
      $(this).val("");
    });
    $("input[name=hot]").eq(0).attr("checked", true);
    $("#myModal").find(".box,.box1").find("input:eq(0)").trigger("click");
    $("#myModal .fileUpload").removeAttr("url");
    $("#myModal .fileUpload").html("点击上传").removeClass("required-input");
    $(".otherModal").removeAttr("data-id");
  });
};
PushManage.getQueryParam = function (page, rows, type) {
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
  PushManage.createTable(params);
};
PushManage.createTable = function (params) {
  parent.modal.loaders("block");
  $.get("/admin/v1/push/getByAll", params, function (data) {
    parent.modal.loaders();
    let html = "";
    if (data.code === 200) {
      if (data.data.length > 0) {
        data.data.map(function (item, index) {
          html += ` <tr data_id="${item.id}" data-json="${item}">
                <td>${item.templateKey}</td>
                <td>${
                  item.type == 1
                    ? "表示应用推送"
                    : item.type == 2
                    ? "表示系统消息"
                    : "表示短信息"
                }</td>
                <td>${item.title}</td>
                <td>${item.content}</td>
                <td>${item.status === 1 ? "是" : "否"}</td>
                <td>
                    <button class="btn editBtn" data_id="${
                      item.id
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
    // initPage(
    //   data.data.total,
    //   params,
    //   PushManage,
    //   "#iframe-content",
    //   "createTable"
    // );
  });
};
PushManage.Verify = function () {
  let num = 0;
  $(".otherModal")
    .find(".verify:not(.hide) input")
    .map(function () {
      if ($(this).val() === "") {
        num++;
        $(this).addClass("required-input");
      }
    });
  return num;
};
