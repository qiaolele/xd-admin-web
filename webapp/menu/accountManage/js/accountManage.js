var AccountManage = new Object();

$(function () {
  AccountManage.regEvent();
  AccountManage.getParams();
  AccountManage.getRole();
});

AccountManage.regEvent = function () {
  //icheck控件
  $("input.icheck").iCheck({
    checkboxClass: "icheckbox_minimal-blue",
    radioClass: "iradio_minimal-blue",
  });
  //iframe menu 收缩
  $("#menuList .glyphicon-menu-hamburger").on("click", function () {
    if ($("#menuList").hasClass("col-md-3on")) {
      $("#menuList .col-pane-body").show();
      $(".col-md-3on").attr("class", "col-md-3");
      $(".col-md-9on").attr("class", "col-md-9");
    } else {
      $("#menuList .col-pane-body").hide();
      $(".col-md-3").attr("class", "col-md-3on");
      $(".col-md-9").attr("class", "col-md-9on");
    }
  });
  //条件查询
  $("#btn-search").on("click", function () {
    AccountManage.getParams();
  });
  //停用
  var changeStatus = {};
  $(document).on("click", ".stopStatus", function (e) {
    changeStatus.id = $(this).attr("data-stopId");
    changeStatus.status = $(this).attr("data-stopStatus") == "1" ? "0" : "1";
    if (changeStatus.status == "0") {
      parent.modal.alertModal({
        title: "停用",
        info: "确认停用此用户",
        className: "custom",
      });
    } else {
      parent.modal.alertModal({
        title: "启用",
        info: "确认启用此用户",
        className: "custom",
      });
    }
    e.stopPropagation();
  });

  $(parent.window.document).on(
    "click",
    "#operModal.custom .modal-footer .btn:eq(1)",
    function () {
      var that = $("table .btn[data-stopId=" + changeStatus.id + "]");
      $.ajax({
        url: "/app/admin/v1/usermanage/updatestatus",
        type: "post",
        traditional: true,
        dataType: "json",
        data: { userId: changeStatus.id, status: changeStatus.status },
        success: function (data) {
          if (data.code === 200) {
            parent.modal.operModal({
              info: "操作成功",
              className: "updateStatus",
            });
            AccountManage.getParams();
          } else {
            parent.modal.operModal({
              info: "操作失败",
              className: "updateStatus",
            });
          }
          if (changeStatus.status == "1") {
            that
              .attr({ class: "btn stopStatus", "data-stopStatus": 0 })
              .html("停用");
            that
              .parents("tr")
              .find(".status-td")
              .attr("class", "status-td green")
              .html("<i>●</i>有效");
          } else {
            that
              .attr({ class: "btn stopStatus", "data-stopStatus": 1 })
              .html("启用");
            that
              .parents("tr")
              .find(".status-td")
              .attr("class", "status-td red")
              .html("<i>●</i>停用");
          }
        },
      });
    }
  );

  //重置密码
  $(document).on("click", ".resetPwd", function (e) {
    $("#modal-resetPwd").modal("show");
    changeStatus.id = $(this).attr("data-resetId");
    e.stopPropagation();
  });
  $(document).on(
    "click",
    "#modal-resetPwd .modal-footer .btn:eq(1)",
    function () {
      var val1 = $("#resetPwd-input1").val();
      var val2 = $("#resetPwd-input2").val();

      if (val1 == "" || val2 == "") {
        $("#resetPwd-tips").html("输入不能为空");
        return;
      } else if (val1 != val2) {
        $("#resetPwd-tips").html("两次输入不一致");
        return;
      }

      $.ajax({
        url: "/app/admin/v1/usermanage/updatePassword",
        type: "get",
        traditional: true,
        dataType: "json",
        data: { id: changeStatus.id, password: val1 },
        success: function (data) {
          parent.modal.operModal({
            info: data.data,
            className: "password",
          });
          $("#btn-search").click();
          $("#modal-resetPwd").modal("hide");
          $("#resetPwd-input1").val("");
          $("#resetPwd-input2").val("");
          $("#resetPwd-tips").html("");
        },
      });
    }
  );

  // $(document).on("blur", "#userName-input, #loginName-input, #inital-input, #phone-input", function () {
  //   var type = {};
  //   if ($(this).attr("id") == "phone-input") {
  //     type.isPhone = 1;
  //   } else if ($(this).attr("id") == "inital-input") {
  //     type.isLen6 = 1;
  //   }
  //   AccountManage.validate($(this), type);
  // });
  //重置
  $(".btn-rest").on("click", function () {
    $(
      "#userName-input, #loginName-input, #inital-input, #phone-input, #remark"
    ).val("");
    $(".icheck").iCheck("uncheck");
    // $(".btn-enter").html('确认');
    $("#menuList .form-control").removeClass("error");
    $(".error-tips").removeClass("visible");
    // $(".form-group-submit").removeAttr('data-id');
  });
  //确认添加
  $(".btn-enter").on("click", function () {
    var isSubmit =
      AccountManage.validate($("#userName-input"), {}) &&
      AccountManage.validate($("#loginName-input"), {}) &&
      AccountManage.validate($("#inital-input"), { isLen6: 1 }) &&
      AccountManage.validate($("#phone-input"), { isPhone: 1 });
    if (!isSubmit) {
      return;
    }
    var userName = $("#userName-input").val();
    var loginName = $("#loginName-input").val();
    var password = $("#inital-input").val();
    var phone = $("#phone-input").val();
    var roleId = $("#roleType-left option:selected").val();
    var remark = $("#remark").val();
    //验证成功，发送请求
    if ($(".btn-enter").html() == "确认") {
      AccountManage.sendMenu("/app/admin/v1/usermanage/addUser", {
        name: userName,
        loginName: loginName,
        password: password,
        phone: phone,
        roleId: roleId,
        remark: remark,
      });
    } else {
      let changeTrId = $(".form-group-submit").attr("data-id");
      AccountManage.sendMenu("/app/admin/v1/usermanage/updateUser", {
        id: changeTrId,
        name: userName,
        loginName: loginName,
        password: password,
        phone: phone,
        roleId: roleId,
        remark: remark,
      });
    }
  });

  $(document).on("click", "table tr", function () {
    var has = $(this).hasClass("active");
    let changeTrId = $(this).find("td:eq(0)").attr("data-id");
    if (!changeTrId) return;
    $("table tr").removeClass("active");
    $(".btn-rest").trigger("click");
    if (has) {
      $(this).removeClass("active");
      $(".btn-enter").html("确认");
    } else {
      $(".form-group-submit").attr("data-id", changeTrId);
      $(this).addClass("active");
      parent.modal.loaders("block");
      $.get("/app/admin/v1/usermanage/showUser", { id: changeTrId }, function (
        data
      ) {
        parent.modal.loaders();
        var d = data.data;
        console.log(d);
        $("#userName-input").val(d.name);
        $("#loginName-input").val(d.loginName);
        $("#inital-input").val(d.password);
        $("#phone-input").val(d.phone);
        $("#remark").val(d.remark);
        $("#roleType-left option[value=" + d.roleId + "]").prop(
          "selected",
          "selected"
        );
        $(".btn-enter").html("修改");
      });
    }
  });
};

