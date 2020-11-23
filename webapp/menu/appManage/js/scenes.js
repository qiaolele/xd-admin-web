var Scenes = new Object();
$(function () {
  Scenes.getLoanPageAndNewCut();
  Scenes.getParams();
  Scenes.regEvent();

})
Scenes.regEvent = function () {
  $('body').on('click', '.queryBtn', function () {
    Scenes.getParams();
  })
  $('body').on('click', '#myModal .saveBtn', function () {
    if (!$('#myModal input[data-param=name]').val()) {
      $('#myModal input[data-param=name]').addClass('required-input');
      return false
    }
    if ($('#myModal').attr('data-id')) {
      let id = $('#myModal').attr('data-id');
      Scenes.AddScenesParams('/admin/v1/scene/manager/edit', id);
    } else {
      Scenes.AddScenesParams('/admin/v1/scene/manager/add');
    }
  })
  $('body').on('click', '.editBtn', function () {
    $('#myModal').attr('data-id', $(this).attr('data-id'));
    let id = $(this).attr('data-id');
    Scenes.getEditData(id);
  })
  $('body').on('click', '.delete', function () {
    $('.deleteConfirm').attr('data-id', $(this).attr('data-id'));
  })
  $('body').on('click', '.deleteConfirm', function () {
    let id = $(this).attr('data-id');
    $.get('/admin/v1/scene/manager/delete', {id: id}, function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: '成功',
          className: 'Scenes'
        })
        Scenes.getParams();
      } else {
        parent.modal.operModal({
          info: data.message,
          className: 'Scenes'
        })
      }
      $('#deleteModal').modal('hide');
    })
  })

  $('#myModal,#setRestrict').on('hidden.bs.modal', function () {//主页模态框隐藏
    $('#myModal').removeAttr('data-id');
    $('#myModal').removeClass('required-input');
    $('#myModal input[data-param]').map(function () {
      $(this).val('');
    })
    $('#myModal input[type=radio]:eq(0)').prop('checked', true);
    $('#myModal select').map(function () {
      $(this).val($(this).find('option:eq(0)').val())
    })
  })
}
Scenes.getLoanPageAndNewCut = function () {//获取新口子和贷款页下拉
  $.get('/admin/v1/scene/manager/getpagenames', function (data) {
    let d = data.data;
    let html1 = '';
    let html2 = '';
    let html3 = '<option value="">全部</option>';
    let html4 = '<option value="">全部</option>';
    d.loanPageName.map(function (item, index) {
      html1 += `<option value="${item.id}">${item.name}</option>`;
      html3 += `<option value="${item.id}">${item.name}</option>`
    })
    d.newOpeningPageName.map(function (item, index) {
      html2 += `<option value="${item.id}">${item.name}</option>`;
      html4 += `<option value="${item.id}">${item.name}</option>`
    })
    $('.panel-select .loanPage select').html(html3);
    $('.panel-select .newCut select').html(html4);
    $('#myModal .APPLoan').html(html1);
    $('#myModal .APPNewCut').html(html2)
  })
}
Scenes.getParams = function (rows, page) {
  let params = {};
  let input = $('.panel-select').find('input');
  let select = $('.panel-select').find('select');
  input.map(function () {
    params[$(this).attr('data-param')] = $(this).val();
  })
  select.map(function () {
    params[$(this).attr('data-param')] = $(this).val();
  })
  params.rows = rows || 25;
  params.page = page || 1;
  Scenes.Query(params)
}
Scenes.Query = function (params) {
  let html = '';
  parent.modal.loaders('block');
  $.get('/admin/v1/scene/manager/query', params, function (data) {
    parent.modal.loaders();
    if (data.code === 200) {
      let d = data.data.data;
      if (d.length > 0) {
        d.map(function (item, index) {
          html += `<tr>
                <td style="width: 100px;text-align: left">
                    <button class="btn editBtn" data-id="${item.id}" data-toggle="modal" data-target="#myModal">编辑</button>
                   ${item.agentNum <= 0 ? `<button class="btn delete" data-id="${item.id}" data-toggle="modal" data-target="#deleteModal">删除</button>` : ""}
                </td>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.homePageType === 0 ? '贷款页' : '新口子'}</td>
                <td>${item.loanPageName || ''}</td>
                <td>${item.newHoleName || ''}</td>
                <td>${item.agentNum || 0}</td>
                <td>${item.gmtModified || ''}</td>
            </tr>`
        })
      } else {
        html += `<tr><td colspan="8">暂无数据</td></tr>`;
      }
    } else {
      html += `<tr><td colspan="8">暂无数据</td></tr>`;
    }
    $('.panel-table tbody').html(html);
    initPage(data.data.total, params, Scenes, '#iframe-content', 'Query');
  })
}
Scenes.AddScenesParams = function (url, id) {//添加新场景
  let params = {};
  let input = $('#myModal').find('input[data-param]');
  let select = $('#myModal').find('select');
  input.map(function () {
    params[$(this).attr('data-param')] = $(this).val();
  })
  select.map(function () {
    params[$(this).attr('data-param')] = $(this).val();
  })
  params.homePageType = $('#myModal input[type=radio]:checked').val();
  params.id = id || '';
  $.get(url, params, function (data) {
    if (data.code === 200) {
      parent.modal.operModal({
        info: '成功',
        className: 'Scenes'
      })
      $('#myModal').modal('hide');
      Scenes.getParams();
    }
  })
}
Scenes.getEditData = function (id) {//获取编辑资料
  $.get('/admin/v1/scene/manager/queryById', {id: id}, function (data) {
    if (data.code === 200) {
      let d = data.data;
      $('#myModal').find('input[data-param]').map(function () {
        $(this).val(d[$(this).attr('data-param')])
      })
      $('#myModal input[type=radio]').map(function () {
        if ($(this).val() == d.homePageType) {
          $(this).prop('checked', true);
        }
      })
      $('#myModal .APPLoan').val(`${d.loanPageId}`);
      $('#myModal .APPNewCut').val(`${d.newHoleId}`);
    }
  })
}















