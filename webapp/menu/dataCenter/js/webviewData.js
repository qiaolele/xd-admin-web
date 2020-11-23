var OperatingAndApi = new Object()
$(function() {
  // OperatingAndApi.getParams()
  OperatingAndApi.regEvent()
})
OperatingAndApi.regEvent = function() {
  $('body').on('click', '.exportBtn', function() {
    let type = 1
    OperatingAndApi.getParams('', '', type)
  })
  $('body').on('click', '.check', function() {
    OperatingAndApi.getParams()
  })
  $('body').on('click', '#iframe-content .panel-table .saveBtn', function() {
    //保存折A
    let id = $(this).attr('data-id')
    if (id == 'null' || id == 'undefined') {
      id = ''
    }
    let url = $(this)
      .siblings('input')
      .attr('data-url')
    let productName = $(this)
      .siblings('input')
      .val()
    let param = {
      id: id,
      url: url,
      productName: productName
    }
    $.post('/admin/v1/tracking/mapping', param, function(data) {
      parent.modal.operModal({
        info: data.message,
        className: 'ChannelSet'
      })
      if (data.code == 200) {
        OperatingAndApi.getParams()
      }
    })
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
OperatingAndApi.getDataList = function(param) {
  parent.modal.loaders('block')
  $.get('/admin/v1/tracking/mapping/list', param, function(data) {
    parent.modal.loaders()
    let html = ''
    let d = data.data.data
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `
                  <tr>
                    <td style="width:600px;white-space: normal;word-break: break-all;
                    word-wrap: break-word;">${item.url}</td>
                    <td>
                    <input type="text" class="form-control" value="${item.productName}" data-url="${item.url}" style="width: 50%;display: inline-block;">
                    <button type="button" data-id="${item.id}" class="btn saveBtn">
                        保存
                    </button>
                </td>
                    <td style="width:100px">${item.pv}</td>
                    <td style="width:100px">${item.uv}</td>
                </tr>`
        })
      } else {
        html += `<tr><td colspan="4">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    initPage(
      data.data.total,
      param,
      OperatingAndApi,
      '#iframe-content',
      'getDataList'
    )
  })
}
