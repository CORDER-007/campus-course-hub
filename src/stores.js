import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { courses } from './data'
const STORAGE_KEY = 'campus-course-hub-selected'
const IDENTITY_KEY = 'campus-course-hub-identity'
const NOTIFICATIONS_KEY = 'campus-course-hub-notifications'

const readStoredJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export const identities = [
  { id: 'student', name: '林晓宇', role: '学生', detail: '2024级 · 计算机科学', avatar: '林' },
  { id: 'teacher', name: '周老师', role: '教师', detail: '计算机科学系', avatar: '周' },
  { id: 'admin', name: '陈老师', role: '教务管理员', detail: '教务管理中心', avatar: '陈' },
]

export const defaultNotifications = [
  { id: 'deadline', title: '选课退改截止日期', content: '请在 2026/09/18 23:59 前完成课程调整。', time: '09月12日 09:30', type: 'important', read: false },
  { id: 'conflict', title: '课程时间冲突提醒', content: '选课时请留意相同星期和节次的课程安排。', time: '09月11日 16:20', type: 'warning', read: false },
  { id: 'capacity', title: '课程容量实时更新', content: '部分热门课程名额有限，建议尽早完成选择。', time: '09月10日', type: 'info', read: true },
  { id: 'system', title: '系统维护通知', content: '选课中心将于今晚 23:00 进行例行维护。', time: '09月09日', type: 'info', read: true },
]
export const useCourseStore = defineStore('course', () => {
  const savedIds = readStoredJson(STORAGE_KEY, null)
  const selectedIds = ref(Array.isArray(savedIds) ? savedIds : ['CS101', 'UX204', 'EN302'])
  if (!Array.isArray(savedIds)) localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds.value))
  const searchText = ref(''); const category = ref('all'); const sortBy = ref('default')
  const savedIdentity = localStorage.getItem(IDENTITY_KEY)
  const currentIdentityId = ref(identities.some((identity) => identity.id === savedIdentity) ? savedIdentity : 'student')
  const savedNotifications = readStoredJson(NOTIFICATIONS_KEY, null)
  const notifications = ref(Array.isArray(savedNotifications) ? savedNotifications : defaultNotifications.map((notification) => ({ ...notification })))
  const currentIdentity = computed(() => identities.find((identity) => identity.id === currentIdentityId.value) || identities[0])
  const unreadNotificationCount = computed(() => notifications.value.filter((notification) => !notification.read).length)
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
  const persistIdentity = () => localStorage.setItem(IDENTITY_KEY, currentIdentityId.value)
  const persistNotifications = () => localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications.value))
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
  const switchIdentity = (identityId) => {
    if (!identities.some((identity) => identity.id === identityId)) return false
    currentIdentityId.value = identityId
    persistIdentity()
    return true
  }
  const markNotificationRead = (notificationId) => {
    const notification = notifications.value.find((item) => item.id === notificationId)
    if (!notification || notification.read) return
    notification.read = true
    persistNotifications()
  }
  const markAllNotificationsRead = () => {
    notifications.value = notifications.value.map((notification) => ({ ...notification, read: true }))
    persistNotifications()
  }
  const categoryStats = computed(() => { const stats = {}; selectedCourses.value.forEach((course) => { stats[course.category] = (stats[course.category] || 0) + course.credits }); return Object.entries(stats).map(([name, value]) => ({ name, value })) })
  return { courses, identities, selectedIds, searchText, category, sortBy, selectedCourses, selectedCredits, completedCredits, progress, filteredCourses, categoryStats, currentIdentity, currentIdentityId, notifications, unreadNotificationCount, isSelected, selectCourse, dropCourse, resetFilters, findConflict, switchIdentity, markNotificationRead, markAllNotificationsRead }
})






