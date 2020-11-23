var Login = new Object();
$(function () {
  Login.regEvent();
});

Login.regEvent = function () {
  $("body").on("click", ".btn-default", function () {
    Login.submit();
  });
  $("body").on("click", ".recode", function () {
    Login.submit(1);
  });
  $(window).on("keydown", function (e) {
    if (e.keyCode == 13) {
      Login.submit();
    }
  });
  // Login.getIcon()
};
(Login.url = "/app/admin/v1/loaginmanage/login"), (Login.code = 1);

Login.submit = function (key) {
  let name = $("#userName").val(),
    pwd = $("#userPwd").val(),
    param = {
      loginName: name,
      password: pwd,
    };
  if (name.length <= 0 || pwd.length <= 0) {
    $(".tips").html("用户名或密码不能为空。");
    return;
  }
  modal.loaders("block");
  if (key) {
    Login.url = "/app/admin/v1/loaginmanage/login";
  } else {
    if (Login.code === 497 || Login.code === 11 || Login.code === 12) {
      Login.url = "/app/admin/v1/loaginmanage/login";
      param.code = $("#code").val();
    } else {
      $(".code").addClass("hidden");
      Login.url = "/app/admin/v1/loaginmanage/login";
    }
  }
  Login.login(param);
};

Login.login = function (param) {
  $.post(Login.url, param, function (data) {
    modal.loaders();
    if (data.code == 200) {
      var cookieArr = [
        {
          key: "userId",
          val: data.data.user.id,
        },
        {
          key: "roleId",
          val: data.data.user.roleId,
        },
        {
          key: "loginName",
          val: data.data.user.loginName,
        },
        {
          key: "password",
          val: data.data.user.password,
        },
        {
          key: "user",
          val: JSON.stringify(data.data.user),
        },
      ];
      Cookie.setArr(cookieArr, 30);
      localStorage.setItem("menuList", JSON.stringify(data.data.menuList));
      location.href = "index.html";
    } else {
      $(".tips").html(data.message);
    }
    $(".tips").html(data.codeMessage);
    Login.code = data.code;
  });

  // modal.loaders();
  //   var cookieArr = [{
  //     key: "userId",
  //     val: 555
  //   },
  //     {
  //       key: "roleId",
  //       val: 39
  //     }, {
  //       key: 'loginName',
  //       val: '超级管理员'
  //     }, {
  //       key: 'password',
  //       val: '7b11b73aeb4d9a223ad7a645aa7cd883'
  //     }, {
  //       key: 'user',
  //       val: JSON.stringify({"id":"555","status":"1", "name":"超级管理员", "loginName":"admin", "roleId":"39", "roleName":"超级管理员", "phone":"13400000001", "loginTime":"", "loginIp":"127.0.0.1", "password":"7b11b73aeb4d9a223ad7a645aa7cd883", "remark":"", "displayStatistics":"0", "isHidePhone":"0"})
  //     }
  //   ];
  //   Cookie.setArr(cookieArr, 30);
  //   localStorage.setItem('menuList', JSON.stringify(
  //     [
  //       {"id":"3","name":"角色管理","url":"/accountManage/roleManage","title":"roleManage"},
  //       {"id":"4","name":"账号管理","url":"/accountManage/accountManage","title":"accountManage"},
  //       {"id":"6","name":"机构管理","url":"/partner/organization","title":"organization"},
  //       {"id":"7","name":"API产品管理","url":"/partner/apiProduct","title":"apiProduct"},
  //       {"id":"8","name":"H5产品管理","url":"/partner/h5Product","title":"h5Product"},
  //       {"id":"10","name":"场景管理","url":"/appManage/scenes","title":"scenes"},
  //       {"id":"11","name":"贷款页列表","url":"/appManage/appLoanList","title":"appLoanList"},
  //       {"id":"12","name":"新口子页列表","url":"/appManage/appNewList","title":"appNewList"},
  //       {"id":"13","name":"贷款推荐位","url":"/appManage/appLoanEntran","title":"appLoanEntran"},
  //       {"id":"15","name":"新口子推荐位","url":"/appManage/appNewEntran","title":"appNewEntran"},
  //       {"id":"17","name":"首页banner","url":"/appAdsManage/banner","title":"banner"},
  //       {"id":"18","name":"其他广告位管理","url":"/appAdsManage/otherGGs","title":"otherAds"},
  //       {"id":"19","name":"推荐借款","url":"/appAdsManage/recommendLoan","title":"recommendLoan"},
  //       {"id":"27","name":"系统消息配置","url":"/infoManage/infoConfig","title":"infoConfig"},
  //       {"id":"28","name":"消息管理","url":"/infoManage/infoManage","title":"infoManage"},
  //       {"id":"31","name":"用户管理","url":"/customerSystem/cusServiceInfo","title":"cusServiceInfo"},
  //       {"id":"34","name":"渠道管理","url":"/marketManage/channelManage","title":"channelManage"},
  //       {"id":"35","name":"渠道结算管理","url":"/marketManage/channelSet","title":"channelSet"},
  //       {"id":"37","name":"市场数据","url":"/dataCenter/marketData","title":"marketData"},
  //       {"id":"37","name":"渠道数据","url":"/dataCenter/agentSumData","title":"agentSumData"},
  //       {"id":"38","name":"产品数据-H5","url":"/dataCenter/co-operatingAndH5","title":"co-operatingAndH5"},
  //       {"id":"39","name":"产品数据-API","url":"/dataCenter/co-operatingAndApi","title":"co-operatingAndApi"},
  //       {"id":"40","name":"成单数据-API","url":"/dataCenter/apiData","title":"apiData"},
  //       {"id":"41","name":"总日报表","url":"/databaseReport/totalReport","title":"totalReport"},
  //       {"id":"42","name":"API日报表","url":"/databaseReport/apiReport","title":"apiReport"},
  //       {"id":"44","name":"H5日报表","url":"/databaseReport/h5Report","title":"h5Report"},
  //       {"id":"45","name":"联登日报表","url":"/databaseReport/JointReport","title":"JointReport"},
  //       {"id":"47","name":"基本资料","url":"/configManage/basicInfo","title":"basicInfo"},
  //       {"id":"49","name":"补充资料","url":"/configManage/supplementInfo","title":"supplementInfo"},
  //       {"id":"50","name":"贷款类型配置","url":"/configManage/loanTypeConfig","title":"loanTypeConfig"},
  //       {"id":"51","name":"产品标签配置","url":"/configManage/labelConfig","title":"labelConfig"},
  //       {"id":"53","name":"认证项列表配置","url":"/configManage/certificationConfig","title":"certificationConfig"},
  //       {"id":"54","name":"H5申请流程内容配置","url":"/configManage/h5ApplyConfig","title":"h5ApplyConfig"},
  //       {"id":"55","name":"额度区间配置","url":"/configManage/linesConfig","title":"linesConfig"},
  //       {"id":"72","name":"产品分类管理","url":"/appManage/classification","title":"classification"},
  //       {"id":"73","name":"接口参数配置","url":"/configManage/config","title":"config"},
  //       {"id":"74","name":"消息头条","url":"/appAdsManage/headLine","title":"headLine"},
  //       {"id":"76","name":"额度分类管理","url":"/appManage/limitsection","title":"limitsection"}
  //       ]
  //   ))
  //   location.href = "index.html";
  // $(".tips").html(data.codeMessage);
  // Login.code = data.code;
};

Login.getIcon = function () {
  $.get("/loan/title/getIcon", function (info) {
    $("head").append(`<link rel="shortcut icon" href=${info}>`);
  });
  $.get("/loan/title/getTitle", function (info) {
    $("head title").html(info.split('"')[1]);
    $(".title").html(info.split('"')[1]);
  });
};
