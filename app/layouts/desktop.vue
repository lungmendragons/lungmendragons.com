<script lang="ts" setup>
import NavFooter from "~/components/Nav/Footer.vue";
import NavSidebar from "~/components/Nav/Sidebar.vue";
import NavTopbar from "~/components/Nav/Topbar.vue";
import { useMediaQuery, useToggle } from "@vueuse/core";

// useMediaQuery is only called once
const menuCollapse = useMediaQuery(mediaQuery.maxWidth.xl);
const toggleCollapseDesktop = useToggle(menuCollapse);
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
      <NavTopbar :toggle-menu="toggleCollapseDesktop" />
    </NLayoutHeader>

    <NLayout has-sider>
      <NLayoutSider
        bordered
        :collapsed="menuCollapse"
        :collapsed-width="0"
        collapse-mode="transform">
        <NavSidebar />
      </NLayoutSider>

      <NLayoutContent
        id="page-content-container"
        content-class="sm:px-4 md:px-8 lg:px-16 xl:px-20 2xl:px-24"
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
