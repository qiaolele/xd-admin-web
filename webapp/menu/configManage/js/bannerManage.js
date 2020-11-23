var BannerManage = new Object();
$(function () {
  BannerManage.regEvent();
  BannerManage.getQueryParam();
});
BannerManage.regEvent = function () {
  $("body").on("click", ".query", function () {
    BannerManage.getQueryParam();
  });
  $("body").on("click", "#myModal .fileUpload0", function () {
    $("#fileload0").click();
  });
  $("body").on("click", "#myModal .fileUpload1", function () {
    $("#fileload1").click();
  });
  $("body").on("click", "#myModal .fileUpload2", function () {
    $("#fileload2").click();
  });
  $("body").on("change", "#fileload0,#fileload1,#fileload2", function () {
    //图片上传
    let $this = this;
    let type = $this.files[0].type;
    var formData = new FormData();
    if ($this.getAttribute("id") == "fileload0") {
      formData.append("file", $("#fileload0")[0].files[0]);
    } else if ($this.getAttribute("id") == "fileload1") {
      formData.append("file", $("#fileload1")[0].files[0]);
    } else if ($this.getAttribute("id") == "fileload2") {
      formData.append("file", $("#fileload2")[0].files[0]);
    }
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
          if ($this.getAttribute("id") == "fileload0") {
            $("#myModal .fileUpload0").html(`<img src="${data.data}">`);
            $("#myModal .fileUpload0").attr("url", data.data);
          } else if ($this.getAttribute("id") == "fileload1") {
            $("#myModal .fileUpload1").html(`<img src="${data.data}">`);
            $("#myModal .fileUpload1").attr("url", data.data);
          } else if ($this.getAttribute("id") == "fileload2") {
            $("#myModal .fileUpload2").html(`<img src="${data.data}">`);
            $("#myModal .fileUpload2").attr("url", data.data);
          }
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
    let type = $(this).parent().parent().attr("data_type");
    let id = $(this).parent().parent().attr("data_id");
    $(".otherModal").attr("data-id", id);
    let param = {
      type: type,
    };
    $.get("/admin/v1/banner/getByType", param, function (data) {
      if (data.code === 200) {
        let d = data.data;
        let html = "";
        d.map(function (item, index) {
          html += `<div class="img_box" data_type="${item.type}"><div class="input-group fl">
          <span class="input-group-addon">图标</span>
          <div class="form-control fileUpload fileUpload${index}" data-param="icon" url="${item.icon}">
            <img style="height:40px;" src='${item.icon}'>
          </div>
        <input type="file" data-param="icon" class="hidden file notEmpty" accept="image/png,image/jpeg"
        data-target="file${index}" />
        <input type="file" class="hidden file" id="fileload${index}" accept="image/png,image/jpeg" />
        </div>
        <div class="input-group fl">
        <span class="input-group-addon">跳转地址</span>
        <input type="text" class="form-control addAddress" data-param="addAddress" data-id="${item.id}" placeholder="请填写地址" value="${item.addAddress}" />
        </div></div>`;
        });
        $("#myModal .arr_box").html(html);

        $("#myModal")
          .find("input[type=radio]")
          .map(function () {
            if ($(this).val() == d[$(this).attr("name")]) {
              $(this).prop("checked", true);
              $(this).trigger("click");
            }
          });
        // $("#myModal .fileUpload")
        //   .attr("url", d.image)
        //   .html(`<img src='${d.image}'>`);

        $("#myModal").modal("show");
      }
    });
  });
  $("body").on("click", "#myModal .affirmBtn", function () {
    //确认添加/修改
    if (BannerManage.Verify() > 0) {
      return false;
    }
    let param = {};
    param.type = $("#myModal .img_box").attr("data_type");
    let input = $("#myModal").find("input:not(.hidden)");
    input.map(function () {
      param[$(this).attr("data-param")] = $(this).val();
    });
    $("#myModal")
      .find("input[type=radio]:checked")
      .map(function () {
        param[$(this).attr("name")] = $(this).val();
      });
    let arr = [];
    let arr2 = [];
    let urlHmtl = $("#myModal .img_box .addAddress");
    let iconHtml = $("#myModal .img_box .fileUpload");
    urlHmtl.map(function (item, index) {
      let json1 = {};
      // json1.addAddress = $(this).val();
      json1[$(this).attr("data-param")] = $(this).val();
      json1.id = $(this).attr("data-id");
      arr.push(json1);
    });
    iconHtml.map(function (item, index) {
      let json2 = {};
      json2[$(this).attr("data-param")] = $(this).attr("url");
      arr2.push(json2);
    });
    arr.map(function (item, index) {
      arr2[index].addAddress = item.addAddress;
      arr2[index].id = item.id;
      arr2[index].type = 2;
    });
    console.log(arr2);
    param.id = $(".otherModal").attr("data-id");
    param.icon = $(".fileUpload0").attr("url");
    console.log(JSON.stringify(param));
    let url = "/admin/v1/banner/updateBanners";
    delete param.undefined;
    let type = "post";
    let lists = [];
    lists.push(param);
    let json = {};
    if (param.type == 1) {
      json = {
        status: param.status,
        lists: lists,
      };
    } else {
      json = {
        status: param.status,
        lists: arr2,
      };
    }
    //编辑
    $.ajax({
      url: url,
      type: type,
      dataType: "JSON",
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify(json),
      success: function (data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: "成功",
            className: "BannerManage",
          });
          $("#myModal").modal("hide");
          BannerManage.getQueryParam();
        } else {
          parent.modal.operModal({
            info: "失败",
            className: "BannerManage",
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
BannerManage.getQueryParam = function (page, rows, type) {
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
  BannerManage.createTable(params);
};
BannerManage.createTable = function (params) {
  parent.modal.loaders("block");
  $.get("/admin/v1/banner/queryBanners", params, function (data) {
    parent.modal.loaders();
    let html = "";
    if (data.code === 200) {
      if (data.data.length > 0) {
        let arr1 = [];
        let arr2 = [];
        let all = [{}];
        data.data.map(function (item, index) {
          if (item.type == 1) {
            arr1.push(item);
          } else {
            arr2.push(item);
          }
        });
        all[0].arr = arr2;
        console.log(all);
        arr1.map(function (item, index) {
          html += ` <tr data_id="${item.id}"  data_type="${item.type}" data-json="${item}">
            <td>
                <img src="${item.icon}" style="width: 200px;height: 100px;">
            </td>
            <td>${item.addAddress}</td>
            <td>
                <button class="btn editBtn" data_id="${item.id}"  data_type="${item.type}" data-toggle="modal" data-target="#myModal">编辑</button>
            </td>
          </tr>`;
        });
        all.map(function (item, index) {
          item.arr.map(function (itm, ind) {
            html += `<tr data_id="${itm.id}" data_type="${itm.type}"><td>
                    <img src="${itm.icon}" style="width: 200px;height: 100px;">
                </td>
                <td>${itm.addAddress}</td>
                <td style="width: 30%" rowspan=${item.arr.length} class="${
              ind !== 0 ? `hide` : ""
            }">
                  <button class="btn editBtn" data-toggle="modal" data_id=${
                    itm.id
                  } data_type="${itm.type}" >编辑</button>
                </td></tr>`;
          });
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
    //   BannerManage,
    //   "#iframe-content",
    //   "createTable"
    // );
  });
};
BannerManage.Verify = function () {
  let num = 0;
  $(".otherModal")
    .find(".verify:not(.hide) input")
    .map(function () {
      if ($(this).val() === "") {
        num++;
        $(this).addClass("required-input");
      }
    });
  // if (!$(".fileUpload").attr("url")) {
  //   num++;
  //   $(".fileUpload").addClass("required-input");
  // }
  return num;
};
