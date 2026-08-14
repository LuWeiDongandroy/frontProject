<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { menuItems } from '../router/menu.js'

const route = useRoute()
const active = computed(() => route.path)
</script>

<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="brand">
        <span class="mark">Troy</span>
        <span class="brand-sub">会飞的特洛伊</span>
      </div>
      <el-menu :default-active="active" router class="side-menu">
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main class="main">
        <router-view />
      </el-main>
      <el-footer class="foot" height="56px">
        <p>© {{ new Date().getFullYear() }} 会飞的特洛伊</p>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--sky-mid);
}

.aside {
  background: #152029;
  color: #f4f7f8;
  display: flex;
  flex-direction: column;
  border-right: none;
}

.brand {
  padding: 28px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mark {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.35rem;
  letter-spacing: 0.04em;
}

.brand-sub {
  font-size: 0.82rem;
  color: rgba(244, 247, 248, 0.65);
}

.side-menu {
  border-right: none;
  background: transparent;
  flex: 1;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: rgba(244, 247, 248, 0.82);
  --el-menu-active-color: #fff;
  --el-menu-hover-bg-color: rgba(13, 115, 119, 0.35);
  --el-menu-hover-text-color: #fff;
}

.side-menu :deep(.el-menu-item) {
  color: rgba(244, 247, 248, 0.82);
}

.side-menu :deep(.el-menu-item:hover),
.side-menu :deep(.el-menu-item.is-active) {
  background: rgba(13, 115, 119, 0.35) !important;
  color: #fff;
}

.main {
  padding: clamp(24px, 4vw, 48px);
  max-width: 960px;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-size: 0.88rem;
  border-top: 1px solid var(--line);
  background: transparent;
}
</style>
