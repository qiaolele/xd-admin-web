var Banner = new Object();
$(function () {
  Banner.regEvent();
  Banner.getQueryParam();
})
Banner.regEvent = function () {
  $('body').on('click', '.query', function () {
    Banner.getQueryParam();
  })
  $('body').on('click', '#myModal .imgWrap', function () {
    $('#fileload').click();
  })
  $('body').on('change', '#fileload', function () {//图片上传
    let $this = this;
    let type = $this.files[0].type;
    $.get('/admin/v1/ossUpload', {type: type}, function (data) {
      if (data.code === 200) {
        let datas = data.data;
        let file = $this.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);//安字节读取文件并存储至二进制缓存区
        reader.onload = function () {
          ossUpload(datas, file, function(data) {
            $('#myModal .imgWrap').html(`<img src="${data.data.name}">`);
            $('#myModal .imgWrap').attr('data-url', data.data.name);
          })
        }
      }
    })
  })
  $('body').on('change', '.modal .type', function () {
    if ($(this).val() === '1') {
      $('.proWrap').removeClass('hide');
      $('.proWrap span').html('产品ID');
    } else if ($(this).val() === '3') {
      $('.proWrap').removeClass('hide');
      $('.proWrap span').html('跳转链接');
    } else if ($(this).val() === '2') {
      $('.proWrap').removeClass('hide');
      $('.proWrap span').html('分类ID');
    } else {
      $('.proWrap').addClass('hide');
    }
    $('.proWrap input').val('');
  })
  $('body').on('click', '.addBtn', function () {
    $('#myModal h4').html('新增banner')
  })
  $('body').on('click', '.editBtn', function () {//编辑
    $('#myModal h4').html('编辑');
    let id = $(this).attr('data-id');
    $(".imgSize").html("尺寸：" + $(this).attr("data-size"))
    $('.affirmBtn').attr('data-id', $(this).attr('data-id'));
    $.get('/admin/v1/home/banner/queryone', {id: id}, function (data) {
      if (data.code === 200) {
        let d = data.data;
        $('#myModal').find('select').map(function () {
          $(this).val(d[$(this).attr('data-param')]);
          if (d.type === 1) {
            $('.proWrap').removeClass('hide');
            $('.proWrap span').html('产品ID');
          } else if (d.type === 3) {
            $('.proWrap').removeClass('hide');
            $('.proWrap span').html('跳转链接');
          } else if (d.type === 2) {
            $('.proWrap').removeClass('hide');
            $('.proWrap span').html('分类ID');
          } else {
            $('.proWrap').addClass('hide');
          }
        })
        $('#myModal').find('input:not(.hidden)').map(function () {
          $(this).val(d[$(this).attr('data-param')])
        })
        $('#myModal .imgWrap').html(`<img src="${d.imgUrl}"/>`);
        $('#myModal .imgWrap').attr('data-url', d.imgUrl);
        $('#myModal .status').html(`状态：${d.status === 1 ? '上架' : '下架'}`);
        $('#myModal .index').html(`序号：${d.orderIndex}`);
        $("#myModal").modal("show");
      }
    })
  })
  $('body').on('click', '#myModal .affirmBtn', function () {//确认添加/修改
    if (Banner.Verify() > 0) {
      return false;
    }
    let param = {};
    let input = $('#myModal').find('input:not(.hidden)');
    let select = $('#myModal').find('select');
    param.imgUrl = $('#myModal .imgWrap').attr('data-url');
    input.map(function () {
      param[$(this).attr('data-param')] = $(this).val()
    })
    select.map(function () {
      param[$(this).attr('data-param')] = $(this).val()
    })
    param.id = $(this).attr('data-id')
    let url = '';
    if ($('#myModal h4').html() === '新增banner') {
      url = '/admin/v1/home/banner/add';
    } else if ($('#myModal h4').html() === '编辑') {
      url = '/admin/v1/home/banner/edit';
    }
    $.get(url, param, function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: '成功',
          className: 'Banner'
        })
        $('#myModal').modal('hide');
        Banner.getQueryParam();
      } else {
        parent.modal.operModal({
          info: '失败',
          className: 'Banner'
        })
      }
    })
  })
  $('body').on('click', '.deleteBtn', function () {//删除
    $('.deleteConfirm').attr('data-id', $(this).attr('data-id'))
  })
  $('body').on('click', '.deleteConfirm', function () {
    let id = $(this).attr('data-id');
    $.get('/admin/v1/home/banner/delete', {id: id}, function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: '成功',
          className: 'Banner'
        })
        Banner.getQueryParam();
        $('#deleteModal').modal('hide')
      }
    })
  })
  $('body').on('click', '.statusBtn', function () {//上下架
    $(this).attr('data-status') === '1' ? $('#updateStatus h4 span').html('下架') : $('#updateStatus h4 span').html('上架');
    $('.updateStatusBtn').attr('data-status', $(this).attr('data-status'));
    $('.updateStatusBtn').attr('data-id', $(this).attr('data-id'));
  })
  $('body').on('click', '.updateStatusBtn', function () {//确认上下架
    let id = $(this).attr('data-id');
    let status = parseInt($(this).attr('data-status') === '1' ? '2' : '1')
    $.get('/admin/v1/home/banner/soldout', {id: id, status: status}, function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: '成功',
          className: 'Banner'
        })
        Banner.getQueryParam();
        $('#updateStatus').modal('hide')
      } else {
        parent.modal.operModal({
          info: '失败',
          className: 'Banner'
        })
      }
    })
  })
  $('body').on('click', '#iframe-content .saveBtn', function () {//排序
    let param = {}
    param.id = $(this).attr('data-id');
    param.orderIndex = $(this).siblings('.orderIndex').val();
    $.get('/admin/v1/home/banner/sort', {sort: JSON.stringify(param)}, function (data) {
      if (data.code === 200) {
        parent.modal.operModal({
          info: '成功',
          className: 'Banner'
        })
        Banner.getQueryParam();
      } else {
        parent.modal.operModal({
          info: '失败',
          className: 'Banner'
        })
      }
    })
  })
  $('#myModal').on('hidden.bs.modal', function () {
    let input = $('#myModal').find('input:not(.hidden)');
    let select = $('#myModal').find('select');
    input.map(function () {
      $(this).val('');
      $(this).removeClass('required-input');
    })
    select.map(function () {
      $(this).val('1');
    })
    $('#fileload').val('');
    $('#myModal .imgWrap').removeAttr('data-url');
    $('#myModal .imgWrap').html('+').removeClass('required-input');
    $('#myModal .status').html(`状态：下架`);
    $('.modal option[1]').prop('checked', true);
    $('.proWrap span').html('产品ID');
    $('#affirmBtn').removeAttr('data-id');
  })
}
Banner.getQueryParam = function () {//获取查询参数
  let params = {};
  let input = $('.panel-select').find('input');
  let select = $('.panel-select').find('select');
  input.map(function () {
    params[$(this).attr('data-param')] = $(this).val();
  })
  select.map(function () {
    params[$(this).attr('data-param')] = $(this).val();
  })
  parent.modal.loaders('block');
  $.get('/admin/v1/home/banner/query', params, function (data) {
    parent.modal.loaders();
    Banner.createTable(data)
  })
}
Banner.createTable = function (data) {
  let html = '';
  if (data.code === 200) {
    if (data.data.length > 0) {
      data.data.map(function (item, index) {
        html += ` <tr>
                <td>${index + 1}</td>
                <td>
                    <button class="btn statusBtn" data-id="${item.id}" data-status="${item.status}" data-toggle="modal" data-target="#updateStatus">
                        ${item.status === 1 ? '下架' : '上架'}
                    </button>
                    <button class="btn editBtn" data-size="${item.imgSize}" data-id="${item.id}">编辑</button>
                    <button class="btn deleteBtn" data-id="${item.id}" data-toggle="modal" data-target="#deleteModal">删除</button>
                </td>
                <td>
                    <input type="number" class="form-control orderIndex" value="${item.orderIndex}" style="display: inline-block;width: 60px;height: 34px;">
                    <button class="btn saveBtn" data-id="${item.id}">保存</button>
                </td>
                <td>
                    <img src="${item.imgUrl}" alt="暂无图片" style="width: 200px;height: 100px;">
                </td>
                <td>${item.name}</td>
                <td>${item.status === 1 ? '上架' : '下架'}</td>
                <td>${item.type === 1 ? '产品推荐' : (item.type === 2 ? '分类推荐' : (item.type === 3 ? '跳转链接' : '不可点击'))}</td>
                <td>${item.gmtCreated}</td>
                <td>${item.endTime}</td>
              </tr>`
      })
    } else {
      html += `<tr><td colspan="9">暂无数据</td><tr/>`
    }
  } else {
    html += `<tr><td colspan="9">暂无数据</td><tr/>`
  }
  $('.panel-table tbody').html(html)
}
Banner.Verify = function () {
  let num = 0;
  $('.otherModal').find('.verify:not(.hide) input').map(function () {
    if ($(this).val() === '') {
      num++;
      $(this).addClass('required-input');
    }
  })
  if (!$('.imgWrap').attr('data-url')) {
    num++;
    $('.imgWrap').addClass('required-input');
  }
  return num
}
