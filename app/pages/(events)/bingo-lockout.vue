<script setup lang="ts">
const bingo = useBingo();
const roomIdField = ref("");
const nameField = ref("");
const teams = bingo.teams;
const model = ref([
  "#2080F0",
  "#D03050",
]);
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NFlex vertical class="w-[300px]">
        <div>
          Game ID: {{ bingo.roomId ?? "none" }} <br>
          Users: {{ Object.values(bingo.users.value ?? {}).map(v => `${v.id}/${v.name}`) }} <br>
        </div>
        <NDivider />
        <NInput
          v-model:value="nameField"
          type="text"
          placeholder="display name"
        />
        <NButton @click="bingo.createRoom(nameField)">
          init
        </NButton>
        <div>
          <NButton class="w-20" @click="bingo.joinRoom(roomIdField, nameField)">
            join
          </NButton>
          <NDivider vertical />
          <NInput
            v-model:value="roomIdField"
            type="text"
            class="max-w-40"
            placeholder="room ID"
          />
        </div>
        <NDivider />
        <NForm v-if="bingo.session.value" :model="model">
          <NFormItem
            v-for="(team, i) in teams"
            :key="i"
            :label="team.name"
            :path="`teams[${i}].color`"
            label-placement="left">
            <NColorPicker
              v-if="model[i]"
              v-model:value="model[i]"
              :modes="['hex']"
              :show-alpha="false"
              :swatches="[
                '#18A058',
                '#2080F0',
                '#F0A020',
                '#D03050',
              ]"
            />
          </NFormItem>
          <NFormItem>
            <NButton @click="bingo.updateTeamColors(model)">
              Confirm
            </NButton>
          </NFormItem>
        </NForm>
      </NFlex>
      <BingoGrid v-if="bingo.session.value" />
    </NFlex>
  </NFlex>
</template>

<style scoped></style>