AccountManage.getAgentList = function (param) {
  parent.modal.loaders("block");
  $.get("/app/admin/v1/usermanage/getuserlist", param, function (data) {
    initPage(data.data.total, param, AccountManage);
    AccountManage.createTable(data.data.data);
  });
};

AccountManage.createTable = function (d) {
  parent.modal.loaders();
  var tbody = "";
  for (var i = 0; i < d.length; i++) {
    var statusBtn =
      d[i].status === 1
        ? '<button class="btn stopStatus"  data-stopId="' +
          d[i].id +
          '" data-stopStatus="' +
          d[i].status +
          '"> 停用</button>'
        : '<button class="btn stopStatus"  data-stopId="' +
          d[i].id +
          '" data-stopStatus="' +
          d[i].status +
          '"> 启用</button>';
    var status =
      d[i].status === 1
        ? '<td class="status-td green"><i>●</i>有效</td>'
        : '<td class="status-td red"><i>●</i>停用</td>';
    var tr =
      '<tr><td data-id="' +
      d[i].id +
      '">' +
      statusBtn +
      '<button class="btn resetPwd" data-resetId="' +
      d[i].id +
      '">重置密码</button> </td>' +
      "<td>" +
      (i + 1) +
      "</td>" +
      "<td>" +
      d[i].name +
      "</td>" +
      "<td>" +
      d[i].loginName +
      "</td>" +
      "<td>" +
      d[i].phone +
      "</td>" +
      "<td>" +
      d[i].roleName +
      "</td>" +
      status +
      "<td>" +
      d[i].loginTime +
      "</td>" +
      "<td>" +
      d[i].loginIp +
      "</td></tr>";
    tbody += tr;
  }
  $(".panel-table table tbody").html(tbody);
};

AccountManage.getParams = function (page) {
  let name = $("#userName-search").val();
  let loginName = $("#loginName").val();
  let roleId = $("#roleType-right").val() || "-1";
  let status = $("#userStatus").val();
  let param = {
    name: name,
    loginName: loginName,
    roleId: roleId,
    status: status,
    page: page || 1,
    rows: 25,
  };
  parent.modal.loaders("block");
  AccountManage.getAgentList(param);
};

AccountManage.getRole = function () {
  //select 角色名称列表
  $.get("/app/admin/v1/usermanage/getrole", { tag: 1 }, function (data) {
    var select = "";
    var select1 = '<option value="-1">全部</option>'; //右侧全部
    for (var i = 0; i < data.data.length; i++) {
      var option =
        '<option value="' +
        data.data[i].id +
        '">' +
        data.data[i].name +
        "</option>";
      select += option;
      select1 += option;
    }
    $("#roleType-left").html(select);
    $("#roleType-right").html(select1);
  });
};

AccountManage.validate = function (obj, type) {
  // 1：对象；2：是否校验数字
  var val = obj.val();
  var reg = /^1\d{10}$/;
  if (!val) {
    obj.addClass("error");
    var str = obj.prev().find(".label-title").html() + "不能为空";
    obj.prev().find(".error-tips").html(str);
    obj.prev().find(".error-tips").addClass("visible");
    return false;
  } else if (type.isPhone && !reg.test(val)) {
    obj.addClass("error");
    var str = "格式不正确";
    obj.prev().find(".error-tips").html(str);
    obj.prev().find(".error-tips").addClass("visible");
  } else if (type.isLen6 && val.length < 6) {
    obj.addClass("error");
    var str = "密码至少6位";
    obj.prev().find(".error-tips").html(str);
    obj.prev().find(".error-tips").addClass("visible");
  } else {
    obj.removeClass("error");
    obj.prev().find(".error-tips").removeClass("visible");
    return true;
  }
};

AccountManage.sendMenu = function (url, data) {
  //验证成功，发送请求
  $.ajax({
    url: url,
    traditional: true,
    type: "post",
    dataType: "json",
    data: data,
    success: function (data) {
      parent.modal.operModal({
        info: data.data,
        className: "sendMenu",
      });
      $("#btn-search").click();
      $(".btn-rest").trigger("click");
      $(".btn-enter").html("确认");
    },
  });
};
