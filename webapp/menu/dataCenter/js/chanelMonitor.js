var chanelMonitor = new Object()
$(function() {
  let html = `<tr><td colspan="18">暂无数据</td></tr>`
  $('.panel-table tbody').html(html)
  chanelMonitor.getParams()
  chanelMonitor.regEvent()
})
chanelMonitor.regEvent = function() {
  $('body').on('click', '.check', function() {
    chanelMonitor.getParams()
  })
}
chanelMonitor.getParams = function(page, rows, type) {
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
  chanelMonitor.getDataList(param)
}
chanelMonitor.getDataList = function(param) {
  parent.modal.loaders('block')
  $.get('/admin/v1/brushAmount', param, function(data) {
    parent.modal.loaders()
    let html = ''
    let d = data.data.data
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.ip}</td>
                    <td>${item.total}</td>
                </tr>`
        })
      } else {
        html += `<tr><td colspan="3">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    initPage(
      data.data.total,
      param,
      chanelMonitor,
      '#iframe-content',
      'getDataList'
    )
  })
}
