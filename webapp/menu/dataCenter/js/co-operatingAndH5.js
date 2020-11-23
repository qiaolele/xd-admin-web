var OperatingAndH5 = new Object()
$(function() {
  OperatingAndH5.getParams()
  OperatingAndH5.regEvent()
})
OperatingAndH5.regEvent = function() {
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
    $.get('/admin/v1/record/center/agency/h5/update', params, function(data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: data.message,
          className: 'OperatingAndH5'
        })
      } else {
        parent.modal.operModal({
          info: data.message,
          className: 'OperatingAndH5'
        })
      }
      OperatingAndH5.getParams()
    })
  })
  $('body').on('click', '.exportBtn', function() {
    let type = 1
    OperatingAndH5.getParams('', '', type)
  })
  $('body').on('click', '.check', function() {
    OperatingAndH5.getParams()
  })
}
OperatingAndH5.export = function(params) {
  delete params.page
  delete params.rows
  let arr = []
  Object.keys(params).map(function(item, index) {
    arr.push(`${item}=${params[item]}`)
  })
  window.open('/admin/v1/record/center/agency/h5/export' + '?' + arr.join('&'))
}
OperatingAndH5.getParams = function(page, rows, type) {
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
  if (type) {
    OperatingAndH5.export(param)
  } else {
    OperatingAndH5.getDataList(param)
  }
}
OperatingAndH5.getDataList = function(param) {
  parent.modal.loaders('block')
  $.get('/admin/v1/record/center/agency/h5/query', param, function(data) {
    parent.modal.loaders()
    let html = ''
    let d = data.data.data
    if (data.code === 200) {
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `<tr>
                    <td>${item.gmtCreated}</td>
                    <td>${item.agencyName}</td>
                    <td>${item.productName}</td>
                    <td>${item.exposure}</td>
                    <td>${item.exposurePeople}</td>
                    <td>${item.listClickUv}</td>
                    <td>${item.listClickPv}</td>
                    <td>${item.detailClickUv}</td>
                    <td>${item.detailClickPv}</td>
                    
                </tr>`
          {
            /* <td>
                    <input type="number" value="${item.registerNum}" data-param="registerNum">
                    </td>
                    <td>
                        <input type="number" value="${item.registerUnitPrice}" data-param="registerUnitPrice">
                    </td>
                    <td>
                        <input type="number" value="${item.loanMoney}" data-param="loanMoney">
                    </td>
                    <td>
                        <input type="number" value="${item.commission}" data-param="commission">
                    </td>
                    <td>${item.income}</td>
                    <td>${item.exposureTimePrice}</td>
                    <td>${item.exposurePeoplePrice}</td>
                    <td>${item.detailPvPrice}</td>
                    <td>${item.detailUvPrice}</td>
                    <td>
                        <span class="btn saveBtn" data-id="${item.id}">保存</span>
                    </td> */
          }
        })
      } else {
        html += `<tr><td colspan="9">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    initPage(
      data.data.total,
      param,
      OperatingAndH5,
      '#iframe-content',
      'getDataList'
    )
  })
}
