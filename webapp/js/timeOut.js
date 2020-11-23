;
(function (factory) {
  if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
    // AMD或CMD
    define(["jquery"], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery);
      return jQuery;
    };
  } else {
    //Browser globals
    factory(jQuery);
  }
}(function ($) {
  //配置参数
  var defaults = {
    callback: function () {

    }
  };

  var TimeOutPlugin = function (element, options) {
    var opts = options, $el = $(element), flag = 0;
    //初始化
    this.init = function () {
      setInterval(function () {
        var lastUpdateTime = Cookie.get("time");
        var effectiveTime = 3 * 60 * 60 * 1000;
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
      }, 1000 * 60);
      this.mousemoveListener();
    };
    //重置超时时间
    this.mousemoveListener = function () {
      window.addEventListener('mousemove', function () {
        Cookie.set("time", new Date().getTime());
      });
    }
    //输入框非空验证
    this.verify = function () {
      const val = $el.val();
      if (val && val.length > 0) {
        flag = 1;
        $el.removeClass("required-input").removeAttr("placeholder");
      } else {
        $el.addClass("required-input").attr("placeholder", "此项不能为空");
      }
      typeof opts.callback === 'function' && opts.callback(this);
    }
    this.isVerify = function () {
      return flag;
    }
    //带交互弹窗
    this.confirmModal = function () {
      $el.append(`<div class="modal fade modal-confirm" id="operModal" tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-sm" role="document" style="top:50%;margin-top: -100px;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                                </button>
                                <h4 class="modal-title">${opts.title}</h4>
                            </div>
                            <div class="modal-body">
                                ${opts.message}
                            </div>
                            <div class="modal-footer" style="text-align: center">
                                <button type="button" class="btn btn-rest" data-dismiss="modal">取消</button>
                                <button type="button" class="btn btn-default">确认</button>
                            </div>
                        </div>
                    </div>
                </div>`);
      $("#operModal").modal("show");
      this.btnConfirm();
    }
    //信息提示弹窗
    this.tipsModal = function () {
      $el.append(`<div class="modal fade modal-confirm" id="modalAlert" tabindex="-1" role="dialog">
              <div class="modal-dialog modal-sm" role="document" style="top:50%;margin-top: -100px;width: 20%">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                          <h4 class="modal-title">提示</h4>
                      </div>
                      <div class="modal-body">
                          <h3>${opts.message}</h3>
                      </div>
                  </div>
              </div>
              </div>`);
      $("#modalAlert").modal("show");
      this.btnConfirm();
    }
    //交互事件
    this.btnConfirm = function () {
      $("body").on("click", "#operModal .btn-default", () => {
        $("#operModal").modal("hide");
        typeof opts.callback === 'function' && opts.callback();
      });
      $("#modalAlert,#operModal").on("hidden.bs.modal", function () {
        $(this).remove();
      })
    }
    //前后元素交换位置
    this.moveUpOrMoveDown = function () {
      $el.on("click", '.glyphicon-arrow-up', function () {
        const $parents = $(this).parents('tr'), $before = $parents.prev();
        if ($before.length !== 0) {
          $before.before($parents.clone())
          $parents.remove();
        }
        typeof opts.callback === 'function' && opts.callback();
      })
      $el.on("click", '.glyphicon-arrow-down', function () {
        const $parents = $(this).parents('tr'), $after = $parents.next();
        if ($after.length !== 0) {
          $after.after($parents.clone())
          $parents.remove();
        }
        typeof opts.callback === 'function' && opts.callback();
      })
    }

    if (!opts.type) {
      this.init();
    } else {
      this[opts.type]();
    }
  };

  $.fn.timeOutPlugin = function (parameter, callback) {
    if (typeof parameter == 'function') { //重载
      callback = parameter;
      parameter = {};
    } else {
      parameter = parameter || {};
      callback = callback || function () {
      };
    }
    var options = $.extend({}, defaults, parameter);
    return this.each(function () {
      var pagination = new TimeOutPlugin(this, options);
      callback(pagination);
    });
  };
}));
