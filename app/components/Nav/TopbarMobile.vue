<script lang="ts" setup>
import { NIcon, useThemeVars } from "naive-ui";
import { useMediaQuery } from "@vueuse/core";
import { isDark, toggleDark } from "~/utils/theme";
import HeroiconsUserCircle from "~icons/heroicons/user-circle";
import HeroiconsMoon from "~icons/heroicons/moon";
import HeroiconsSun from "~icons/heroicons/sun";
import UilBars from "~icons/uil/bars";
import LogoColorIcon from "~/components/Logo/ColorIcon.vue";
import LogoBlackIcon from "~/components/Logo/BlackIcon.vue";

const { toggleMenu, hideScrolling } = defineProps<{
  toggleMenu: () => void;
  hideScrolling: boolean;
}>();

const moreThanXL = useMediaQuery(mediaQuery.minWidth.xl as string);
const themeVars = useThemeVars();
const showUserDrawer = ref(false);
const { user, signOut, loggedIn } = useAuth();
</script>

<template>
  <NFlex
    class="ease"
    justify="space-between"
    align="center"
    :style="{
      backgroundColor: themeVars.cardColor,
      maxHeight: hideScrolling ? '36px' : 'unset',
    }">
    <NFlex
      align="center"
      class="ease"
      :size="hideScrolling ? 0 : 12"
      :style="{
        flexGrow: moreThanXL ? 0 : 1,
        width: moreThanXL ? 'auto' : '',
        margin: hideScrolling ? '4px 0 4px 6px' : '0.5rem 0 0.5rem 1rem',
      }">
      <NButton
        quaternary
        circle
        :size="hideScrolling ? 'small' : 'medium'"
        :style="{ justifySelf: 'start' }"
        @click="toggleMenu()">
        <template #icon>
          <NIcon :size="hideScrolling ? 16 : 24" class="ease">
            <UilBars />
          </NIcon>
        </template>
      </NButton>
      <NuxtLink to="/">
        <component
          class="ease"
          :is="isDark ? LogoColorIcon : LogoBlackIcon"
          :style="{ height: hideScrolling ? '1.375rem' : '2.5rem' }"
        />
      </NuxtLink>
    </NFlex>
    <NFlex align="center" :style="{ margin: hideScrolling ? '4px 12px 4px 0' : '0.5rem 1rem 0.5rem 0' }">
      <template v-if="loggedIn">
        <NAvatar
          round
          class="ease"
          :size="hideScrolling ? 20 : 'medium'"
          :src="user?.image"
          :style="{ cursor: 'pointer' }"
          @click="showUserDrawer = true"
        />
      </template>
      <template v-else>
        <NAvatar
          round
          class="ease"
          :size="hideScrolling ? 20 : 'medium'"
          :style="{ cursor: 'pointer' }"
          @click="showUserDrawer = true">
          <NIcon :size="36">
            <HeroiconsUserCircle />
          </NIcon>
        </NAvatar>
      </template>
    </NFlex>
    <NDrawer
      v-model:show="showUserDrawer"
      placement="right"
      :width="300">
      <NDrawerContent closable>
        <template #header>
          <NFlex align="center">
            <template v-if="loggedIn">
              <NAvatar
                round
                :src="user?.image"
              />
              {{ user?.name }}
            </template>
            <template v-else>
              <NAvatar round @click="showUserDrawer = true">
                <NIcon :size="36">
                  <HeroiconsUserCircle />
                </NIcon>
              </NAvatar>
              Guest
            </template>
          </NFlex>
        </template>
        <NFlex vertical :size="18">
          <template v-if="loggedIn">
            <NuxtLink to="/profile">
              <NButton type="primary">
                Profile
              </NButton>
            </NuxtLink>
            <NFlex align="center">
              <NButton
                quaternary
                circle
                size="large"
                @click="toggleDark()">
                <template #icon>
                  <NIcon size="24">
                    <HeroiconsMoon v-if="isDark" />
                    <HeroiconsSun v-else />
                  </NIcon>
                </template>
              </NButton>
              Theme
            </NFlex>
            <NButton secondary @click="signOut({ redirectTo: '/' })">
              Sign out
            </NButton>
          </template>
          <template v-else>
            <NFlex>
              <NuxtLink to="/signin">
                <NButton type="primary">
                  Sign in
                </NButton>
              </NuxtLink>
              <NuxtLink to="/signup">
                <NButton type="primary" secondary>
                  Sign up
                </NButton>
              </NuxtLink>
            </NFlex>
          </template>
        </NFlex>
      </NDrawerContent>
    </NDrawer>
  </NFlex>
</template>

<style scoped>
#topbar, .ease {
  transition: 0.2s all ease-out;
}
/* .topbar--hide {
  transform: translate3d(0, -100%, 0);
} */
</style>
