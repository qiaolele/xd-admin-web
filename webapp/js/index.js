var Index = new Object()
var cookieName = Cookie.get('loginName')
var cookiePwd = Cookie.get('password')
var menuList = localStorage.getItem('menuList')
  ? JSON.parse(localStorage.getItem('menuList'))
  : ''
var user = Cookie.get('user') ? JSON.parse(Cookie.get('user')) : ''
$(function() {
  // Index.getIcon()
  if (!cookieName || !user || !cookiePwd || !menuList) {
    location.href = 'login.html'
  }
  Index.regEvent()
  Index.login()
})

Index.regEvent = function() {
  $('body').timeOutPlugin()
  $('body').on('click', '#btn-right', function() {
    //退出
    Cookie.delAll()
    localStorage.removeItem('menuList')
    window.location.href = 'login.html'
  })
  //左侧列表隐藏
  $('#btn-left').on('click', function() {
    $('body').toggleClass('hide-menu')
  })

  //左侧下拉菜单
  $('#menu-group').on('click', '.menu-dt', function() {
    $('#firstPage').removeClass('active')
    $(this)
      .parent()
      .toggleClass('menu-group-list-active')
    $(this)
      .parent()
      .siblings()
      .removeClass('menu-group-list-active')
    $('#menu-group')
      .find('.menu-group-list .menu-dt')
      .removeClass('active')
    $(this).addClass('active')

    $('#menu-group')
      .find('.list-group .list-group-item')
      .removeClass('active')
    $(this)
      .siblings('.list-group')
      .find('.list-group-item')
      .addClass('active')
  })

  //左侧对应iframe
  $('#menu-group').on('click', '.menu-dd', function() {
    if ($(this).attr('id') === 'firstPage')
      $('.menu-group-list .menu-dt').removeClass('active')
    $('.menu-dd').removeClass('active')
    $(this).addClass('active')
    var id = $(this).attr('data-id')
    $('#nav-tabs li').removeClass('active')
    $('#tab-content .tab-pane').removeClass('active')

    if ($('#nava' + id).length) {
      $('#nava' + id).addClass('active')
      $('#navc' + id).addClass('active')
      $('#nav-tabs li[data-id=' + id + ']').trigger('click')
      return false
    }

    var txt = $(this).html()
    if (txt == '主页') {
      var close = ''
    } else {
      var close = '<span class="nav-close glyphicon"></span>'
    }

    var li =
      '<li id="nava' +
      id +
      '" data-id="' +
      id +
      '" class="active"><a href="#navc' +
      id +
      '" data-toggle="tab">' +
      txt +
      '</a>' +
      close +
      '</li>'
    $('#nav-tabs').append(li)

    var pane = '<div class="tab-pane active" id="navc' + id + '"></div>'
    $('#tab-content').append(pane)

    var iframe = document.createElement('iframe')
    iframe.id = 'iframe' + id
    $(iframe).addClass('iframe')
    $(iframe).attr('src', 'menu' + $(this).attr('data-href') + '.html')
    $('#navc' + id).append(iframe)
    $('#nav-tabs li[data-id=' + id + ']').trigger('click')
  })

  $('#wrapper .glyphicon-chevron-right').on('click', function() {
    var boxW = $('#navbar').width()
    var leftW = $('#navbar .nav-tabs').position().left
    var $li = $('#navbar .nav-tabs li')
    var len = $li.length
    var maxW = 0
    var minW = 0

    for (var i = 0; i < len; i++) {
      maxW += $li.eq(i).width()

      if (maxW > -leftW) {
        minW += $li.eq(i).width()
        if (minW > boxW) {
          minW -= $li.eq(i).width()
          break
        }
      }
    }

    maxW = 0
    for (var i = 0; i < len; i++) {
      maxW += $li.eq(i).width()
      if (maxW + leftW > boxW) {
        $('#navbar .nav-tabs').animate(
          {
            right: leftW - minW
          },
          200
        )
        break
      }
    }
  })

  $('#wrapper .glyphicon-chevron-left').on('click', function() {
    var boxW = $('#navbar').width()
    var leftW = $('#navbar .nav-tabs').position().left

    if (leftW < 0) {
      if (-leftW > boxW) {
        $('#navbar .nav-tabs').animate(
          {
            left: leftW + boxW
          },
          200
        )
      } else {
        $('#navbar .nav-tabs').animate(
          {
            left: 0
          },
          200
        )
      }
    }
  })

  $('#nav-tabs').on('click', 'li', function() {
    var boxW = $('#navbar').width()
    var boxL = $('#nav-tabs').position().left
    var thisW = $(this).width()
    var thisL = $(this).position().left

    if (thisL < -boxL) {
      $('#navbar .nav-tabs')
        .stop(false, true)
        .animate(
          {
            left: -thisL
          },
          200
        )
    }

    if (thisL + thisW > boxW - boxL) {
      $('#navbar .nav-tabs')
        .stop(false, true)
        .animate(
          {
            left: -thisL + boxW - thisW
          },
          200
        )
    }

    var prevId = $(this).attr('data-id')
    $('.menu-dd').removeClass('active')
    $('.menu-dd[data-id=' + prevId + ']').addClass('active')

    $('.menu-group-list').removeClass('menu-group-list-active')
    $('.menu-dd[data-id=' + prevId + ']')
      .parents('.menu-group-list')
      .addClass('menu-group-list-active')
  })

  $('#nav-tabs').on('click', '.nav-close', function(e) {
    var prevId = $(this)
      .parent()
      .prev()
      .attr('data-id')
    var id = $(this)
      .parent()
      .attr('data-id')

    $(this)
      .parent()
      .prev()
      .addClass('active')
    $('#navc' + prevId).addClass('active')
    $(this)
      .parent()
      .remove()
    $('#navc' + id).remove()

    $('.menu-dd').removeClass('active')
    $('.menu-dd[data-id=' + prevId + ']').addClass('active')
    $('.menu-group-list').removeClass('menu-group-list-active')
    $('.menu-dd[data-id=' + prevId + ']')
      .parents('.menu-group-list')
      .addClass('menu-group-list-active')
    e.stopPropagation()
  })
}

