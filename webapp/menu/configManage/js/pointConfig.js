var pointConfig = new Object();
var type1 = "project";
$(function () {
  pointConfig.regEvent();
  pointConfig.queryProject();
  pointConfig.queryEvent();
  pointConfig.queryAttr();
  pointConfig.loadEventSelect();
  pointConfig.loadAttrSelect();
});
//默认获取关联事件下拉框
pointConfig.loadEventSelect = function () {
  parent.modal.loaders("block");
  let data = [];
  $.get("/app/admin/eventTrace/events/all", {}, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      data = data.data;
      let html = "";
      for (var i = 0; i < data.length; i++) {
        html +=
          "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
      }
      $("#event_select").html(html);
      $("#event_select").selectpicker("refresh");
    }
  });
};
//默认获取关联属性下拉框
pointConfig.loadAttrSelect = function () {
  parent.modal.loaders("block");
  let data = [];
  $.get("/app/admin/eventTrace/eventProps/all", {}, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      data = data.data;
      let html = "";
      for (var i = 0; i < data.length; i++) {
        html +=
          "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
      }
      $("#attr_select").html(html);
      $("#attr_select").selectpicker("refresh");
    }
  });
};
//获取属性弹窗详情
pointConfig.getAttrDetail = function (id) {
  parent.modal.loaders("block");
  $.get("/app/admin/eventTrace/eventProps/" + id, {}, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      $("#editAttr").attr("data-id", data.data.id);
      $("#editAttr .name").val(data.data.name);
      $("#editAttr .configKey").val(data.data.configKey);
      $("#editAttr .configLen").val(data.data.configLen);
      $("#editAttr .example").val(data.data.example);
    }
  });
};
//获取事件弹窗详情
pointConfig.getEventDetail = function (id) {
  parent.modal.loaders("block");
  $.get("/app/admin/eventTrace/events/" + id, {}, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      $("#editEvent").attr("data-id", data.data.id);
      $("#editEvent .name").val(data.data.name);
      $("#editEvent .eventKey").val(data.data.eventKey);
      $("#editEvent .description").val(data.data.description);
      //赋多个默认选中：
      let arr = data.data.propIds.split(",");
      // let arr = ['1', '2', '4']
      $("#attr_select").selectpicker("val", arr); //默认选中
      $("#attr_select").selectpicker("refresh");
    }
  });
};
//获取项目详情
pointConfig.getProjectDetail = function (id) {
  parent.modal.loaders("block");
  $.get("/app/admin/eventTrace/projects/" + id, {}, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      $("#editProduct").attr("data-id", data.data.id);
      $("#editProduct .name").val(data.data.name);
      //赋多个默认选中：
      let arr = data.data.eventIds.split(",");
      $("#event_select").selectpicker("val", arr); //默认选中
      $("#event_select").selectpicker("refresh");
    }
  });
};
pointConfig.deleteEvent = function (id, eventKey) {
  parent.modal.loaders("block");
  $.ajax({
    url: "/app/admin/eventTrace/events/" + id,
    type: "delete",
    dataType: "json",
    data: { eventKey: eventKey },
    success: function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: "删除成功",
          className: "H5Product",
        });
        pointConfig.queryEvent();
      } else {
        parent.modal.operModal({
          info: data.message,
          className: "H5Product",
        });
      }
      $("#deleteEventModal").modal("hide");
    },
  });
};
pointConfig.deleteProject = function (id) {
  parent.modal.loaders("block");
  $.ajax({
    url: "/app/admin/eventTrace/projects/" + id,
    type: "delete",
    dataType: "json",
    success: function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: "删除成功",
          className: "H5Product",
        });
        pointConfig.queryProject();
      } else {
        parent.modal.operModal({
          info: data.message,
          className: "H5Product",
        });
      }
      $("#deleteModal").modal("hide");
    },
  });
};
pointConfig.regEvent = function () {
  $("body").on("click", ".search", function () {
    pointConfig.queryEvent();
  });
  //删除事件
  $("body").on("click", ".deleteEvent", (event) => {
    let id = event.target.dataset.id;
    let eventKey = event.target.dataset.eventkey;
    $(".deleteEventConfirm").attr("data-id", id);
    $(".deleteEventConfirm").attr("data-eventKey", eventKey);
  });
  //确认删除事件
  $("body").on("click", ".deleteEventConfirm", function () {
    let id = $(this).attr("data-id");
    let eventKey = $(this).attr("data-eventKey");
    pointConfig.deleteEvent(id, eventKey);
  });
  //删除项目
  $("body").on("click", ".deleteProject", (event) => {
    let id = event.target.dataset.id;
    $(".deleteConfirm").attr("data-id", id);
  });
  //确认删除
  $("body").on("click", ".deleteConfirm", function () {
    let id = $(this).attr("data-id");
    pointConfig.deleteProject(id);
  });
  //属性编辑
  $("body").on("click", ".editAttr", (event) => {
    let id = event.target.dataset.id;
    pointConfig.getAttrDetail(id);
    $("#editAttr").attr("data-type", 1).modal("show");
  });
  //事件编辑
  $("body").on("click", ".editEvent", (event) => {
    let id = event.target.dataset.id;
    pointConfig.getEventDetail(id);
    $("#editEvent").attr("data-type", 1).modal("show");
  });
  //项目编辑
  $("body").on("click", ".editProduct", (event) => {
    let id = event.target.dataset.id;
    pointConfig.getProjectDetail(id);
    $("#editProduct").attr("data-type", 1).modal("show");
  });
  //添加项目配置
  $("body").on("click", ".addProductBtn", function () {
    $("#editProduct")
      .find("input")
      .map(function () {
        $(this).val("");
      });
    $("#editProduct").removeAttr("data-id");
    $("#editProduct").attr("data-type", 1).modal("show");
  });
  //添加事件配置
  $("body").on("click", ".addEventBtn", function () {
    $("#editEvent")
      .find("input")
      .map(function () {
        $(this).val("");
      });
    $("#editEvent").removeAttr("data-id");
    $("#editEvent").attr("data-type", 1).modal("show");
  });
  //添加属性配置
  $("body").on("click", ".addAttrBtn", function () {
    $("#editAttr")
      .find("input")
      .map(function () {
        $(this).val("");
      });
    $("#editAttr").removeAttr("data-id");
    $("#editAttr").attr("data-type", 1).modal("show");
  });
  //导航菜单切换
  $("body").on("click", "#myTab button", function (e) {
    const $type = $("#myTab").attr("data-type"),
      $tab = $(".tab-content"),
      type = $("#myTab").attr("data-type");
    if (!$type) pointConfig.prevOrNext($(this));
    type1 = $(this).attr("data-type");
  });
  $("#editProduct,#editEvent,#editAttr").on("hidden.bs.modal", function () {
    //主页模态框隐藏
    num = 0; //初始化
    let input = $("#editProduct .modal-body").find(".form-control");
    input.map(function () {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    $(".notEmpty").removeClass("required-input");
    $("#editProduct").removeAttr("data-id");
    $("#editProduct input").removeClass("required-input");
    $("#attr_select").selectpicker("deselectAll");
    $("#event_select").selectpicker("deselectAll");
  });

  $("body").on("click", ".editAuthModal", (event) => {
    let id = event.target.dataset.id;
    pointConfig.getAuthDetail(id);
    $("#editProduct").attr("data-type", 1).modal("show");
  });
  //保存项目弹窗
  $("body").on("click", "#editProduct .modal-footer .btn-default", function () {
    if (pointConfig.verifyPack() > 0) {
      return false;
    }
    pointConfig.upDateDetail();
  });
  //保存事件弹窗
  $("body").on("click", "#editEvent .modal-footer .btn-default", function () {
    if (pointConfig.verifyEventPack() > 0) {
      return false;
    }
    pointConfig.upDateEventDetail();
  });
  //保存属性弹窗
  $("body").on("click", "#editAttr .modal-footer .btn-default", function () {
    if (pointConfig.verifyAttrPack() > 0) {
      return false;
    }
    pointConfig.upDateAttrDetail();
  });
  $("body").on("input", ".panel-table input", function () {
    if ($(this).val() > 5) {
      $(this).val($(this).val().slice(0, 5));
    }
  });
};

pointConfig.prevOrNext = function ($this) {
  if ($this.length <= 0) return;
  const $tab = $(".tab-content"),
    type = $this.attr("data-type");
  $("#myTab button").removeClass("btn-info");
  $this.addClass("btn-info");
  $tab.find(".tab-pane").removeClass("active");
  $tab.find(`.tab-pane[id=${type}]`).addClass("active");
};
//修改属性弹窗
pointConfig.upDateAttrDetail = function () {
  let params = {};
  params.id = $("#editAttr").attr("data-id");
  $("#editAttr")
    .find("input")
    .map(function () {
      params[$(this).attr("data-param")] = $(this).val();
    });
  console.log("属性弹窗");
  $.post("/app/admin/eventTrace/eventProps", params, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      pointConfig.loadAttrSelect();
      parent.modal.operModal({
        info: "保存成功",
        className: "H5Product",
      });
      pointConfig.queryAttr();
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product",
      });
    }
  });
};
//修改事件弹窗
pointConfig.upDateEventDetail = function () {
  let params = {};
  params.id = $("#editEvent").attr("data-id");
  params.propIds = $("#attr_select").val().join(",");
  $("#editEvent")
    .find("input")
    .map(function () {
      params[$(this).attr("data-param")] = $(this).val();
    });
  delete params.undefined;
  $.post("/app/admin/eventTrace/events", params, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      pointConfig.loadEventSelect();
      parent.modal.operModal({
        info: "保存成功",
        className: "H5Product",
      });
      pointConfig.queryEvent();
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product",
      });
    }
  });
};
//修改项目弹窗
pointConfig.upDateDetail = function () {
  let params = {};
  params.id = $("#editProduct").attr("data-id");
  params.name = $("#editProduct .name").val();
  params.eventIds = $("#event_select").val().join(",");
  console.log("属性弹窗");
  $.post("/app/admin/eventTrace/projects", params, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      parent.modal.operModal({
        info: "保存成功",
        className: "H5Product",
      });
      pointConfig.queryProject();
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product",
      });
    }
  });
};
pointConfig.verifyPack = function () {
  let num = 0;
  $("#editProduct")
    .find(".verify")
    .map(function () {
      if ($(this).val() === "") {
        $(this).addClass("required-input");
        num++;
      } else {
        $(this).removeClass("required-input");
      }
    });
  return num;
};
pointConfig.verifyEventPack = function () {
  let num = 0;
  $("#editEvent")
    .find(".verify")
    .map(function () {
      if ($(this).val() === "") {
        $(this).addClass("required-input");
        num++;
      } else {
        $(this).removeClass("required-input");
      }
    });
  return num;
};
pointConfig.verifyAttrPack = function () {
  let num = 0;
  $("#editAttr")
    .find(".verify")
    .map(function () {
      if ($(this).val() === "") {
        $(this).addClass("required-input");
        num++;
      } else {
        $(this).removeClass("required-input");
      }
    });
  return num;
};
//获取弹窗详情
pointConfig.getAuthDetail = function (id) {
  parent.modal.loaders("block");
  $.get("/app/admin/api/v1/member/types/" + id, {}, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      $(".money").empty();
      $("#editProduct").attr("data-id", data.data.id);
      $(".form .name").val(data.data.name);
      $(".form .validityPeriod").val(data.data.validityPeriod);
      $(".form .price").val(data.data.price);
      $(".form .originalPrice").val(data.data.originalPrice);
    }
  });
};
pointConfig.queryProject = function (rows, page, type) {
  let params = {};
  $(".panel-select")
    .find("input")
    .map(function () {
      params[$(this).attr("data-param")] = $(this).val();
    });
  params.orderBy = $("select").val();
  params.page = page || 1;
  params.rows = rows || 25;
  pointConfig.getDataList(params);
};
pointConfig.getDataList = function (params) {
  parent.modal.loaders("block");
  $.get("/app/admin/eventTrace/projects", params, function (data) {
    if (data.code === 200) {
      parent.modal.loaders();
      var html = '<tr><td colspan="13">暂无数据</td></tr>';
      let d = data.data.data;
      if (d && d.length > 0) {
        html = "";
        d.map((item, index) => {
          html += `<tr data-id='${item.id}'>
              <td>${item.name}</td>
              <td>${item.eventIds.split(",").length}</td>
              <td>${item.gmtCreate}</td>
              <td>${item.originalPrice ? item.originalPrice : "--"}</td>
              <td><button class="btn editProduct" data-id="${
                item.id
              }">编辑</button>&nbsp;<button class="btn deleteProject" data-id="${
            item.id
          }" data-toggle="modal" data-target="#deleteModal">删除</button></td>
           </tr>`;
        });
      }
      $("#project table tbody").html(html);
      // pointConfig.createTable(data.data, params)
      initPage(data.data.total, params, pointConfig, "#project", "getDataList");
    }
  });
};
//获取搜索条件
pointConfig.getParams = function (page) {
  if (type1 == "event") {
    pointConfig.queryEvent(page);
  } else if (type1 == "project") {
    pointConfig.queryProject(page);
  } else if ((type1 = "attribute")) {
    pointConfig.queryAttr(page);
  }
};
pointConfig.queryEvent = function (rows, page, type) {
  let params = {};
  $("#event")
    .find("input")
    .map(function () {
      params[$(this).attr("data-param")] = $(this).val();
    });
  params.page = page || 1;
  params.rows = rows || 25;
  pointConfig.getEventDataList(params);
};
pointConfig.getEventDataList = function (params) {
  let html = "";
  parent.modal.loaders("block");
  $.get("/app/admin/eventTrace/events", params, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      let d = data.data.data;
      parent.modal.loaders();
      var html = '<tr><td colspan="13">暂无数据</td></tr>';
      if (d && d.length > 0) {
        html = "";
        d.map((item, index) => {
          html += `<tr data-id='${item.id}'>
              
              <td>${item.name}</td>
              <td>${item.eventKey}</td>
              <td>${item.propIds.split(",").length}</td>
              <td>${item.gmtCreate}</td>
              <td>${item.originalPrice ? item.originalPrice : "--"}</td>
              <td><button class="btn editEvent" data-id="${
                item.id
              }">编辑</button>&nbsp;<button class="btn deleteEvent" data-id="${
            item.id
          }" data-eventKey="${
            item.eventKey
          }" data-toggle="modal" data-target="#deleteEventModal">删除</button></td>
           </tr>`;
        });
      }
    }
    $("#event table tbody").html(html);
    initPage(
      data.data.total,
      params,
      pointConfig,
      "#event",
      "getEventDataList"
    );
  });
};

