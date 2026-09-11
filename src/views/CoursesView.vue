<template>
  <section class="page-container">
    <div class="page-title-row"><div><div class="eyebrow">COURSE CATALOG</div><h1>课程中心</h1><p>浏览本学期开放课程，合理安排你的学习计划。</p></div><div class="title-actions"><span class="capacity-tip"><span class="live-dot"></span>名额实时更新</span><RouterLink to="/schedule" class="secondary-btn"><CalendarDays :size="17" /> 查看课表</RouterLink></div></div>
    <div class="course-toolbar panel"><div class="search-box"><Search :size="18" /><input v-model="store.searchText" placeholder="搜索课程名称、课程编号或教师" /></div><div class="filter-tabs"><button v-for="item in categoryOptions" :key="item.value" type="button" :class="{ active: store.category === item.value }" @click="store.category = item.value">{{ item.label }}</button></div><select v-model="store.sortBy" class="sort-select"><option value="default">默认排序</option><option value="credits-desc">学分从高到低</option><option value="seats-asc">剩余名额优先</option></select></div>
    <div class="course-result-row"><span>共找到 <strong>{{ store.filteredCourses.length }}</strong> 门课程</span><button type="button" class="reset-btn" @click="store.resetFilters"><RotateCcw :size="14" /> 重置筛选</button></div>
    <div v-if="store.filteredCourses.length" class="course-grid"><article v-for="course in store.filteredCourses" :key="course.id" class="course-card"><div class="card-top"><span class="code-label">{{ course.code }}</span><span class="category-pill" :class="`pill-${course.color}`">{{ course.category }}</span></div><h2>{{ course.name }}</h2><p>{{ course.description }}</p><div class="course-meta"><span><UserRound :size="15" /> {{ course.teacher }}</span><span><CreditCard :size="15" /> {{ course.credits }} 学分</span><span><MapPin :size="15" /> {{ course.room }}</span></div><div class="class-time"><CalendarDays :size="15" /><strong>{{ course.dayLabel }} · {{ course.periods }} 节</strong><span>{{ course.periodLabel }}</span></div><div class="card-footer"><div class="seat-bar"><div><span>剩余名额</span><strong>{{ course.capacity - course.enrolled }} <small>/ {{ course.capacity }}</small></strong></div><div class="bar"><i :style="{ width: `${(course.enrolled / course.capacity) * 100}%` }"></i></div></div><button type="button" :class="store.isSelected(course.id) ? 'selected-btn' : 'primary-small-btn'" @click="toggleCourse(course)"><CircleCheck v-if="store.isSelected(course.id)" :size="16" /><Plus v-else :size="16" />{{ store.isSelected(course.id) ? '已选课程' : '加入课表' }}</button></div></article></div><div v-else class="empty-state"><SearchX :size="38" /><strong>没有找到匹配课程</strong><span>试试更换关键词或清空筛选条件</span><button class="secondary-btn" type="button" @click="store.resetFilters">清空条件</button></div>
  </section>
</template>
<script setup>
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CalendarDays, CircleCheck, CreditCard, MapPin, Plus, RotateCcw, Search, SearchX, UserRound } from 'lucide-vue-next'
import { categoryOptions } from '../data'
import { useCourseStore } from '../stores'
const store = useCourseStore()
const toggleCourse = (course) => { const result = store.isSelected(course.id) ? store.dropCourse(course) : store.selectCourse(course); ElMessage({ type: result.ok ? 'success' : 'warning', message: result.message }) }
</script>
