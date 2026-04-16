<template>
  <el-tabs type="border-card">
    <el-tab-pane label="类型管理">
      <div class="fl" style="margin-top: -10px;margin-bottom: 10px;">
        <el-button size="medium" type="success" @click="openadd()">增加</el-button>
      </div>
      <el-table :data="result" border>
        <el-table-column type="index" label="序号" width="150"></el-table-column>
        <el-table-column prop="typeid" label="类型ID" width="150"></el-table-column>
        <el-table-column prop="typename" label="类型名称" width="150"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-row>
              <el-button size="small" type="primary"  @click="handleEdit(scope.row)">编辑
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
  <el-dialog v-model="addFormVisible" title="新增类型">
    <el-form :model="addForm" ref="addFormRef" :rules="rules">
      <el-input v-model="addForm.typeid" type="hidden" />
      <el-form-item label="类型名称" prop="typename">
        <el-input v-model="addForm.typename" placeholder="请输入类型名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addCancel()">取消</el-button>
        <el-button type="primary" @click="add(addFormRef)">新增</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="类型修改" v-model="updateFormVisible">
    <el-form ref="detailDataRef" :model="detailData" :rules="rules">
      <el-form-item label="类型ID" prop="typeid">
        <el-input v-model="detailData.typeid" disabled></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="typename">
        <el-input v-model="detailData.typename"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateFormVisible = false">取消</el-button>
        <el-button type="primary" @click="update(detailDataRef)">修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
//1.在script标签上添加setup属性即变为糖衣语法，相当于整个script就是组件的setup函数
//2.在语法糖中，省略了导出export default() 省略了setup函数，省略了return()
//3.定义的数据无需return即可在模板和样式中调用
//4.语法糖中，子组件导入即可使用，无需在components中注册
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
//reactive创建一个具有响应式的对象数据，使用reactive时，可以用toRefs解构导出，在template就可以直接使用了
let result = reactive([
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
])
//ref创建一个具有响应式的基本数据类型的数据
let addFormVisible = ref(false)
let updateFormVisible = ref(false)
let addFormRef = reactive({})
let addForm = reactive({})
//验证规则
const rules = reactive({
  typename: [
    { required: true, message: '请输入类型名称', trigger: 'blur' },
    { min: 2, max: 5, message: '类型名称长度为3到5', trigger: 'blur' }
  ]
})
let detailDataRef = reactive({})
let detailData = reactive({})
let total = ref(3)
let pageSize = ref(2)
let currentPage = ref(1)
//打开新增窗口
const openadd = () => {
  //使用ref在setup读取的时候需要获取xxx.value，但在template中不需要
  addFormVisible.value = true
  addForm.typeid = ''
  addForm.typename = ''
}
//新增
const add = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      addForm.typeid = result[result.length - 1].typeid + 1
      result.push({//这里不能直接把addForm对象添加到result数组
        typeid: addForm.typeid,
        typename: addForm.typename
      })
      total.value = result.length
      addFormVisible.value = false
      ElMessage({message: '新增成功',type: 'success'})
    } else {
      ElMessage.error('表单验证失败')
    }
  })
}
//新增对话框取消
const addCancel = () => {
    addFormVisible.value = false
    addForm.resetFields()
}
//修改按钮
const update =  async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
       //修改数组元素
      result.map(t => {
        if(t.typeid === detailData.typeid){
          t.typename = detailData.typename
          //不能t = detailData，可以写成Object.assign(t, detailData)
        }
        return t
      })
      ElMessage({message: '修改成功',type: 'success'})
      updateFormVisible.value = false
    } else {
      ElMessage.error('表单验证失败')
    }
  })
}
//编辑按钮
const handleEdit = (row) => {
  detailData.typeid = row.typeid
  detailData.typename =  row.typename
  updateFormVisible.value = true
}
//删除
const confirmEvent = (row, index) => {
  //删除一个元素
  result.splice(index, 1)
  total.value = result.length
  ElMessage({message: '删除成功',type: 'success'})
}
const cancelEvent = () => {
}
</script>
