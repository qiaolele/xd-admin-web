$(function() {
  $('body')
    .find('script:first')
    .after(`<script src="../../js/timeOut.js"></script>`)
  $('body')
    .find('script:first')
    .after(`<script src="../../js/babel.js"></script>`)
  $('body')
    .find('input')
    .attr('autocomplete', 'off')
  initDateTime()
  initDatePicker()
  $('body').on('click', '.glyphicon-th', function() {
    initDatePicker(
      $(this)
        .parent('.input-group-addon')
        .siblings('.form-control')
        .attr('id')
    )
  })
  $('body').on('click', '.glyphicon-remove', function() {
    //清除所选时间
    $(this)
      .parent('.input-group-addon')
      .siblings('.form-control')
      .val('')
    initDatePicker(
      $(this)
        .parent('.input-group-addon')
        .siblings('.form-control')
        .attr('id')
    )
  })
  $('body').timeOutPlugin()
})

//时间初始化
function initDateTime() {
  $('.panel-body .form_datetime input').each(function() {
    let $this = $(this)
    if ($this.attr('data-time') === 'start') {
      let startDays = $this.attr('data-days')
      $this.val(initDateTimeFormat(1, parseInt(startDays)))
    } else if ($this.attr('data-time') === 'end') {
      let endDays = $this.attr('data-days')
      $this.val(initDateTimeFormat(2, parseInt(endDays)))
    }
  })
}

function initDateTimeFormat(index, days) {
  let date = new Date()
  if (days) {
    date.setDate(date.getDate() - days)
  }
  let month = date.getMonth() + 1
  month = month.toString().length === 1 ? '0' + month.toString() : month
  let strDate = date.getDate()
  strDate = strDate.toString().length === 1 ? '0' + strDate.toString() : strDate
  let hour =
    date.getHours().toString().length === 1
      ? '0' + date.getHours()
      : date.getHours()
  let min =
    date.getMinutes().toString().length === 1
      ? '0' + date.getMinutes()
      : date.getMinutes()
  let sec =
    date.getSeconds().toString().length === 1
      ? '0' + date.getSeconds()
      : date.getSeconds()
  if (index === 1 && !days) strDate = 1
  let currentdate = date.getFullYear() + '-' + month + '-' + strDate
  return currentdate
}

/***
 *
 * date：当前时间
 * days：天数
 * Operator：+/- 需要增加或者减去的天数
 * type:
 * **/
function dateFormat(date, days, Operator, type) {
  //时间格式化：2017-9-15 10:28:38
  if (Operator === '+') {
    date.setDate(date.getDate() + days)
  } else if (Operator === '-') {
    date.setDate(date.getDate() - days)
  } else {
    date.setDate(date.getDate())
  }
  let month = date.getMonth() + 1
  month = month.toString().length === 1 ? '0' + month.toString() : month
  let strDate = date.getDate()
  strDate = strDate.toString().length === 1 ? '0' + strDate.toString() : strDate
  let hour =
    date.getHours().toString().length === 1
      ? '0' + date.getHours()
      : date.getHours()
  let min =
    date.getMinutes().toString().length === 1
      ? '0' + date.getMinutes()
      : date.getMinutes()
  let sec =
    date.getSeconds().toString().length === 1
      ? '0' + date.getSeconds()
      : date.getSeconds()
  let time = ''
  if (type === 1) {
    //默认显示00:00:00
    time = ' 00:00:00'
  } else if (type === 0) {
    //默认显示23:59:59 需求更改为00:00:00
    time = ' 00:00:00'
  } else if (type === 2) {
    time = '' //只显示到日期
  } else {
    time = ` ${hour}:${min}:${sec}` //当前时间
  }
  let currentdate = date.getFullYear() + '-' + month + '-' + strDate + time
  return currentdate
}

/*******
 * @param total:数据总条数
 * @param param:搜索条件
 * @param el:当前JS文件定义的Object
 * ********/
function initPage(total, param, el, $el, type) {
  let count = Math.ceil(total / param.rows),
    $e = $el || ''
  if (count <= 1) {
    $(`${$e} .pagination`).hide()
  } else {
    $(`${$e} .pagination`).show()
  }
  $(`${$e} .pagination`).pagination({
    pageCount: count,
    totalData: total,
    jump: true,
    coping: true,
    current: param.page,
    callback: function(api) {
      param.page = api.getCurrent()
      if ($el) {
        el[type](param)
      } else {
        el.getParams(api.getCurrent())
      }
    }
  })
}

