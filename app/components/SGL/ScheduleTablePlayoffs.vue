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
          <td style="white-space: nowrap;">
            <span>Polymer (EN) vs Sena (JP)</span>
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
          <td style="white-space: nowrap;">
            <span>Miguel_San (JP) vs WXY (TC)</span>
            <Link to="https://youtube.com/live/pTxwCqCFZLo">
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
          <td style="white-space: nowrap;">
            <span>Kaisei (SC) vs Artuosa (KR)</span>
            <Link to="https://youtube.com/live/xshqHl2B0l0">
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
          <td style="white-space: nowrap;">
            <span>Soup (SC) vs Cola (SC)</span>
            <Link to="https://youtube.com/live/ki3K1gJDgLw">
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
              :time="1742990400000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742990400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="white-space: nowrap;">
            <span>Kaisei (SC) vs Miguel_San (JP)</span>
            <Link to="https://youtube.com/live/Z_H-NORuMs4">
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
              :time="1743076800000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1743076800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="white-space: nowrap;">
            <span>Polymer (EN) vs Soup (SC)</span>
            <Link to="https://youtube.com/live/Z_H-NORuMs4">
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
              :time="1743249600000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1743249600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="white-space: nowrap;">
            <span>Miguel_San (JP) vs Soup (SC)</span>
            <Link to="https://youtube.com/live/wMqJgW2wYnI">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>EN</td>
        </tr>
      </tbody>
    </NTable>
  </NScrollbar>
</template>