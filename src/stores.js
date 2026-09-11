import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { courses } from './data'
const STORAGE_KEY = 'campus-course-hub-selected'
export const useCourseStore = defineStore('course', () => {
  const savedIds = localStorage.getItem(STORAGE_KEY)
  const selectedIds = ref(savedIds ? JSON.parse(savedIds) : ['CS101', 'UX204', 'EN302'])
  if (!savedIds) localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds.value))
  const searchText = ref(''); const category = ref('all'); const sortBy = ref('default')
  const selectedCourses = computed(() => courses.filter((course) => selectedIds.value.includes(course.id)))
  const selectedCredits = computed(() => selectedCourses.value.reduce((sum, course) => sum + course.credits, 0))
  const completedCredits = computed(() => 42 + selectedCredits.value)
  const progress = computed(() => Math.min(100, Math.round((completedCredits.value / 54) * 100)))
  const filteredCourses = computed(() => {
    const keyword = searchText.value.trim().toLowerCase()
    const result = courses.filter((course) => {
      const matchesKeyword = !keyword || [course.name, course.code, course.teacher, course.category].some((field) => field.toLowerCase().includes(keyword))
      return matchesKeyword && (category.value === 'all' || course.category === category.value)
    })
    if (sortBy.value === 'credits-desc') return [...result].sort((a, b) => b.credits - a.credits)
    if (sortBy.value === 'seats-asc') return [...result].sort((a, b) => (a.capacity - a.enrolled) - (b.capacity - b.enrolled))
    return result
  })
  const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds.value))
  const isSelected = (id) => selectedIds.value.includes(id)
  const findConflict = (course) => selectedCourses.value.find((selected) => selected.weekday === course.weekday && selected.periods === course.periods)
  const selectCourse = (course) => {
    if (isSelected(course.id)) return { ok: false, type: 'duplicate', message: '这门课程已经在你的课表中了' }
    if (course.enrolled >= course.capacity) return { ok: false, type: 'full', message: '该课程名额已满，请选择其他课程' }
    const conflict = findConflict(course)
    if (conflict) return { ok: false, type: 'conflict', message: `与「${conflict.name}」时间冲突，请先调整课表` }
    selectedIds.value.push(course.id); persist(); return { ok: true, message: `已选「${course.name}」` }
  }
  const dropCourse = (course) => { selectedIds.value = selectedIds.value.filter((id) => id !== course.id); persist(); return { ok: true, message: `已退选「${course.name}」` } }
  const resetFilters = () => { searchText.value = ''; category.value = 'all'; sortBy.value = 'default' }
  const categoryStats = computed(() => { const stats = {}; selectedCourses.value.forEach((course) => { stats[course.category] = (stats[course.category] || 0) + course.credits }); return Object.entries(stats).map(([name, value]) => ({ name, value })) })
  return { courses, selectedIds, searchText, category, sortBy, selectedCourses, selectedCredits, completedCredits, progress, filteredCourses, categoryStats, isSelected, selectCourse, dropCourse, resetFilters, findConflict }
})




