<script setup lang="ts">
// Set page metadata
useSeoMeta({
  title: 'Shop - Lungmen Dragons',
  description: 'Browse and purchase items from the Lungmen Dragons official shop.',
})

// Track iframe height
const iframeHeight = ref('800px')

// Define the message handler function so we can properly remove it
const handleMessage = (event: MessageEvent) => {
  // Check if it's our resize message
  if (event.data && event.data.type === 'resize-iframe') {
    // Add a small buffer to avoid cutting off content
    iframeHeight.value = `${event.data.height + 20}px`
  }
}

// Listen for messages from the iframe
onMounted(() => {
  window.addEventListener('message', handleMessage)
})

// Clean up event listener
onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="shop-page-container">
    <div class="shop-header">
      <h1>Lungmen Dragons Shop</h1>
      <p>Support us by purchasing official merchandise!</p>
    </div>
    
    <div class="shop-iframe-container">
      <iframe
        :src="'/kofi-embed.html'"
        :style="{ height: iframeHeight }"
        class="kofi-shop-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        scrolling="no"
        title="Lungmen Dragons Shop"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.shop-page-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
}

.shop-header {
  text-align: center;
  margin-bottom: 2rem;
}

.shop-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ff5f83;
  line-height: 1.2;
}

.shop-header p {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.shop-iframe-container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.kofi-shop-iframe {
  width: 100%;
  border: none;
  transition: height 0.3s ease;
}

/* Responsive width adjustments */
@media (max-width: 1200px) {
  .shop-iframe-container {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .shop-header h1 {
    font-size: 2rem;
  }
  
  .shop-header p {
    font-size: 1rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .shop-page-container {
    padding: 0.5rem;
  }
  
  .shop-header h1 {
    font-size: 1.8rem;
  }
  
  .shop-header p {
    font-size: 0.95rem;
  }
}
</style>