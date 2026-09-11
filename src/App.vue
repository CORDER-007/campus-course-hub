<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="brand"><div class="brand-mark"><span></span><span></span><span></span></div><div v-if="!sidebarCollapsed" class="brand-copy"><strong>Course Hub</strong><small>校园选课中心</small></div></div>
      <div v-if="!sidebarCollapsed" class="term-switcher"><span>当前学期</span><strong>2026 秋季学期</strong><ChevronDown :size="15" /></div>
      <nav class="nav-list"><RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item"><component :is="item.icon" :size="19" /><span v-if="!sidebarCollapsed">{{ item.label }}</span></RouterLink></nav>
      <div class="sidebar-bottom"><div class="support-card" v-if="!sidebarCollapsed"><div class="support-icon"><MessageCircle :size="18" /></div><strong>需要帮助？</strong><span>查看选课指南</span></div><button class="collapse-btn" type="button" @click="sidebarCollapsed = !sidebarCollapsed"><PanelLeftClose :size="18" /><span v-if="!sidebarCollapsed">收起菜单</span></button></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><div class="mobile-brand"><div class="brand-mark"><span></span><span></span><span></span></div><strong>Course Hub</strong></div><div class="breadcrumb"><span>校园服务</span><ChevronRight :size="14" /><strong>{{ currentTitle }}</strong></div><div class="top-actions"><button class="icon-btn" type="button" title="通知"><Bell :size="19" /><i></i></button><div class="user-menu"><div class="avatar">林</div><div class="user-copy"><strong>林晓宇</strong><span>2024级 · 计算机科学</span></div><ChevronDown :size="16" /></div></div></header>
      <div class="page-view"><RouterView /></div>
    </main>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Bell, BookOpen, CalendarDays, ChevronDown, ChevronRight, LayoutDashboard, MessageCircle, PanelLeftClose } from 'lucide-vue-next'
const route = useRoute(); const sidebarCollapsed = ref(false)
const currentTitle = computed(() => route.meta.title || '学习总览')
const navItems = [{ label: '学习总览', path: '/home', icon: LayoutDashboard }, { label: '课程中心', path: '/courses', icon: BookOpen }, { label: '我的课表', path: '/schedule', icon: CalendarDays }]
</script>
