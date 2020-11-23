new Vue({
  el: "#iframe-content",
  data: {
    currentPage: 1, //默认第一页
    chooseStatus: 1, // 1:未审核 2：审核通过 3：审核驳回
    name: "",
    city: "",
    phone: "",
    companyType: "",
    companyName: "",
    companyAdress: "",
    idCard: [], //身份证照片
    faceImage: "", //活体照片
    prove: [], //资质证明
    radio: 2, //2:通过 3：驳回
    dialogFormVisible: false, //是否显示弹窗
    infoList: [],
    commitId: 0,
    phoneNum: "", //输入手机号查询
    totalNum: 0,
    videoUrl:'',
    remark:''
  },
  created() {
    this.getList(this.chooseStatus, this.currentPage);
  },
  mounted() {},
  watch: {},
  methods: {
    //token:9imqY2YCbQOW6stVD+gkWdrujkEE5v8yHqJBqUV45z8=
    getList(authStatus, page) {
      let param = {
        authStatus: authStatus,
        page: page,
      };
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/auth/queryList", { params: param })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            this.infoList = res.data.data.list;
            this.totalNum = res.data.data.count;
            console.log(this.infoList);
          }
        });
    },
    handleCurrentChange(val) {
      //分页
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList(this.chooseStatus, this.currentPage);
    },
    clickTabOne() {
      this.chooseStatus = 1;
      this.currentPage = 1;
      this.phoneNum = "";
      this.getList(this.chooseStatus, this.currentPage);
    },
    clickTabTwo() {
      this.chooseStatus = 2;
      this.currentPage = 1;
      this.phoneNum = "";
      this.getList(this.chooseStatus, this.currentPage);
    },
    clickTabThree() {
      this.chooseStatus = 3;
      this.currentPage = 1;
      this.phoneNum = "";
      this.getList(this.chooseStatus, this.currentPage);
    },
    showDigo(id) {
      //展示弹窗信息
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/auth/queryByPhoneAuthInfo", {
          params: { id: id },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            let info = res.data.data;
            this.dialogFormVisible = true;
            this.radio = 2;
            this.name = info.realName;
            this.city = info.qualificaAuth ? info.qualificaAuth.city : "";
            this.phone = info.phone;
            this.companyType = info.qualificaAuth
              ? info.qualificaAuth.companyType
              : "";
            this.companyName = info.qualificaAuth
              ? info.qualificaAuth.companyName
              : "";
            this.companyAdress = info.qualificaAuth
              ? info.qualificaAuth.address
              : "";
            this.idCard = []; //身份证信息
            this.idCard.push(info.idcardBack);
            this.idCard.push(info.idcardFront);
            this.faceImage = info.faceImage;
            this.prove = [];
            this.prove.push(info.qualificaAuth ? info.qualificaAuth.logo : "");
            if(info.qualificaAuth.means){
              this.prove.push(info.qualificaAuth ? info.qualificaAuth.means : "");
            }
            if(info.qualificaAuth.contracts){
              this.prove.push(info.qualificaAuth ? info.qualificaAuth.contracts : "");
            }
            this.videoUrl = info.qualificaAuth ? info.qualificaAuth.videoUrl : "";
            this.remark = info.remark;
            this.commitId = info.id;
            this.$nextTick(() => {
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
          }
        });
    },
    phoneList() {
      console.log(this.phoneNum, this.chooseStatus);
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/auth/queryList", {
          params: { phone: this.phoneNum, authStatus: this.chooseStatus },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            this.infoList = res.data.data.list;
            this.totalNum = res.data.data.count;
            console.log(this.infoList);
          }
        });
    },
    searchCom() {
      if (this.companyName) {
        window.open("https://www.qcc.com/search?key=" + this.companyName);
      }
    },
    commitBtn() {
      console.log(this.radio, this.commitId);
      axios({
        method: "post",
        url: "/app/admin/v1/auth/updateStatus",
        params: {
          id: Number(this.commitId),
          status: Number(this.radio),
          remark:this.remark
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          parent.modal.loaders();
          this.dialogFormVisible = false;
          this.getList(this.chooseStatus, this.currentPage);
          this.sendCode();
        }
      });
    },
    sendCode(){
      axios({
        method: "post",
        url: "/app/admin/v1/auth/sendVerifiyCode",
        params: {
          phone: this.phone,
          status: Number(this.radio)==2?1:0,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          
        }
      });
    }
  },
});
