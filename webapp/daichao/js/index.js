var Index = new Object();
var cookieName = Cookie.get("loginName");
var cookiePwd = Cookie.get("password");
$(function () {
  if (!cookieName) {
    location.href = "login.html";
  }
  Index.login();
  Index.regEvent();
  Index.timer();
});

Index.regEvent = function () {
  $('body').on('click', '#btn-right', function () {//退出
    Cookie.delAll();
    window.location.href = 'login.html';
  });
  //左侧列表隐藏
  $("#btn-left").on("click", function () {
    $("body").toggleClass("hide-menu");
  });

  //左侧下拉菜单
  $("#menu-group").on("click", ".menu-dt", function () {
    $("#firstPage").removeClass('active');
    $(this).parent().toggleClass("menu-group-list-active");
    $(this).parent().siblings().removeClass("menu-group-list-active");
    $('#menu-group').find('.menu-group-list .menu-dt').removeClass('active');
    $(this).addClass('active');

    $("#menu-group").find(".list-group .list-group-item").removeClass('active');
    $(this).siblings(".list-group").find('.list-group-item').addClass('active');
  });

  //左侧对应iframe
  $("#menu-group").on("click", ".menu-dd", function () {
    if ($(this).attr('id') === 'firstPage') $(".menu-group-list .menu-dt").removeClass('active');
    $(".menu-dd").removeClass("active");
    $(this).addClass("active");
    var id = $(this).attr("data-id");
    $("#nav-tabs li").removeClass("active");
    $("#tab-content .tab-pane").removeClass("active");

    if ($("#nava" + id).length) {
      $("#nava" + id).addClass("active");
      $("#navc" + id).addClass("active");
      $("#nav-tabs li[data-id=" + id + "]").trigger("click");
      return false;
    }


    var txt = $(this).html();
    if (txt == "主页") {
      var close = "";
    } else {
      var close = '<span class="nav-close glyphicon"></span>';
    }

    var li = '<li id="nava' + id + '" data-id="' + id + '" class="active"><a href="#navc' + id + '" data-toggle="tab">' + txt + '</a>' + close + '</li>'
    $("#nav-tabs").append(li);

    var pane = '<div class="tab-pane active" id="navc' + id + '"></div>';
    $("#tab-content").append(pane);

    var iframe = document.createElement("iframe");
    iframe.id = "iframe" + id;
    $(iframe).addClass("iframe");
    $(iframe).attr("src", "menu" + $(this).attr("data-href") + ".html");
    $("#navc" + id).append(iframe);
    $("#nav-tabs li[data-id=" + id + "]").trigger("click");
  });

  $("#wrapper .glyphicon-chevron-right").on("click", function () {
    var boxW = $("#navbar").width();
    var leftW = $("#navbar .nav-tabs").position().left;
    var $li = $("#navbar .nav-tabs li");
    var len = $li.length;
    var maxW = 0;
    var minW = 0;

    for (var i = 0; i < len; i++) {
      maxW += $li.eq(i).width();

      if (maxW > -leftW) {
        minW += $li.eq(i).width();
        if (minW > boxW) {
          minW -= $li.eq(i).width();
          break;
        }
      }
    }

    maxW = 0;
    for (var i = 0; i < len; i++) {
      maxW += $li.eq(i).width();
      if (maxW + leftW > boxW) {
        $("#navbar .nav-tabs").animate({"left": leftW - minW}, 200);
        break;
      }
    }

  });

  $("#wrapper .glyphicon-chevron-left").on("click", function () {
    var boxW = $("#navbar").width();
    var leftW = $("#navbar .nav-tabs").position().left;

    if (leftW < 0) {
      if (-leftW > boxW) {
        $("#navbar .nav-tabs").animate({"left": leftW + boxW}, 200);
      } else {
        $("#navbar .nav-tabs").animate({"left": 0}, 200);
      }
    }
  });

  $("#nav-tabs").on("click", "li", function () {
    var boxW = $("#navbar").width();
    var boxL = $("#nav-tabs").position().left;
    var thisW = $(this).width();
    var thisL = $(this).position().left;

    if (thisL < -boxL) {
      $("#navbar .nav-tabs").stop(false, true).animate({"left": -thisL}, 200);
    }

    if ((thisL + thisW) > (boxW - boxL)) {
      $("#navbar .nav-tabs").stop(false, true).animate({"left": -thisL + boxW - thisW}, 200);
    }

    var prevId = $(this).attr("data-id");
    $(".menu-dd").removeClass("active");
    $(".menu-dd[data-id=" + prevId + "]").addClass("active");

    $(".menu-group-list").removeClass("menu-group-list-active");
    $(".menu-dd[data-id=" + prevId + "]").parents(".menu-group-list").addClass("menu-group-list-active");
  });

  $("#nav-tabs").on("click", ".nav-close", function (e) {
    var prevId = $(this).parent().prev().attr("data-id");
    var id = $(this).parent().attr("data-id");

    $(this).parent().prev().addClass("active");
    $("#navc" + prevId).addClass("active");
    $(this).parent().remove();
    $("#navc" + id).remove();

    $(".menu-dd").removeClass("active");
    $(".menu-dd[data-id=" + prevId + "]").addClass("active");
    $(".menu-group-list").removeClass("menu-group-list-active");
    $(".menu-dd[data-id=" + prevId + "]").parents(".menu-group-list").addClass("menu-group-list-active");
    e.stopPropagation();
  });

  $(document).on('mousemove', 'body', function () {
    Cookie.set("time", new Date().getTime());
  });
  $(document).on('click', 'body', function () {
    $("body").trigger('mousemove');
  });
  $("body").trigger('mousemove');
}

