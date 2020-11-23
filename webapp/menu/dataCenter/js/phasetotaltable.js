$(function() {
  getPhaseList()
  $('body').on('click', '.check', function() {
    getTotalData()
  })
  // setInterval(() => {//每隔15秒执行一次
  //   getTotalData()
  // }, 1000*60*15)
})
function getPhaseList() {
  $.get('/admin/v1/phaseList', {}, function(data) {
    var select = ''
    let d = data.data
    for (var i = 0; i < d.length; i++) {
      var option =
        '<option value="' + d[i].value + '">' + d[i].name + '</option>'
      select += option
    }
    $('.clickId').html(select)
    getTotalData()
  })
}

function getTotalData() {
  let param = {
    startTime: $('#startTime').val(),
    endTime: $('#endTime').val(),
    phaseParam: $('.clickId').val()
  }
  $.get('/admin/v1/monitorList', param, function(d) {
    let data = {
      message: d.data
    }
    $('#panel_box').html('')
    for (key_result in data) {
      var div = document.createElement('div')
      div.id = key_result
      $('#panel_box').append(div)
      var chart = new G2.Chart({
        id: key_result,
        forceFit: true,
        height: 650,
        background: '#fff',
        plotCfg: {
          margin: [20, 20, 100, 80],
          background: {
            stroke: '#ccc', // 边颜色
            lineWidth: 1 // 边框粗细
          }
        }
      })
      chart.source(data[key_result], {
        date: {
          type: 'cat'
        },
        time: {
          alias: ' '
        },
        value: {
          alias: key_result
        }
      })
      chart.legend({
        position: 'bottom'
      })
      chart.tooltip(true, {
        custom: true, // 使用自定义的 tooltip
        offset: 50
      })

      chart
        .line()
        .position('time*value')
        .color('date')
        .shape('dot')
        .size(2)
      chart.render()
    }
  })
}
