import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CoursesView from '../views/CoursesView.vue'
import ScheduleView from '../views/ScheduleView.vue'
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/', redirect: '/home' }, { path: '/home', component: HomeView, meta: { title: '学习总览' } },
  { path: '/courses', component: CoursesView, meta: { title: '课程中心' } }, { path: '/schedule', component: ScheduleView, meta: { title: '我的课表' } },
] })
export default router
