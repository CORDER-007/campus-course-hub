<template>
  <section class="page-container">
    <div class="page-title-row"><div><div class="eyebrow">MY WEEKLY SCHEDULE</div><h1>我的课表</h1><p>2026 秋季学期 · 第 2 教学周（9月7日 - 9月13日）</p></div><div class="title-actions"><div class="credit-chip"><Sparkles :size="16" /> 已选 {{ store.selectedCredits }} 学分</div><button class="secondary-btn" type="button" @click="printSchedule"><Printer :size="17" /> 打印课表</button></div></div>
    <div class="schedule-summary"><div><span>本周课程</span><strong>{{ store.selectedCourses.length }} <small>门</small></strong></div><div><span>总课时</span><strong>{{ store.selectedCourses.length * 2 }} <small>课时</small></strong></div><div><span>上课日</span><strong>{{ activeDays }} <small>天</small></strong></div><div class="schedule-tip"><CircleCheck :size="18" /><span>课程安排无时间冲突</span></div></div>
    <section class="panel timetable-panel"><div class="table-scroll"><div class="timetable"><div class="time-column"><div class="table-head blank"></div><div v-for="slot in slots" :key="slot.value" class="time-slot"><strong>{{ slot.value }}</strong><span>{{ slot.time }}</span></div></div><div v-for="day in days" :key="day.value" class="day-column"><div class="table-head"><strong>{{ day.label }}</strong><span>{{ day.date }}</span></div><div v-for="slot in slots" :key="slot.value" class="schedule-cell"><article v-for="course in getCourses(day.value, slot.value)" :key="course.id" class="schedule-course" :class="`course-${course.color}`"><strong>{{ course.name }}</strong><span>{{ course.room }}</span><small>{{ course.teacher }}</small><button type="button" title="退选" @click="drop(course)"><X :size="13" /></button></article></div></div></div></div><div v-if="!store.selectedCourses.length" class="empty-state"><CalendarDays :size="38" /><strong>课表还是空的</strong><span>从课程中心选择课程后，它们会出现在这里</span><RouterLink to="/courses" class="primary-btn">去选课</RouterLink></div></section>
    <div class="schedule-bottom"><section class="panel course-list-panel"><div class="panel-heading"><div><h2>已选课程</h2><p>点击退选按钮可调整课程安排</p></div><RouterLink to="/courses" class="text-link">继续选课 <ArrowUpRight :size="15" /></RouterLink></div><div v-if="store.selectedCourses.length" class="selected-table"><div class="selected-row header"><span>课程</span><span>时间地点</span><span>学分</span><span>操作</span></div><div v-for="course in store.selectedCourses" :key="course.id" class="selected-row"><div class="course-name-cell"><i :class="`dot-color ${course.color}`"></i><div><strong>{{ course.name }}</strong><small>{{ course.code }} · {{ course.teacher }}</small></div></div><span>{{ course.dayLabel }} {{ course.periods }} 节<br /><small>{{ course.room }}</small></span><strong>{{ course.credits }}</strong><button class="table-action" type="button" @click="drop(course)">退选</button></div></div><div v-else class="empty-state compact"><strong>暂无已选课程</strong><span>课程中心可以查看全部开放课程</span></div></section><section class="panel tips-panel"><div class="panel-heading"><div><h2>选课小贴士</h2><p>让你的课表更合理</p></div><Lightbulb :size="22" class="tip-icon" /></div><ul><li>优先选择培养方案中的专业必修课程。</li><li>选课前留意上课时间，系统会自动检测冲突。</li><li>建议将课程分散到不同教学日，保持学习节奏。</li><li>退改选截止时间：2026年9月18日 23:59。</li></ul></section></div>
  </section>
</template>
<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowUpRight, CalendarDays, CircleCheck, Lightbulb, Printer, Sparkles, X } from 'lucide-vue-next'
import { useCourseStore } from '../stores'
const store = useCourseStore()
const days = [{ label: '周一', date: '09/07', value: 1 }, { label: '周二', date: '09/08', value: 2 }, { label: '周三', date: '09/09', value: 3 }, { label: '周四', date: '09/10', value: 4 }, { label: '周五', date: '09/11', value: 5 }]
const slots = [{ value: '1-2', time: '08:00' }, { value: '3-4', time: '10:00' }, { value: '5-6', time: '14:00' }, { value: '7-8', time: '16:00' }]
const activeDays = computed(() => new Set(store.selectedCourses.map((course) => course.weekday)).size)
const getCourses = (weekday, periods) => store.selectedCourses.filter((course) => course.weekday === weekday && course.periods === periods)
const drop = (course) => { const result = store.dropCourse(course); ElMessage({ type: 'success', message: result.message }) }
const printSchedule = () => window.print()
</script>