function initDatePicker(id) {
  if (id) {
    $('#' + id).trigger('focus')
  } else {
    $('.form_datetime .form-control').each(function() {
      let $this = $(this)
      $this.attr('placeholder', '请选择')
      let id = $this.attr('id')
      let format = 'Y-m-d H:00:00'
      let timepicker = true
      if (id) {
        if (id.indexOf('stats') !== -1) {
          format = 'Y-m-d'
          timepicker = false
        }
        if (id.indexOf('TimeColl') !== -1) {
          format = 'Y-m-d'
          timepicker = false
        }
      }
      $this.datetimepicker({
        format: format,
        formatTime: 'H:i',
        timepicker: timepicker
      })
      $.datetimepicker.setLocale('ch')
    })
  }
}

function exportData(url, param) {
  delete param.page
  delete param.rows
  let arr = new Array()
  Object.keys(param).map(function(key, index) {
    console.log(param)
    arr.push(`${key}=${param[key]}`)
  })
  window.open(url + '?' + arr.join('&'))
}

function imgGallery(gallery) {
  let $blueimp = `<div class="blueimp-gallery" style="display: none" id="blueimp-image-carousel">
    <div class="slides"></div>
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    </div>`
  $('body')
    .find('.imggallery')
    .html($blueimp)
  $('#blueimp-image-carousel').addClass(
    'blueimp-gallery-display blueimp-gallery-left'
  )
  blueimp.Gallery(gallery, {
    container: '#blueimp-image-carousel',
    carousel: true
  })
}

/**
 * @param id：如果是修改，去除当前ID
 * @param loginName：用户登录名
 * @param el:需要提示的元素
 */
function VerifyUserName(id, loginName, el) {
  $.get(
    '/loan/userManage/judgeLoginName',
    {
      id: id || '',
      loginName: loginName
    },
    function(data) {
      if (data.code === 14) {
        el.parent()
          .siblings()
          .addClass('error')
        el.html(data.codeMessage).addClass('visible')
      }
    }
  )
}

function copyTextToClipboard(text, $el) {
  //复制
  $el.append(`<input class="execCommand" type="text" value=${text}>`)
  $el.find('.execCommand').select()
  try {
    var msg = document.execCommand('copy') ? '复制成功' : '复制失败'
  } catch (err) {}
  $('.copy-url').tooltip('show')
  $('.execCommand').remove()
}

// function ossUpload(obj) {//阿里云图片上传ajax
//   obj.host = obj.host;
//   obj.result = obj.result;
//   obj.success = obj.success;
//   let request = new XMLHttpRequest();
//   request.onreadystatechange = function () {
//     if (request.readyState == 4 && request.status == 200) {
//       obj.success(request.responseText);
//     }
//   }
//   request.open('PUT', obj.host);//host是阿里云返回的图片存储地址，即你要请求的地址
//   request.setRequestHeader('Content-Type', 'application/octet-stream');
//   request.send(obj.result);
// }

// oss图片上传
function ossUpload(data, file, callback) {
  let uploadUrl = data.url
  let param = data.param
  let formData = new FormData()
  formData.append('OSSAccessKeyId', param.OSSAccessKeyId)
  formData.append('Signature', param.Signature)
  formData.append('callback', param.callback)
  formData.append('key', param.key)
  formData.append('policy', param.policy)
  formData.append('Content-Type', param['Content-Type'])
  formData.append('file', file)
  let request = new XMLHttpRequest()
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      callback(JSON.parse(request.responseText))
    }
  }
  request.open('POST', uploadUrl) //uploadUrl是阿里云返回的图片存储地址，即你要请求的地址
  request.send(formData)
}

function productTypeQuery(cb) {
  $.get('/admin/v1/product/producttype/query', info => {
    let { code, data } = info,
      html = ''
    if (code === 200) {
      data.map(item => {
        html += `<option value="${item.option}">${item.name}</option>`
      })
    } else {
      html += `<option value="false" selected>暂无数据</option>`
    }
    cb(html)
  }).error(err => {
    cb(`<option value="false" selected>暂无数据</option>`)
  })
}
