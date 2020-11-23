var blackList = new Object();
var coldId = "";
var status = 1;
$(function() {
  blackList.regEvent();
  blackList.getDataList();
  // blackList.getProductList()
});
blackList.regEvent = function() {
  $("body").on("click", "#iframe-content .query-btn", function() {
    blackList.getDataList1();
  });
  //添加认证列表
  $("body").on("click", ".addAuthModal", function() {
    $("#editProduct")
      .attr("data-type", 1)
      .modal("show");
  });
  $("body").on("click", ".editAuthModal", event => {
    coldId = event.target.dataset.id;
    status = event.target.dataset.status; //1:加入黑名单，2：移出黑名单
    // blackList.toRemove(id)
    parent.modal.alertModal({
      title: "提示",
      info: status == 1 ? "确认加入黑名单吗" : "确认移出黑名单吗",
      className: "custom"
    });
  });
  $("#editProduct").on("hidden.bs.modal", function() {
    //主页模态框隐藏
    $(".editProductModal select")
      .find("option:first")
      .prop("selected", true);
    blackList.getProductList();
  });
  //产品类型切换
  $(".type").on("change", function(data) {
    $(this).prop("checked", true);
    blackList.getProductList();
  });

  //确认移除事件
  $(parent.window.document).on(
    "click",
    "#operModal.custom .modal-footer .btn:eq(1)",
    function() {
      if (status == 1) {
        //加入黑名单
        blackList.toDelete(coldId, status);
      } else {
        // 移出黑名单
        blackList.toDelete(coldId, status);
      }
    }
  );
  //保存弹窗
  $("body").on("click", "#editProduct .modal-footer .btn-default", function() {
    blackList.sureAdd();
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
};
//获取产品列表
blackList.getProductList = function() {
  let productType = $(".editProductModal .type").val();
  $.get("/admin/v1/recommend/products/type/" + productType, function(data) {
    parent.modal.loaders();
    if (data.code === 200) {
      var select = "";
      for (var i = 0; i < data.data.length; i++) {
        var option =
          '<option value="' +
          data.data[i].id +
          '">' +
          data.data[i].name +
          "(" +
          blackList.changeStatus(data.data[i].status) +
          ")";
        ("</option>");
        select += option;
      }
      $(".name").html(select);
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product"
      });
    }
  });
};
//添加or移除功能
blackList.toDelete = function() {
  let url = "/admin/v1/black-list/add";
  if (status == 2) {
    url = "/admin/v1/black-list/remove";
  }
  $.ajax({
    url: url,
    type: "POST",
    dataType: "JSON",
    contentType: "application/x-www-form-urlencoded",
    data: { coldId: coldId },
    success: function(data) {
      parent.modal.loaders();
      if (data.code === 200) {
        parent.modal.operModal({
          info: status == 1 ? "加入成功" : "移出成功",
          className: "H5Product"
        });
        blackList.getDataList();
        blackList.getDataList1();
      } else {
        parent.modal.operModal({
          info: data.message,
          className: "H5Product"
        });
      }
    }
  });
};
//确定推荐产品
blackList.sureAdd = function() {
  let id = $(".editProductModal .name").val();
  $.post("/admin/v1/recommend/products/" + id, function(data) {
    parent.modal.loaders();
    if (data.code === 200) {
      parent.modal.operModal({
        info: "保存成功",
        className: "H5Product"
      });
      blackList.getDataList();
    } else {
      parent.modal.operModal({
        info: data.message,
        className: "H5Product"
      });
    }
  });
};
blackList.verifyPack = function() {
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
// /admin/v1/black-list/user/{coldId}
blackList.getDataList1 = function(page, rows) {
  //主页查询按钮
  let coldId = $("#iframe-content input").val();
  if (coldId == "") {
    return false;
  }
  parent.modal.loaders("block");
  $.get("/admin/v1/black-list/user/" + coldId, {}, function(data) {
    parent.modal.loaders();
    let d = data.data.data;
    let html1 = "";
    if (data.code === 200) {
      if (d.length > 0) {
        d.map((item, index) => {
          html1 += `<tr data-id='${item.coldId}'>
                  <td><img style="width:100px;height:100px;" src='${
                    item.avatar
                  }' /></td>
                  <td>
                    <p>${item.loginName}</p>
                    <p>酷玩ID：${item.coldId}</p>
                  </td>
                  <td>
                  ${
                    item.status == 1
                      ? `<button
                        class="btn editAuthModal btn-default"
                        data-id="${item.coldId}"
                        data-status="${item.status}"
                      >
                        加入黑名单
                      </button>`
                      : `<button
                        class="btn editAuthModal"
                        data-id="${item.coldId}"
                        data-status="${item.status}"
                      >
                        移出黑名单
                      </button>`
                  }
                  </td>
               </tr>`;
        });
      } else {
        html1 += `<tr><td colspan="5">暂无数据</td></tr>`;
      }
    }
    $(".search_table tbody").html(html1);
  });
};
blackList.getDataList = function(page, rows) {
  let param = {};
  param.page = page || 1;
  param.rows = rows || 25;
  //主页查询按钮
  // param.coldId = $("#iframe-content input").val();
  parent.modal.loaders("block");
  $.get("/admin/v1/black-list/list", param, function(data) {
    parent.modal.loaders();
    let d = data.data.data;
    let html = "";
    if (data.code === 200) {
      if (d.length > 0) {
        d.map((item, index) => {
          html += `<tr data-id='${item.coldId}'>
                  <td><img style="width:100px;height:100px;" src='${item.avatar}' /></td>
                  <td>
                    <p>${item.loginName}</p>
                    <p>酷玩ID：${item.coldId}</p>
                  </td>
                  <td><button class="btn editAuthModal" data-id="${item.coldId}" data-status="2">移出黑名单
          </button></td>
               </tr>`;
        });
      } else {
        html += `<tr><td colspan="5">暂无数据</td></tr>`;
      }
    }
    $(".table_list tbody").html(html);
    initPage(
      data.data.total,
      param,
      blackList,
      "#iframe-content",
      "getDataList"
    );
  });
};
blackList.changeStatus = function(val) {
  if (val == -1) {
    return "删除";
  } else if (val == 0) {
    return "下线";
  } else if (val == 1) {
    return "上线";
  } else if (val == 2) {
    return "上架";
  } else if (val == 3) {
    return "下架";
  } else if (val == 4) {
    return "限量下架";
  }
};
blackList.addConfig = function() {
  let tr = $("#iframe-content tbody").find(".query-item.hide");
  $("tr:last").after(tr.clone().removeClass("hide"));
};
blackList.Count = function() {
  $("#iframe-content tbody")
    .find(".query-item:not(.hide)")
    .map(function(index) {
      $(this)
        .find(".orderIndex")
        .val(index + 1);
      $(this).attr("data-index", index + 1);
    });
};
