+function ($) {
  var loadData = function () {
    // parent.modal.loaders('block');
    $.ajax({
      url: "/admin/v1/queryhomepage",
      type: "get",
      dataType: "json",
      success: function (data) {
        parent.modal.loaders();
        var d = data.data;
        $(".pv-wrapper .col-sm-2").each(function (index) {
          var str = "";
          switch (index) {
            case 0:    //今日新增用户
              str = d.registNum;
              break;
            case 1:    //今日认证通过用户
              str = d.authPassNum;
              break;
            case 2:     //今日申请贷款单数
              str = d.applyLoanNum;
              break;
            case 3:     //今日申请贷款金额
              str = d.applyLoanMoney;
              break;
            case 4:     //今日放款成功单数
              str = d.releasePassNum;
              break;
            case 5:     //今日放款成功金额
              str = d.releaseMoney.toFixed(0);
              break;
          }
          $(this).find(".pv-panel-body div:first").html(str);
        })
        createChart(d);

      }
    });
  };
  var iframe = $('#navc1', parent.window.document);//获取tab
  //正在浏览当前页面，进行数据刷新
  setInterval(function () {
    if (iframe.hasClass('active')) loadData();
  }, 1000 * 60 *  3);//3分钟
  loadData();
  var createChart = function (d) {
    var ctx1 = document.getElementById("myChart1");
    var ctx2 = document.getElementById("myChart2");
    var ctx3 = document.getElementById("myChart3");
    var ctx4 = document.getElementById("myChart4");
    d.registList.reverse();
    d.authNumList.reverse();
    d.applyNumList.reverse();
    d.renewNumList.reverse();
    d.overdueNumList.reverse();
    d.shouldReleaseList.reverse();
    d.loanNumList.reverse();
    d.loanMoneyList.reverse();
    var myChart1 = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: d.registList.map(keys=>{return keys.date}),
        datasets: [
      {
        label: "认证通过数量",
        data: d.authNumList.map(keys=>{return keys.value}),
    backgroundColor: 'rgba(255,165,0,0.4)',
      borderWidth: 1,
      borderColor: '#ffa600',
      lineTension: 0
  },{
          label: "注册数量",
          data: d.registList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(204,204,204,0.4)',
          borderWidth: 1,
          lineTension: 0
        }]
      }, options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        }
      }
    });

    var myChart2 = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: d.applyNumList.map(keys=>{return keys.date}),
        datasets: [{
          label: "借款数量",
          data: d.applyNumList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(255,165,0,0.4)',
          borderColor: '#ffa600',
          borderWidth: 1
        }, {
          label: "续借数量",
          data: d.renewNumList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(204,204,204,0.4)',
          borderWidth: 1
        }]
      }, options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        }
      }
    });

    var myChart3 = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: d.overdueNumList.map(keys=>{return keys.date}),
        datasets: [{
          label: "逾期笔数",
          data: d.overdueNumList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(255,165,0,0.4)',
          borderColor: '#ffa600',
          borderWidth: 1
        }, {
          label: "应收笔数",
          data: d.shouldReleaseList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(204,204,204,0.4)',
          borderWidth: 1
        }]
      }, options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        }
      }
    });

    var myChart4 = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: d.loanNumList.map(keys=>{return keys.date}),
        datasets: [{
          label: "贷款金额",
          data: d.loanMoneyList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(255,165,0,0.4)',
          borderColor: '#ffa600',
          borderWidth: 1
        }, {
          label: "贷款单数",
          data: d.loanNumList.map(keys=>{return keys.value}),
          backgroundColor: 'rgba(204,204,204,0.4)',
          borderWidth: 1
        }]
      }, options: {
        tooltips: {
          mode: 'index',
          intersect: false,
        }
      }
    });
  }
  $(".chart-wrapper .glyphicon-chevron-down").on("click", function () {
    var $wraper = $(this).parents(".col-lg-6")
    var $content = $(this).parents(".col-lg-6").find(".chart-content");
    $wraper.toggleClass("active")
    $content.slideToggle();
  })
  $(".chart-wrapper .glyphicon-remove").on("click", function () {
    $(this).parents(".col-lg-6").remove();

  })

  $(document).on("mousemove", "body", function () {//监听鼠标动作
    $('body', parent.window.document).trigger('click');//重置超时时间，mousemove在parent.window.document无效，用click代替
  });
}(jQuery);
