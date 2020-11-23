var recommendLoan = new Object()
var currentId = ''
$(function() {
  recommendLoan.regEvent()
  recommendLoan.getDataList()
  recommendLoan.getProductList()
})
recommendLoan.regEvent = function() {
  //添加认证列表
  $('body').on('click', '.addAuthModal', function() {
    $('#editProduct')
      .attr('data-type', 1)
      .modal('show')
  })
  $('body').on('click', '.editAuthModal', event => {
    currentId = event.target.dataset.id
    // recommendLoan.toRemove(id)
    parent.modal.alertModal({
      title: '移除',
      info: '确认移除该产品吗',
      className: 'custom'
    })
  })
  $('#editProduct').on('hidden.bs.modal', function() {
    //主页模态框隐藏
    $('.editProductModal select')
      .find('option:first')
      .prop('selected', true)
    recommendLoan.getProductList()
  })
  //产品类型切换
  $('.type').on('change', function(data) {
    $(this).prop('checked', true)
    recommendLoan.getProductList()
  })

  //确认移除事件
  $(parent.window.document).on(
    'click',
    '#operModal.custom .modal-footer .btn:eq(1)',
    function() {
      recommendLoan.toDelete(currentId)
    }
  )
  //保存弹窗
  $('body').on('click', '#editProduct .modal-footer .btn-default', function() {
    recommendLoan.sureAdd()
  })
  $('body').on('input', '.panel-table input', function() {
    if ($(this).val() > 5) {
      $(this).val(
        $(this)
          .val()
          .slice(0, 5)
      )
    }
  })
}
//获取产品列表
recommendLoan.getProductList = function() {
  let productType = $('.editProductModal .type').val()
  $.get('/admin/v1/recommend/products/type/' + productType, function(data) {
    parent.modal.loaders()
    if (data.code === 200) {
      var select = ''
      for (var i = 0; i < data.data.length; i++) {
        var option =
          '<option value="' +
          data.data[i].id +
          '">' +
          data.data[i].name +
          '(' +
          recommendLoan.changeStatus(data.data[i].status) +
          ')'
        ;('</option>')
        select += option
      }
      $('.name').html(select)
    } else {
      parent.modal.operModal({
        info: data.message,
        className: 'H5Product'
      })
    }
  })
}
//移除功能
recommendLoan.toDelete = function() {
  $.ajax({
    url: '/admin/v1/recommend/products/' + currentId,
    type: 'DELETE',
    success: function(data) {
      parent.modal.loaders()
      if (data.code === 200) {
        parent.modal.operModal({
          info: '移除成功',
          className: 'H5Product'
        })
        recommendLoan.getDataList()
      } else {
        parent.modal.operModal({
          info: data.message,
          className: 'H5Product'
        })
      }
    }
  })
}
//确定推荐产品
recommendLoan.sureAdd = function() {
  let id = $('.editProductModal .name').val()
  $.post('/admin/v1/recommend/products/' + id, function(data) {
    parent.modal.loaders()
    if (data.code === 200) {
      parent.modal.operModal({
        info: '保存成功',
        className: 'H5Product'
      })
      recommendLoan.getDataList()
    } else {
      parent.modal.operModal({
        info: data.message,
        className: 'H5Product'
      })
    }
  })
}
recommendLoan.verifyPack = function() {
  let num = 0
  $('#editProduct')
    .find('.verify')
    .map(function() {
      if ($(this).val() === '') {
        $(this).addClass('required-input')
        num++
      } else {
        $(this).removeClass('required-input')
      }
    })
  return num
}
recommendLoan.getDataList = function(page, rows) {
  let param = {}
  param.page = page || 1
  param.rows = rows || 25
  parent.modal.loaders('block')
  $.get('/admin/v1/recommend/products', param, function(data) {
    parent.modal.loaders()
    let d = data.data.data
    let html = ''
    if (data.code === 200) {
      if (d.length > 0) {
        d.map((item, index) => {
          html += `<tr data-id='${item.id}'>
                  <td>${item.name}</td>
                  <td>${recommendLoan.changeStatus(item.status)}</td>
                  <td>${
                    item.type === 1 ? 'Api' : item.type === 2 ? 'H5' : '联登'
                  }</td>
                  <td><button class="btn editAuthModal" data-id="${
                    item.id
                  }">移出</button></td>
               </tr>`
        })
      } else {
        html += `<tr><td colspan="18">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    initPage(
      data.data.total,
      param,
      recommendLoan,
      '#iframe-content',
      'getDataList'
    )
  })
}
recommendLoan.changeStatus = function(val) {
  if (val == -1) {
    return '删除'
  } else if (val == 0) {
    return '下线'
  } else if (val == 1) {
    return '上线'
  } else if (val == 2) {
    return '上架'
  } else if (val == 3) {
    return '下架'
  } else if (val == 4) {
    return '限量下架'
  }
}
recommendLoan.addConfig = function() {
  let tr = $('#iframe-content tbody').find('.query-item.hide')
  $('tr:last').after(tr.clone().removeClass('hide'))
}
recommendLoan.Count = function() {
  $('#iframe-content tbody')
    .find('.query-item:not(.hide)')
    .map(function(index) {
      $(this)
        .find('.orderIndex')
        .val(index + 1)
      $(this).attr('data-index', index + 1)
    })
}
