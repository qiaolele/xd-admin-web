new Vue({
  el: "#iframe-content",
  data() {
    return {
      timeValue: [],
      listArr: [],
      clickSearch: false,
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    getList(page) {
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/order/freeOrderCount")
        .then((res) => {
          console.log(res);
          parent.modal.loaders();
          if (res.data.code == 200) {
            if (res.data.data) {
              this.listArr = res.data.data;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    searchList() {
      if (this.timeValue) {
        this.clickSearch = true;
        console.log(this.timeValue);
        let param = {
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
        };
        this.searchListGet(param);
      } else {
        this.clickSearch = false;
        this.listArr = [];
      }
    },
    searchListGet(param) {
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/order/freeOrderCount", { params: param })
        .then((res) => {
          console.log(res);
          parent.modal.loaders();
          if (res.data.code == 200) {
            if (res.data.data) {
              this.listArr = res.data.data;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
  },
});
