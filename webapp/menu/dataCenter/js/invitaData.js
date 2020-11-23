new Vue({
  el: "#iframe-content",
  data() {
    return {
      timeValue: [],
      currentPage: 1, //默认第一页
      size: 20,
      totalNum: 0,
      listArr: [],
      clickSearch: false,
    };
  },
  created() {
    // this.getList(this.currentPage);
  },
  mounted() {},
  methods: {
    getList(page) {
      let param = {
        page: page,
        size: this.size,
      };
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/order/invitationCount", { params: param })
        .then((res) => {
          console.log(res);
          parent.modal.loaders();
          if (res.data.code == 200) {
            if (res.data.data) {
              this.listArr = res.data.data.list;
              this.totalNum = res.data.data.total;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    searchList() {
      this.currentPage = 1;
      if (this.timeValue) {
        this.clickSearch = true;
        console.log(this.timeValue);
        let param = {
          page: this.currentPage,
          size: this.size,
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
        };
        this.searchListGet(param);
      } else {
        this.clickSearch = false;
        this.listArr = [];
        this.totalNum = 0;
        // this.getList(this.currentPage);
      }
    },
    handleCurrentChange(val) {
      //分页
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      if (this.clickSearch) {
        let param = {
          page: this.currentPage,
          size: this.size,
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
        };
        this.searchListGet(param);
      } else {
        this.getList(this.currentPage);
      }
    },
    searchListGet(param) {
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/order/invitationCount", { params: param })
        .then((res) => {
          console.log(res);
          parent.modal.loaders();
          if (res.data.code == 200) {
            if (res.data.data) {
              this.listArr = res.data.data.list;
              this.totalNum = res.data.data.total;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
  },
});
