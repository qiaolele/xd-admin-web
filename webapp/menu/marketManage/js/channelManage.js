var Channel = new Object();
$(function () {
  Channel.getListData();
  Channel.regEvent();
  Channel.getSkinList();
});
Channel.regEvent = function () {
  $("body").on("click", "#query", function () {
    //查询
    Channel.getListData();
  });
  $("#btn-newadd").on("click", function () {
    //获取新增主渠道的场景
    $("#modal-channel h4").html("新增");
    Channel.getSceneList();
  });
  $("body").on("click", ".editBtn", function () {
    //编辑主渠道
    Channel.getSceneList();
    let id = $(this).attr("data-id");
    Channel.getPatnerChannel(id);
    $("#modal-channel h4").html("编辑");
    $("#modal-channel .saveBtn").attr("data-id", $(this).attr("data-id"));
  });
  $("body").on("click", "#modal-channel .saveBtn", function () {
    //保存主渠道
    let params = {};
    params.name = $("#modal-channel input").val();
    $("#modal-channel")
      .find("select")
      .map(function () {
        params[$(this).attr("data-param")] = $(this).val();
      });
    params.id = $(this).attr("data-id");
    if (
      $("#modal-channel input").val() === "" ||
      $(".sceneWrap").val() === "" ||
      $(".parentType").val() === ""
    ) {
      $("#modal-channel input").addClass("required-input");
      return false;
    }
    $.get("/app/admin/v1/partner/addorupdateprimary", params, function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: "成功",
          className: "Channel",
        });
        $("#modal-channel").modal("hide");
        Channel.getListData();
      }
    });
  });
  $("body").on("click", ".updateStatusBtn", function () {
    let status = $(this).attr("data-status") === "0" ? "1" : "0";
    let id = $(this).attr("data-id");
    $.post(
      "/app/admin/v1/partner/setstatus",
      {
        id: id,
        status: status,
      },
      function (data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: "成功",
            className: "Channel",
          });
          Channel.getListData();
          $("#updateStatus").modal("hide");
        }
      }
    );
  });
  $("body").on("click", ".statusBtn", function () {
    // 启用/禁用
    $(".updateStatusBtn").attr({
      "data-id": $(this).attr("data-id"),
      "data-status": $(this).attr("data-status"),
    });
    let html = $(this).attr("data-status") === "1" ? "禁用" : "启用";
    $("#updateStatus h4 span").html(html);
  });
  $("body").on("click", ".testOnBtn", function () {
    //开启测试数据
    $("#modalTestData h4").html("确认测试");
    let id = $(this).attr("data-id");
    Channel.getPatnerChannel(id);
    $("#modalTestData .saveBtn").attr(
      "data-parentId",
      $(this).attr("data-parentId")
    );
    $("#modalTestData .saveBtn").attr("data-id", $(this).attr("data-id"));
  });
  // 确认开启测试
  $("body").on("click", "#modalTestData .saveBtn", function () {
    let num = 0,
      params = {
        skinIds: "",
      };
    let status = $(this).attr("data-status") ? "0" : "1";
    $("#modalTestData .required-div")
      .find("img")
      .map(function () {
        params.skinIds += $(this).attr("data-id") + ",";
        if ($(this).attr("data-id") !== "") num++;
      });
    if (num < 2) {
      parent.modal.operModal({
        info: "图片不能小于2张",
        className: "H5Product",
      });
      return false;
    }
    params.partnerId = $(this).attr("data-id");
    Channel.updateTest(params, status);
  });
  // 确认结束测试
  $("body").on("click", ".updateTestBtn", function () {
    let params = {};
    let status = $(this).attr("data-status") ? "0" : "1";
    params.partnerId = $(this).attr("data-id");
    Channel.updateTest(params, status);
  });
  $("body").on("click", ".testExportBtn", function () {
    let type = 1;
    Channel.getParams("", "", type);
  });
  $("body").on("click", ".testDataBtn", function () {
    //开启测试数据
    $("#testModal").attr({
      "data-id": $(this).attr("data-id"),
      "data-status": $(this).attr("data-status"),
    });
    Channel.getParams();
  });
  $("body").on("click", ".testDataSearch", function () {
    //开启测试数据
    Channel.getParams();
  });
  $("body").on("click", ".testBtn", function () {
    // 结束测试
    $(".updateTestBtn").attr({
      "data-id": $(this).attr("data-id"),
      "data-status": $(this).attr("data-status"),
    });
    let stopTime = new Date().getTime();
    let startTime = $(this).attr("data-time");
    let time = parseInt((stopTime - startTime) / 1000);
    // Channel.formatDateTime(time)
    let years = parseInt(Channel.editE(time / (3600 * 24 * 365))); //防止科学技术法

    if (years >= 1) {
      //即间隔超过一年时间
      time = parseInt(time - years * (3600 * 24 * 365));
    }
    let days = parseInt(time / (3600 * 24));
    if (days >= 1) {
      //即间隔超过一天时间
      time = parseInt(time - days * (3600 * 24));
    }
    let hours = parseInt(time / 3600);
    if (hours >= 1) {
      //即间隔超过一小时
      time = parseInt(time - hours * 3600);
    }
    let mins = parseInt(time / 60);
    if (mins >= 1) {
      //即间隔超过一分钟
      time = parseInt(time - mins * 60);
    }
    let sec = time;
    $("#updateTest h4 span").html(
      "该测试已进行 " +
        days +
        "天" +
        hours +
        "小时" +
        mins +
        "分钟" +
        sec +
        "秒，确认要结束测试吗"
    );
  });

  $("body").on(
    "click",
    "#modal-childChannel img,#modalTestData img",
    function () {
      //选择皮肤
      if ($(this).parent().hasClass("required-div")) {
        $(this).parent().removeClass("required-div");
      } else {
        $("#modal-childChannel img").parent().removeClass("required-div");
        $(this).parent().addClass("required-div");
        $(this).parent().addClass("required-div");
      }
    }
  );
  $("body").on("click", ".newChildBtn", function () {
    //新增子渠道按钮
    $("#modal-childChannel h4").html("新增");
    $("#modal-childChannel .saveBtn").attr(
      "data-parentId",
      $(this).attr("data-id")
    );
  });

  $("body").on("click", ".editChildBtn", function () {
    //编辑子渠道按钮
    $("#modal-childChannel h4").html("编辑");
    let id = $(this).attr("data-id");
    Channel.getPatnerChannel(id);
    $("#modal-childChannel .saveBtn").attr(
      "data-parentId",
      $(this).attr("data-parentId")
    );
    $("#modal-childChannel .saveBtn").attr("data-id", $(this).attr("data-id"));
  });

  $("body").on("click", "#modal-childChannel .saveBtn", function () {
    //保存子渠道
    let name = $("#modal-childChannel #channelName").val();
    const skinId = $("#modal-childChannel .required-div").attr("data-id");
    if (name) {
      $("#modal-childChannel #channelName").removeClass("required-input");
    } else {
      $("#modal-childChannel #channelName").addClass("required-input");
      return;
    }
    if (!skinId) {
      parent.modal.operModal({
        info: "请选择皮肤",
        className: "Channel",
      });
      return;
    }
    let jumpType = $("input[name='jumpType']:checked").val();
    let jumpUrl = $("#modal-childChannel .jumpUrl").val();
    console.log(jumpType, jumpUrl);
    $.get(
      "/app/admin/v1/partner/addorupdatelesser",
      {
        parentId: $(this).attr("data-parentId"),
        name: name,
        skinId: skinId,
        jumpType: jumpType,
        jumpUrl: jumpUrl,
        id: $(this).attr("data-id") || "",
      },
      function (data) {
        if (data.code === 200) {
          Channel.getListData();
          $("#modal-childChannel").modal("hide");
        }
        parent.modal.operModal({
          info: data.data,
          className: "Channel",
        });
      }
    );
  });
  $("body").on(
    "click",
    "#modal-childChannel .deleteBtn,#modalTestData .deleteBtn",
    function () {
      //删除按钮
      $(".deleteConfirm").attr("data-id", $(this).attr("data-id"));
    }
  );
  $("body").on("click", ".deleteConfirm", function () {
    //确认删除
    let id = $(this).attr("data-id");
    parent.modal.loaders("block");
    $.post(
      "/app/admin/v1/partner/deleteskin",
      {
        id: id,
      },
      function (data) {
        parent.modal.loaders();
        if (data.code === 200) {
          parent.modal.operModal({
            info: "成功",
            className: "Channel",
          });
          Channel.getSkinList();
        } else {
          parent.modal.operModal({
            info: data.message,
            className: "Channel",
          });
        }
        $("#deleteModal").modal("hide");
      }
    );
  });
  $("body").on("click", ".btn-qrcode", function () {
    //查看链接
    var id = $(this).attr("data-id");
    parent.modal.loaders("block");
    $.get(
      "/app/admin/v1/partner/getregisteredaddress",
      {
        id: id,
      },
      function (data) {
        parent.modal.loaders();
        $("#modal-qrcode").modal("show");
        $("#modal-qrcode .qrcode-text").html("");
        $("#modal-qrcode .qrcode-text").qrcode({
          render: "table",
          width: 200,
          height: 200,
          text: data.data.replace(/"/g, ""),
        });
        $(".qrcode-url-text").html(data.data);
      }
    );
  });
  $("body").on("click", ".copy-url", function () {
    //复制二维码地址按钮
    copyTextToClipboard($(".qrcode-url-text").text(), $("#modal-qrcode"));
  });
  $("body").on("click", "#modal-skin .imgWrap,#modal-skin .mask", function () {
    //上传皮肤
    $(this).siblings("input").click();
  });
  $("body").on("change", "#modal-skin .file", function () {
    let that = $(this);
    var formData = new FormData();
    formData.append("file", $("#fileload2")[0].files[0]);
    console.log($("#fileload2")[0].files[0]);
    $.ajax({
      url: "/app/file/upload",
      type: "post",
      // 告诉jQuery不要去处理发送的数据
      processData: false,
      // 告诉jQuery不要去设置Content-Type请求头
      contentType: false,
      data: formData,
      success: function (data) {
        if (data.code === 200) {
          that.siblings(".imgWrap").find("img").attr("src", data.data);
          that.siblings(".imgWrap").find("img").attr("data-url", data.data);
          that.siblings(".preBtn").attr("data-url", data.data);
        }
      },
    });
  });
  $("body").on("mouseover", "#modal-skin .img", function () {
    if ($(this).children(".imgWrap").children("img").attr("data-url")) {
      $(this).children(".mask").removeClass("hide");
    }
  });
  $("body").on("mouseout", "#modal-skin .img", function () {
    $("#modal-skin .mask").addClass("hide");
  });
  $("body").on("click", "#modal-skin .saveBtn", function () {
    //保存皮肤上传
    let params = {};
    let num = 0;
    $("#modal-skin")
      .find("img")
      .map(function () {
        params[$(this).attr("data-param")] = $(this).attr("data-url");
        if ($(this).attr("data-url")) num++;
      });
    if (num < 1) {
      parent.modal.operModal({
        info: "图片不能为空",
        className: "H5Product",
      });
      return false;
    }
    $.post(
      "/app/admin/v1/partner/addskin",
      {
        skin: JSON.stringify(params),
      },
      function (data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: data.msg,
            className: "H5Product",
          });
          $("#modal-skin").modal("hide");
          Channel.getListData();
          Channel.getSkinList();
        } else {
          parent.modal.operModal({
            info: data.message,
            className: "H5Product",
          });
        }
      }
    );
  });
  $("body").on("click", ".preBtn", function () {
    if ($(this).attr("data-url")) {
      $(".preWrap").removeClass("hide");
      $(".preImg").html(`<img src="${$(this).attr("data-url")}">`);
    }
  });
  $("body").on("click", ".closeBtn", function () {
    $(".preWrap").addClass("hide");
  });
  // 关闭测试数据弹窗
  $("body").on("click", ".closeTableBtn", function () {
    $("#testModal").hide();
    $(".modal-backdrop").removeClass("in");
    Channel.getListData();
    Channel.regEvent();
    Channel.getSkinList();
  });
  $("#modal-channel").on("hidden.bs.modal", function () {
    //主渠道模态框隐藏
    $("#modal-channel input").val("");
    $("#modal-channel .parentType").val("0");
    $("#modal-channel .saveBtn").removeAttr("data-id");
    $("#modal-channel input").removeClass("required-input");
    $("#modal-channel")
      .find("img")
      .map(function () {
        $(this).removeClass("required-div");
      });
  });
  $("#modal-childChannel").on("hidden.bs.modal", function () {
    //子渠道模态框隐藏
    $("#modal-childChannel img").parent().removeClass("required-div");
    $("#modal-childChannel #channelName,#modal-childChannel .jumpUrl").val("");
    $("#modal-childChannel .saveBtn").removeAttr("data-parentid");
    $("#modal-childChannel .saveBtn").removeAttr("data-id");
    $("#modal-childChannel input[type=radio]:eq(0)").prop("checked", true);
  });
  $("#modal-skin").on("hidden.bs.modal", function () {
    //添加皮肤模态框隐藏

    $("#modal-skin")
      .find("img")
      .map(function () {
        $(this).attr("src", "../../pic/upload.png").removeClass("width100");
        $(this).removeAttr("data-url");
      });
    $(".preBtn").removeAttr("data-url");
    $("#modal-skin .closeBtn").trigger("click");
    $("#modal-skin input[type=file]").val("");
  });
};
Channel.getListData = function () {
  //获取渠道信息列表
  let name = $(".panel-body .name").val();
  let partnerName = $(".panel-body .partnerName").val();
  parent.modal.loaders("block");
  $.get(
    "/app/admin/v1/partner/query",
    {
      name: name,
      partnerName: partnerName,
    },
    function (data) {
      parent.modal.loaders();
      Channel.createTable(data);
    }
  );
};
Channel.editE = function (num) {
  if (!num) return num;
  num = num.toString();
  if (num.indexOf("e") === -1) {
    return num;
  }
  let reg = /(?:(\d)+(?:.(\d+))?)[e]{1}-(\d)/.exec(num);
  if (!reg) {
    return num;
  }
  let v = num;
  if (reg[3] === "7") {
    v = "0.000000" + (reg[2] ? reg[1] + reg[2] : reg[1]);
  } else {
    v = "0.0000000" + reg[1];
  }
  return v;
};
Channel.updateTest = function (params, status) {
  $.post("/app/admin/v1/partner/test/" + status, params, function (data) {
    if (data.code === 200) {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product",
      });
      $("#modal-skin").modal("hide");
      Channel.getListData();
      Channel.getSkinList();
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product",
      });
    }
  });
};
Channel.createTable = function (data) {
  let tbody = `<table style="margin-bottom: 0">
                            <thead>
                            <tr>
                                <th style="width: 30%">渠道名称</th>
                                <th style="width: 20%">子渠道</th>
                                <th style="width: 20%">子渠道ID</th>
                                <th style="width: 30%">操作</th>
                            </tr>
                            </thead>
                        </table>`;
  if (data.code === 200) {
    let d = data.data;
    if (d.length > 0) {
      d.map(function (item, index) {
        tbody += `<table><tbody>
          ${
            item.partnerList && item.partnerList.length > 0
              ? item.partnerList
                  .map(function (ite, ind) {
                    return `<tr>
                      <td rowspan=${
                        item.partnerList.length
                      } style="width: 30%;background: #fff;" class="${ind !== 0 ? `hide` : ""}">
                          <div style="font-size: 16px;padding-bottom: 25px">${
                            item.name
                          }</div>
                          <button class="btn editBtn" data-toggle="modal" data-target="#modal-channel" data-id=${
                            item.id
                          }>编辑
                          </button>
                          <button class="btn newChildBtn" data-toggle="modal" data-target="#modal-childChannel" data-id=${
                            item.id
                          }>新增子渠道
                          </button>
                      </td>
                      <td style="width: 20%">${ite.name || ""}</td>
                      <td style="width: 20%">${ite.id || ""}</td>
                      <td style="width: 30%">
                        <button class="btn editChildBtn" data-toggle="modal" data-target="#modal-childChannel" data-id=${
                          ite.id
                        } data-parentId="${item.id}">编辑</button>
                        <button class="btn btn-qrcode" data-id="${
                          ite.id
                        }" data-toggle="modal" data-target="#modal-qrcode" >查看链接</button>
                        <button class="btn statusBtn" data-id=${
                          ite.id
                        } data-status=${ite.status} data-toggle="modal" data-target="#updateStatus">
                            ${ite.status === 1 ? "禁用" : "启用"}</button>
                      </td>
                  </tr>`;
                  })
                  .join("")
              : ` <tr><td style = "width: 27.5%;background: #fff;" >
          <div> ${
            item.name || ""
          } </div> <button class = "btn editBtn" data-toggle = "modal" data-target = "#modal-channel" data-id = ${
                  item.id
                } > 编辑 </button> <button class = "btn newChildBtn" data-toggle = "modal" data-target = "#modal-childChannel" data-id = ${
                  item.id
                } > 新增子渠道 </button> </td> <td style="width:70%" colspan = "4"> 暂无数据 </td> </tr> `
          } </tbody></table> `;
      });
    } else {
      tbody +=
        '<table> <tbody> <tr colspan = "5"> <td> 暂无数据 </td></tr> </tbody></table>';
    }
  } else {
    tbody +=
      '<table> <tbody> <tr colspan = "5"> <td> 暂无数据 </td></tr> </tbody></table>';
  }
  $(".parentTable").html(tbody);
};
Channel.getSceneList = function () {
  //获取场景绑定
  $.get("/app/admin/v1/partner/getscenelist", function (data) {
    let option = "";
    if (data.code === 200) {
      data.data.map(function (item, index) {
        option +=
          '<option value = "' + item.id + '" >' + item.name + "</option>";
      });
    }
    $(".sceneWrap").html(option);
  });
};
Channel.getPatnerChannel = function (id) {
  //获取渠道编辑信息
  $.get(
    "/app/admin/v1/partner/getpartner",
    {
      id: id,
    },
    function (data) {
      if (data.code === 200) {
        $(
          "#modal-channel .modal-body input,#modal-childChannel #channelName"
        ).val(data.data.name);
        $("#modal-channel .modal-body .parentType").val(data.data.parentType);
        // $('#modal-channel .modal-body .sceneWrap ').val(data.data.parentSceneId);
        $("#modal-childChannel .jumpUrl").val(data.data.jumpUrl);
        $("#modal-childChannel")
          .find("input[type=radio]")
          .map(function () {
            if (parseInt($(this).val()) === data.data.jumpType) {
              $(this).trigger("click");
              $(this).attr("checked", "checked");
            }
          });
        let id = data.data.skinId;
        if (
          $("#modal-childChannel h4").html() === "编辑" ||
          $("#modalTestData h4").html() === "确认测试"
        ) {
          $("#modal-childChannel,#modalTestData")
            .find("img")
            .map(function () {
              if ($(this).parent().attr("data-id") == id)
                $(this).parent().addClass("required-div");
            });
        }
      }
    }
  );
};
Channel.getSkinList = function () {
  //获取皮肤列表
  $.get("/app/admin/v1/partner/getskinlist", function (data) {
    let div = "";
    if (data.code === 200) {
      data.data.map(function (item, index) {
        div += `<div class="img">
                  <div class="imgWrap" data-id="${item.id}">
                    <img src="${
                      JSON.parse(item.skin).backgroundImg
                    }" data-id="${item.id}">
                  </div>
                  <span class="index">${index + 1}</span>
                  <span class="deleteBtn" data-id="${
                    item.id
                  }" data-toggle="modal" data-target="#deleteModal" style="padding: 0 3px;font-size: 12px">删除</span>
              </div>`;
      });
    }
    $("#modal-childChannel .skin").html(div);
    $("#modalTestData .skin").html(div);
  });
};