Index.login = function() {
  $('#menu-user-name').html(user.name)
  var html = ''

  for (var i = 0; i < menuList.length; i++) {
    var div = '<div class="menu-group-list">'
    if (!menuList[i].sysMenuDto) {
      var dt =
        '<a class="menu-dd first" id="firstPage" href="javascript:;" data-id="' +
        menuList[i].id +
        '" data-href="' +
        menuList[i].url +
        '">' +
        menuList[i].name +
        '</a>'
      div += dt + '</div>'
      html += div
    } else {
      var dt =
        '<a class="menu-dt" href="javascript:;">' +
        menuList[i].name +
        '<span class="glyphicon glyphicon-menu-right"></span></a>'
      var ul = '<ul class="list-group">'
      for (var j = 0; j < menuList[i].sysMenuDto.length; j++) {
        var dd =
          '<li class="list-group-item"><a class="menu-dd" href="javascript:;" data-id="' +
          menuList[i].sysMenuDto[j].id +
          '" data-href="' +
          menuList[i].sysMenuDto[j].url +
          '">' +
          menuList[i].sysMenuDto[j].name +
          '</a></li>'
        ul += dd
      }
      ul += '</ul>'
      div += dt + ul + '</div>'
      html += div
    }
  }
  $('#menu-group').html(html)
  $('.menu-group-list .menu-dt')
    .eq(0)
    .trigger('click')
  $('.menu-group-list .menu-dd')
    .eq(0)
    .trigger('click')
  $('#menu-user-name').html(user.name)
  var html = ''
  for (var i = 0; i < menuList.length; i++) {
    var div = '<div class="menu-group-list">'
    if (!menuList[i].sysMenuDto) {
      var dt =
        '<a class="menu-dd first" id="firstPage" href="javascript:;" data-id="' +
        menuList[i].id +
        '" data-href="' +
        menuList[i].url +
        '">' +
        menuList[i].name +
        '</a>'

      div += dt + '</div>'
      html += div
    } else {
      var dt =
        '<a class="menu-dt" href="javascript:;">' +
        menuList[i].name +
        '<span class="glyphicon glyphicon-menu-left"></span></a>'
      var ul = '<ul class="list-group">'
      for (var j = 0; j < menuList[i].sysMenuDto.length; j++) {
        var dd =
          '<li class="list-group-item"><a class="menu-dd" href="javascript:;" data-id="' +
          menuList[i].sysMenuDto[j].id +
          '" data-href="' +
          menuList[i].sysMenuDto[j].url +
          '">' +
          menuList[i].sysMenuDto[j].name +
          '</a></li>'
        ul += dd
      }
      ul += '</ul>'
      div += dt + ul + '</div>'
      html += div
    }
  }
  $('#menu-group').html(html)
  $('.menu-group-list .menu-dt')
    .eq(0)
    .trigger('click')
  $('.menu-group-list .menu-dd')
    .eq(0)
    .trigger('click')
}

Index.getIcon = function() {
  $.get('/loan/title/getIcon', function(info) {
    $('head').append(`<link rel="shortcut icon" href=${info}>`)
  })
  $.get('/loan/title/getTitle', function(info) {
    $('head title').html(info.split('"')[1])
  })
}
