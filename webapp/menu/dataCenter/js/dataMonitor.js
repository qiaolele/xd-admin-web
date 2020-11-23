var OperatingAndApi = new Object()
var myChart = echarts.init(document.getElementById('brokeLine'))
var dateList = [
  '00:00:00',
  '00:15:00',
  '00:30:00',
  '00:45:00',
  '01:00:00',
  '01:15:00',
  '01:30:00',
  '01:45:00',
  '02:00:00',
  '02:15:00',
  '02:30:00',
  '02:45:00',
  '03:00:00',
  '03:15:00',
  '03:30:00',
  '03:45:00',
  '04:00:00',
  '04:15:00',
  '04:30:00',
  '04:45:00',
  '05:00:00',
  '05:15:00',
  '05:30:00',
  '05:45:00',
  '06:00:00',
  '06:15:00',
  '06:30:00',
  '06:45:00',
  '07:00:00',
  '07:15:00',
  '07:30:00',
  '07:45:00',
  '08:00:00',
  '08:15:00',
  '08:30:00',
  '08:45:00',
  '09:00:00',
  '09:15:00',
  '09:30:00',
  '09:45:00',
  '10:00:00',
  '10:15:00',
  '10:30:00',
  '10:45:00',
  '11:00:00',
  '11:15:00',
  '11:30:00',
  '11:45:00',
  '12:00:00',
  '12:15:00',
  '12:30:00',
  '12:45:00',
  '13:00:00',
  '13:15:00',
  '13:30:00',
  '13:45:00',
  '14:00:00',
  '14:15:00',
  '14:30:00',
  '14:45:00',
  '15:00:00',
  '15:15:00',
  '15:30:00',
  '15:45:00',
  '16:00:00',
  '16:15:00',
  '16:30:00',
  '16:45:00',
  '17:00:00',
  '17:15:00',
  '17:30:00',
  '17:45:00',
  '18:00:00',
  '18:15:00',
  '18:30:00',
  '18:45:00',
  '19:00:00',
  '19:15:00',
  '19:30:00',
  '19:45:00',
  '20:00:00',
  '20:15:00',
  '20:30:00',
  '20:45:00',
  '21:00:00',
  '21:15:00',
  '21:30:00',
  '21:45:00',
  '22:00:00',
  '22:15:00',
  '22:30:00',
  '22:45:00',
  '23:00:00',
  '23:15:00',
  '23:30:00',
  '23:45:00'
]

var valueList1 = []
var valueList2 = []
var valueList3 = []
var valueList4 = []
var valueList5 = []

$(function() {
  $('#beginDate').datetimepicker({
    format: 'Y-m-d',
    timepicker: false
  })
  $('#endDate').datetimepicker({ format: 'Y-m-d', timepicker: false })
  OperatingAndApi.getClickId('banner点击')
  OperatingAndApi.regEvent()
})

