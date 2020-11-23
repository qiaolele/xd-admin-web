var OperatingAndApi = new Object()
$(function() {
  OperatingAndApi.getParams()
  OperatingAndApi.regEvent()
})
OperatingAndApi.regEvent = function() {
  $('body').on('click', '.saveBtn', function() {
    let params = {}
    let num = 0
    params.id = $(this).attr('data-id')
    $(this)
      .parent()
      .parent()
      .find('input')
      .map(function(item, index) {
        params[$(this).attr('data-param')] = $(this).val()
        if ($(this).val() === '') num++
        if (num > 0) {
          parent.modal.operModal({
            info: '数据不能为空',
            className: 'OperatingAndH5'
          })
          return false
        }
      })
    $.get('/admin/v1/record/center/agency/api/update', params, function(data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: data.message,
          className: 'OperatingAndApi'
        })
      } else {
        parent.modal.operModal({
          info: data.message,
          className: 'OperatingAndApi'
        })
      }
      OperatingAndApi.getParams()
    })
  })
  $('body').on('click', '.exportBtn', function() {
    let type = 1
    OperatingAndApi.getParams('', '', type)
  })
  $('body').on('click', '.check', function() {
    OperatingAndApi.getParams()
  })
}
OperatingAndApi.export = function(params) {
  delete params.page
  delete params.rows
  let arr = []
  Object.keys(params).map(function(item, index) {
    arr.push(`${item}=${params[item]}`)
  })
  window.open('/admin/v1/record/center/agency/apiexport' + '?' + arr.join('&'))
}
OperatingAndApi.getParams = function(page, rows, type) {
  let param = {}
  $('.panel-select')
    .find('input')
    .map(function(item, index) {
      param[$(this).attr('data-param')] = $(this).val()
    })
  $('.panel-select')
    .find('select')
    .map(function(item, index) {
      param[$(this).attr('data-param')] = $(this).val()
    })
  param.page = page || 1
  param.rows = rows || 25
  param.timestamp = new Date().getTime()
  if (type) {
    OperatingAndApi.export(param)
  } else {
    OperatingAndApi.getDataList(param)
  }
}
OperatingAndApi.changeStatus = function(val) {
  if (val == 0) {
    val = '未付款'
  } else if (val == 1) {
    val = '已付款'
  } else if (val == 2) {
    val = '已退款'
  }
  return val
}
OperatingAndApi.getDataList = function(param) {
  parent.modal.loaders('block')
  $.get('/admin/api/v1/member/getPayOrderList', param, function(data) {
    parent.modal.loaders()
    let html = ''
    let d = data.data.data
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `
                  <tr>
                    <td>${item.consumerId}</td>
                    <td>${item.realName}</td>
                    <td>${item.loginPhone}</td>
                    <td>${item.actualAmount}</td>
                    <td>${item.memberOrder}</td>
                    <td>${item.gmtCreated}</td>
                    <td>${OperatingAndApi.changeStatus(item.orderStatus)}</td>
                </tr>`
        })
      } else {
        html += `<tr><td colspan="7">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    //是否启动分页
    initPage(
      data.data.total,
      param,
      OperatingAndApi,
      '#iframe-content',
      'getDataList'
    )
  })
}
