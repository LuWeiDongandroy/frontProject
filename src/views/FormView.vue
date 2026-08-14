<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { emptyForm, formRules, loadSubmissions, submitForm } from './form.js'

const formRef = ref()
const form = reactive(emptyForm())
const submissions = ref([])

async function refreshList() {
  try {
    submissions.value = await loadSubmissions()
  } catch {
    ElMessage.error('无法加载已提交记录，请确认后端已启动')
  }
}

async function onSubmit() {
  let result
  try {
    result = await submitForm(form)
  } catch {
    ElMessage.error('无法连接后端，请确认服务已启动')
    return
  }
  if (!result.ok) {
    await formRef.value?.validate().catch(() => {})
    return
  }
  ElMessage.success(result.message)
  formRef.value?.resetFields()
  await refreshList()
}

onMounted(refreshList)
</script>

<template>
  <section class="page form-page">
    <h2 class="section-title">表单填写</h2>
    <p class="section-desc">填写基本信息后提交，数据会保存到后端，刷新页面后仍可看到。</p>

    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="72px"
      class="profile-form"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请填写姓名" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请填写电话" maxlength="11" />
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="form.address" placeholder="请填写住址" />
      </el-form-item>
      <el-form-item label="职业" prop="occupation">
        <el-input v-model="form.occupation" placeholder="请填写职业" />
      </el-form-item>
      <el-form-item label="爱好" prop="hobby">
        <el-input v-model="form.hobby" placeholder="请填写爱好" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">提交</el-button>
      </el-form-item>
    </el-form>

    <div class="submission-list">
      <h3 class="section-title">已提交记录</h3>
      <p v-if="!submissions.length" class="section-desc">还没有提交记录。</p>
      <ul v-else>
        <li v-for="item in submissions" :key="item.id" class="submission-item">
          <strong>{{ item.name }}</strong>
          <span>{{ item.phone }}</span>
          <span>{{ item.occupation }}</span>
          <span>{{ item.address }}</span>
          <span>{{ item.hobby }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
