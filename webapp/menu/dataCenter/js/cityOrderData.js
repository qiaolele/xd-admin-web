new Vue({
  el: "#iframe-content",
  data: {
    timeValue: [],
  },
  created() {
  },
  mounted() {},
  methods: {
    exportInfo(txt){
      // console.log(this.timeValue)
      if (this.timeValue && this.timeValue.length > 0){
        if(txt == 'countCity'){//总单数
          window.open(
            "/app/admin/v1/order/countCity/export?startTime=" +
              this.timeValue[0] +
              "&endTime=" +
              this.timeValue[1]
          );
        }else if(txt == 'countCityGrap'){//抢单数
          window.open(
            "/app/admin/v1/order/countCityGrap/export?startTime=" +
              this.timeValue[0] +
              "&endTime=" +
              this.timeValue[1]
          );
        }
      }else{
        this.$message.error("请选择日期");
      }
    }
  },
});
