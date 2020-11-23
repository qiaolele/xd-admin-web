new Vue({
  el: "#gold-config",
  data() {
    return {
      dialogVisible: false,
      priceInput: "",
      goldInput: "",
      goldList: [],
      toastInfo: {},
      addGoldToast: false,
      phoneInput: "",
      goldNumInput: "",
    };
  },
  created() {
    // parent.modal.loaders("block");
    // setTimeout(() => {
    //   parent.modal.loaders();
    // }, 2000);
    this.getGoldInfo();
  },
  mounted() {},
  watch: {},
  methods: {
    getGoldInfo() {
      parent.modal.loaders("block");
      axios.get("/app/admin/v1/goldConfig/queryListGold").then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.goldList = res.data.data;
          parent.modal.loaders();
        }
      });
    },
    showDialog(id) {
      parent.modal.loaders("block");
      axios.get("/app/admin/v1/goldConfig/getById/" + id).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.dialogVisible = true;
          parent.modal.loaders();
          this.toastInfo = res.data.data;
          this.priceInput = res.data.data.money;
          this.goldInput = res.data.data.gold;
        }
      });
    },
    addGold() {
      this.dialogVisible = true;
      this.priceInput = "";
      this.goldInput = "";
    },
    addUserGold() {
      this.addGoldToast = true;
    },
    addGoldCommit() {
      // console.log(this.phoneInput, this.goldNumInput);
      parent.modal.loaders("block");
      axios({
        method: "post",
        url: "/app/v1/user/updateMoney",
        data: {
          phone: this.phoneInput,
          goldNum: this.goldNumInput,
        },
        transformRequest: [
          function (data) {
            let ret = "";
            for (let it in data) {
              ret +=
                encodeURIComponent(it) +
                "=" +
                encodeURIComponent(data[it]) +
                "&";
            }
            return ret;
          },
        ],
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          parent.modal.loaders();
          this.addGoldToast = false;
          this.phoneInput = "";
          this.goldNumInput = "";
          this.$message({
            message: "添加成功",
            type: "success",
          });
        } else {
          parent.modal.loaders();
          this.$message.error(res.data.msg);
        }
      });
    },
    commitBtn() {
      console.log(this.priceInput.toString(), this.goldInput);
      console.log(typeof this.priceInput.toString());
      parent.modal.loaders("block");
      axios({
        method: "post",
        url: "/app/admin/v1/goldConfig/updateById",
        params: {
          id: this.toastInfo.id.toString(),
          price: this.priceInput.toString(),
          goldCount: this.goldInput.toString(),
          firstGoldCount: this.toastInfo.firstFlushGold.toString(),
          hasFirst: this.toastInfo.hasFirstFlush.toString(),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.dialogVisible = false;
          parent.modal.loaders();
          this.getGoldInfo();
        }
      });
    },
  },
});
