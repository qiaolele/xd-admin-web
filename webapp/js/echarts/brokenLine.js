/**
 * Created by qiaolele on 2016/11/17.
 */
var myChart = echarts.init(document.getElementById('brokeLine'))
data = [
  ['2000-06-05', 116],
  ['2000-06-06', 129],
  ['2000-06-07', 135],
  ['2000-06-08', 86],
  ['2000-06-09', 73],
  ['2000-06-10', 85],
  ['2000-06-11', 73],
  ['2000-06-12', 68],
  ['2000-06-13', 92],
  ['2000-06-14', 130],
  ['2000-06-15', 245],
  ['2000-06-16', 139],
  ['2000-06-17', 115],
  ['2000-06-18', 111],
  ['2000-06-19', 309],
  ['2000-06-20', 206],
  ['2000-06-21', 137],
  ['2000-06-22', 128],
  ['2000-06-23', 85],
  ['2000-06-24', 94],
  ['2000-06-25', 71],
  ['2000-06-26', 106],
  ['2000-06-27', 84],
  ['2000-06-28', 93],
  ['2000-06-29', 85],
  ['2000-06-30', 73],
  ['2000-07-01', 83],
  ['2000-07-02', 125],
  ['2000-07-03', 107],
  ['2000-07-04', 82],
  ['2000-07-05', 44],
  ['2000-07-06', 72],
  ['2000-07-07', 106],
  ['2000-07-08', 107],
  ['2000-07-09', 66],
  ['2000-07-10', 91],
  ['2000-07-11', 92],
  ['2000-07-12', 113],
  ['2000-07-13', 107],
  ['2000-07-14', 131],
  ['2000-07-15', 111],
  ['2000-07-16', 64],
  ['2000-07-17', 69],
  ['2000-07-18', 88],
  ['2000-07-19', 77],
  ['2000-07-20', 83],
  ['2000-07-21', 111],
  ['2000-07-22', 57],
  ['2000-07-23', 55],
  ['2000-07-24', 60]
]

var dateList = data.map(function(item) {
  return item[0]
})
var valueList = data.map(function(item) {
  return item[1]
})

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
      //设置折线折点颜色
      itemStyle: {
        normal: {
          color: '#f00',
          //折线线条颜色
          lineStyle: {
            color: '#f00'
          }
        }
      },
      type: 'line',
      showSymbol: false,
      // symbol: 'none',//设置拐点的圆圈没有 或者有用symbolSize: 0,
      data: valueList
    }
  ]
}
myChart.setOption(option)
window.onresize = function() {
  myChart.resize()
}
