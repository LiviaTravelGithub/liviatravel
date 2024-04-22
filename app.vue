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
const allOffers = await useFetch("/api/offersInfo");
const allTours = await useFetch("/api/toursInfo");

const router = useRouter();
onMounted(() => {
  if(allOffers !== null && allTours !== null) {
    store.loadData(allOffers.data.value.rows, allTours.data.value.rows);
  }
  if(router.currentRoute.value.path == "/dashboard/offers" || router.currentRoute.value.path == "/dashboard/tours" || router.currentRoute.value.path == "/dashboard") {
    store.setLayoutName("dashboard");
  }
})
</script>
