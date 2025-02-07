<script lang="ts" setup>
import { useThemeVars } from "naive-ui";
import { isDark, toggleDark } from "~/utils/theme";

import HeroiconsUserCircle from "~icons/heroicons/user-circle";
import HeroiconsMoon from "~icons/heroicons/moon";
import HeroiconsSun from "~icons/heroicons/sun";
import UilBars from "~icons/uil/bars";
import { useMediaQuery } from "@vueuse/core";
import LogoColorFull from "~/components/Logo/ColorFull.vue";
import LogoBlackFull from "~/components/Logo/BlackFull.vue";

const { toggleMenu } = defineProps<{ toggleMenu: () => void }>();
const moreThanLG = useMediaQuery(mediaQuery.minWidth.lg);
const moreThanXL = useMediaQuery(mediaQuery.minWidth.xl as string);
const themeVars = useThemeVars();
const showUserDrawer = ref(false);

const { client, signOut } = useAuth();
const { data: session } = await client.useSession(useFetch);
const loggedIn = computed(() => !!session.value);
</script>

<template>
  <NFlex
    justify="space-between"
    align="center"
    :style="{ backgroundColor: themeVars.cardColor }">
    <NFlex
      align="center"
      :style="{
        flexGrow: moreThanXL ? 0 : 1,
        width: moreThanXL ? 'auto' : '',
        margin: '0.5rem 0 0.5rem 1rem',
      }">
      <NButton
        quaternary
        circle
        :style="{ justifySelf: 'start' }"
        @click="toggleMenu()">
        <template #icon>
          <NIcon size="24">
            <UilBars />
          </NIcon>
        </template>
      </NButton>
      <NuxtLink to="/">
        <component
          :is="isDark ? LogoColorFull : LogoBlackFull"
          :style="{ height: '2.5rem' }"
        />
      </NuxtLink>
    </NFlex>
    <NFlex align="center" :style="{ margin: '0.5rem 1rem 0.5rem 0' }">
      <template v-if="loggedIn">
        <template v-if="moreThanLG">
          {{ session?.user.name }}
        </template>
        <NAvatar
          round
          :src="session?.user.image ?? undefined"
          :style="{ cursor: 'pointer' }"
          @click="showUserDrawer = true"
        />
      </template>
      <template v-else>
        <template v-if="moreThanLG">
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
        </template>
        <template v-else>
          <NAvatar
            round
            :style="{ cursor: 'pointer' }"
            @click="showUserDrawer = true">
            <NIcon :size="36">
              <HeroiconsUserCircle />
            </NIcon>
          </NAvatar>
        </template>
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
                :src="session?.user.image ?? undefined"
              />
              {{ session?.user.name }}
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
