<script setup lang="ts">
import { withBase } from 'vitepress';

const LOGO_URL = 'https://cdn.addtowallet.io/img/a2w-api-logo.png';
const homeHref = withBase('/');
</script>

<template>
  <a class="a2w-api-sidebar-brand" :href="homeHref" aria-label="@basetime a2w-api-ts">
    <img :src="LOGO_URL" alt="@basetime a2w-api-ts" width="972" height="233" decoding="async" />
  </a>
</template>
