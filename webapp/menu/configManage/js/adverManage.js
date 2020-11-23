new Vue({
  el: "#advert-manage",
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      typeOptions: [
        {
          value: "广告位",
          label: "广告位",
        },
        {
          value: "banner",
          label: "banner",
        },
      ],
      valueType: "", //弹框类别
      valuePosition: "", //位置
      positionOptions: [
        {
          value: 1,
          label: "开屏",
        },
        {
          value: 2,
          label: "弹窗",
        },
        {
          value: 3,
          label: "轮播banner",
        },
        {
          value: 4,
          label: "我的广告位",
        },
        {
          value: 5,
          label: "首页广告位",
        },
      ],
      imgInput: "",
      imageUrl: "",
      toastInfo: {},
      toastUse: "",
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  watch: {},
  methods: {
    getList() {
      parent.modal.loaders("block");
      axios.get("/app/admin/v1/adver/queryAll").then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          parent.modal.loaders();
          this.tableData = res.data.data;
        }
      });
    },
    addAdver(item) {
      this.dialogVisible = true;
      this.valueType = "";
      this.valuePosition = "";
      this.imgInput = "";
      this.imageUrl = "";
      this.toastUse = item;
    },
    upLoad() {
      // 触发上传图片按钮
      this.$refs.avatarInput.dispatchEvent(new MouseEvent("click"));
    },
    uploadImg() {
      //上传图片
      var files = this.$refs.avatarInput.files[0];
      console.log(files);
      var formData = new FormData();
      formData.append("file", files);
      console.log(formData);
      parent.modal.loaders("block");
      axios({
        method: "post",
        url: "/app/file/upload",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: formData,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          parent.modal.loaders();
          this.imageUrl = res.data.data;
        }
      });
    },
    changeStatus(id, status) {
      console.log(id, status);
      var nowStatus = 0;
      if (status == 1) {
        nowStatus = -1;
      } else {
        nowStatus = 1;
      }
      axios({
        method: "post",
        url: "/app/admin/v1/adver/updateById",
        params: {
          id: id.toString(),
          status: nowStatus,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.getList();
        }
      });
    },
    showDialog(id, item) {
      //展示弹框
      console.log(id, item);
      this.toastUse = item;
      this.dialogVisible = true;
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/adver/queryById", { params: { id: id } })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.toastInfo = res.data.data;
            parent.modal.loaders();
            let info = res.data.data;
            this.valueType = info.type == 1 ? "广告位" : "banner";
            this.valuePosition = info.site;
            this.imgInput = info.pageUrl;
            this.imageUrl = info.image;
          }
        });
    },
    commitBtn() {
      //提交
      console.log(this.valueType);
      console.log(this.toastInfo.site, this.valuePosition);
      let name = "";
      if (this.valuePosition == 1) {
        name = "开屏";
      } else if (this.valuePosition == 2) {
        name = "弹窗";
      } else if (this.valuePosition == 3) {
        name = "轮播banner";
      } else if (this.valuePosition == 4) {
        name = "我的广告位";
      } else if (this.valuePosition == 5) {
        name = "首页广告位";
      }
      console.log(name);
      if (this.toastUse == "emit") {
        axios({
          method: "post",
          url: "/app/admin/v1/adver/updateById",
          params: {
            id: this.toastInfo.id.toString(),
            pageUrl: this.imgInput,
            image: this.imageUrl,
            type: this.valueType == "广告位" ? 1 : 2,
            site: this.valuePosition,
            name: name,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.dialogVisible = false;
            this.getList();
          }
        });
      } else if (this.toastUse == "add") {
        axios({
          method: "post",
          url: "/app/admin/v1/adver/insertAdver",
          params: {
            pageUrl: this.imgInput,
            image: this.imageUrl,
            type: this.valueType == "广告位" ? 1 : 2,
            site: this.valuePosition,
            name: name,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.dialogVisible = false;
            this.getList();
          }
        });
      }
    },
  },
});
