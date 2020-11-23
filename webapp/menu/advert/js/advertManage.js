var AdvertManage = new Object();
var isTab = 1;
$(function() {
  AdvertManage.regEvent();
  AdvertManage.createTable("1");
});
AdvertManage.regEvent = function() {
  $("#myModal").on("hidden.bs.modal", function() {
    $("#myModal input").map(function() {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    let textarea = $("#myModal").find("textarea");
    $("#myModal input[type=radio]:eq(0)").prop("checked", true);
    $("#myModal input[name=status]:eq(0)").prop("checked", true);
    $("#myModal select").map(function() {
      $(this).val(
        $(this)
          .find("option:eq(0)")
          .val()
      );
    });
    textarea.map(function() {
      $(this).val("");
    });
    $("#myModal .fileUpload2,#myModal .fileUpload3").removeAttr("url");
    $("#myModal .fileUpload2,#myModal .fileUpload3")
      .html("点击上传")
      .removeClass("required-input");
    $(".otherModal").removeAttr("data-id");
  });
  $("#fxAdvert").on("hidden.bs.modal", function() {
    $("#fxAdvert input[data-param]").map(function() {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    let textarea = $("#fxAdvert").find("textarea");
    $("#fxAdvert input[type=radio]:eq(0)").prop("checked", true);
    $("#fxAdvert select").map(function() {
      $(this).val(
        $(this)
          .find("option:eq(0)")
          .val()
      );
    });
    textarea.map(function() {
      $(this).val("");
    });
    $("#fxAdvert .fileUpload1").removeAttr("url");
    $("#fxAdvert .fileUpload1")
      .html("点击上传")
      .removeClass("required-input");
    $(".otherModal").removeAttr("data-id");
  });
  // 上传图片
  $("body").on("click", ".fileUpload1,.fileUpload2,.fileUpload3", function() {
    $(this)
      .parent()
      .find("input")
      .trigger("click");
  });
  $(".file1,.file2,.file3").change(function() {
    const target = $(this).attr("data-target");
    AdvertManage.uploadFile(this, target);
  });
  $("body").on("click", ".queryBtn", function() {
    if (isTab == 2) {
      AdvertManage.createTable("2");
    } else {
      AdvertManage.createTable("1");
    }
  });
  $("body").on("click", "#myTab .messageAdvert", function() {
    isTab = 2;
    $(".navs-item").removeClass("hide");
    AdvertManage.createTable("2");
  });
  $("body").on("click", "#myTab .fixedAdvert", function() {
    isTab = 1;
    $(".navs-item").addClass("hide");
    AdvertManage.createTable("1");
  });
  $("body").on("click", ".navs-item .user", function() {
    isTab = 2;
    $("#messageAdvert .user").removeClass("hide");
    $("#messageAdvert .dynamic").addClass("hide");
    AdvertManage.createTable("2");
  });
  $("body").on("click", ".navs-item .dynamic", function() {
    isTab = 3;
    $("#messageAdvert .user").addClass("hide");
    $("#messageAdvert .dynamic").removeClass("hide");
    AdvertManage.createTable("3");
  });
  $("body").on("click", ".addBtn", function() {
    $("#myModal h4, #fxAdvert h4").html("新增广告");
    if (isTab == 2) {
      $(".isShowbox").hide();
    } else {
      $(".isShowbox").show();
    }
  });
  $("body").on("click", ".editFixedBtn", function() {
    //编辑——固定广告
    $("#fxAdvert h4").html("编辑广告");
    let param = {};
    let id = $(this).attr("data-id");
    $(".otherModal").attr("data-id", id);
    $.get("/admin/ad_admin/ad/" + id, function(data) {
      if (data.code === 200) {
        let d = data.data;
        $("#fxAdvert input[name=status]").map(function() {
          if ($(this).val() == d.status) {
            $(this).prop("checked", true);
          }
        });
        $("#fxAdvert .position")
          .val(d.position.toString())
          .prop("selected", true);
        $("#fxAdvert .fileUpload1")
          .attr("url", d.picUrl)
          .html(`<img src='${d.picUrl}'>`);
        $("#fxAdvert .url").val(d.url);
        $("#fxAdvert").modal("show");
      }
    });
  });
  // 编辑信息流广告
  $("body").on("click", ".editMessBtn", function() {
    if (isTab == 2) {
      $(".isShowbox").hide();
    } else {
      $(".isShowbox").show();
    }
    //编辑——固定广告
    $("#myModal h4").html("编辑广告");
    let param = {};
    let id = $(this).attr("data-id");
    $("#myModal").attr("data-id", id);
    $.get("/admin/ad_admin/ad/" + id, function(data) {
      if (data.code === 200) {
        let d = data.data;
        $("#myModal input[name=status]").map(function() {
          if ($(this).val() == d.status) {
            $(this).prop("checked", true);
          }
        });
        $("#myModal .fileUpload2")
          .attr("url", d.picUrl)
          .html(`<img src='${d.picUrl}'>`);
        $("#myModal .fileUpload3")
          .attr("url", d.headPicUrl)
          .html(`<img src='${d.headPicUrl}'>`);
        $("#myModal .url").val(d.url);
        $("#myModal .title").val(d.title);
        $("#myModal .orderNum").val(d.orderNum);
        $("#myModal .nickname").val(d.nickname);
        $("#myModal .copywriting").val(d.copywriting);
        $("#myModal .position").val(d.position);
        $("#myModal").modal("show");
      }
    });
  });
  //固定广告提交
  $("body").on("click", ".affirmFixBtn", function() {
    //确认添加/修改
    if (AdvertManage.Verify() > 0) {
      return false;
    }
    let param = {};
    let select = $("#fxAdvert").find("select");
    param.picUrl = $("#fxAdvert .fileUpload1").attr("url");
    select.map(function() {
      param[$(this).attr("data-param")] = $(this).val();
    });
    param.type = isTab;
    param.url = $("#fxAdvert .url").val();
    param.id = $("#fxAdvert").attr("data-id");
    param.status = $("input[name='status']:checked").val();
    console.log(JSON.stringify(param));
    AdvertManage.editAdvert(param);
  });
  //信息流广告提交
  $("body").on("click", ".affirmMessBtn", function() {
    //确认添加/修改
    if (AdvertManage.Verify1() > 0) {
      return false;
    }
    let param = {};
    param.id = $("#myModal").attr("data-id");
    param.picUrl = $("#myModal .fileUpload2").attr("url");
    param.headPicUrl = $("#myModal .fileUpload3").attr("url");
    param.url = $("#myModal .url").val();
    param.nickname = $("#myModal .nickname").val();
    param.position = $("#myModal .position").val();
    param.title = $("#myModal .title").val();
    param.copywriting = $("#myModal .copywriting").val();
    param.status = $("#myModal input[name='status']:checked").val();
    param.type = isTab;
    param.orderNum = $("#myModal .orderNum").val();
    console.log(JSON.stringify(param));
    AdvertManage.editAdvert(param);
  });
};
AdvertManage.editAdvert = function(param) {
  let url = "/admin/ad_admin/ad";
  let type = "post";
  if (param.id) {
    type = "put";
  }
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
        $("#fxAdvert").modal("hide");
        if (isTab == 1) {
          AdvertManage.createTable("1");
        } else if (isTab == 2) {
          AdvertManage.createTable("2");
        } else if (isTab == 3) {
          AdvertManage.createTable("3");
        }
      } else {
        parent.modal.operModal({
          info: "失败",
          className: "GameManage"
        });
      }
    }
  });
};
AdvertManage.Verify = function() {
  let num = 0;
  $("#fxAdvert")
    .find(".verify:not(.hide) input")
    .map(function() {
      if ($(this).val() === "") {
        num++;
        $(this).addClass("required-input");
      }
    });
  if (!$(".fileUpload1").attr("url")) {
    num++;
    $(".fileUpload1").addClass("required-input");
  }
  return num;
};
AdvertManage.Verify1 = function() {
  let num = 0;
  $("#myModal")
    .find(".verify:not(.hide) input")
    .map(function() {
      if ($(this).val() === "") {
        num++;
        $(this).addClass("required-input");
      }
    });
  if (!$(".fileUpload2").attr("url")) {
    num++;
    $(".fileUpload2").addClass("required-input");
  }
  if (isTab == 3) {
    if (!$(".fileUpload3").attr("url")) {
      num++;
      $(".fileUpload3").addClass("required-input");
    }
  } else {
    num--;
  }

  return num;
};
//上传图片
AdvertManage.uploadFile = function(files, target) {
  //图片上传
  let $this = this;
  let type = files.type;
  var formData = new FormData();
  if (target == "file2") {
    formData.append("file", $("#fileload2")[0].files[0]);
  } else if (target == "file3") {
    formData.append("file", $("#fileload3")[0].files[0]);
  } else {
    formData.append("file", $("#fileload1")[0].files[0]);
  }
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
        if (target == "file2") {
          $("#myModal .fileUpload2").html(`<img src="${data.data}">`);
          $("#myModal .fileUpload2").attr("url", data.data);
        } else if (target == "file3") {
          $("#myModal .fileUpload3").html(`<img src="${data.data}">`);
          $("#myModal .fileUpload3").attr("url", data.data);
        } else {
          $("#fxAdvert .fileUpload1").html(`<img src="${data.data}">`);
          $("#fxAdvert .fileUpload1").attr("url", data.data);
        }
      }
    }
  });
};
AdvertManage.createTable = function(type) {
  // type://1_固定广告、2——用户广告、3——动态广告
  //基本信息
  $.get("/admin/ad_admin/ads", { type: type }, function(data) {
    let html = "";
    let html1 = "";
    let html2 = "";
    let d = data.data;
    if (data.code === 200) {
      if (d.length > 0) {
        d.map((item, index) => {
          if (type == 1) {
            html += `<tr data-id='${item.id}'>
                <td>${item.id}</td>
                <td>
                  <img src="${item.picUrl}" style="width: 200px;height: 100px;">
                </td>
                <td>${item.url}</td>
                <td>${
                  item.position == 1
                    ? "首页banner "
                    : item.position == 2
                    ? "我的页面"
                    : item.position == 3
                    ? "启动页"
                    : item.position == 4
                    ? "H5页面"
                    : item.position == 5
                    ? "瓷片1"
                    : "瓷片2"
                }</td>
                <td>${item.status === 1 ? "开启" : "关闭"}</td>
                <td> <button class="btn editFixedBtn" data-id="${
                  item.id
                }" data-toggle="modal" data-target="#fxAdvert">编辑</button></td>
              </tr>`;
          } else if (type == 2) {
            html1 += `<tr data-id='${item.id}'>
                <td>${item.id}</td>
                <td>
                  <img src="${item.picUrl}" style="width: 200px;height: 100px;">
                </td>
                <td>${item.nickname}</td>
                <td>${item.copywriting}</td>
                <td>${item.url}</td>
                <td>${item.status === 1 ? "开启" : "关闭"}</td>
                <td> <button class="btn editMessBtn" data-id="${
                  item.id
                }" data-toggle="modal" data-target="#myModal">编辑</button></td>
              </tr>`;
          } else if (type == 3) {
            html2 += `<tr data-id='${item.id}'>
                <td>${item.id}</td>
                <td>
                  <img src="${item.picUrl}" style="width: 200px;height: 100px;">
                </td>
                <td>
                  <img src="${
                    item.headPicUrl
                  }" style="width: 200px;height: 100px;">
                </td>
                <td>${item.nickname}</td>
                <td>${item.title}</td>
                <td>${item.copywriting}</td>
                <td>${item.url}</td>
                <td>${item.status === 1 ? "开启" : "关闭"}</td>
                <td> <button class="btn editMessBtn" data-id="${
                  item.id
                }" data-toggle="modal" data-target="#myModal">编辑</button></td>
              </tr>`;
          }
        });
      } else {
        html += `<tr><td colspan="6">暂无数据</td></tr>`;
        html1 += `<tr><td colspan="7">暂无数据</td></tr>`;
        html2 += `<tr><td colspan="9">暂无数据</td></tr>`;
      }
    }
    if (type == 1) {
      $(".messageTable tbody").html(html);
    } else if (type == 2) {
      $(".userTable tbody").html(html1);
    } else if (type == 3) {
      $(".dynamicTable tbody").html(html2);
    }
  });
};
