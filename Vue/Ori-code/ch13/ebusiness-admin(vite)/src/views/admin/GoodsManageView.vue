<template>
  <el-tabs type="border-card">
    <el-tab-pane label="商品管理">
      <el-form :inline="true" :model="searchParam" class="fl">
				<el-form-item label="商品类型">
					<el-select v-model="searchParam.typeid" placeholder="商品类型">
						<el-option label="---" value="0"></el-option>
						<el-option v-for="item in typeoptions" :key="item.typeid" :label="item.typename" :value="item.typeid" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit()">查询</el-button>
				</el-form-item>
        <el-form-item>
				  <el-button size="medium" type="success" @click="addFormVisible = true">新增</el-button>
				</el-form-item>
			</el-form>
      <el-table :data="result" border>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="gid" label="商品ID" width="150"></el-table-column>
        <el-table-column prop="gname" label="商品名称" width="200"></el-table-column>
        <el-table-column prop="typename" label="商品类型" width="150"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-row>
              <el-button size="small" type="success" @click="handleDetail(scope.row)">详情
              </el-button>
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
                title="真的删除吗？" @confirm="confirmEvent(scope.row, scope.$index)" @cancel="cancelEvent">
                <template #reference>
                  <el-button size="small" type="danger">删除
                  </el-button>
                </template>
              </el-popconfirm>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination background layout="total, prev, pager, next" v-model:currentPage="currentPage"
          :page-size="pageSize" :total="total" />
      </div>
    </el-tab-pane>
  </el-tabs>
  <el-dialog v-model="addFormVisible" title="增加商品">
    <el-form :model="addForm" class="fl" ref="addForm" :rules="rules">
      <el-form-item label="商品名称" prop="gname">
        <el-input v-model="addForm.gname" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="商品价格" prop="gprice">
        <el-input v-model="addForm.gprice" placeholder="请输入商品价格" />
      </el-form-item>
      <el-form-item label="商品库存" prop="gstore">
        <el-input v-model="addForm.gstore" placeholder="请输入商品库存" />
      </el-form-item>
      <el-form-item label="商品图片">
         <el-upload
          accept=".jpg,.png"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :file-list="fileList"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <br/>
          <el-button type="success" @click="submitUpload"> 点击上传 </el-button>
          <template #tip>
            <div style="color: red">只能上传.jpg,.png文件</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-radio-group v-model="addForm.isrec">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否广告">
        <el-radio-group v-model="addForm.isadv">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品类型" prop="typeid">
        <el-select v-model="addForm.typeid" clearable placeholder="Select">
          <el-option v-for="item in typeoptions" :key="item.typeid" :label="item.typename" :value="item.typeid" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button @click="addFormVisible = false">取消</el-button>
    <el-button type="primary" @click="add()">新增</el-button>
  </el-dialog>

  <el-dialog title="商品修改" v-model="updateFormVisible">
    <el-form :model="detailData" class="fl" ref="detailData" :rules="rules" >
      <el-form-item label="商品ID">
        <el-input v-model="detailData.gid" disabled/>
      </el-form-item>
      <el-form-item label="商品名称" prop="gname">
        <el-input v-model="detailData.gname"/>
      </el-form-item>
      <el-form-item label="商品价格" prop="gprice">
        <el-input v-model="detailData.gprice"/>
      </el-form-item>
      <el-form-item label="商品库存" prop="gstore">
        <el-input v-model="detailData.gstore"/>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-image :src="imgurl" style="width: 100px; height: 100px"/>
         <el-upload
          accept=".jpg,.png"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :file-list="fileList"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <br/>
          <el-button type="success" @click="submitUpload"> 点击上传 </el-button>
          <template #tip>
            <div style="color: red">只能上传.jpg,.png文件</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-radio-group v-model="detailData.isrec">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否广告">
        <el-radio-group v-model="detailData.isadv">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品类型" prop="typeid">
        <el-select v-model="detailData.typeid">
          <el-option v-for="item in typeoptions" :key="item.typeid" :label="item.typename" :value="item.typeid" />
        </el-select>
      </el-form-item>
        <el-button @click="updateFormVisible = false">取消</el-button>
        <el-button type="primary" @click="update()">修改</el-button>
    </el-form>
  </el-dialog>

  <el-dialog title="商品详情" v-model="detailFormVisible">
    <el-form :model="detailData" class="fl" ref="detailData" disabled >
      <el-form-item label="商品名称">
        <el-input v-model="detailData.gname"/>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="detailData.gprice"/>
      </el-form-item>
      <el-form-item label="商品库存">
        <el-input v-model="detailData.gstore"/>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-image :src="imgurl" style="width: 100px; height: 100px"/>
      </el-form-item>
      <el-form-item label="是否推荐">
        <el-radio-group v-model="detailData.isrec">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否广告">
        <el-radio-group v-model="detailData.isadv">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品类型">
        <el-select v-model="detailData.typeid">
          <el-option v-for="item in typeoptions" :key="item.typeid" :label="item.typename" :value="item.typeid" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
