var sdkAdvert = new Object()
$(function() {
  sdkAdvert.regEvent()
  sdkAdvert.query()
})
sdkAdvert.regEvent = function() {
  $('body').on('click', '.edit', function() {
    let param = {}
    $('.form-control').each(function() {
      param[$(this).attr('data-param')] = $(this).val()
    })
    sdkAdvert.submit(param)
  })
}
sdkAdvert.query = function(param) {
  parent.modal.loaders('block')
  $.get('/admin/v1/sdkadv', {}, function(data) {
    parent.modal.loaders()
    if (data.code === 200) {
      $('.showFrequency').val(data.data.showFrequency)
      $('.displayForm').val(data.data.displayForm)
      $('.listShow').val(data.data.listShow)
      $('.startShow').val(data.data.startShow)
    } else {
      parent.modal.operModal({
        info: data.message,
        className: 'H5Product'
      })
    }
  })
}

sdkAdvert.submit = function(param) {
  $.ajax({
    url: '/admin/v1/sdkadv',
    type: 'put',
    dataType: 'json',
    data: param,
    success: function(data) {
      parent.modal.loaders()
      if (data.code === 200) {
        parent.modal.operModal({
          info: '修改成功',
          className: 'H5Product'
        })
      } else {
        parent.modal.operModal({
          info: data.message,
          className: 'H5Product'
        })
      }
    }
  })
}
