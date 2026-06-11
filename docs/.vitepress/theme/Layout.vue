<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import A2wApiSidebarBrand from './A2wApiSidebarBrand.vue';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #sidebar-nav-before>
      <A2wApiSidebarBrand />
    </template>
  </Layout>
</template>
