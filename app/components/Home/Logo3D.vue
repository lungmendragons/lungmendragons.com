<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBreakpoints, useWindowSize, watchThrottled } from "@vueuse/core";

import LogoWhiteText from "~/components/Logo/WhiteText.vue";
import LogoBlackText from "~/components/Logo/BlackText.vue";
import { isDark } from "~/utils/theme";
import { breakpoints } from "~/utils/breakpoints";

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SRGBColorSpace,
  PCFSoftShadowMap,
  AmbientLight,
  DirectionalLight,
  Vector3,
} from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const logo3dContainer = ref();
const ld3d = ref();

// 3D logo is wrapped in a <ClientOnly> component,
// so we can use useBreakpoints instead of useMediaQuery
const useBreakpointsObject = useBreakpoints(breakpoints);
const { width } = useWindowSize();

function getRendererDims(): [number, number] {
  if (useBreakpointsObject.smaller("xs").value)
    return [ 80, 80 ];
  if (useBreakpointsObject.smaller("sm").value)
    return [ 96, 96 ];
  if (useBreakpointsObject.smaller("md").value)
    return [ 120, 120 ];
  if (useBreakpointsObject.smaller("lg").value)
    return [ 144, 144 ];
  return [ 168, 168 ];
};

let [ rendWidth, rendHeight ] = getRendererDims();

const scene = new Scene();
const camera = new PerspectiveCamera(70, rendWidth / rendHeight, 0.1, 1000);
const renderer = new WebGLRenderer({ antialias: true, alpha: true });

renderer.setPixelRatio(rendWidth / rendHeight);
renderer.setClearColor(0x000000, 0);
renderer.setSize(rendWidth, rendHeight);
renderer.outputColorSpace = SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

const ambientLight = new AmbientLight(0x404040, 3); // soft white light
scene.add(ambientLight);

const directionalLight1 = new DirectionalLight(0xFFFFFF, 5);
directionalLight1.position.set(0, 2, 3);
directionalLight1.castShadow = true;
directionalLight1.shadow.bias = -0.00001;
scene.add(directionalLight1);

const directionalLight2 = new DirectionalLight(0xFFFFFF, 5);
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
  controls.target = new Vector3(0, 0, 0);

  // throttled to 200ms to prevent it from calling hundreds of times a second when resizing
  watchThrottled(width, () => {
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

onUnmounted(() => {
  scene.clear();
  camera.clear();
  renderer.dispose();
  ambientLight.dispose();
  directionalLight1.dispose();
  directionalLight2.dispose();
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
    <div :style="{ padding: 'auto 0' }">
      <component
        :is="isDark ? LogoWhiteText : LogoBlackText"
        :style="{ objectFit: 'contain' }"
        class="w-52 xs:w-64 sm:w-80 md:w-96 lg:w-[28rem]"
      />
    </div>
  </NFlex>
</template>
