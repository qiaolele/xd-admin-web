var packageManage = new Object();
$(function() {
  packageManage.regEvent();
  packageManage.getDataList();
});
packageManage.regEvent = function() {
  //添加认证列表
  $("body").on("click", ".addAuthModal", function() {
    $("#editProduct")
      .attr("data-type", 1)
      .modal("show");
  });
  $("#editProduct").on("hidden.bs.modal", function() {
    //主页模态框隐藏
    num = 0; //初始化
    let input = $("#editProduct .modal-body").find(".form-control");
    input.map(function() {
      $(this).val("");
      $(this).removeClass("required-input");
    });
    $(".notEmpty").removeClass("required-input");
    $("#editProduct").removeAttr("data-id");
    $("#editProduct .type input[type=radio]:eq(0)").prop("checked", true);
    $("#editProduct .compulsoryRenewal input[type=radio]:eq(0)").prop(
      "checked",
      true
    );
    $("#editProduct input").removeClass("required-input");
  });

  //保存弹窗
  $("body").on("click", "#editProduct .modal-footer .btn-default", function() {
    if (packageManage.verifyPack() > 0) {
      return false;
    }
    packageManage.upDateDetail();
  });
  $("body").on("click", ".addBtn", function() {
    packageManage.addConfig();
  });
  $("body").on("input", ".panel-table input", function() {
    if ($(this).val() > 5) {
      $(this).val(
        $(this)
          .val()
          .slice(0, 5)
      );
    }
  });
  $("body").on("click", "tbody .saveBtn", function() {
    let targetIndex = $(this)
      .siblings("input")
      .val();
    let currentIndex = $(this)
      .parent()
      .parent()
      .attr("data-index");
    let len = $("tbody").find(".query-item:not(.hide)").length;
    if (parseInt(targetIndex) < 0) targetIndex = 1;
    if (parseInt(targetIndex) >= len) targetIndex = len;
    if (parseInt(targetIndex) < parseInt(currentIndex)) {
      $("tbody")
        .find('.query-item:not(.hide):eq("' + (targetIndex - 1) + '")')
        .before(
          $(this)
            .parent()
            .parent()
            .clone()
        );
    } else {
      $("tbody")
        .find('.query-item:not(.hide):eq("' + (targetIndex - 1) + '")')
        .after(
          $(this)
            .parent()
            .parent()
            .clone()
        );
    }
    $(this)
      .parent()
      .parent()
      .remove();
    packageManage.Count();
  });
  $("body").on("click", ".text-center .saveBtn", function() {
    let el = $("tbody").find(".query-item:not(.hide)");
    let arr = [];
    let num = 0;
    el.map(function() {
      let params = {};
      $(this)
        .find(".form-control")
        .map(function() {
          params[$(this).attr("data-param")] = $(this).val();
          if ($(this).hasClass("verify") && $(this).val() === "") {
            num++;
          }
        });
      arr.push(params);
    });
    if (num > 0) {
      parent.modal.operModal({
        info: "数据不能为空",
        className: "LoanTypeConfig"
      });
      return;
    }
    $.get(
      "/admin/v1/config/auth/defaultdue/update",
      { value: JSON.stringify(arr) },
      function(data) {
        if (data.code === 200) {
          parent.modal.operModal({
            info: data.message,
            className: "H5Product"
          });
        }
      }
    );
  });
};
//修改弹窗内容
packageManage.upDateDetail = function() {
  let params = {};
  params.versionNum = $(".form .versionNum").val();
  params.remark = $(".form .remark").val();
  params.pageUrl = $(".form .pageUrl").val();
  params.type = $(".form .type")
    .find(`.radio-inline input:checked`)
    .val();
  params.compulsoryRenewal = $(".form .compulsoryRenewal")
    .find(`.radio-inline input:checked`)
    .val();
  params.channel = $(".form .channel").val();
  $.post("/admin/v1/appversion/insert", params, function(data) {
    parent.modal.loaders();
    if (data.code === 200) {
      parent.modal.operModal({
        info: "保存成功",
        className: "H5Product"
      });
      packageManage.getDataList();
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product"
      });
    }
  });
};
packageManage.verifyPack = function() {
  let num = 0;
  $("#editProduct")
    .find(".verify")
    .map(function() {
      if ($(this).val() === "") {
        $(this).addClass("required-input");
        num++;
      } else {
        $(this).removeClass("required-input");
      }
    });
  return num;
};
packageManage.getDataList = function(page, rows) {
  let param = {};
  param.page = page || 1;
  param.rows = rows || 25;
  parent.modal.loaders("block");
  $.get("/admin/v1/appversion/query", param, function(data) {
    parent.modal.loaders();
    let d = data.data.data;
    let html = "";
    if (data.code === 200) {
      if (d.length > 0) {
        d.map((item, index) => {
          html += `<tr data-id='${item.id}'>
                  <td>${item.type == 1 ? "Android" : "Ios"}</td>
                  <td>${item.compulsoryRenewal == 2 ? "是" : "否"}</td>
                  <td>${item.channel}</td>
                  <td>${item.versionNum}</td>
                  <td>${item.pageUrl}</td>
                  <td>${item.gmtCreate.slice(0, 10)} ${item.gmtCreate.slice(
            11
          )}</td>
               </tr>`;
        });
      } else {
        html += `<tr><td colspan="18">暂无数据</td></tr>`;
      }
    }
    $(".panel-table tbody").html(html);
    initPage(
      data.data.total,
      param,
      packageManage,
      "#iframe-content",
      "getDataList"
    );
  });
};
packageManage.addConfig = function() {
  let tr = $("#iframe-content tbody").find(".query-item.hide");
  $("tr:last").after(tr.clone().removeClass("hide"));
};
packageManage.Count = function() {
  $("#iframe-content tbody")
    .find(".query-item:not(.hide)")
    .map(function(index) {
      $(this)
        .find(".orderIndex")
        .val(index + 1);
      $(this).attr("data-index", index + 1);
    });
};
