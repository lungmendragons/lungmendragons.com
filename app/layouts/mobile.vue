<script lang="ts" setup>
import { useMediaQuery, useWindowSize, useElementVisibility } from "@vueuse/core";
import { useNotifStore } from "~/stores/notifs";

const { user } = useAuth();
// useMediaQuery is only called once
const isXL = useMediaQuery(mediaQuery.minWidth.xl as string);
const collapse = ref<boolean>(isXL.value);
const { width } = useWindowSize();

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

const watchHideTopbar = ref();
const targetIsVisible = useElementVisibility(watchHideTopbar);
const hideScrolling = ref(false);

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

function toggleCollapseMobile(): void {
  collapse.value = !collapse.value;
};

provide("isXLProvide", isXL);
provide("toggleCollapseMobile", toggleCollapseMobile);

watch(targetIsVisible, (isVisible) => {
  hideScrolling.value = !isVisible;
});

useRuntimeHook("page:loading:end", () => {
  loadingBar.finish();
});

onMounted(() => {
  if (user.value) {
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
      minHeight: '100svh',
    }">
    <NLayoutHeader bordered>
      <NavTopbarMobile
        :toggle-menu="toggleCollapseMobile"
        :hide-scrolling="hideScrolling"
      />
    </NLayoutHeader>

    <NLayout>
      <NDrawer
        v-model:show="collapse"
        placement="left"
        :width="width * 0.4"
        :style="{ minWidth: '280px' }">
        <NDrawerContent :body-content-style="{ padding: '12px' }">
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
        <div ref="watchHideTopbar" />
        <div id="page-content">
          <slot />
        </div>
        <NavFooter />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
