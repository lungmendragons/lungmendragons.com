<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBreakpoints, useWindowSize, watchThrottled } from "@vueuse/core";

import LogoWhiteText from "~/components/Logo/WhiteText.vue";
import LogoBlackText from "~/components/Logo/BlackText.vue";
import { isDark } from "~/utils/theme";
import { breakpoints } from "~/utils/breakpoints";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const logo3dContainer = ref();
const ld3d = ref();

// 3D logo is wrapped in a <ClientOnly> component,
// so we can use useBreakpoints instead of useMediaQuery
const useBreakpointsObject = useBreakpoints(breakpoints);
const windowSize = useWindowSize();

function getRendererDims(): [number, number] {
  if (useBreakpointsObject.smaller("xs").value)
    return [ 80, 80 ];
  if (useBreakpointsObject.smaller("sm").value)
    return [ 96, 96 ];
  return [ 128, 128 ];
};

let [ rendWidth, rendHeight ] = getRendererDims();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, rendWidth / rendHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setPixelRatio(rendWidth / rendHeight);
renderer.setClearColor(0x000000, 0);
renderer.setSize(rendWidth, rendHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambientLight = new THREE.AmbientLight(0x404040, 3); // soft white light
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 5);
directionalLight1.position.set(0, 2, 3);
directionalLight1.castShadow = true;
directionalLight1.shadow.bias = -0.00001;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 5);
directionalLight2.position.set(0, 0, -3);
directionalLight2.castShadow = true;
directionalLight2.shadow.bias = -0.00001;
scene.add(directionalLight2);

camera.position.z = 15;

const loader = new GLTFLoader().setPath("/3d/");
loader.load("ld3dsvg.glb", (gltf) => {
  const root = gltf.scene;
  scene.add(root);
});

onMounted(() => {
  // renderer.domElement needs to be appended to body BEFORE initializing trackball controls
  // if not, the model loads but can't be rotated etc.
  ld3d.value.appendChild(renderer.domElement);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.noPan = true;
  controls.dynamicDampingFactor = 0.03;
  controls.noZoom = true;
  controls.target = new THREE.Vector3(0, 0, 0);

  // throttled to 200ms to prevent it from calling hundreds of times a second when resizing
  watchThrottled(windowSize, () => {
    [ rendWidth, rendHeight ] = getRendererDims();
    camera.aspect = rendWidth / rendHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(rendWidth, rendHeight);
  }, { throttle: 200 });

  animate();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
});
</script>

<template>
  <NFlex
    justify="center"
    align="center"
    :style="{ maxHeight: '10rem' }"
  >
    <div ref="logo3dContainer">
      <div ref="ld3d" />
    </div>
    <div :style="{ padding: 'auto 0', maxHeight: '8rem', maxWidth: '380px' }">
      <component
        :is="isDark ? LogoWhiteText : LogoBlackText"
        :style="{ objectFit: 'contain', maxHeight: '8rem' }"
        class="w-52 xs:w-64 sm:w-80"
      />
    </div>
  </NFlex>
</template>
