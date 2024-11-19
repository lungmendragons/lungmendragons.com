<script lang="ts" setup>
import NavFooter from "~/components/Nav/Footer.vue";
import NavSidebar from "~/components/Nav/Sidebar.vue";
import NavTopbar from "~/components/Nav/Topbar.vue";
import { useMediaQuery, useToggle, useWindowSize } from "@vueuse/core";

// useMediaQuery is only called once
const isXL = useMediaQuery(mediaQuery.minWidth.xl);
const toggleCollapseMobile = useToggle(isXL);
const { width } = useWindowSize();
</script>

<template>
  <NLayout
    position="absolute"
    :content-style="{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }">
    <NLayoutHeader bordered>
      <NavTopbar :toggle-menu="toggleCollapseMobile" />
    </NLayoutHeader>

    <NLayout>
      <NDrawer
        v-model:show="isXL"
        :width="width * 0.8"
        placement="left">
        <NDrawerContent>
          <NavSidebar drawer />
        </NDrawerContent>
      </NDrawer>

      <NLayoutContent
        id="page-content-container"
        content-class="px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-24"
        :content-style="{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '1rem',
        }">
        <div id="page-content">
          <slot />
        </div>
        <NavFooter />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
