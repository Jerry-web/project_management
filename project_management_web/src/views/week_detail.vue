<template>
  <div>
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-10">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20" :to="{ path: '/common/weekReport' }">周报管理</el-breadcrumb-item>
        <el-breadcrumb-item>周报详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1000px;padding:  10px 20px">
      <div class="itme-title">周报基本信息
        <el-button type="primary"  style="float: right;margin-top: -5px"  size="small" plain @click="reportFormOpen()"><i class="fa fa-edit margin-right-5"></i>修改</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>
          <tr>
            <td width="150" class="info-title">标题</td>
            <td colspan="3">{{weekInfo.report_title}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">时间</td>
            <td colspan="3">{{weekInfo.report_time}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">周报汇总</td>
            <td colspan="3"  v-html='weekInfo.report_content'></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="itme-title margin-top-20">列表
        <el-button type="success"  style="float: right;margin-top: -5px"  size="small" plain @click="peopleFormOpen('add')"><i class="fa fa-plus margin-right-5"></i>新增</el-button>
      </div>
      <div class="padding-10">
        <el-table :data="weekPeopleList" border style="width: 100%;margin-top:10px;">
          <el-table-column label="序号" width="60" type="index" :index="indexMethod" ></el-table-column>
          <el-table-column prop="user_name" width="100" label="姓名"></el-table-column>
          <el-table-column  label="工作内容">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="primary" v-show="loginUser.user_id==scope.row.user_id" title="编辑" size="small" @click="peopleFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
              <!--<el-button type="danger" size="small" icon="el-icon-delete" @click="userDeleteOpen(scope.row.user_id)" circle></el-button>-->
              <el-button type="danger" v-show="loginUser.user_id==scope.row.user_id" title="删除记录" style="margin-left:5px;" size="small" @click="recordDeleteOpen(scope.row.wd_id)" icon="el-icon-delete" circle></el-button>

            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog :title="reportTitle" :visible.sync="reportFormVisible"  width="900px">
        <el-form :model="weekReport"   ref="weekReport" label-width="80px">
          <el-form-item label="标题" prop="report_title">
            <el-input  placeholder="请输入标题" v-model="weekReport.report_title"></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="report_time">
            <el-date-picker type="date" style="width: 100%" value-format="yyyy-MM-dd" placeholder="选择时间" v-model="weekReport.report_time"></el-date-picker>
          </el-form-item>
          <el-form-item label="周报汇总"  prop="content">
            <div class="demand-editor">
              <UE1 :defaultMsg='reportcontent' :config=ueconfig  ref="ue"></UE1>
            </div>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reportFormVisible = false">取消</el-button>
          <el-button type="primary" @click="reportSubmit">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog class="bug-record-panel" width="900px" :title="title" :visible.sync="bugRecordFormVisible" :close-on-click-modal="false"  >
        <el-form :model="peopleRecordForm" :rules="bugRecordRules" label-width="80px"  ref="peopleRecordForm"  style="padding: 0 20px">
          <!-- <el-form-item label="姓名" prop="user_name" >
             <el-input  placeholder="请输入创建人" v-model="peopleRecordForm.user_name"></el-input>
           </el-form-item>-->
          <el-form-item label="工作内容"  prop="content">
            <div class="demand-editor">
              <UE :defaultMsg='uecontent' :config=ueconfig  ref="ue"></UE>
            </div>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="bugRecordFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="peopleRecordSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <el-dialog title="删除记录" :visible.sync="dialogDeleteVisible" width="500px">
        <div class="fs16 danger">
          确定要删除该记录吗？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deleteSubmit">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import UE from '@/components/ue.vue';
  import UE1 from '@/components/ue_sub.vue';
  export default {
    components: {UE,UE1},
    data(){
      return {
        dialogDeleteVisible:false,
        reportFormVisible:false,
        weekPeopleList:[],
        loginUser:JSON.parse(sessionStorage.getItem('user')),
        delId:'',
        weekReport:{},
        weekInfo:{
          report_title:'',
          report_time:''
        },
        currentPage:1,
        weekType:'add',
        weekId:this.$route.params.week_report_id,
        uecontent:"",
        reportcontent:"",
        ueconfig: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          wordCount: false,
          toolbars:this.config.ueditorToolbar
        },
        title:'新增',
        reportTitle:'周报修改',
        bugRecordFormVisible:false,
        bugRecordRules:{
          user_name:[
            {required:true,message:'请输入姓名',trigger:'blur'}
          ]
        },
        peopleRecordForm:{
          user_name:'',
          content:''
        }
      }
    },
    created(){
      this.getWeekBasic();
      this.getRecordList();
    },
    methods:{
      getWeekBasic:function() {
        var vm = this;
        vm.$http({
          method: 'post',
          data:{week_report_id:vm.$route.params.week_report_id},
          url: vm.config.baseUrl+'week/weekDetail'
        }).then(function (result) {
          var data = result.data;
          var response = data.code;
          if(response==0){
            vm.weekInfo = data.week;
            vm.weekReport=JSON.parse(JSON.stringify(data.week));
            vm.reportcontent=vm.weekReport.report_content;
          }
        })
      },
      reportFormOpen:function () {
        this.reportFormVisible = true;
        this.weekReport=JSON.parse(JSON.stringify( this.weekInfo));
        this.reportcontent=this.weekReport.report_content?this.weekReport.report_content:"";
      },
      reportSubmit:function () {
        var vm=this;
        vm.$refs['weekReport'].validate((valid) => {
          if (valid) {
            var reportInfo = this.weekReport;
            reportInfo.report_content=vm.$refs.ue.getUEContent();
            if(reportInfo.report_time!=null&&reportInfo.report_time.length>1){
              reportInfo.report_time=vm.$moment(reportInfo.report_time).format("YYYY-MM-DD HH:mm:ss");
            }
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'week/updateWeek',
              data: reportInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.reportFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getWeekBasic()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      peopleFormOpen:function (type,obj) {
        this.weekType = type;
        this.bugRecordFormVisible=true;
        this.uecontent = " ";
        if(type=='add'){
          this.title = '新增';

          if(this.$refs['peopleRecordForm']!=undefined){
            this.$refs['peopleRecordForm'].resetFields();
          }


        }else{
          this.title = '修改';
          this.peopleRecordForm=JSON.parse(JSON.stringify(obj));
          this.uecontent =  this.peopleRecordForm.content;

        }
        this.peopleRecordForm.user_name=this.loginUser.full_name;
        this.peopleRecordForm.user_id=this.loginUser.user_id
      },
      indexMethod:function (index) {
        var vm=this;
        return (vm.currentPage-1)*10+index+1;
      },
      peopleRecordSubmit:function(){
        var vm = this;
        vm.$refs['peopleRecordForm'].validate((valid) => {
          if(valid){
            var peopleInfo = vm.peopleRecordForm;
            peopleInfo.content = vm.$refs.ue.getUEContent();
            peopleInfo.week_id = vm.weekId;
            var url = '';
            if(vm.weekType=='add'){
              url = 'week/addWeekRecord'
            }else{
              url = 'week/updateRecord'
            }
            vm.$http({
              method:'post',
              url:this.config.baseUrl + url ,
              data:peopleInfo
            }).then(function (result) {
              var data = result.data;
              var status = data.code;
              if(status==0){
                vm.bugRecordFormVisible=false;
                vm.$message({message:'提交成功！',type:'success'});
                vm.getRecordList();
              }
            })
          }
        })
      },
      getRecordList: function () {
        var vm = this;
        vm.$http({
          params:{week_id:vm.weekId},
          url: vm.config.baseUrl+'week/getRecordList'
        }).then(function (result) {
          var data = result.data;
          var response = data.code;
          if(response==0){
            vm.weekPeopleList = data.recordList;
          }
        })
      },
      recordDeleteOpen:function(deleteId){
        this.dialogDeleteVisible = true;
        this.delId = deleteId;
      },

      deleteSubmit: function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: vm.config.baseUrl + 'week/deleteRecord',
          data: {wd_id:vm.delId}
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.dialogDeleteVisible = false;
            vm.getRecordList();
            vm.$message({message: '删除成功！！', type: 'success'});
          } else {
            vm.$message.error('提交失败！！');
          }
        })
      },
    }
  }
</script>

<style>
  .p-header{
    background-color: #324157;
    text-align: left;
  }
  .header-title{
    color: aliceblue;
    height: 60px;
    line-height: 60px;
    font-size: 23px;
    margin-left: 10px;
    letter-spacing:8px;
  }
  .add-project .el-dialog__body{
    padding:10px 20px;
  }
  .itme-title{
    padding: 12px 20px;
    background-color: #e9e9e9;
    font-size: 15px;
    border-radius: 5px;
    font-weight: 600;
  }
  .info-title{
    text-align: center;
    background-color: #f9f9f9;
    font-weight: 600;

  }
  .home-table tbody td{
    padding: 12px!important;
  }
  .demand-editor {
    line-height: 20px;
  }
  .bug-content table td{
    border: 1px solid #ddd;
  }
</style>
