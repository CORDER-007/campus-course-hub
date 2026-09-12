<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="brand"><div class="brand-mark"><span></span><span></span><span></span></div><div v-if="!sidebarCollapsed" class="brand-copy"><strong>Course Hub</strong><small>校园选课中心</small></div></div>
      <div v-if="!sidebarCollapsed" class="term-switcher"><span>当前学期</span><strong>2026 秋季学期</strong><ChevronDown :size="15" /></div>
      <nav class="nav-list"><RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item"><component :is="item.icon" :size="19" /><span v-if="!sidebarCollapsed">{{ item.label }}</span></RouterLink></nav>
      <div class="sidebar-bottom"><div class="support-card" v-if="!sidebarCollapsed"><div class="support-icon"><MessageCircle :size="18" /></div><strong>需要帮助？</strong><span>查看选课指南</span></div><button class="collapse-btn" type="button" @click="sidebarCollapsed = !sidebarCollapsed"><PanelLeftClose :size="18" /><span v-if="!sidebarCollapsed">收起菜单</span></button></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><div class="mobile-brand"><div class="brand-mark"><span></span><span></span><span></span></div><strong>Course Hub</strong></div><div class="breadcrumb"><span>校园服务</span><ChevronRight :size="14" /><strong>{{ currentTitle }}</strong></div><div class="top-actions">
        <div class="popover-wrap">
          <button class="icon-btn" type="button" title="通知" :aria-label="store.unreadNotificationCount ? `通知，${store.unreadNotificationCount} 条未读` : `通知，全部已读`" aria-haspopup="dialog" aria-controls="notification-panel" :aria-expanded="notificationsOpen" @click.stop="toggleNotifications"><Bell :size="19" /><span v-if="store.unreadNotificationCount" class="notification-count">{{ store.unreadNotificationCount }}</span></button>
          <section v-if="notificationsOpen" id="notification-panel" class="notification-panel" role="dialog" aria-label="通知中心" @click.stop>
            <div class="popover-heading"><div><strong>通知中心</strong><span>{{ store.unreadNotificationCount ? `有 ${store.unreadNotificationCount} 条未读消息` : '全部消息已读' }}</span></div><button v-if="store.unreadNotificationCount" type="button" class="mark-read-btn" @click="markAllRead">全部已读</button></div>
            <div v-if="store.notifications.length" class="notification-list"><button v-for="notification in store.notifications" :key="notification.id" type="button" class="notification-item" :class="{ unread: !notification.read }" @click="readNotification(notification)"><span class="notification-icon" :class="`notification-${notification.type}`"><Bell :size="15" /></span><span class="notification-copy"><strong>{{ notification.title }}</strong><span>{{ notification.content }}</span><small>{{ notification.time }}</small></span><i v-if="!notification.read" class="unread-dot"></i></button></div><div v-else class="notification-empty"><Bell :size="24" /><span>暂时没有新通知</span></div>
          </section>
        </div>
        <div class="popover-wrap">
          <button class="user-menu" type="button" :aria-label="`${store.currentIdentity.name}，${store.currentIdentity.role}，打开身份菜单`" aria-haspopup="menu" aria-controls="identity-panel" :aria-expanded="identityOpen" @click.stop="toggleIdentity"><div class="avatar">{{ store.currentIdentity.avatar }}</div><div class="user-copy"><strong>{{ store.currentIdentity.name }}</strong><span>{{ store.currentIdentity.role }} · {{ store.currentIdentity.detail }}</span></div><ChevronDown :size="16" /></button>
          <section v-if="identityOpen" id="identity-panel" class="identity-panel" role="menu" aria-label="切换演示身份" @click.stop>
            <div class="popover-heading"><div><strong>切换演示身份</strong><span>当前仅用于前端功能演示</span></div></div>
            <button v-for="identity in store.identities" :key="identity.id" type="button" class="identity-option" :class="{ active: identity.id === store.currentIdentity.id }" role="menuitemradio" :aria-checked="identity.id === store.currentIdentity.id" @click="changeIdentity(identity)"><span class="identity-avatar">{{ identity.avatar }}</span><span class="identity-copy"><strong>{{ identity.name }}</strong><small>{{ identity.role }} · {{ identity.detail }}</small></span><Check v-if="identity.id === store.currentIdentity.id" :size="16" /></button>
          </section>
        </div>
      </div></header>
      <div class="page-view"><RouterView /></div>
    </main>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCourseStore } from './stores'
import { Bell, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, LayoutDashboard, MessageCircle, PanelLeftClose } from 'lucide-vue-next'
const route = useRoute(); const sidebarCollapsed = ref(false); const identityOpen = ref(false); const notificationsOpen = ref(false); const store = useCourseStore()
const currentTitle = computed(() => route.meta.title || '学习总览')
const navItems = [{ label: '学习总览', path: '/home', icon: LayoutDashboard }, { label: '课程中心', path: '/courses', icon: BookOpen }, { label: '我的课表', path: '/schedule', icon: CalendarDays }]
const toggleIdentity = () => { identityOpen.value = !identityOpen.value; notificationsOpen.value = false }
const toggleNotifications = () => { notificationsOpen.value = !notificationsOpen.value; identityOpen.value = false }
const changeIdentity = (identity) => { store.switchIdentity(identity.id); identityOpen.value = false; ElMessage.success(`已切换为${identity.role}演示身份`) }
const readNotification = (notification) => { store.markNotificationRead(notification.id) }
const markAllRead = () => { store.markAllNotificationsRead(); ElMessage.success('已将全部通知标记为已读') }
const closePopovers = () => { identityOpen.value = false; notificationsOpen.value = false }
const handleEscape = (event) => { if (event.key === 'Escape') closePopovers() }
onMounted(() => { window.addEventListener('click', closePopovers); window.addEventListener('keydown', handleEscape) })
onBeforeUnmount(() => { window.removeEventListener('click', closePopovers); window.removeEventListener('keydown', handleEscape) })
watch(() => route.fullPath, closePopovers)
</script>

