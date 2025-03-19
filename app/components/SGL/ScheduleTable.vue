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
          <td>
            <span class="font-bold">1349</span>
            <Link to="https://www.youtube.com/live/W1ndnVdS75E?t=877s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
          <td>
            <span class="font-bold">2656</span>
            <Link to="https://www.youtube.com/live/W1ndnVdS75E?t=7651s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
          <td>
            <span class="font-bold">2525</span>
            <Link to="https://www.youtube.com/live/W1ndnVdS75E?t=16952s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
          <td style="background-color: #13873255;">
            <span class="font-bold">1748</span>
            <Link to="https://www.youtube.com/live/dstn4x5Bif4?t=1303s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">A</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742072400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>SC</td>
          <td>Cola</td>
          <td>
            <span class="font-bold">2946</span>
            <Link to="https://www.youtube.com/live/dstn4x5Bif4?t=7780s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>CN</td>
          <td>B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742085000000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>Sena</td>
          <td>
            <span class="font-bold">2681</span>
            <Link to="https://www.youtube.com/live/dstn4x5Bif4?t=18961s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
          <td>
            <span class="font-bold">2192</span>
            <Link to="https://www.youtube.com/watch?v=ilKUYpUSlu8&t=864s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>CN</td>
          <td>A</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742158800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>KR</td>
          <td>Hijkstuv</td>
          <td>
            <span class="font-bold">2660</span>
            <Link to="https://www.youtube.com/watch?v=ilKUYpUSlu8&t=12616s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>CN</td>
          <td>B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742171400000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>YS</td>
          <td>
            <span class="font-bold">1501</span>
            <Link to="https://www.youtube.com/watch?v=ilKUYpUSlu8&t=25200s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
          <td style="background-color: #13873255;">
            <span class="font-bold">2556</span>
            <Link to="https://www.youtube.com/watch?v=rm40tm3PovE&t=626s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>CN</td>
          <td style="background-color: #13873255;">B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742245200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>TC</td>
          <td>Wxy</td>
          <td>
            <span class="font-bold">2910</span>
            <Link to="https://www.youtube.com/watch?v=rm40tm3PovE&t=11850s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>CN</td>
          <td>C</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742257800000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>SC</td>
          <td>Kaisei</td>
          <td>
            <span class="font-bold">2753</span>
            <Link to="https://www.youtube.com/watch?v=rm40tm3PovE&t=24378s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
          <td style="background-color: #13873255;">
            <span class="font-bold">3027</span>
            <Link to="https://www.youtube.com/live/NnJG9cVvwuU?t=778s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td style="background-color: #13873255;">EN</td>
          <td style="background-color: #13873255;">C</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742331600000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>TC</td>
          <td>Toby</td>
          <td>
            <span class="font-bold">2214</span>
            <Link to="https://www.youtube.com/live/NnJG9cVvwuU?t=12849s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
          <td>CN</td>
          <td>B</td>
        </tr>
        <tr>
          <td>
            <NTime
              time-zone="America/New_York"
              :time="1742344200000"
              format="HH:mm"
              class="font-bold"
            />
          </td>
          <td>JP</td>
          <td>Caron</td>
          <td>
            <span class="font-bold">1529</span>
            <Link to="https://www.youtube.com/live/NnJG9cVvwuU?t=24982s">
              <NIcon class="ml-2 top-0.5" size="14">
                <Fa6BrandsYoutube />
              </NIcon>
            </Link>
          </td>
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
              :time="1742418000000"
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
              :time="1742430600000"
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
              :time="1742504400000"
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