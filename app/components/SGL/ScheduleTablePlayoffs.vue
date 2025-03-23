<script setup lang="ts">
  import Link from "~/components/Link.global.vue";
  import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
</script>

<template>
  <NScrollbar x-scrollable>
    <NTable
      :single-line="false"
      size="small"
      class="text-xs md:text-sm">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Match</th>
          <th>Broadcast</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="	1742644800000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="	1742644800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>
            <span style="white-space: nowrap;">Polymer (EN) vs Sena (JP)</span>
            <Link to="https://youtu.be/jwmhkFCqpgw">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>EN</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742731200000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742731200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td><span style="white-space: nowrap;">Kaisei (SC) vs Artuosa (KR)</span></td>
          <td>EN</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742817600000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742817600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td><span style="white-space: nowrap;">Miguel_San (JP) vs WXY (TC)</span></td>
          <td>EN</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742904000000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742904000000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td><span style="white-space: nowrap;">Soup (SC) vs Cola (SC)</span></td>
          <td>EN</td>
        </tr>
      </tbody>
    </NTable>
  </NScrollbar>
</template>