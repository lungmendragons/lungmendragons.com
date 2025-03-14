<script setup lang="ts">
// import Link from "~/components/Link.global.vue";
// import Fa6BrandsYoutube from "~icons/fa6-brands/youtube";
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
          <th>Server</th>
          <th>Player</th>
          <th>Score</th>
          <th>Broadcast</th>
          <th>Group</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="3">
            <NTime
              time-zone="America/New_York"
              :time="1741973400000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1741973400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>TC</td>
          <td>Liriyin</td>
          <td>–</td>
          <!-- <td>
            <span class="font-bold">1234</span>
            <Link to="https://www.youtube.com/">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td> -->
          <td>CN</td>
          <td>D</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1741986000000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>KR</td>
          <td>Artuosa</td>
          <td>–</td>
          <td>CN</td>
          <td>A</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1741998600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>KR</td>
          <td>Hays</td>
          <td>–</td>
          <td>CN</td>
          <td>C</td>
        </tr>
        <tr>
          <td rowspan="3">
            <NTime
              time-zone="America/New_York"
              :time="1742059800000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">
            <NTime
              time-zone="America/New_York"
              :time="1742059800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">Aoao</td>
          <td style="background-color: #13873255;">–</td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">A</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742083200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>SC</td>
          <td>Cola</td>
          <td>–</td>
          <td>CN</td>
          <td>B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742092200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>Sena</td>
          <td>–</td>
          <td>CN</td>
          <td>D</td>
        </tr>
        <tr>
          <td rowspan="3">
            <NTime
              time-zone="America/New_York"
              :time="1742146200000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742146200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>TC</td>
          <td>Winsok</td>
          <td>–</td>
          <td>CN</td>
          <td>A</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742169600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>KR</td>
          <td>Hijkstuv</td>
          <td>–</td>
          <td>CN</td>
          <td>B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742178600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>YS</td>
          <td>–</td>
          <td>CN</td>
          <td>A</td>
        </tr>
        <tr>
          <td rowspan="3">
            <NTime
              time-zone="America/New_York"
              :time="1742232600000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">
            <NTime
              time-zone="America/New_York"
              :time="1742232600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">Mei of May</td>
          <td style="background-color: #13873255;">–</td>
          <td>CN</td>
          <td style="background-color: #13873255;">B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742256000000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>TC</td>
          <td>Wxy</td>
          <td>–</td>
          <td>CN</td>
          <td>C</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742265000000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>SC</td>
          <td>Kaisei</td>
          <td>–</td>
          <td>CN</td>
          <td>D</td>
        </tr>
        <tr>
          <td rowspan="3">
            <NTime
              time-zone="America/New_York"
              :time="1742319000000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">
            <NTime
              time-zone="America/New_York"
              :time="1742319000000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">Polymer</td>
          <td style="background-color: #13873255;">–</td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">C</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742342400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>TC</td>
          <td>Toby</td>
          <td>–</td>
          <td>CN</td>
          <td>B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742351400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>Caron</td>
          <td>–</td>
          <td>CN</td>
          <td>C</td>
        </tr>
        <tr>
          <td rowspan="3">
            <NTime
              time-zone="America/New_York"
              :time="1742405400000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">
            <NTime
              time-zone="America/New_York"
              :time="1742405400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">Bait</td>
          <td style="background-color: #13873255;">–</td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">D</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742428800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>KR</td>
          <td>LemuenWheelchairThief</td>
          <td>–</td>
          <td>CN</td>
          <td>D</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742437800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>SC</td>
          <td>Eyanx</td>
          <td>–</td>
          <td>CN</td>
          <td>C</td>
        </tr>
        <tr>
          <td rowspan="2">
            <NTime
              time-zone="America/New_York"
              :time="1742491800000"
              format="MM/dd"
              class="font-bold"
            />
          </td>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742491800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>SC</td>
          <td>Soup</td>
          <td>–</td>
          <td>CN</td>
          <td>A</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742515200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>Miguel_San</td>
          <td>–</td>
          <td>CN</td>
          <td>B</td>
        </tr>
      </tbody>
    </NTable>
  </NScrollbar>
</template>