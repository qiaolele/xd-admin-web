var OperatingAndApi = new Object()
var myChart = echarts.init(document.getElementById('brokeLine'))
var dateList = []
var valueListUv = []
var valueListPv = []

$(function() {
  $('#beginDate').datetimepicker({ format: 'Y-m-d', timepicker: false })
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
          show: true, //控制坐标轴x轴的文字是否显示
          textStyle: {
            color: '#666', //x轴上的字体颜色
            fontSize: '12' // x轴字体大小
          }
        },
        // x轴网格线
        splitLine: {
          show: true, // 网格线是否显示 // 改变样式
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
        splitLine: { show: false }
      }
    ],
    grid: {
      show: 'true'
      //  borderWidth: '0'//去掉右边线和上边线
    },
    series: [
      {
        name: 'PV',
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
        data: valueListPv
      },
      {
        name: 'UV',
        //设置折线折点颜色
        itemStyle: {
          normal: {
            // color: '#333399',
            //折线线条颜色
            lineStyle: {
              // color: '#333399'
            }
          }
        },
        type: 'line',
        showSymbol: false,
        // symbol: 'none', //设置拐点的圆圈没有 或者有用symbolSize: 0,
        data: valueListUv
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
        valueListPv = d.map(function(item) {
          return item['pv']
        })
        valueListUv = d.map(function(item) {
          return item['uv']
        })
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
