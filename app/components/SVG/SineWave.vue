<script setup lang="ts">
const { z = -1, scale = 1 } = defineProps<{
  z?: number;
  scale?: number;
}>();

interface Wave {
  amplitude: number;
  wavelength: number;
  verticalOffset: number;
  strokeWidth: number;
  gradient: number;
  opacity: number;
  speed: number;
  phase: number;
  path: string;
}

const width = 3200;
const height = 100;
const midY = height / 2;

const waves = ref<Wave[]>([
  { amplitude: 24, wavelength: 3600, verticalOffset: -2, strokeWidth: 6 * scale, gradient: 1, opacity: 0.3, speed: 1.8, phase: 0, path: "", },
  { amplitude: 18, wavelength: 4200, verticalOffset: 4, strokeWidth: 5 * scale, gradient: 2, opacity: 0.5, speed: 2.1, phase: 0, path: "", },
  { amplitude: 12, wavelength: 4800, verticalOffset: -4, strokeWidth: 5 * scale, gradient: 1, opacity: 0.4, speed: 1.2, phase: 0, path: "", },
  { amplitude: 8, wavelength: 5400, verticalOffset: 2, strokeWidth: 6 * scale, gradient: 2, opacity: 0.3, speed: 1.5, phase: 0, path: "", },
])

function generateSinePath(
  amplitude: number,
  wavelength: number,
  verticalOffset: number,
  phase: number,
): string {
  const frequency = 2 * Math.PI / wavelength
  let d = `M0,${midY + verticalOffset}`;
  for (let x = 0; x <= width; x += 5) {
    const y = midY + verticalOffset + amplitude * Math.sin(frequency * x + phase);
    d += ` L${x},${y}`;
  }
  return d;
}

let lastTime = performance.now();

function animate(time: number) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;
  waves.value.forEach(wave => {
    wave.phase += wave.speed * delta;
    // keep phase in 0..2PI range for numeric stability (optional)
    if (wave.phase > 2 * Math.PI) wave.phase -= 2 * Math.PI;
    wave.path = generateSinePath(wave.amplitude, wave.wavelength, wave.verticalOffset, wave.phase);
  })
  requestAnimationFrame(animate);
}

onMounted(() => {
  // Initialize paths first frame with phase 0
  waves.value.forEach(wave => {
    wave.path = generateSinePath(wave.amplitude, wave.wavelength, wave.verticalOffset, 0)
  })
  requestAnimationFrame(animate)
})
</script>

<template>
  <div class="wave" :style="{ zIndex: z }">
    <svg id="sine-wave" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="steelblue" stop-opacity="0" />
          <stop offset="15%" stop-color="steelblue" stop-opacity="1" />
          <stop offset="85%" stop-color="steelblue" stop-opacity="1" />
          <stop offset="100%" stop-color="steelblue" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="firebrick" stop-opacity="0" />
          <stop offset="15%" stop-color="firebrick" stop-opacity="1" />
          <stop offset="85%" stop-color="firebrick" stop-opacity="1" />
          <stop offset="100%" stop-color="firebrick" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        v-for="(wave, i) in waves"
        :key="i"
        :d="wave.path"
        fill="none"
        :stroke="`url(#g${wave.gradient})`"
        :stroke-width="wave.strokeWidth"
        :opacity="wave.opacity"
        style="position:absolute; top:0; left:0; height:100%; width:400%;"
      />
    </svg>
  </div>
</template>

<style>
  .wave {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;
    /* z-index: -1; */
    transform: translateY(-50%);
    pointer-events: none;
    overflow: hidden;
  }
  .wave svg {
    height: 100%;
    width: 100%;
    overflow: visible;
    position: relative;
  }
</style>