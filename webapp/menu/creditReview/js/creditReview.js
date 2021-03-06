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
    faceImage: [], //活体照片
    prove: [], //资质证明
    radio: 2, //2:通过 3：驳回
    dialogFormVisible: false, //是否显示弹窗
    infoList: [],
    commitId: 0,
    phoneNum: "", //输入手机号查询
    totalNum: 0,
    videoUrl:'',
    remark:'',//输入驳回原因
    infoRemark:'',//上次驳回原因
    pointsAdminToast:false,//信用分账号管理窗口
    deleteInfo:{},//账号管理信息
    deletePoint:'',//扣除信用分
    deleteList:[],
    clearInfoToast:false,//清认证信息弹窗
    clearInput:'',//输入清认证信息原因
    clearId:'',
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
      this.selectPoint();
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
            // this.faceImage = info.faceImage;
            this.faceImage = [];
            this.faceImage.push(info.faceImage);
            this.prove = [];
            this.prove.push(info.qualificaAuth ? info.qualificaAuth.logo : "");
            if(info.qualificaAuth.means){
              // this.prove.push(info.qualificaAuth ? info.qualificaAuth.means : "");
              this.prove.push(info.qualificaAuth.means);
            }
            this.prove.push(info.qualificaAuth ? info.qualificaAuth.contracts : "");
            console.log(this.prove)
            this.videoUrl = info.qualificaAuth ? info.qualificaAuth.videoUrl : "";
            this.remark = info.remark;
            this.infoRemark = info.remark;
            this.commitId = info.id;
            // this.$nextTick(() => {
            //   $("#jqhtml").viewer({
            //     url: "data-original",
            //     toolbar: {
            //       zoomIn: 4,
            //       zoomOut: 4,
            //       oneToOne: false,
            //       reset: false,
            //       prev: false,
            //       play: {
            //         show: 4,
            //         size: "large",
            //       },
            //       next: false,
            //       rotateLeft: false,
            //       rotateRight: false,
            //       flipHorizontal: 4,
            //       flipVertical: 4
            //     },
            //   });
            // });
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
    },
    showPoint(id){//信用分管理
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/credit/user/info", {
          params: { userId: id},
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            this.pointsAdminToast = true;
            this.deleteInfo = res.data.data;
          }
        });
    },
    selectPoint(){
      parent.modal.loaders("block");
      axios
        .get("/app/admin/v1/credit/query/points", {
          params: { type: 0},
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            this.deleteList = res.data.data;
          }
        });
    },
    subPoint(userId){
      if(this.deletePoint){
        parent.modal.loaders("block");
        axios({
          method: "post",
          url: "/app/admin/v1/credit/reduce/score",
          params: {
            userId: userId,
            id: this.deletePoint,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.pointsAdminToast = false;
            this.deletePoint = '';
            parent.modal.loaders();
          }
        });
      }else{
        this.$message({
          message: "请选择扣分项",
          type: "warning",
        });
      }
    },
    getTime (time) {
      if (time.split("T").length) {
        return time.split("T")[0] + ' ' + time.split("T")[1]
      }
    },
    clearInfo(id){//清认证信息
      this.clearInfoToast = true;
      this.clearId = id;
    },
    subClear(){//清认证信息确认按钮
      if(this.clearInput){
        parent.modal.loaders("block");
        axios
        .get("/app/admin/v1/auth/authIofo", {
          params: { userId: this.clearId,remark:this.clearInput},
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            parent.modal.loaders();
            this.clearInfoToast = false;
            this.clearInput = '';
          }
        });
      }else{
        this.$message({
          message: "请输入原因",
          type: "warning",
        });
      }
    }
  },
});
