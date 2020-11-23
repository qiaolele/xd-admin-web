const AppNewList = new Object(),
  userId = Cookie.get('userId')

AppNewList.regEvent = function() {
  $('body').on('click', '.check', function() {
    AppNewList.getParams()
  })
  //选择产品
  $('body').on('click', '.transfer-left .transfer-item', function(e) {
    e.preventDefault()
    const $this = $(this),
      $right = $('.transfer-right'),
      $checbox = $this.find('input'),
      dataId = $this.attr('data-id'),
      $rightList = $right.find('.transfer-list'),
      $hideItem = $rightList.find('.query-item.hide')
    if ($checbox.is(':checked')) {
      $rightList.find(`.query-item[data-id=${dataId}]`).remove()
    } else {
      const $item = $hideItem.clone().removeClass('hide'),
        data = AppNewList.productData.filter(
          item => item.id === parseInt(dataId)
        )[0]
      $item.find('.col-xs-2').each(function() {
        const type = $(this).attr('data-param')
        if (type && data[type]) $(this).html(data[type])
      })
      $hideItem.before($item.attr('data-id', dataId))
    }
    $right
      .find('.transfer-title span')
      .html($right.find('.query-item:not(.hide)').length)
    AppNewList.calculation()
    $checbox.trigger('click')
  })
  //防止冒泡
  $('body').on('click', '.transfer-left .transfer-item input', function(e) {
    e.stopPropagation()
  })
  //删除产品
  $('body').on(
    'click',
    '.transfer-right .transfer-item .glyphicon-remove',
    function() {
      $('body').on(
        'click',
        '.transfer-right .transfer-item .glyphicon-remove',
        function() {
          const $item = $(this).parents('.transfer-item'),
            dataId = $item.attr('data-id'),
            $left = $('.transfer-left').find(
              `.transfer-item[data-id=${dataId}]`
            )
          if ($left.length > 0) {
            $('.transfer-left')
              .find(`.transfer-item[data-id=${dataId}]`)
              .trigger('click')
          } else {
            $item.remove()
            $('.transfer-right')
              .find('.transfer-title span')
              .html($('.transfer-right').find('.query-item:not(.hide)').length)
          }
        }
      )
    }
  )
  //排序
  $('body').on('click', '.transfer-right .btn-rest', function() {
    const list = new Array(),
      $item = $('.transfer-right .transfer-item:not(.hide)')
    $item.each(function() {
      let targetIndex = parseInt(
          $(this)
            .find('.form-control')
            .val()
        ),
        currentIndex = parseInt($(this).attr('data-index')),
        length = $('.transfer-right').find('.transfer-item:not(.hide)').length
      if (targetIndex > length) targetIndex = length
      if (targetIndex <= 0) targetIndex = 1
      const $target = $('.transfer-right .transfer-item:not(.hide)')[
        targetIndex - 1
      ]
      if (currentIndex < targetIndex) {
        $target.after($(this).context)
      } else if (currentIndex > targetIndex) {
        $target.before($(this).context)
      }
    })
    AppNewList.calculation()
  })
  //编辑产品
  $('body').on('click', '.editProduct', function() {
    const { id, name } = JSON.parse(
      $(this)
        .parents('tr')
        .attr('data-info')
    )
    $('#transferMoadal')
      .modal('show')
      .attr('data-id', id)
    $('#transferMoadal .form-inline .form-control').val(name)
    $.get('/admin/v1/scene/manager/getproductlist', { id }, function(info) {
      const { code, data } = info
      if (code === 200) {
        data.map(item => {
          const $hideItem = $(
              '.transfer-right .transfer-list .transfer-item.hide'
            ),
            $item = $hideItem.clone().removeClass('hide')
          $item.find('.col-xs-2').each(function() {
            const type = $(this).attr('data-param')
            if (type && item[type]) $(this).html(item[type])
          })
          $hideItem.before($item.attr('data-id', item.id))
          $('.transfer-left .transfer-list')
            .find(`.transfer-item[data-id=${item.id}]`)
            .find('input')
            .prop('checked', true)
          $item.find('.AndIndex').val(item.orderIndex)
          $item.find('.IosIndex').val(item.orderIndexIos)
          // $(".transfer-left .transfer-list").find(`.transfer-item[data-id=${item.id}]`).find("input").prop("checked", true);
        })
        // AppNewList.calculation();
        $('.transfer-right')
          .find('.transfer-title span')
          .html(data.length)
      }
    })
  })
  $('body').on('click', '.transfer-check input', function() {
    parent.modal.loaders('block')
    AppNewList.getproductlist()
  })
  $('body').on(
    'input propertychange',
    '.transfer-search .form-control',
    function() {
      AppNewList.getproductlist()
    }
  )
  $('body').on(
    'click',
    '#transferMoadal .modal-footer .btn-default',
    function() {
      $('.transfer-right .btn-rest').trigger('click')
      AppNewList.getAddOrEditParams()
    }
  )
  //删除
  $('body').on('click', '.delete', function() {
    const { id, name } = JSON.parse(
      $(this)
        .parents('tr')
        .attr('data-info')
    )
    parent.modal.alertModal({
      title: '提示',
      info: '确定删除吗？',
      className: 'apploanlist'
    })
    $('#operModal', parent.window.document).attr('data-id', id)
  })
  $(parent.window.document).on(
    'click',
    '#operModal.apploanlist .modal-footer .btn:eq(1)',
    function() {
      AppNewList.deletepage({
        id: $(this)
          .parents('#operModal')
          .attr('data-id'),
        userId
      })
    }
  )

  $('#transferMoadal').on('show.bs.modal', function() {
    AppNewList.getproductlist()
  })
  $('#transferMoadal').on('hidden.bs.modal', function() {
    $('.transfer-right')
      .find('.transfer-item:not(.hide)')
      .remove()
    $('#transferMoadal')
      .find('.form-control')
      .val('')
    $('#transferMoadal').removeAttr('data-id')
    $('.transfer-title div span').html(0)
  })

  $('body')
    .on('mouseover', '.w4', function() {
      $(this).popover('show')
    })
    .on('mouseleave', '.w4', function() {
      $(this).popover('hide')
    })
}
//计算位置
AppNewList.calculation = function() {
  $('.transfer-right .transfer-item:not(.hide)').each(function(index) {
    $(this)
      .find('.form-control')
      .val(index + 1)
    $(this).attr('data-index', index + 1)
  })
}
AppNewList.getParams = function(page) {
  parent.modal.loaders('block')
  const params = new Object()
  $('#iframe-content .form-control').each(function() {
    if ($(this).val().length > 0)
      params[$(this).attr('data-param')] = $(this).val()
  })
  params.page = page || 1
  params.rows = 25
  AppNewList.query(params)
}
AppNewList.query = function(param) {
  $.get('/admin/v1/appnewopening/query', param, info => {
    AppNewList.createTable(info.data)
    initPage(info.data.total, param, AppNewList)
  })
}
AppNewList.createTable = function(info) {
  const data = info.data
  parent.modal.loaders()
  var html = '<tr><td colspan="8">暂无数据</td></tr>'
  if (data && data.length > 0) {
    html = ''
    data.map(item => {
      html += `<tr data-info='${JSON.stringify(item)}'>
                <td style="text-align: left">
                  <button class="btn btn-rest editProduct">编辑</button>
                  ${
                    item.isDefault
                      ? ''
                      : `<button class="btn btn-rest delete">删除</button>`
                  }
                </td>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.productCount}</td>
                <td>
                    <div class="w4" data-container="body" data-toggle="popover" data-placement="top" data-content="${item.productNames.join(
                      ','
                    )}">
                       ${item.productNames.join(',')}
                    </div>
                </td>
                <td>${item.sceneNum}</td>
                <td>${item.gmtModified}</td>
           </tr>`
    })
  }
  $('#iframe-content .panel-table table tbody').html(html)
}
//新增、修改
AppNewList.addandupdate = function(param) {
  $.post('/admin/v1/appnewopening/addandupdate', param, function(info) {
    parent.modal.operModal({
      info: info.message,
      className: 'addandupdate'
    })
    AppNewList.getParams()
  })
}
//获取新增、修改参数
AppNewList.getAddOrEditParams = function() {
  const json = {}
  const list = new Array(),
    param = {
      userId,
      name: $('#transferMoadal .form-inline .form-control').val()
    },
    id = $('#transferMoadal').attr('data-id')
  $('.transfer-right .transfer-list .transfer-item:not(.hide)').each(
    function() {
      let AndIndex = $(this)
        .find('.AndIndex')
        .val()
      let IosIndex = $(this)
        .find('.IosIndex')
        .val()
      json[$(this).attr('data-id')] = AndIndex + ',' + IosIndex
      list.push($(this).attr('data-id'))
    }
  )
  console.log(json)
  param.productOrder = JSON.stringify(json)
  if (param.name.length <= 0 || list.length <= 0) return
  if (id) param.id = id
  AppNewList.addandupdate(param)
}
//获取产品列表
AppNewList.getproductlist = function() {
  let param = {
    type: $('.transfer-check')
      .find('.radio-inline input:checked')
      .val(),
    status: $('.transfer-check')
      .find('.checkbox-inline input')
      .is(':checked')
      ? 3
      : 2,
    keyWord: $('.transfer-search .form-control').val()
  }
  $.get('/admin/v1/scene/manager/getproductlist', param, function(info) {
    parent.modal.loaders()
    const { code, data } = info
    if (code === 200) {
      let html = ''
      AppNewList.productData = data
      data.map(item => {
        html += ` <li class="transfer-item row" data-id="${item.id}">
                      <div class="col-xs-4">
                        <label class="checkbox-inline">
                            <input type="checkbox" name='authlist'>
                            <label class="checkbox-beauty"></label>
                            <span>${item.name}</span>
                         </label>
                      </div>
                      <div class="col-xs-4 remaining">${item.type}</div>
                      <div class="col-xs-3 remaining">${item.status}</div>
                  </li>`
      })
      $('.transfer-left .transfer-list').html(html)
      const list = new Array()
      $('.transfer-right .transfer-list .transfer-item:not(.hide)').each(
        function() {
          list.push($(this).attr('data-id'))
        }
      )
      list.map(item => {
        $('.transfer-left .transfer-list')
          .find(`.transfer-item[data-id=${item}]`)
          .find('input')
          .prop('checked', true)
      })
    }
  })
}
//删除产品
AppNewList.deletepage = function(param) {
  $.post('/admin/v1/apploanlist/deletepage', param, info => {
    parent.modal.operModal({
      info: info.data,
      className: 'deletepage'
    })
    AppNewList.getParams()
  })
}
$(function() {
  AppNewList.regEvent()
  AppNewList.getParams()
})
