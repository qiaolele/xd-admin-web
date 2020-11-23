new Vue({
  el: "#iframe-content",
  data() {
    return {
      timeValue: [],
    };
  },
  created() {},
  mounted() {},
  methods: {
    exportList() {
      if (this.timeValue && this.timeValue.length > 0) {
        window.open(
          "/app/v1/order/userOrBackGold/export?startTime=" +
            this.timeValue[0] +
            "&endTime=" +
            this.timeValue[1]
        );
      } else {
        this.$message.error("请选择日期");
      }
    },
  },
});