pointConfig.queryAttr = function (rows, page, type) {
  let params = {};
  $(".panel-select")
    .find("input")
    .map(function () {
      params[$(this).attr("data-param")] = $(this).val();
    });
  params.page = page || 1;
  params.rows = rows || 25;
  pointConfig.getAttrDataList(params);
};
pointConfig.getAttrDataList = function (params) {
  parent.modal.loaders("block");
  $.get("/app/admin/eventTrace/eventProps", params, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      parent.modal.loaders();
      var html = '<tr><td colspan="13">暂无数据</td></tr>';
      let d = data.data.data;
      if (d && d.length > 0) {
        html = "";
        d.map((item, index) => {
          html += `<tr data-id='${item.id}'>
              <td>${item.name}</td>
              <td>${item.configKey}</td>
              <td>${item.configLen}</td>
              <td>${item.example}</td>
              <td>${item.gmtCreate}</td>
              <td>${item.originalPrice ? item.originalPrice : "--"}</td>
              <td><button class="btn editAttr" data-id="${
                item.id
              }">编辑</button></td>
           </tr>`;
        });
      }
      $("#attribute table tbody").html(html);
      initPage(
        data.data.total,
        params,
        pointConfig,
        "#attribute",
        "getAttrDataList"
      );
    }
  });
};

pointConfig.addConfig = function () {
  let tr = $("#iframe-content tbody").find(".query-item.hide");
  $("tr:last").after(tr.clone().removeClass("hide"));
};
pointConfig.Count = function () {
  $("#iframe-content tbody")
    .find(".query-item:not(.hide)")
    .map(function (index) {
      $(this)
        .find(".orderIndex")
        .val(index + 1);
      $(this).attr("data-index", index + 1);
    });
};
