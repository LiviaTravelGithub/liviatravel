<template>
  <div>
    <NuxtLayout :name="store.layoutName">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { useMainStore } from '~/stores/main';
const store = useMainStore();

const router = useRouter();
onMounted(() => {
  if(router.currentRoute.value.path == "/dashboard/offers" || router.currentRoute.value.path == "/dashboard/tours" || router.currentRoute.value.path == "/dashboard") {
    store.setLayoutName("dashboard");
  }
})
</script>
