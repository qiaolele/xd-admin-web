var GameManage = new Object();
$(function() {
  // $('body').on('click', '.edit', function() {
  //   $('.editInput').attr('disabled', false)
  // })
  GameManage.regEvent();
  GameManage.getQueryParam();
});
//认证项排序
GameManage.authListSort = function(type, gameId) {
  $(".baseTable")
    .find("tr")
    .each(function(item) {
      $(this)
        .find(".indexNumber")
        .val(item + 1);
    });
  let param = {
    gameId: gameId,
    direction: type
  };
  $.post("/admin/ad_game/sort", param, function(data) {
    if (data.code === 200) {
      GameManage.getQueryParam();
    }
  });
  //
};
GameManage.regEvent = function() {
  $("body").on("click", ".queryBtn", function() {
    GameManage.getQueryParam();
  });
  $("body").on("click", ".baseTable .btn-enter", function() {
    const type = $(this).attr("data-type"),
      $tr = $(this)
        .parent()
        .parent(),
      id = $tr.attr("data_id");
    switch (type) {
      case "up":
        if ($tr.prev().length > 0) {
          $tr.prev().before($tr.clone());
          $tr.remove();
        }
        break;
      case "down":
        if (!$tr.next().hasClass("hide")) {
          $tr.next().after($tr.clone());
          $tr.remove();
        }
        break;
    }
    GameManage.authListSort(type, id);
  });
  $("body").on("click", ".query", function() {
    GameManage.getQueryParam();
  });
  $("body").on("click", "#myModal .fileUpload", function() {
    $("#fileload").click();
  });
  $("body").on("change", "#fileload", function() {
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
      success: function(data) {
        if (data.code === 200) {
          $("#myModal .fileUpload").html(`<img src="${data.data}">`);
          $("#myModal .fileUpload").attr("url", data.data);
        }
      }
    });
  });
  $("body").on("click", ".addBtn", function() {
    $("#myModal h4").html("新增");
  });
  $("body").on("click", ".editBtn", function() {
    //编辑
    $("#myModal h4").html("编辑");
    let id = $(this).attr("data-id");
    $(".otherModal").attr("data-id", id);
    $.get("/admin/ad_game/game/" + id, function(data) {
      if (data.code === 200) {
        let d = data.data;
        $(".userNum").val(d.userNum);
        $(".name").val(d.name);
        $("#myModal")
          .find("textarea")
          .map(function() {
            $(this).val(d[$(this).attr("data-param")]);
          });
        $("#myModal")
          .find("input[type=radio]")
          .map(function() {
            if (parseInt($(this).val()) === d[$(this).attr("name")]) {
              $(this).trigger("click");
              $(this).attr("checked", "checked");
            }
          });
        $("#myModal")
          .find("input[type=text]")
          .map(function() {
            $(this).val(d[$(this).attr("data-param")]);
          });

        $("#myModal .os")
          .val(d.os)
          .prop("selected", true);
        $("#myModal .fileUpload")
          .attr("url", d.icon)
          .html(`<img src='${d.icon}'>`);
        $("#myModal").modal("show");
      }
    });
  });
  $("body").on("click", "#myModal .affirmBtn", function() {
    //确认添加/修改
    if (GameManage.Verify() > 0) {
      return false;
    }
    let param = {};
    let input = $("#myModal").find("input:not(.hidden)");
    let select = $("#myModal").find("select");
    let textarea = $("#myModal").find("textarea");
    param.icon = $("#myModal .fileUpload").attr("url");
    input.map(function() {
      param[$(this).attr("data-param")] = $(this).val();
    });
    select.map(function() {
      param[$(this).attr("data-param")] = $(this).val();
    });
    textarea.map(function() {
      param[$(this).attr("data-param")] = $(this).val();
    });
    param.id = $(".otherModal").attr("data-id");
    param.status = $("input[name='status']:checked").val();
    param.type = $("input[name='type']:checked").val();
    delete param.undefined;
    console.log(JSON.stringify(param));
    let url = "/admin/ad_game/game";
    let type = "post";
    //编辑
    $.ajax({
      url: url,
      type: type,
      dataType: "JSON",
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify(param),
      success: function(data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: "成功",
            className: "GameManage"
          });
          $("#myModal").modal("hide");
          GameManage.getQueryParam();
        } else {
          parent.modal.operModal({
            info: "失败",
            className: "GameManage"
          });
        }
      }
    });
  });
  $("body").on("click", "#iframe-content .saveBtn", function() {
    //排序
    let param = {};
    param.id = $(this).attr("data-id");
    param.orderIndex = $(this)
      .siblings(".orderIndex")
      .val();
    $.get(
      "/admin/v1/home/GameManage/sort",
      { sort: JSON.stringify(param) },
      function(data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: "成功",
            className: "GameManage"
          });
          GameManage.getQueryParam();
        } else {
          parent.modal.operModal({
            info: "失败",
            className: "GameManage"
          });
        }
      }
    );
  });
  $("#myModal").on("hidden.bs.modal", function() {
    let input = $("#myModal").find("input[type=text]");
    let radio = $("#myModal").find("input[type=radio]");
    let select = $("#myModal").find("select");
    let textarea = $("#myModal").find("textarea");
    input.map(function() {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    $(this)
      .find("select.form-control")
      .find("option:first")
      .prop("selected", true)
      .trigger("change");
    textarea.map(function() {
      $(this).val("");
    });
    $("#myModal")
      .find(".box")
      .find("input:eq(0)")
      .trigger("click");
    $("#myModal .fileUpload").removeAttr("url");
    $("#myModal .fileUpload")
      .html("点击上传")
      .removeClass("required-input");
    $(".otherModal").removeAttr("data-id");
  });
};
GameManage.getQueryParam = function(page, rows, type) {
  //获取查询参数
  let params = {};
  params.page = page || 1;
  params.rows = rows || 25;
  let input = $(".panel-select").find("input");
  let select = $(".panel-select").find("select");
  input.map(function() {
    params[$(this).attr("data-param")] = $(this).val();
  });
  select.map(function() {
    params[$(this).attr("data-param")] = $(this).val();
  });
  GameManage.createTable(params);
};
GameManage.createTable = function(params) {
  parent.modal.loaders("block");
  $.get("/admin/ad_game/games", params, function(data) {
    parent.modal.loaders();
    let html = "";
    if (data.code === 200) {
      if (data.data.data.length > 0) {
        data.data.data.map(function(item, index) {
          html += ` <tr data_id="${item.id}">
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>
                    <img src="${item.icon}" style="width: 200px;height: 100px;">
                </td>
                <td>${item.introduction}</td>
                <td>${item.userNum}</td>
                <td>${item.tag}</td>
                <td>${
                  item.type === 1 ? "推荐" : item.type === 2 ? "热门" : "最新"
                }</td>
                <td>${item.status === 1 ? "上架" : "下架"}</td>
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
                    <button class="btn editBtn" data-id="${
                      item.id
                    }" data-toggle="modal" data-target="#myModal">编辑</button>
                </td>
              </tr>`;
        });
      } else {
        html += `<tr><td colspan="10">暂无数据</td><tr/>`;
      }
    } else {
      html += `<tr><td colspan="10">暂无数据</td><tr/>`;
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
GameManage.Verify = function() {
  let num = 0;
  $(".otherModal")
    .find(".verify:not(.hide) input")
    .map(function() {
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
