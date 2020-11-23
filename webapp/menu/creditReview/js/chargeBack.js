new Vue({
  el: "#iframe-content",
  data: {
    currentPage: 1, //默认第一页
    chooseStatus: 14, // 14:未审核 12：审核通过 13：审核驳回
    dialogFormVisible: false, //是否显示弹窗
    phoneNum: "", //输入手机号查询
    totalNum: 0,
    radio: 12, //12:通过 13：驳回
    size: 20,
    list: [],
    toastInfo: {}, //弹框信息
    toastImgs: [], //弹框图片
    textarea: "", //驳回原因
    disabled: false, //禁止输入
    options: [],
    value: ''
  },
  created() {
    this.getList(this.chooseStatus, this.currentPage);
  },
  mounted() {},
  methods: {
    getList(status, page,phone) {
      //status:审核状态 page:页码
      //获取列表信息
      let param = {
        status: status,
        page: page,
        size: this.size,
        phone:phone
      };
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/order/orderByStatus", { params: param })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            if (res.data.data) {
              this.list = res.data.data.list;
              this.totalNum = res.data.data.total;
            } else {
              this.list = [];
              this.totalNum = 0;
            }
          }
        });
    },
    clickTabOne() {
      //未审核
      this.chooseStatus = 14;
      this.currentPage = 1;
      this.phoneNum = "";
      this.getList(this.chooseStatus, this.currentPage);
    },
    clickTabTwo() {
      //审核通过
      this.chooseStatus = 12;
      this.currentPage = 1;
      this.phoneNum = "";
      this.getList(this.chooseStatus, this.currentPage);
    },
    clickTabThree() {
      //审核驳回
      this.chooseStatus = 13;
      this.currentPage = 1;
      this.phoneNum = "";
      this.getList(this.chooseStatus, this.currentPage);
    },
    handleCurrentChange(val) {
      //分页
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList(this.chooseStatus, this.currentPage,this.phoneNum);
    },
    showDigo(item) {
      //点击查看
      console.log(item);
      this.options=[];
      this.value = '';
      this.radio = 12;
      this.dialogFormVisible = true;
      this.toastInfo = item;
      this.toastInfo.phoneTimeList.forEach(item => {
        this.options.push({
          value:item,
          label: item
        })
      });
      this.toastImgs = this.toastInfo.singleImage.split(",");
      this.$nextTick(() => {
        //点击放大图片
        $("#jqhtml").viewer({
          url: "data-original",
          toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: false,
            reset: false,
            prev: false,
            play: {
              show: 4,
              size: "large",
            },
            next: false,
            rotateLeft: false,
            rotateRight: false,
            flipHorizontal: 4,
            flipVertical: 4,
          },
        });
      });
    },
    submitBtn(orderId) {
      console.log(orderId, this.radio);
      let param = {};
      if (this.radio == 13) {
        //驳回
        if (!this.textarea) {
          this.$message({
            message: "请输入驳回原因",
            type: "warning",
          });
        } else {
          console.log(this.textarea);
          param = {
            orderId: orderId,
            status: this.radio,
            rejectReason: this.textarea,
          };
          this.singPost(param);
        }
      } else {
        console.log(orderId, this.radio);
        param = {
          orderId: orderId,
          status: this.radio,
        };
        this.singPost(param);
      }
      // parent.modal.loaders("block");
      // axios({
      //   method: "post",
      //   url: "/app/admin/v1/order/singleAuthOrder",
      //   params: {
      //     orderId: orderId,
      //     status: this.radio,
      //     rejectReason: this.textarea,
      //   },
      // }).then((res) => {
      //   console.log(res);
      //   if (res.data.code == 200) {
      //     parent.modal.loaders();
      //     this.dialogFormVisible = false;
      //     this.getList(this.chooseStatus, this.currentPage);
      //   }
      // });
    },
    singPost(param) {
      parent.modal.loaders("block");
      axios({
        method: "post",
        url: "/app/admin/v1/order/singleAuthOrder",
        params: param,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          parent.modal.loaders();
          this.dialogFormVisible = false;
          this.getList(this.chooseStatus, this.currentPage);
        }
      });
    },
    phoneList() {
      console.log(this.phoneNum, this.chooseStatus);
      let param = {
        status: this.chooseStatus,
        page: this.currentPage,
        size: this.size,
        phone: this.phoneNum,
      };
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/order/orderByStatus", { params: param })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            if (res.data.data) {
              this.list = res.data.data.list;
              this.totalNum = res.data.data.total;
            } else {
              this.list = [];
              this.totalNum = 0;
            }
          }
        });
    },
  },
});
