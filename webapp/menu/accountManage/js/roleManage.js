var RoleManage = new Object();

$(function () {
  RoleManage.regEvent();
  RoleManage.getParams();
  RoleManage.getMenuList();
});

RoleManage.regEvent = function () {
  //条件查询
  $("#btn-search").on("click", function () {
    RoleManage.getParams();
  });
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
  // menu 一级列表
  $("#menuAdd").on("click", ".form-group-dt", function () {
    var has = $(this).hasClass("active");
    if (has) {
      $(this)
        .removeClass("active")
        .nextUntil(".form-group-dt")
        .removeClass("show");
    } else {
      $(this).addClass("active").nextUntil(".form-group-dt").addClass("show");
    }
  });
  // menu 二级列表
  $("#menuAdd").on("click", ".form-group-dd", function () {
    var has = $(this).hasClass("active");
    if (has) {
      $(this).removeClass("active");
    } else {
      $(this).addClass("active");
      $("#menuAdd").removeClass("active");
      $("#menu-tips").removeClass("visible");
    }
  });
  //重置
  $(".btn-rest").on("click", function () {
    $("#roleName-input").val("");
    $(".form-group-dd").removeClass("active").removeClass("show");
    $(".form-group-dt").removeClass("active");
    $("#menuList .form-control").removeClass("error");
    $(".error-tips").removeClass("visible");
    $("#remark").val("");
    if ($(".form-group-submit").attr("data-id")) return;
    $(".btn-enter").html("确认");
  });
  //确认添加
  $(".btn-enter").on("click", function () {
    var isSubmit = RoleManage.validate($("#roleName-input"));
    if (!isSubmit) {
      return;
    }
    var roleType = $("#roletype-left option:selected").val();
    if (roleType == 2) {
      //验证催收员
      var priority = $("#form-group-csvp .form-control").val();
    } else if (roleType == 4) {
      //代理商
      var priority = $("#form-group-dlvp input:checked").val();
    } else {
      var priority = -1;
    }
    var menuids = [];
    $("#menuAdd .form-group-dd").each(function () {
      if ($(this).hasClass("active")) {
        menuids.push($(this).attr("data-id"));
      }
    });
    if (!menuids.length) {
      $("#menuAdd").addClass("active");
      $("#menu-tips").addClass("visible");
      return;
    }

    var roleName = $("#roleName-input").val();
    var remark = $("#remark").val();
    let changeTrId = $(".form-group-submit").attr("data-id");
    if ($(".btn-enter").html() == "确认") {
      RoleManage.sendMenu("/app/admin/v1/rolemanage/addrole", {
        name: roleName,
        remark: remark,
        priority: priority,
        menuids: menuids,
      });
    } else {
      RoleManage.sendMenu("/app/admin/v1/rolemanage/updaterole", {
        id: changeTrId,
        name: roleName,
        remark: remark,
        priority: priority,
        menuids: menuids,
      });
    }
  });
  //修改
  $(document).on("click", "table tr", function () {
    var has = $(this).hasClass("active");
    var changeTrId = $(this).find("td:eq(0)").attr("data-id");
    if (!changeTrId) return;
    $("table tr").removeClass("active");
    $(".btn-rest").trigger("click");
    $(".form-group-submit").attr("data-id", changeTrId);
    if (has) {
      $(".form-group-submit").removeAttr("data-id");
      $(this).removeClass("active");
      $(".btn-enter").html("确认");
    } else {
      $(this).addClass("active");
      parent.modal.loaders("block");
      $.get("/app/admin/v1/rolemanage/showrole", { id: changeTrId }, function (
        data
      ) {
        parent.modal.loaders();
        var d = data.data;
        $("#roleName-input").val(d.name);
        $("#remark").val(d.remark);
        RoleManage.getMenuList($("#roletype-left").val(), d.menuRespList);
        $(".btn-enter").html("修改");
      });
    }
  });
  // $(document).on("blur keyup", "#roleName-input, #csvp-input", function () {
  //   var isNum = 0;
  //   if ($(this).attr("id") == "csvp-input") {
  //     isNum = 1;
  //   }
  //   RoleManage.validate($(this), isNum);
  // });
};

RoleManage.getAgentList = function (param) {
  let url = "/app/admin/v1/rolemanage/getrolebyname";
  $.get(url, param, function (data) {
    initPage(data.data.total, param, RoleManage);
    RoleManage.createTable(data.data.data);
  });
};

RoleManage.createTable = function (d) {
  parent.modal.loaders();
  var tbody = "";
  for (var i = 0; i < d.length; i++) {
    var tr = `<tr><td data-id="${d[i].id}">${i + 1}</td> 
            <td> ${d[i].name} </td> 
            <td> ${d[i].userNum}</td>
            <td> ${d[i].remark} </td> 
            <td>${d[i].gmtCreated}</td></tr>`;
    tbody += tr;
  }
  $(".panel-table table tbody").html(tbody);
};

RoleManage.sendMenu = function (url, data) {
  //验证成功，发送请求
  $.ajax({
    url: url,
    traditional: true,
    type: "get",
    dataType: "json",
    data: data,
    success: function (data) {
      RoleManage.getParams();
      parent.modal.operModal({
        info: data.message,
        className: "custom",
      });
      $(".btn-rest").trigger("click");
      $(".form-group-submit").removeAttr("data-id");
      $(".btn-enter").html("确认");
    },
  });
};

RoleManage.validate = function (obj, isNum) {
  // 1：对象；2：是否校验数字
  var val = obj.val();
  var reg = /^[0-9]*$/;
  if (!val) {
    obj.addClass("error");
    var str = obj.prev().find(".label-title").html() + "不能为空";
    obj.prev().find(".error-tips").html(str);
    obj.prev().find(".error-tips").addClass("visible");
    return false;
  } else if (isNum && !reg.test(val)) {
    obj.addClass("error");
    var str = "格式不正确";
    obj.prev().find(".error-tips").html(str);
    obj.prev().find(".error-tips").addClass("visible");
  } else {
    obj.removeClass("error");
    obj.prev().find(".error-tips").removeClass("visible");
    return true;
  }
};

RoleManage.getMenuList = function (val, list) {
  //menu load
  $.get("/app/admin/v1/rolemanage/getmenupriority", { type: val }, function (
    data
  ) {
    var html = "";
    data.data["-1"].map(function (info) {
      let list = data.data[info.id];
      if (info.id !== 1) {
        html += `<div class="form-group-dt form-control" data-id=${info.id}>${info.name} <span class="glyphicon glyphicon-triangle-bottom"></span></div>`;
        list.map(function (li) {
          html += `<div class="form-group-dd form-control" data-id=${li.id}>${li.name}<span class="glyphicon glyphicon-ok"></span></div>`;
        });
      }
    });
    $("#menuAdd").html(html);
    if (list) {
      for (var i = 0; i < list.length; i++) {
        $("#menuAdd .form-group-dt[data-id=" + list[i].parentId + "]")
          .addClass("active")
          .nextUntil(".form-group-dt")
          .addClass("show");
        $("#menuAdd .form-group-dd[data-id=" + list[i].id + "]").addClass(
          "active"
        );
      }
    }
  });
};

RoleManage.getParams = function (page) {
  let type = $("#roleType-right").val();
  let name = $("#roleName-search").val();
  let param = {
    type: type,
    name: name,
    page: page || 1,
    rows: 25,
  };
  parent.modal.loaders("block");
  RoleManage.getAgentList(param);
};
