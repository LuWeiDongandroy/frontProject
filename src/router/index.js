import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import AboutView from '../views/AboutView.vue'
import MottoView from '../views/MottoView.vue'
import FocusView from '../views/FocusView.vue'
import AgentsView from '../views/AgentsView.vue'
import FormView from '../views/FormView.vue'

export const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/about' },
      { path: 'about', name: 'about', component: AboutView, meta: { title: '简介' } },
      { path: 'motto', name: 'motto', component: MottoView, meta: { title: '座右铭' } },
      { path: 'focus', name: 'focus', component: FocusView, meta: { title: '方向' } },
      { path: 'agents', name: 'agents', component: AgentsView, meta: { title: 'Agent' } },
      { path: 'form', name: 'form', component: FormView, meta: { title: '表单填写' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
