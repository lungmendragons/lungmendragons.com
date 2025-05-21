<script setup lang="ts">
const bingo = useBingo();
const roomIdField = ref("");
const nameField = ref("");
const model = ref([
  "#2080F0",
  "#D03050",
]);

const teams = computed(bingo.teams);
</script>

<template>
  <NFlex vertical>
    <NFlex>
      <NFlex vertical class="w-[300px]">
        <div>
          Game ID: {{ bingo.inRoom()?.roomId ?? "none" }} <br>
          Users: {{ Object.values(bingo.inRoom()?.users ?? {}).map(v => `${v.id}/${v.name}`) }} <br>
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
          <NButton class="w-20" @click="bingo.joinRoom(nameField, roomIdField)">
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
        <NForm v-if="teams" :model="model">
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
            <NButton @click="model.forEach((v, i) => bingo.setTeamColor(i, v))">
              Confirm
            </NButton>
          </NFormItem>
        </NForm>
      </NFlex>
      <BingoGrid />
    </NFlex>
  </NFlex>
</template>

<style scoped></style>
