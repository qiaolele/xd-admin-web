var Channel = new Object()
$(function() {
  Channel.getParams()
  Channel.regEvent()
})
Channel.regEvent = function() {
  $('body').on('click', '#query', function() {
    //查询
    Channel.getParams()
  })
  $('body').on('click', '.testDataBtn', function() {
    //开启测试数据
    let id = $(this).attr('data-id')
    // 获取测试数据
    $('#testModal').attr({
      'data-id': $(this).attr('data-id'),
      'data-status': $(this).attr('data-status')
    })
    Channel.getParams()
  })

  // 关闭测试数据弹窗
  $('body').on('click', '.closeTableBtn', function() {
    $('#testModal').hide()
    $('.modal-backdrop').removeClass('in')
  })
  $('#modal-channel').on('hidden.bs.modal', function() {
    //主渠道模态框隐藏
    $('#modal-channel input').val('')
    $('#modal-channel .parentType').val('0')
    $('#modal-channel .saveBtn').removeAttr('data-id')
    $('#modal-channel input').removeClass('required-input')
    $('#modal-channel')
      .find('img')
      .map(function() {
        $(this).removeClass('required-div')
      })
  })
  $('#modal-childChannel').on('hidden.bs.modal', function() {
    //子渠道模态框隐藏
    $('#modal-childChannel img')
      .parent()
      .removeClass('required-div')
    $('#modal-childChannel input').val('')
    $('#modal-childChannel .saveBtn').removeAttr('data-parentid,data-id')
  })
}

Channel.getParams = function(page, rows, type) {
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
  param.partnerId = $(this).attr('data-id')
  param.timestamp = new Date().getTime()
  if (type) {
    Channel.export(param)
  } else {
    // Channel.getDataList(param)
  }
}
Channel.getDataList = function(param) {
  parent.modal.loaders('block')
  $.get('/admin/v1/partner/test/list', param, function(data) {
    parent.modal.loaders()
    let html = ''
    if (data.code === 200) {
      if (data.data.length > 0) {
        data.data.map(function(item, index) {
          html += `
                  <tr>
                    <td>${item.version}</td>
                    <td>${item.skinUrl}</td>
                    <td>${item.skinId}</td>
                    <td>${item.testTime}</td>
                    <td>${item.lastTime}</td>
                    <td>${item.uv}</td>
                    <td>${item.registerNum}</td>
                    <td>${item.transRate}</td>
                </tr>`
        })
      } else {
        html += `<tr><td colspan="10">暂无数据</td></tr>`
      }
    }
    $('.panel-table tbody').html(html)
    initPage(data.data.total, param, Channel, '#iframe-content', 'getDataList')
  })
}
