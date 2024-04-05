<template>
  <div class="home-container">
    <div class="skeleton-container" v-if="carouselOffers === undefined">
      <Skeleton width="30%" height="200px" />
      <Skeleton width="50%" height="150px" />
      <Skeleton width="10%" height="50px" />
    </div>
    <Carousel
      v-else
      :value="carouselOffers"
      :show-navigators="false"
      :autoplayInterval="3000"
    >
      <template #item="slotProps">
        <div class="carousel-container">
          <img :src="slotProps.data.img" alt="" />
          <div class="img-details">
            <h1>{{ slotProps.data.title }}</h1>
            <h2>{{ slotProps.data.country }} {{ slotProps.data.location }}</h2>
            <p>{{ slotProps.data.description.slice(0, 240) }}...</p>
            <Button
              class="offer-button"
              label="Vezi oferta"
              @click="showOffer(slotProps.data)"
            />
            <div class="gradient-bg"></div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
  <div class="home-offers">
    <Title :text="`Oferta Zilei`" />
    <div id="special-offer" class="special-offer-container">
      <div
        class="special-offer"
        :style="{ backgroundImage: `url(${specialOffer.img})` }"
      >
        <h4 class="ribbon">Oferta Zilei!</h4>
        <div class="special-offer-info">
          <div class="bg"></div>
          <div class="special-offer-details">
            <h1>{{ specialOffer.title }}</h1>
            <h2>{{ specialOffer.country }}</h2>
            <h5>{{ specialOffer.location }}</h5>
            <Rating
              v-model="specialOffer.rating"
              :stars="5"
              readonly
              :cancel="false"
            />
            <p>{{ specialOffer.description.substring(0, descLimit) }}...</p>
          </div>
          <div class="offer-details">
            <Button
              label="Rezervă"
              @click="showOffer(specialOffer)"
            />
            <div class="special-offer-price">
              <div>
                {{ parseFloat(specialOffer.price).toLocaleString("ro-RO") }}
                <span class="currency">&euro;</span>
              </div>
              <div class="price-specification">
                {{ specialOffer.duration }} nopti
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Title :text="`Ultimele oferte adaugate`" />
    <div id="offers" class="offers-container">
      <OfferCard v-for="offer in offers" :key="offer.id" :offer="offer" />
    </div>
    <div id="tours" class="tours-container">
      <TourCard v-for="tour in tours" :key="tour.id" :tour="tour" />
    </div>
  </div>
</template>
<script setup>
import Carousel from "primevue/carousel";
import Skeleton from "primevue/skeleton";
import Title from "../components/Title.vue";
import OfferCard from "../components/OfferCard.vue";
import TourCard from "../components/TourCard.vue";
const allOffers = await useFetch("/api/offersInfo");
const allTours = await useFetch("/api/toursInfo");

const store = useMainStore();

const descLimit = ref(200);

const showOffer = (offer) => {
  store.setOffer(offer);
  store.setOfferType("offer");
  navigateTo("/oferta");
}

const isMobile = () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const carouselOffers = ref();
const specialOffer = ref({
  title: "",
  img: "",
  country: "",
  location: "",
  description: "",
  is_special: false,
  price: 0,
  rating: 0,
});

const tours = ref();
const offers = ref();

onMounted(async () => {
  const offersData = allOffers.data.value.rows;
  carouselOffers.value = offersData.slice(0, 3);
  offersData.forEach((offer) => {
    if (offer.is_special) {
      specialOffer.value = offer;
    }
  });
  offers.value = latestOffers();
  tours.value = latestTours();
  if (isMobile()) {
    descLimit.value = 150;
  }
});

const latestOffers = () => {
  const offersData = allOffers.data.value.rows;
  return offersData
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
    .slice(0, 6);
};

const latestTours = () => {
  const toursData = allTours.data.value.rows;
  return toursData
    .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
    .slice(0, 6);
};
</script>
<style lang="scss">
@import "~/assets/css/home.carousel.scss";
@import "~/assets/css/home.offers.scss";
.home-container {
  margin-top: 50px;
}
</style>