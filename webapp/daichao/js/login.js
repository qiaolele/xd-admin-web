+function ($) {
  $('input.icheck').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass: 'iradio_minimal-yellow'
  });

  $(".btn").on("click", function () {
    /*if ($("#generateVerificationCode").val() === '') {
      $(".tips").addClass("tips-show");
      $(".tips span").html("请输入验证码。");
      return;
    }
    contrastVerificationCode($("#generateVerificationCode").val());*/
    submit();
  });

  $(window).on("keydown", function (e) {
    if (e.keyCode == 13) {
      submit();
    }
  })

  $("body").on('click', '.generateVerificationCode', function () {
    generateVerificationCode();

  });
  generateVerificationCode();

}(jQuery);

function submit() {
  var name = $("#userName").val();
  var pwd = $("#userPwd").val();
  modal.loaders('block');
  $.post("/loan/home/login", {loginName: name, password: pwd, code: ''}, function (data) {
    modal.loaders();
    if (data.code == 1) {
      $(".tips").addClass("tips-show tips-succ");
      $(".tips span").html("登录成功。");
      var cookieArr = [
        {
          key: "userId",
          val: data.data.user.id
        },
        {
          key: "roleId",
          val: data.data.user.roleId
        }, {
          key: 'loginName',
          val: data.data.user.loginName
        }, {
          key: 'password',
          val: data.data.user.password
        }
      ];
      Cookie.setArr(cookieArr, 30);
      location.href = "index.html";
    } else if (data.code == 2) {
      $(".tips").addClass("tips-show");
      $(".tips span").html("用户名或密码不正确，请重新输入。");
    } else if (data.code == 3) {
      $(".tips").addClass("tips-show");
      $(".tips span").html("用户名或密码不能为空。");
    }

  });
};

//验证
function contrastVerificationCode(code) {
  let p = {
    code: code
  };
  $.post('/loan/home/contrastVerificationCode', p, function (data) {
    if (data) {
      submit();
    } else {
      $(".tips").addClass("tips-show");
      $(".tips span").html("验证码错误，请重新输入。");
      generateVerificationCode();
    }
  });
}

function generateVerificationCode() {
  $.post('/loan/home/generateVerificationCode', function (data) {
    if (data.code === 1) {
      $(".generateVerificationCode").attr("src", '/loan/images/kaptcha.jpg');
    }
  })
}