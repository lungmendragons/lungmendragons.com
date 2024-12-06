<script lang="ts" setup>
import { useMediaQuery, useToggle } from "@vueuse/core";
import { useNotifStore } from "~/stores/notifs";

// useMediaQuery is only called once
const menuCollapse = useMediaQuery(mediaQuery.maxWidth.xl as string);
const toggleCollapseDesktop = useToggle(menuCollapse);

const { session } = useAuth();
const loadingBar = useLoadingBar();
const notification = useNotification();
const notifStore = useNotifStore();
const notifFuncPtrs = {
  create: notification.create,
  info: notification.info,
  success: notification.success,
  warning: notification.warning,
  error: notification.error,
};

function doNotif(item: any) {
  if (
    item.data.timeStart > Date.now()
    || item.data.timeEnd < Date.now()
  ) {
    return;
  };

  // @ts-expect-error implicit any
  const notifFunc = notifFuncPtrs[item.data.notifFunc];
  const notifObject = {
    title: item.data.title,
    description: item.data.description,
    content: item.data.content,
    onClose: () => notifStore.addToDismissed(item.key),
  };
  notifFunc(notifObject);
};

useRuntimeHook("page:loading:end", () => {
  loadingBar.finish();
});

onMounted(() => {
  if (session) {
    const dismissed = notifStore.getDismissed();
    $fetch("/api/notifs")
      .then((kvArray) => {
        kvArray.forEach((item) => {
          // @ts-expect-error possibly null
          if (!dismissed.includes(item.key))
            doNotif(item);
        });
      });
  };
});
</script>

<template>
  <NLayout
    position="absolute"
    :content-style="{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100lvh',
    }">
    <NLayoutHeader bordered>
      <NavTopbarDesktop :toggle-menu="toggleCollapseDesktop" />
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
