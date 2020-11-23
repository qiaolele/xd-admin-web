(function ($) {
  $.fn.EasyTree = function (options) {
    this.each(function () {
      var easyTree = $(this);
      $(easyTree).delegate('li.parent_li > span', 'click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        $(this).parent('li').siblings().find('.menuList').removeClass('less').addClass('plus');
        $(this).parent('li').siblings().find('li').hide('fast');
        if (children.is(':visible')) {
          $(this).addClass('plus').removeClass('less');
          children.hide('fast');
        } else {
          $(this).addClass('less').removeClass('plus');
          children.show('fast');
        }
        var li = $(this).parent();
        if (li.hasClass('selected')) {
          $(li).removeClass('li_selected');
        } else {
          $(easyTree).find('li.li_selected').removeClass('li_selected');
          $(li).addClass('li_selected');
        }
        e.stopPropagation();
      });
    });
  };
})(jQuery);
