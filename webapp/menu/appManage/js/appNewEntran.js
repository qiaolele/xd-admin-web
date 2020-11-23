const type = window.location.pathname.indexOf('appNewEntran') > 0 ? 1 : 0
var AppNewEntran = new Object()
$(function() {
  AppNewEntran.regEvent()
  AppNewEntran.query()
})
AppNewEntran.regEvent = function() {
  //添加认证列表
  //保存弹窗
  $('body').on('click', '#editProduct .modal-footer .btn-default', event => {
    if (AppNewEntran.verifyPack() > 0) {
      return false
    }
    if (!$('.fileUpload1').attr('url')) {
      $('.fileUpload1').addClass('required-input')
      return false
    } else {
      $('.fileUpload1').removeClass('required-input')
    }
    AppNewEntran.upDateDetail()
  })
  $('body').on('click', '.addAuthModal', function() {
    $('#editProduct')
      .attr('data-type', 1)
      .modal('show')
  })
  $('body').on('click', '.editAuthModal', event => {
    let id = event.target.dataset.id
    AppNewEntran.getAuthDetail(id)
    $('#editProduct')
      .attr('data-type', 1)
      .modal('show')
  })
  $('#editProduct').on('hidden.bs.modal', function() {
    //主页模态框隐藏
    // num = 0 //初始化
    let input = $('#editProduct').find('input[data-param]')
    let select = $('#editProduct').find('select')
    input.map(function() {
      $(this).val('')
    })
    select.map(function() {
      $(this).val(
        $(this)
          .find('option:eq(0)')
          .val()
      )
    })
    $('#editProduct input').removeClass('required-input')
    $('.fileUpload1').removeAttr('url')
    $('.fileUpload1').html('点击上传')
    $('#editProduct').removeAttr('data-id')
  })
  // $('#editProduct').on('show.bs.modal', function() {
  //   productTypeQuery(info =>
  //     $('.selectWrap select[data-param=typeId]').html(info)
  //   )
  // })
  // 上传小图标
  $('body').on('click', '.fileUpload1', function() {
    $(this)
      .parent()
      .find('input')
      .trigger('click')
  })
  $('.file1').change(function() {
    const target = $(this).attr('data-target')
    AppNewEntran.uploadFile(this)
  })
  //删除配置
  $('body').on('click', '.delete', event => {
    $(event.target)
      .parents('tr')
      .remove()
    AppNewEntran.calculation()
  })

  const $item = 'table .query-item:not(.hide) .notEmpty'

  // $('body').on('click', '.confirm', () => {
  //   let $file = $('table .query-item:not(.hide) .fileUpload'),
  //     flag = 0
  //   AppNewEntran.flag = 0
  //   $($item).trigger('blur')

  //   $file.each(function() {
  //     if ($(this).attr('url')) {
  //       $(this).removeClass('required-input')
  //     } else {
  //       $(this).addClass('required-input')
  //       flag++
  //     }
  //   })
  //   if ($($item).length === AppNewEntran.flag && flag === 0)  = AppNewEntran.getParams()
  // })
  $('body').on('blur', $item, function() {
    $(this).timeOutPlugin(
      { type: 'verify' },
      event => (AppNewEntran.flag += event.isVerify())
    )
  })
}
AppNewEntran.getAuthDetail = function(id) {
  parent.modal.loaders('block')
  $.get('/admin/v1/newRecommend/getInfo', { id: id }, function(data) {
    parent.modal.loaders()
    if (data.code === 200) {
      $('#editProduct').attr('data-id', data.data.id)
      $('#editProduct .genre')
        .val(data.data.genre)
        .prop('selected', true)
      $('#editProduct .fileUpload1')
        .attr('url', data.data.iconUrl)
        .html(`<img src='${data.data.iconUrl}'>`)
      $('.form .name').val(data.data.name)
      $('.form .pageUrl').val(data.data.pageUrl)
    }
  })
}
AppNewEntran.upDateDetail = function() {
  let params = {}
  params.id = $('#editProduct').attr('data-id')
    ? $('#editProduct').attr('data-id')
    : ''
  params.type = type
  params.name = $('.form .name').val()
  params.genre = $('.genre').val()
  params.pageUrl = $('.form .pageUrl').val()
  params.iconUrl = $('.fileUpload1 img').attr('src')

  $.post('/admin/v1/newRecommend/update', params, function(data) {
    parent.modal.loaders()
    if (data.code === 200) {
      parent.modal.operModal({
        info: '保存成功',
        className: 'H5Product'
      })
      AppNewEntran.query()
    } else {
      parent.modal.operModal({
        info: data.message,
        className: 'H5Product'
      })
    }
  })
}
AppNewEntran.verifyPack = function() {
  let num = 0
  $('#editProduct')
    .find('.verify')
    .map(function() {
      if ($(this).val() === '') {
        $(this).addClass('required-input')
        num++
      } else {
        $(this).removeClass('required-input')
      }
    })
  return num
}
AppNewEntran.query = function() {
  parent.modal.loaders('block')
  $.get('/admin/v1/recommend/query', { type }, info => {
    parent.modal.loaders()
    const { code, data } = info
    if (code === 200) {
      let html = ''
      data.map((item, idx) => {
        html += `<tr class="query-item">
                  <td>${idx + 1}</td>
                  <td>
                          <img src='${item.iconUrl}' width="80"/>
                  </td>
                  <td>${item.name || ''}
                  </td>
                  <td>${AppNewEntran.changeStatus(item.genre)}
                  </td>
                  <td>${item.pageUrl}
                  </td>
                  <td><button class="btn editAuthModal" data-id="${
                    item.id
                  }">编辑</button></td>
              </tr>`
      })
      $('.panel-table table tbody').html(html)
    }
  }).error(err => {
    console.error(err)
  })
}
AppNewEntran.changeStatus = function(val) {
  if (val == 1) {
    return '产品推荐'
  } else if (val == 2) {
    return '分类推荐'
  } else if (val == 3) {
    return '跳转链接'
  }
}
//上传图片
AppNewEntran.uploadFile = function(files) {
  let type = files.files[0].type
  $.get('/admin/v1/ossUpload', { type: type }, function(data) {
    if (data.code === 200) {
      let datas = data.data
      let file = files.files[0]
      let reader = new FileReader()
      reader.readAsArrayBuffer(file) //安字节读取文件并存储至二进制缓存区
      reader.onload = function() {
        ossUpload(datas, file, function(data) {
          $('.fileUpload1')
            .attr('url', data.data.name)
            .html(`<img src='${data.data.name}'>`)
        })
      }
    }
  })
}
AppNewEntran.calculation = function() {
  const length = $('.panel-table tbody tr').length
  $('.panel-table tbody tr').each(function(index) {
    if (length <= 3 && index <= 2) {
      $(this)
        .find('.delete')
        .addClass('hide')
    } else {
      $(this)
        .find('.delete')
        .removeClass('hide')
    }
    $(this)
      .find('td:nth-child(2)')
      .html(index + 1)
  })
}
AppNewEntran.getParams = function() {
  const list = new Array()
  $('.panel-table tbody tr').each(function() {
    const param = new Object()
    $(this)
      .find('.form-control')
      .each(function() {
        if ($(this).val().length > 0 && $(this).attr('data-param'))
          param[$(this).attr('data-param')] = $(this).val()
      })
    param.iconUrl = $(this)
      .find('.fileUpload')
      .attr('url')
    list.push(JSON.stringify(param))
  })
  AppNewEntran.update({ type, json: `[${list.toString()}]` })
}
AppNewEntran.update = function(param) {
  $.get('/admin/v1/recommend/update', param, info => {
    parent.modal.operModal({
      info: info.message,
      className: 'deletepage'
    })
  })
}