OperatingAndApi.regEvent = function() {
  $('body').on('change', '.productName select', function() {
    const val = $(this).val()
    OperatingAndApi.getClickId(val)
  })
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
OperatingAndApi.getClickId = function(val) {
  //select 获取对应id
  $.get('/admin/v1/tracking/select', { productName: val }, function(data) {
    var select = ''
    for (var i = 0; i < data.data.length; i++) {
      var option =
        '<option value="' +
        data.data[i].id +
        '">' +
        data.data[i].name +
        '</option>'
      select += option
    }
    $('.clickId').html(select)

    // OperatingAndApi.getParams()
  })
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
  if (param.beginDate == '' || param.endDate == '') {
    parent.modal.operModal({
      info: '起始截止日期必选',
      className: 'OperatingAndH5'
    })
    return false
  }
  // param.page = page || 1
  // param.rows = rows || 25
  if (type) {
    OperatingAndApi.export(param)
  } else {
    OperatingAndApi.getDataList(param)
  }
}
OperatingAndApi.updateOption = function() {
  option = {
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400
      }
    ],
    title: [
      {
        left: 'center',
        text: '数据'
      }
    ],
    tooltip: {
      trigger: 'axis',
      //设置平行于y轴的分隔线条隐藏
      axisPointer: {
        type: 'none'
      }
    },
    legend: {
      // y: '480px',
      data: [
        '2019-07-11',
        '2019-07-10',
        '2019-07-09',
        '2019-07-08',
        '2019-07-07'
      ]
    },
    xAxis: [
      {
        data: dateList,
        //设置轴线的属性
        axisLine: {
          lineStyle: {
            color: '#666',
            width: 2 //这里是为了突出显示加上的
          }
        },
        // x轴的字体样式
        axisLabel: {
          interval: 0,
          rotate: 50,
          // show: true //控制坐标轴x轴的文字是否显示
          textStyle: {
            color: '#000', //x轴上的字体颜色
            fontSize: '10' // x轴字体大小
          }
        },
        // x轴网格线
        splitLine: {
          show: false, // 网格线是否显示 // 改变样式
          lineStyle: {
            color: '#ccc' // 修改网格线颜色
          }
        }
      }
    ],

    yAxis: [
      {
        //设置轴线的属性
        axisLine: {
          lineStyle: {
            color: '#666',
            width: 2 //这里是为了突出显示加上的
          }
        },
        // y轴的字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#666',
            fontSize: '12' // x轴字体大小
          }
        },
        splitLine: { show: true }
      }
    ],
    grid: {
      show: 'true'
      //  borderWidth: '0'//去掉右边线和上边线
    },
    series: [
      {
        name: '2019-07-11',
        //设置折线折点颜色
        itemStyle: {
          normal: {
            // color: '#cc3300',
            //折线线条颜色
            lineStyle: {
              // color: '#cc3300'
            }
          }
        },
        type: 'line',
        showSymbol: false,
        // symbol: 'none', //设置拐点的圆圈没有 或者有用symbolSize: 0,
        data: valueList1
      },
      {
        name: '2019-07-10',
        //设置折线折点颜色
        itemStyle: {
          normal: {
            //折线线条颜色
            lineStyle: {}
          }
        },
        type: 'line',
        showSymbol: false,
        data: valueList2
      },
      {
        name: '2019-07-09',
        //设置折线折点颜色
        itemStyle: {
          normal: {
            //折线线条颜色
            lineStyle: {}
          }
        },
        type: 'line',
        showSymbol: false,
        data: valueList3
      },
      {
        name: '2019-07-08',
        //设置折线折点颜色
        itemStyle: {
          normal: {
            //折线线条颜色
            lineStyle: {}
          }
        },
        type: 'line',
        showSymbol: false,
        data: valueList4
      },
      {
        name: '2019-07-07',
        //设置折线折点颜色
        itemStyle: {
          normal: {
            //折线线条颜色
            lineStyle: {}
          }
        },
        type: 'line',
        showSymbol: false,
        data: valueList5
      }
    ]
  }
  myChart.hideLoading() //清除暂无数据气泡状态
  myChart.setOption(option, true)
}
OperatingAndApi.getDataList = function(param) {
  parent.modal.loaders('block')

  $.get('/admin/v1/tracking/data', param, function(data) {
    parent.modal.loaders()
    // let html = ''
    let d = data.data
    if (data.code === 200) {
      if (d.length > 0) {
        dateList = d.map(function(item) {
          return item['date']
        })
        dateList = [
          '00:00:00',
          '00:15:00',
          '00:30:00',
          '00:45:00',
          '01:00:00',
          '01:15:00',
          '01:30:00',
          '01:45:00',
          '02:00:00',
          '02:15:00',
          '02:30:00',
          '02:45:00',
          '03:00:00',
          '03:15:00',
          '03:30:00',
          '03:45:00',
          '04:00:00',
          '04:15:00',
          '04:30:00',
          '04:45:00',
          '05:00:00',
          '05:15:00',
          '05:30:00',
          '05:45:00',
          '06:00:00',
          '06:15:00',
          '06:30:00',
          '06:45:00',
          '07:00:00',
          '07:15:00',
          '07:30:00',
          '07:45:00',
          '08:00:00',
          '08:15:00',
          '08:30:00',
          '08:45:00',
          '09:00:00',
          '09:15:00',
          '09:30:00',
          '09:45:00',
          '10:00:00',
          '10:15:00',
          '10:30:00',
          '10:45:00',
          '11:00:00',
          '11:15:00',
          '11:30:00',
          '11:45:00',
          '12:00:00',
          '12:15:00',
          '12:30:00',
          '12:45:00',
          '13:00:00',
          '13:15:00',
          '13:30:00',
          '13:45:00',
          '14:00:00',
          '14:15:00',
          '14:30:00',
          '14:45:00',
          '15:00:00',
          '15:15:00',
          '15:30:00',
          '15:45:00',
          '16:00:00',
          '16:15:00',
          '16:30:00',
          '16:45:00',
          '17:00:00',
          '17:15:00',
          '17:30:00',
          '17:45:00',
          '18:00:00',
          '18:15:00',
          '18:30:00',
          '18:45:00',
          '19:00:00',
          '19:15:00',
          '19:30:00',
          '19:45:00',
          '20:00:00',
          '20:15:00',
          '20:30:00',
          '20:45:00',
          '21:00:00',
          '21:15:00',
          '21:30:00',
          '21:45:00',
          '22:00:00',
          '22:15:00',
          '22:30:00',
          '22:45:00',
          '23:00:00',
          '23:15:00',
          '23:30:00',
          '23:45:00'
        ]
        valueList1 = d.map(function(item) {
          return item['pv']
        })
        valueList2 = d.map(function(item) {
          return item['uv']
        })
        valueList3 = [120, 132, 101, 134, 90, 230, 210]
        valueList4 = [220, 182, 191, 234, 290, 330, 310]
        valueList5 = [150, 232, 201, 154, 190, 330, 410]
      }
      OperatingAndApi.updateOption()
    } else {
      if (data.code != 4106) {
        parent.modal.operModal({
          info: data.message,
          className: 'OperatingAndH5'
        })
      }
      dateList = []
      valueListPv = []
      valueListUv = []
      OperatingAndApi.updateOption()
    }
  })
}
OperatingAndApi.updateOption()
window.onresize = function() {
  myChart.resize()
}