Channel.getParams = function (page, rows, type) {
  let param = {};
  param.startTime = $("#testModal .startTime").val();
  param.endTime = $("#testModal .endTime").val();
  param.page = page || 1;
  param.rows = rows || 25;
  param.partnerId = $("#testModal").attr("data-id");
  if (type) {
    Channel.export(param);
  } else {
    Channel.getDataList(param);
  }
};
Channel.export = function (params) {
  delete params.page;
  delete params.rows;
  let arr = [];
  Object.keys(params).map(function (item, index) {
    arr.push(`${item}=${params[item]}`);
  });
  window.open("/app/admin/v1/partner/test/csv" + "?" + arr.join("&"));
};
Channel.getDataList = function (param) {
  parent.modal.loaders("block");
  $.get("/app/admin/v1/partner/test/list", param, function (data) {
    parent.modal.loaders();
    let html = "";
    if (data.code === 200) {
      if (data.data.data.length > 0) {
        data.data.data.map(function (item, index) {
          html += `
                  <tr>
                    <td>${item.version}</td>
                    <td><img src="${item.skinUrl}" width="100" /></td>
                    <td>${item.skinId}</td>
                    <td>${item.testTime}</td>
                    <td>${item.testLast}</td>
                    <td>${item.uv}</td>
                    <td>${item.registerNum}</td>
                    <td>${item.transRate}</td>
                </tr>`;
        });
      } else {
        html += `<tr><td colspan="10">暂无数据</td></tr>`;
      }
    }
    $("#testModal .panel-table tbody").html(html);
    initPage(data.data.total, param, Channel, "#testModal", "getDataList");
  });
};
