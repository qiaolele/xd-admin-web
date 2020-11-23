var HeadLine = {
  init() {
    this.regEvent();
    this.query();
  },
  regEvent() {
    $("body").on("click", ".deleteTr", function () {
      const id = JSON.parse($(this).parents("tr").attr("data-info")).id;
      $('body').timeOutPlugin({
        type: 'confirmModal', title: "删除", message: "确定删除吗？", callback: () => HeadLine.deleteTr(id)
      });
    });
    $("body").on("click", ".edit", function () {
      const info = JSON.parse($(this).parents("tr").attr("data-info"));
      $("#bannerEdit .form-control").each(function () {
        $(this).val(info[$(this).attr("data-param")]);
      })
      $("#bannerEdit .form-control[data-param=recommendType]").val(info.recommendType);
      if(info.recommendType === 4)$('.pageUrl').addClass('hide');
      $("#bannerEdit").modal('show').attr("data-id", info.id);
    })
    $("body").on("click", "#bannerEdit .btn-default", () => {
      HeadLine.flag = 0;
      let param = new Object(), url = "", id = $("#bannerEdit").attr("data-id"),
        $blur = $("#bannerEdit .input-group:not(.hide) input.form-control");
      $("#bannerEdit").find(".form-inline .form-control").each(function () {
        param[$(this).attr("data-param")] = $(this).val();
      })
      if (param.recommendType === '4') param.pageUrl = '';
      $blur.trigger("blur");
      if (id) {
        url = '/admin/v1/notification/edit';
        param.id = id;
      } else {
        url = '/admin/v1/notification/add';
      }
      if ($blur.length === HeadLine.flag)
        this.addOrEdit(param, url);
    });
    $("body").on("change", "#bannerEdit .form-control[data-param=recommendType]", function () {
      const val = $(this).val(), $txt = $(".pageUrl").find(".input-group-addon");
      $(".pageUrl").removeClass("hide");
      if (val === '3') {
        $txt.html("跳转链接");
      } else if (val === '4') {
        $(".pageUrl").addClass("hide");
      } else {
        $txt.html("产品/分类ID");
      }
      $('.pageUrl input').val('');
      $('.pageUrl input').prop('placeholder','请输入');
    })
    $("body").on("blur", "#bannerEdit .input-group:not(.hide) input.form-control", function () {
      $(this).timeOutPlugin({type: 'verify'}, event => HeadLine.flag += event.isVerify());
    })
    $("#bannerEdit").on("hidden.bs.modal", function () {
      $(this).find("input.form-control").removeClass("required-input").val("");
      $(this).find("select.form-control").find('option:first').prop('selected', true).trigger("change");
      $(this).removeAttr("data-id");
    });

    $("body").on("click", ".order", event => {
      const $this = $(event.target),
        id = JSON.parse($this.parents("tr").attr("data-info")).id,
        orderIndex = parseInt($this.siblings("input").val()),
        reg = /^\+?[1-9][0-9]*$/;
      if (!reg.test(orderIndex)) return;
      let sort = JSON.stringify({id, orderIndex});
      this.addOrEdit({sort}, '/admin/v1/notification/sort');
    });
  },
  query() {
    parent.modal.loaders('block');
    $.get("/admin/v1/notification/querytype", info => {
      let html = '';
      info.data.map(item => html += `<option value="${item.id}">${item.name}</option>`)
      $('#bannerEdit').find(".form-control[data-param=type]").html(html);
      $.get("/admin/v1/notification/query", res => {
        parent.modal.loaders();
        let {code, data} = res, html = "";
        data.map((item, index) => {
          const data = info.data.filter(it => it.id === item.type);
          html += `<tr  data-info='${JSON.stringify(item)}' data-index="${index + 1}">
                    <td>
                      <div style="display: flex;justify-content: space-around;">
                        <input class="form-control" style="width: 60px;" value="${item.orderIndex + 1}" type="number">
                        <button class="btn order">保存</button>
                        <button class="btn edit">编辑</button>
                        <button class="btn deleteTr">删除</button>
                      </div>
                    </td>
                    <td>${item.name}</td>
                    <td>
                        ${data.length <= 0 ? "" : data[0].name}
                    </td>
                    <td>${item.message}</td>
                    <td>
                        ${this.switchType(item.recommendType)}
                    </td>
                    <td>${item.pageUrl}</td>
                </tr>`
        });
        $(".panel-table table tbody").html(html);
      })
    })
  },
  switchType(type) {
    let text = '';
    switch (type) {
      case 1:
        text = '产品推荐';
        break
      case 2:
        text = '分类推荐';
        break
      case 3:
        text = '跳转链接';
        break
      case 4:
        text = '不可点击';
        break
      default:
        text = '';
    }
    return text;
  },
  deleteTr(id) {
    $.get("/admin/v1/notification/delete", {id}, res => {
      $('body').timeOutPlugin({
        type: 'tipsModal', title: "提示", message: res.message
      });
      this.query();
    })
  },
  addOrEdit(param, url) {
    $.get(url, param, res => {
      $('body').timeOutPlugin({
        type: 'tipsModal', title: "提示", message: res.message
      });
      this.query();
      $("#bannerEdit").modal("hide");
    })
  },
}

HeadLine.init();
