<template>
  <div class="offers-title">
    <div class="offers-title-bg"></div>
    <div class="offers-title-text">{{ text }}</div>
  </div>
</template>
<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss">
.offers-title {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  position: relative;
  margin: 2rem auto;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.5));
}

.offers-title-bg {
  width: 100%;
  height: 100%;
  background: var(--color-2);
  padding: 1.5rem;
  position: absolute;
  clip-path: polygon(100% 0%, 97% 50%, 100% 100%, 0% 100%, 3% 50%, 0% 0%);
}

.offers-title-text {
  color: #fff;
  position: relative;
  font-weight: 700;
  z-index: 2;
  color: #fff;
}

@media screen and (max-width: 414px) {
  .offers-title {
    width: 90%;
    font-size: 1.5rem;
  }
  .offers-title-bg {
    clip-path: polygon(100% 0%, 93% 50%, 100% 100%, 0% 100%, 7% 50%, 0% 0%);
  }
}
</style>