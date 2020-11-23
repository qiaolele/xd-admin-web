var GameManage = new Object();
var strengthCode = "";
var platformCode = "";
var locationCode = "";
var orderNum = "";
var gameId = "";
$(function() {
  // $('body').on('click', '.edit', function() {
  //   $('.editInput').attr('disabled', false)
  // })
  GameManage.regEvent();
  GameManage.getQueryParam();
  GameManage.getGameTypeList();
});
//获取平台大区、擅长位置、最高实力列表
GameManage.getArrayList = function(type, gameId) {
  let param = {
    type: type,
    gameId: gameId
  };
  $.get("/admin/game_admin/game/dict", param, function(data) {
    let d = data.data;
    if (data.code === 200) {
      if (data.data.length > 0) {
        if (type == "strength") {
          let html2 = "";
          d.map(function(item, index) {
            html2 +=
              '<div class="item_box"><input class="form-control notEmpty verify strengthVal" type="text" data-param="platform" value="' +
              item.name +
              '" data-id="' +
              item.id +
              '" placeholder="请输入"><button data-id="' +
              item.id +
              '" data-parentCode="' +
              item.parentCode +
              '" class="btn glyphicon glyphicon-remove btn-little reduceStregthBtn"></button><button data-id="' +
              item.id +
              '" data-parentCode="' +
              item.parentCode +
              '"  class="btn glyphicon glyphicon-ok btn-little editStregthBtn"></button></div>';
          });
          $(".strength").html(html2);
        } else if (type == "location") {
          let html3 = "";
          d.map(function(item, index) {
            html3 +=
              '<div class="item_box"><input class="form-control notEmpty verify locationVal" type="text" data-param="platform" value="' +
              item.name +
              '" data-id="' +
              item.id +
              '" placeholder="请输入"><button data-id="' +
              item.id +
              '" data-parentCode="' +
              item.parentCode +
              '" class="btn glyphicon glyphicon-remove btn-little reduceLocationBtn"></button><button data-id="' +
              item.id +
              '" data-parentCode="' +
              item.parentCode +
              '"  class="btn glyphicon glyphicon-ok btn-little editLocationBtn"></button></div>';
          });
          $(".location").html(html3);
        } else if (type == "platform") {
          let html1 = "";
          d.map(function(item, index) {
            html1 +=
              '<div class="item_box"><input class="form-control notEmpty verify platformVal" type="text" data-param="platform" value="' +
              item.name +
              '" data-id="' +
              item.id +
              '" placeholder="请输入"><button data-id="' +
              item.id +
              '" data-parentCode="' +
              item.parentCode +
              '" class="btn glyphicon glyphicon-remove btn-little reducePlatformBtn"></button><button data-id="' +
              item.id +
              '" data-parentCode="' +
              item.parentCode +
              '" class="btn glyphicon glyphicon-ok btn-little editPlatformBtn"></button></div>';
          });
          $(".platform").html(html1);
        }
      }
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product"
      });
    }
  });
};
//获取游戏分类列表
GameManage.getGameTypeList = function(val) {
  $.get("/admin/game_admin/category", function(data) {
    if (data.code === 200) {
      var html = "";
      for (var i = 0; i < data.data.length; i++) {
        html +=
          '<div class="item typeBox"><label><input type="radio" name="categoryCode" data-param="categoryCode" value="' +
          data.data[i].code +
          '" />' +
          '<input type="text" name="categoryName" data-param="categoryName" value="' +
          data.data[i].name +
          '" data-code="' +
          data.data[i].code +
          '" class="editInput hide form-control" style="float:none;" />' +
          '<span class="title">' +
          data.data[i].name +
          "</span></label>" +
          '<button class="btn glyphicon glyphicon-edit" data-id="' +
          data.data[i].id +
          '"></button>' +
          '<button class="btn glyphicon glyphicon-remove hide" data-id="' +
          data.data[i].id +
          '"></button></div>';
      }
      $(".box1").html(html);
      if (val) {
        $(`input[name=categoryCode][value=${val}]`)
          .prop("checked", true)
          .trigger("click");
      } else {
        $("#myModal input[name=categoryCode]:eq(0)")
          .prop("checked", true)
          .trigger("click");
      }
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product"
      });
    }
  });
};
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
  $.post("/admin/game_admin/sort", param, function(data) {
    if (data.code === 200) {
      GameManage.getQueryParam();
    }
  });
  //
};
GameManage.addGameTypeList = function(name, code) {
  let param = {
    name: name,
    code: code
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
    success: function(data) {
      if (data.code === 200) {
        if (code) {
          parent.modal.operModal({
            info: "修改分类成功",
            className: "GameManage"
          });
        } else {
          parent.modal.operModal({
            info: "添加分类成功",
            className: "GameManage"
          });
        }
        GameManage.getGameTypeList();
      } else {
        parent.modal.operModal({
          info: "失败",
          className: "GameManage"
        });
      }
    }
  });
};
GameManage.addUpdateInfo = function(param, obj) {
  $.ajax({
    url: "/admin/dict_admin/dict/game",
    type: "post",
    dataType: "JSON",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(param),
    success: function(data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: "成功",
          className: "GameManage"
        });
        if (obj == "platform") {
          $(".platform .item_box").empty();
          GameManage.getArrayList("platform", gameId);
        } else if (obj == "location") {
          $(".location .item_box").empty();
          GameManage.getArrayList("location", gameId);
        } else if (obj == "strength") {
          $(".strength .item_box").empty();
          GameManage.getArrayList("strength", gameId);
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
GameManage.deleteInfo = function(url, type, param, obj) {
  $.ajax({
    url: url + param.id,
    type: type,
    dataType: "JSON",
    contentType: "application/json;charset=UTF-8",
    success: function(data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: "成功",
          className: "GameManage"
        });
        if (obj == "platform") {
          GameManage.getArrayList("platform", gameId);
        } else if (obj == "location") {
          GameManage.getArrayList("location", gameId);
        } else if (obj == "strength") {
          GameManage.getArrayList("strength", gameId);
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
GameManage.regEvent = function() {
  //添加一个平台大区
  var index = 1;
  $("body").on("click", ".addPlatformBtn", function() {
    if ($("#myModal").attr("data-id")) {
      //修改
      var link = $(
        '<div class="item_box"><input class="form-control notEmpty verify platformVal" type="text" value="" data-code="" data-param="platform" placeholder="请输入"><button class="btn glyphicon glyphicon-remove btn-little reducePlatformBtn" data-id="" data-parentCode="' +
          platformCode +
          '"></button><button data-id="" data-parentCode="' +
          platformCode +
          '" class="btn glyphicon glyphicon-ok btn-little editPlatformBtn"></button></div>'
      );
    } else {
      //新增
      var link = $(
        '<div class="item_box"><input class="form-control notEmpty verify platformVal" type="text" value="" data-code="" data-param="platform" placeholder="请输入"><button class="btn glyphicon glyphicon-remove btn-little reducePlatformBtn" data-id="" data-parentCode="' +
          platformCode +
          '"></button></div>'
      );
    }
    $(".platform").append(link);
  });
  //删除一个平台大区
  $("#platform").on("click", ".reducePlatformBtn,.editPlatformBtn", function() {
    let id = $(this).attr("data-id");
    let parentCode = $(this).attr("data-parentCode");
    let val = $(this)
      .parent()
      .find("input")
      .val();
    console.log(id + "," + val);
    let json = {
      id: id,
      name: val,
      parentCode: parentCode
    };
    if ($(this).hasClass("reducePlatformBtn")) {
      if (id) {
        GameManage.deleteInfo(
          "/admin/dict_admin/dict/",
          "delete",
          json,
          "platform"
        );
      } else {
        //页面删除
        $(this)
          .parent()
          .remove();
      }
    } else {
      //添加、修改
      GameManage.addUpdateInfo(json, "platform");
    }
  });

  //添加一个最高实力
  $("body").on("click", ".addStregthBtn", function() {
    if ($("#myModal").attr("data-id")) {
      //修改
      var link = $(
        '<div class="item_box"><input class="form-control notEmpty verify strengthVal" type="text" data-param="platform" placeholder="请输入"><button class="btn glyphicon glyphicon-remove btn-little reduceStregthBtn" data-id="" data-parentCode="' +
          strengthCode +
          '"></button><button data-id="" data-parentCode="' +
          strengthCode +
          '" class="btn glyphicon glyphicon-ok btn-little editStregthBtn"></button></div>'
      );
    } else {
      //新增
      var link = $(
        '<div class="item_box"><input class="form-control notEmpty verify strengthVal" type="text" data-param="platform" placeholder="请输入"><button class="btn glyphicon glyphicon-remove btn-little reduceStregthBtn" data-id="" data-parentCode="' +
          strengthCode +
          '"></button></div>'
      );
    }
    $(".strength").append(link);
  });
  //删除一个最高实力
  $("#strength").on("click", ".reduceStregthBtn,.editStregthBtn", function() {
    let id = $(this).attr("data-id");
    let parentCode = $(this).attr("data-parentCode");
    let val = $(this)
      .parent()
      .find("input")
      .val();
    console.log(id + "," + val);
    let json = {
      id: id,
      name: val,
      parentCode: parentCode
    };
    if ($(this).hasClass("reduceStregthBtn")) {
      if (id) {
        GameManage.deleteInfo(
          "/admin/dict_admin/dict/",
          "delete",
          json,
          "strength"
        );
      } else {
        //页面删除
        $(this)
          .parent()
          .remove();
      }
    } else {
      //添加、修改
      GameManage.addUpdateInfo(json, "strength");
    }
  });
  // 添加一个擅长位置
  $("body").on("click", ".addLocationBtn", function() {
    if ($("#myModal").attr("data-id")) {
      //修改
      var link = $(
        '<div class="item_box"><input class="form-control notEmpty verify locationVal" type="text" data-param="platform" placeholder="请输入"><button class="btn glyphicon glyphicon-remove btn-little reduceLocationBtn" data-id="" data-parentCode="' +
          locationCode +
          '"></button><button data-id="" data-parentCode="' +
          locationCode +
          '" class="btn glyphicon glyphicon-ok btn-little editLocationBtn"></button></div>'
      );
    } else {
      //新增
      var link = $(
        '<div class="item_box"><input class="form-control notEmpty verify locationVal" type="text" data-param="platform" placeholder="请输入"><button class="btn glyphicon glyphicon-remove btn-little reduceLocationBtn" data-id="" data-parentCode="' +
          locationCode +
          '"></button></div>'
      );
    }
    $(".location").append(link);
  });
  //删除一个擅长位置
  $("#location").on("click", ".reduceLocationBtn,.editLocationBtn", function() {
    let id = $(this).attr("data-id");
    let parentCode = $(this).attr("data-parentCode");
    let val = $(this)
      .parent()
      .find("input")
      .val();
    console.log(id + "," + val);
    let json = {
      id: id,
      name: val,
      parentCode: parentCode
    };
    if ($(this).hasClass("reduceLocationBtn")) {
      if (id) {
        GameManage.deleteInfo(
          "/admin/dict_admin/dict/",
          "delete",
          json,
          "location"
        );
      } else {
        //页面删除
        $(this)
          .parent()
          .remove();
      }
    } else {
      //添加、修改
      GameManage.addUpdateInfo(json, "location");
    }
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
  $("body").on(
    "click",
    ".typeBox .glyphicon-edit,.typeBox .glyphicon-remove",
    event => {
      const $this = $(event.target),
        $parent = $this.parent(".typeBox");
      $parent.find(".title").toggleClass("hide");
      $parent
        .find(".editInput")
        .toggleClass("hide")
        .focus();
      $parent.find(".glyphicon-remove").toggleClass("hide");
      $parent.find(".glyphicon-edit").toggleClass("hide");
      if ($this.hasClass("glyphicon-remove")) {
        $parent.find(".title").html($parent.find(".editInput").val());
        // 调用新增分类接口
        let code = $parent.find(".editInput").attr("data-code");
        let value = $parent.find(".editInput").val();
        GameManage.addGameTypeList(value, code);
      }
    }
  );
  $("body").on("click", ".addType", function() {
    var link = $(
      '<div class="item typeBox" style="display:inline-block;"><label><input class="icheck" type="radio"  name="categoryCode" data-param="categoryCode"  value="" />  <input type="text" name="categoryName" data-param="categoryName" value="" class="editInput hide form-control" style="float:none;"><span class="title"></span></label><button class="btn glyphicon glyphicon-edit"  data-id=""></button><button data-id="" class="btn glyphicon glyphicon-remove hide"></button></div>'
    );
    $(".box1").append(link);
  });
  $("body").on("click", ".query", function() {
    GameManage.getQueryParam();
  });
  $("body").on("click", "#myModal .fileUpload1", function() {
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
    locationCode = $(this).attr("data-locationcode");
    orderNum = $(this).attr("data-orderNum");
    platformCode = $(this).attr("data-platformcode");
    strengthCode = $(this).attr("data-strengthcode");
    $(".otherModal").attr("data-id", id);
    $(".otherModal").attr("data-orderNum", orderNum);
    $(".otherModal").attr("data-platformCode", platformCode);
    $(".otherModal").attr("data-locationCode", locationCode);
    $(".otherModal").attr("data-strengthCode", strengthCode);
    $.get("/admin/game_admin/games/" + id, function(data) {
      if (data.code === 200) {
        let d = data.data;
        GameManage.getGameTypeList(d.categoryCode);
        gameId = d.id;
        platformCode = d.platformCode;
        strengthCode = d.strengthCode;
        locationCode = d.locationCode;
        GameManage.getArrayList("location", d.id);
        GameManage.getArrayList("strength", d.id);
        GameManage.getArrayList("platform", d.id);
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
            if ($(this).val() == d[$(this).attr("name")]) {
              $(this).prop("checked", true);
              $(this).trigger("click");
            }
          });
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
    param.orderNum = $("#myModal").attr("data-orderNum");
    param.platformCode = $("#myModal").attr("data-platformCode");
    param.strengthCode = $("#myModal").attr("data-strengthCode");
    param.locationCode = $("#myModal").attr("data-locationCode");
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
    $("#myModal")
      .find("input[type=radio]:checked")
      .map(function() {
        param[$(this).attr("name")] = $(this).val();
      });
    param.id = $(".otherModal").attr("data-id");
    param.categoryCode = $("input[name='categoryCode']:checked").val();
    param.categoryName = $("input[name='categoryCode']:checked")
      .next()
      .val();
    //新增的时候
    let platformArr = [];
    let strengthArr = [];
    $(".platform")
      .find(".platformVal")
      .map(function(index, item) {
        let platformJson = {};
        platformJson.name = $(this).val();
        platformArr[index] = Object.assign(platformJson);
      });
    param.platform = platformArr;
    $(".strength")
      .find(".strengthVal")
      .map(function(index, item) {
        let strengthJson = {};
        strengthJson.name = $(this).val();
        strengthArr[index] = Object.assign(strengthJson);
      });
    param.strength = strengthArr;
    let locationArr = [];
    let arr = $(".location").find(".locationVal");
    arr.map(function(index, item) {
      let locationJson = {};
      locationJson.name = $(this).val();
      locationArr[index] = Object.assign(locationJson);
    });
    param.location = locationArr;
    delete param.undefined;
    console.log(JSON.stringify(param));
    let url = "/admin/game_admin/games";
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
    $(".location").empty();
    $(".strength").empty();
    $(".platform").empty();
    input.map(function() {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    select.map(function() {
      $(this).val("");
    });
    textarea.map(function() {
      $(this).val("");
    });
    $("input[name=hot]")
      .eq(0)
      .attr("checked", true);
    $("#myModal")
      .find(".box,.box1")
      .find("input:eq(0)")
      .trigger("click");
    $("#myModal .fileUpload").removeAttr("url");
    $("#myModal .fileUpload")
      .html("点击上传")
      .removeClass("required-input");
    $(".otherModal").removeAttr("data-id");
    $(".otherModal").removeAttr("data-orderNum");
    $(".otherModal").removeAttr("data-platformCode");
    $(".otherModal").removeAttr("data-locationCode");
    $(".otherModal").removeAttr("data-strengthCode");
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
  $.get("/admin/game_admin/games", params, function(data) {
    parent.modal.loaders();
    let html = "";
    if (data.code === 200) {
      if (data.data.data.length > 0) {
        data.data.data.map(function(item, index) {
          html += ` <tr data_id="${item.id}" data-json="${item}">
                <td>${item.name}</td>
                <td>
                    <img src="${item.icon}" style="width: 200px;height: 100px;">
                </td>
                <td>${item.categoryName}</td>
                <td>${item.hot === 1 ? "是" : "否"}</td>
                <td>${item.userNum}</td>
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
