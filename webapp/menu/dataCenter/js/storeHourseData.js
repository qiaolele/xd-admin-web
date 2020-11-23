var storeHourseData = new Object()
$(function() {
  // storeHourseData.getParams()
  storeHourseData.regEvent()
})
storeHourseData.regEvent = function() {
  $('body').on('click', '.check', function() {
    storeHourseData.getParams()
  })
}
storeHourseData.getParams = function(page, rows) {
  let param = {}
  $('.panel-select')
    .find('input')
    .map(function(item, index) {
      param[$(this).attr('data-param')] = $(this).val()
    })
  param.page = page || 1
  param.rows = rows || 25
  storeHourseData.getDataList(param)
}
storeHourseData.getDataList = function(params) {
  parent.modal.loaders('block')
  $.get('/admin/v1/unionLogin/statistic', params, function(data) {
    parent.modal.loaders()
    let html = ''
    let d = data.data.data
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `<tr>
                  <td>${item.name}</td>
                  <td>${item.checkNum}</td>
                  <td>${item.checkPassNum}</td>
                  <td>${item.loginNum}</td>
                  <td>${item.loginSuccessNum}</td>
              </tr>`
        })
      } else {
        html += `<tr><td colspan="10">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    initPage(
      data.data.total,
      params,
      storeHourseData,
      '#iframe-content',
      'getDataList'
    )
  })
}
