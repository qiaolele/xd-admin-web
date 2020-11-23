var OtherAds = new Object();
$(function () {
  OtherAds.getQueryParam();
  OtherAds.regEvent();
})
OtherAds.regEvent = function () {
  $('body').on('click', '.editBtn', function () {
    parent.modal.loaders("block");
    $(".imgSize").html("尺寸：" + $(this).attr("data-size"))
    $.get('/admin/v1/commercial/query', {id: $(this).attr('data-id')}, function (data) {
      parent.modal.loaders();
      if (data.code === 200) {
        let d = data.data[0];
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
        $('#myModal .pageUrl').val(d.pageUrl);
        $('#myModal select').val(d.type);
        $('#myModal .imgWrap').html(`<img src="${d.imgUrl}"/>`);
        $('.imgWrap').attr('data-url', d.imgUrl);
        $('#myModal .name').html(d.positionName);
        $('.affirmBtn').attr('data-id', d.id);
        $("#myModal").modal("show");
      }
    })
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
            $('#myModal .imgWrap').html(`<img src="${data.data.name}"/>`);
            $('.imgWrap').attr('data-url', data.data.name);
          })
        }
      }
    })
  })
  $('body').on('click', '.affirmBtn', function () {
    if ($('.proWrap').hasClass('hide') === false && $('.proWrap input').val() === '') {
      $('.proWrap input').addClass('required-input');
      return false;
    }
    let params = {};
    params.id = $(this).attr('data-id');
    params.type = $('#myModal select').val();
    params.pageUrl = $('#myModal .pageUrl').val();
    params.imgUrl = $('#myModal .imgWrap').attr('data-url');
    parent.modal.loaders("block");
    $.get('/admin/v1/commercial/edit', params, function (data) {
      parent.modal.loaders();
      if (data.code === 200) {
        parent.modal.operModal({
          info: data.message,
          className: 'Banner'
        })
        $('#myModal').modal('hide');
        OtherAds.getQueryParam();
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
  $('body').on('click', '.statusBtn', function () {
    $('.updateStatusBtn').attr({'data-id': $(this).attr('data-id'), 'data-status': $(this).attr('data-status')});
    let html = $(this).attr('data-status') === '1' ? '禁用' : '启用';
    $('#updateStatus h4 span').html(html);
  })
  $('body').on('click', '.updateStatusBtn', function () {
    let id = $(this).attr('data-id');
    let status = parseInt($(this).attr('data-status') === '1' ? '2' : '1');
    parent.modal.loaders("block");
    $.get('/admin/v1/commercial/updatestatus', {id: id, status: status}, function (data) {
      parent.modal.loaders();
      parent.modal.operModal({
        info: data.message,
        className: 'Banner'
      })
      OtherAds.getQueryParam();
      $('#updateStatus').modal('hide');
    })
  })
  $('#myModal').on('hidden.bs.modal', function () {//主页模态框隐藏
    $('#myModal .name').html('');
    $('#myModal .imgWrap').html('+');
    $('#myModal .imgWrap').removeAttr('data-url');
    $('.proWrap input').removeClass('required-input');
  })
}
OtherAds.getQueryParam = function () {
  parent.modal.loaders("block");
  $.get('/admin/v1/commercial/query', function (data) {
    parent.modal.loaders();
    let html = '';
    let d = data.data;
    if (data.code === 200) {
      d.map(function (item, index) {
        html += ` <tr>
                    <td>${index + 1}</td>
                    <td>
                        <button class="btn editBtn" data-size="${item.imgSize}" data-id="${item.id}">编辑</button>
                        <button class="btn statusBtn" data-id="${item.id}" data-status="${item.status}" data-toggle="modal" data-target="#updateStatus" >
                            ${item.status === 1 ? '禁用' : '启用'}</button>
                    </td>
                    <td>
                        <img src="${item.imgUrl}" class="imgStyle" style="width:auto;height: 100px;">
                    </td>
                    <td>${item.name}</td>
                    <td>${item.type === 1 ? '产品推荐' : (item.type === 2 ? '分类推荐' : (item.type === 3 ? '跳转链接' : '不可点击'))}</td>
                    <td>${item.gmtModified}</td>
                </tr>`
      })
    } else {
      html += `<tr><td colspan="6">暂无数据</td></tr>`
    }
    $('#iframe-content tbody').html(html)
  })
}