Index.login = function () {
  modal.loaders('block');
  $.post("/loan/home/getUserMenu", {loginName: cookieName, password: cookiePwd}, function (data) {
    modal.loaders();
    if (data.code == 1) {
      var d = data.data;
      $("#menu-user-name").html(d.user.name);

      var html = "";
      for (var i = 0; i < d.menuList.length; i++) {
        var div = '<div class="menu-group-list">';
        if (!d.menuList[i].menuDto.length) {
          var dt = '<a class="menu-dd first" id="firstPage" href="javascript:;" data-id="' + d.menuList[i].id + '" data-href="' + d.menuList[i].url + '">' + d.menuList[i].name + '</a>';

          div += dt + '</div>';
          html += div;
        } else {
          var dt = '<a class="menu-dt" href="javascript:;">' + d.menuList[i].name + '<span class="glyphicon glyphicon-menu-left"></span></a>'
          var ul = '<ul class="list-group">';
          for (var j = 0; j < d.menuList[i].menuDto.length; j++) {
            var dd = '<li class="list-group-item"><a class="menu-dd" href="javascript:;" data-id="' + d.menuList[i].menuDto[j].id + '" data-href="' + d.menuList[i].menuDto[j].url + '">' + d.menuList[i].menuDto[j].name + '</a></li>'
            ul += dd;
          }
          ul += '</ul>'
          div += dt + ul + '</div>';
          html += div;
        }
      }
      $("#menu-group").html(html);
      $(".menu-group-list .menu-dt").eq(0).trigger("click");
      $(".menu-group-list .menu-dd").eq(0).trigger("click");

    } else {
      location.href = "login.html";
    }
  });
}

Index.timer = function () {
  var authTime = setInterval(function () {
    var lastUpdateTime = Cookie.get("time");
    var effectiveTime = 15 * 60 * 1000;
    var deadTime = new Date().getTime();
    if (lastUpdateTime === null) {
      Cookie.delAll();
      window.location.reload();
      window.location.href = 'login.html';
    } else {
      if ((parseInt(lastUpdateTime) + effectiveTime) < deadTime) {
        //超时
        Cookie.delAll();
        window.location.reload();
        window.location.href = 'login.html';
      } else {
        return;
      }
    }
  }, 1000 * 60);//1分钟检查一次
}