import { ElMessage } from 'element-plus'
export default {
  data() {
    return {
      result: [
        {
          gid: 1000,
          gname: '家电1号',
          gprice: 100.0,
          gstore: 1000,
          gpicture: '../../assets/99.jpg',
          isrec: '1',
          isadv: '2',
          typeid: 1000,
          typename: '家电'
        },
        {
          gid: 1001,
          gname: '水果1号',
          gprice: 200.0,
          gstore: 2000,
          gpicture: '../../assets/101.jpg',
          isrec: '2',
          isadv: '1',
          typeid: 1001,
          typename: '水果'
        },
        {
          gid: 1002,
          gname: '文具1号',
          gprice: 300.0,
          gstore: 3000,
          gpicture: '../../assets/108.jpg',
          isrec: '2',
          isadv: '2',
          typeid: 1002,
          typename: '文具'
        }
      ],
       //备份原始数据
      resultcopy: [],
      addFormVisible: false,
      updateFormVisible: false,
      detailFormVisible: false,
      searchParam: {},
      fileList: [],
      //打开新增对话框时，界面的默认值
      addForm: {
        typeid: '',
        gpicture: '',
        typename: '',
        isrec: '2',
        isadv: '2'
      },
      //验证规则
      rules: {
        gname: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        gprice: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        gstore: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        typeid: [{ required: true, message: '请选择商品类型', trigger: 'change' }]
      },
      detailData: {},
      //在vite中不能使用require引入图片资源
      imgurl: new URL('../../assets/99.jpg', import.meta.url).href,
      total: 3,
      pageSize: 2,
      currentPage: 1,
      typeoptions: [
        {
          typeid: 1000,
          typename: '家电'
        },
        {
          typeid: 1001,
          typename: '水果'
        },
        {
          typeid: 1002,
          typename: '文具'
        }
      ],
    }
  },
  methods: {
    handleExceed() {
      ElMessage.warning(
        "您已经选择了一个文件，如需切换请删除第一个文件后再添加！！！"
      );
    },
    submitUpload() {
      if (this.fileList.length == 0) 
        ElMessage.error("请先添加文件！！")
      else {
        //fileData提交给服务器的文件对象
        //let fileData = new FormData()
        //"file"为form中的参数名
        //fileData.append("file",this.fileList[0].raw)
        //alert(this.fileList[0].raw.name)
        //模拟时，图片固定值
        this.addForm.gpicture = '../../assets/108.jpg'
      }
    },
    onSubmit(){//查询
      let resultserach = []
      for(let i = 0; i < this.resultcopy.length; i++){
        //没有选择类型
        if(this.searchParam.typeid === '0'){
           resultserach = this.resultcopy
           break
        }
        if(this.resultcopy[i].typeid ===  this.searchParam.typeid){
          resultserach.push(this.resultcopy[i])
        }
      }
      this.result = resultserach
      this.total = this.result.length
    },
    add() {//新增
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addForm.gid = this.result[this.result.length - 1].gid + 1
          //商品类型
          for(let i = 0; i < this.typeoptions.length; i++){
            if(this.typeoptions[i].typeid ===  this.addForm.typeid){
              this.addForm.typename = this.typeoptions[i].typename
              break
            }
          }
          this.result.push(this.addForm)
          this.total = this.result.length
          ElMessage({ message: '新增成功', type: 'success' })
          this.addFormVisible = false
        }
        else {
          ElMessage.error('表单验证失败')
        }
      })
    },
    update() {
      this.$refs['detailData'].validate((valid) => {
        if (valid) {
           //商品类型
          for(let i = 0; i < this.typeoptions.length; i++){
            if(this.typeoptions[i].typeid ===  this.detailData.typeid){
              this.detailData.typename = this.typeoptions[i].typename
              break
            }
          }
          //修改数组元素
          this.result.map(t => {
            return t.gid === this.detailData.gid ? this.detailData : t
          })
          ElMessage({ message: '修改成功', type: 'success' })
        }
        else {
          ElMessage.error('表单验证失败')
          return false
        }
      })
      this.updateFormVisible = false
    },
    //编辑
    handleEdit(row) {
      this.detailData = row
      const gpic = this.detailData.gpicture
      const start = gpic.lastIndexOf('/')
      //在vite中不能使用require引入图片资源
      this.imgurl = new URL('../../assets' + gpic.slice(start), import.meta.url).href 
      this.updateFormVisible = true
    },
    //详情
    handleDetail(row) {
      this.detailData = row
      const gpic = this.detailData.gpicture
      const start = gpic.lastIndexOf('/')
      //在vite中不能使用require引入图片资源
      this.imgurl = new URL('../../assets' + gpic.slice(start), import.meta.url).href 
      this.detailFormVisible = true
    },
    confirmEvent(row, index) {
      //删除一个元素
      this.result.splice(index, 1)
      this.total = this.result.length
    },
    cancelEvent() {
    }
  },
  mounted() {
      //备份数据 以便查询
      this.resultcopy = this.result
  }
}
</script>