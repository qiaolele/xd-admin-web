var ChannelSet = new Object()
$(function() {
  ChannelSet.getDataList()
  ChannelSet.regEvent()
})
ChannelSet.regEvent = function() {
  $('body').on('click', '#iframe-content .query-btn', function() {
    //主页查询按钮
    let name = $('#iframe-content input').val()
    let parentType = $('#iframe-content select').val()
    ChannelSet.getDataList(name, parentType)
  })
  $('body').on('click', '#iframe-content .panel-table .saveBtn', function() {
    //保存折A
    let id = $(this).attr('data-id')
    let foldA = $(this)
      .siblings('input')
      .val()
    $.post(
      '/admin/v1/partner/setchannelfolda',
      { id: id, foldA: foldA },
      function(data) {
        parent.modal.operModal({
          info: data.message,
          className: 'ChannelSet'
        })
      }
    )
  })
  $('body').on('click', '.historyBtn', function() {
    //历史折扣按钮
    let id = $(this).attr('data-id')
    $('#disHistory .disHistoryQuery').attr('data-id', $(this).attr('data-id'))
    ChannelSet.queryHistoryData(id)
  })
  $('body').on('click', '.disHistoryQuery', function() {
    //查询历史折扣
    let id = $(this).attr('data-id')
    let createStartTime = $('#createStartTime').val()
    let createEndTime = $('#createEndTime').val()
    ChannelSet.queryHistoryData(id, createStartTime, createEndTime)
  })
  $('body').on('click', '.daliyBtn', function() {
    //引流日报表
    let id = $(this).attr('data-id')
    $('.dailyQuery').attr('data-id', id)
    ChannelSet.getDrainageReport(id)
  })
  $('body').on('click', '#daily .dailyQuery', function() {
    let id = $(this).attr('data-id')
    let createStartTime = $('#daily #createStartTime').val()
    let createEndTime = $('#daily #createEndTime').val()
    ChannelSet.getDrainageReport(id, createStartTime, createEndTime)
  })
}
ChannelSet.getDataList = function(name, parentType) {
  $.get(
    '/admin/v1/partner/getchannelsettlement',
    { name: name, parentType: parentType },
    function(data) {
      ChannelSet, createTable(data)
    }
  )
}
ChannelSet,
  (createTable = function(data) {
    let html = ''
    if (data.code === 200) {
      let d = data.data
      if (d.length > 0) {
        d.map(function(item, index) {
          html += `<tr>
                <td>
                    <button class="btn daliyBtn" data-toggle="modal" data-target="#daily" data-id="${
                      item.id
                    }">引流日报表</button>
                    <button class="btn historyBtn" data-toggle="modal" data-target="#disHistory" data-id="${
                      item.id
                    }">折扣历史</button>
                </td>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.parentTypeStr}</td>
                <td>
                    <input type="number" class="form-control" value="${
                      item.foldA
                    }" maxlength="5" data-param="foldA" style="width: 50%;display: inline-block;">
                    <button type="button" data-id="${
                      item.id
                    }" class="btn saveBtn">
                        保存
                    </button>
                </td>
            </tr>`
        })
      } else {
        html += `<tr><td colspan="5">暂无数据</td></tr>`
      }
    } else {
      html += `<tr><td colspan="5">暂无数据</td></tr>`
    }
    $('#iframe-content .panel-table tbody').html(html)
  })
ChannelSet.queryHistoryData = function(id, createStartTime, createEndTime) {
  //历史折扣
  $.get(
    '/admin/v1/partner/getfoldalist',
    {
      id: id,
      createStartTime: createStartTime,
      createEndTime: createEndTime
    },
    function(data) {
      let html = ''
      if (data.code === 200) {
        let d = data.data
        if (d.length > 0) {
          d.map(function(item, index) {
            html += `<tr>
                      <td>${index + 1}</td>
                      <td>${item.gmtCreated}</td>
                      <td>${item.foldA}</td>
                  </tr>`
          })
        } else {
          html += `<tr><td colspan="3">暂无数据</tdcolspan></tr>`
        }
      }
      $('#disHistory tbody').html(html)
    }
  )
}
ChannelSet.getDrainageReport = function(id, createStartTime, createEndTime) {
  //引流日报表
  $.get(
    '/admin/v1/partner/getdrainagereport',
    {
      id: id,
      createStartTime: createStartTime,
      createEndTime: createEndTime
    },
    function(data) {
      let html = ''
      if (data.code === 200) {
        if (data.data.length > 0) {
          data.data.map(function(item, index) {
            html += `<tr>
                <td>${index + 1}</td>
                <td>${item.gmtCreated}</td>
                <td>${item.registration}</td>
                <td>${item.afterFoldingRegistration}</td>
              </tr>`
          })
        } else {
          html += `<tr><td colspan="4">暂无数据</td></tr>`
        }
      }
      $('#daily tbody').html(html)
    }
  )
}
