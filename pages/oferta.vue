<template>
  <div class="current-offer-wrapper">
    <Title :text="`Oferta`" />
    <section class="current-offer-container">
      <img :src="currentOfferData.img" />
      <section class="current-offer-info">
        <div class="current-offer-title">
          {{ currentOfferData.title }}
        </div>
        <div class="current-offer-detail current-offer-location">
          {{ currentOfferData.location }}
          {{ currentOfferData.country }}
        </div>
        <Rating v-model="intRating" :stars="5" readonly :cancel="false" />
        <div class="current-offer-detail current-offer-duration">
          Durata sejur:
          <span
            >{{ currentOfferData.duration }}
            <span v-if="store.offerType === 'offer'">nopti</span>
            <span v-if="store.offerType === 'tour'">zile</span></span
          >
        </div>
        <div class="current-offer-detail current-offer-adults">
          Numar Adulti: <span>{{ store.rezervationData.adults }}</span>
        </div>
        <div class="current-offer-detail current-offer-children">
          Numar Copii: <span>{{ store.rezervationData.children }}</span>
        </div>

        <section class="current-offer-detail current-offer-price">
          <div class="current-offer-price-text">Incepand de la</div>
          <div class="current-offer-price-value">
            {{ currentOfferData.price }}
            <span class="current-offer-price-detail">&euro;</span>
          </div>
          <span class="current-offer-price-text">per adult</span>
        </section>
        <!-- <Button class="current-offer-btn" @click="goToRezervaionForm()">Rezerva</Button> -->
      </section>
    </section>
    <div class="current-offer-desc">
      <Title :text="`Descriere`" />
      <div class="current-offer-desc-container">
        <section
          class="current-offer-details"
          v-if="store.offerType === 'offer'"
        >
          <ul>
            <li v-for="(facility, index) in offerFacilities()" :key="index">
              <img :src="`img/${facility.icon}`" />{{ facility.label }}
            </li>
          </ul>
        </section>

        <section class="tour-dates" v-if="store.offerType === 'tour'">
          <ul>
            <li>
              Plecare - <span>{{ currentOfferData.departure }}</span>
            </li>
            <li>
              Intoarcere - <span>{{ currentOfferData.arrival }}</span>
            </li>
            <li>
              Locuri disponibile: <span>{{ currentOfferData.available }}</span>
            </li>
          </ul>
        </section>
        <div>{{ currentOfferData.description }}</div>
      </div>
    </div>
    <div class="current-offer-form">
      <Title :text="`Formular rezervare`" />
      <div v-if="store.offerType === 'offer'">
        <RezervationForm />
      </div>
      <div v-if="store.offerType === 'tour'">
        <TourForm />
      </div>
    </div>
  </div>
</template>
<script setup>
import Button from "primevue/button";
import Rating from "primevue/rating";
import { onMounted, ref } from "vue";
import Title from "../components/Title.vue";
import { useMainStore } from "~/stores/main";
import RezervationForm from "../components/RezervationForm.vue";
import TourForm from "../components/TourForm.vue";
import Toast from "primevue/toast";

const store = useMainStore();

const intRating = ref(0);
const currentOfferData = ref({});

onMounted(() => {
  if(store.offerType === null){
    store.setOfferType(localStorage.getItem('offerType'));
  }
  switch (store.offerType) {
    case "offer":
      currentOfferData.value = store.rezervationOffer !== null ? store.rezervationOffer : JSON.parse(localStorage.getItem('rezervationOffer'));
      break;
    case "tour":
      currentOfferData.value = store.rezervationTour !== null ? store.rezervationTour : JSON.parse(localStorage.getItem('rezervationTour'));
      break;
  }

  if (currentOfferData !== null) {
    intRating.value = parseInt(currentOfferData.value.rating, 10);
  }
});

const offerFacilities = () => {
  if (currentOfferData.value.details !== undefined) {
    let finalOfferFacilities = [];
    const offerFacilitiesArray = currentOfferData.value.details
      .split(",")
      .filter((item) => item !== " ");
    const facilities = [
      { label: "Facilitati Copii", icon: "children-svgrepo-com.svg" },
      { label: "Activitati Sportive", icon: "sport-svgrepo-com.svg" },
      { label: "Piscina", icon: "pool-swimming-pool-svgrepo-com.svg" },
      { label: "Parcare", icon: "parking-fee-svgrepo-com.svg" },
      { label: "Plaja", icon: "summer-svgrepo-com.svg" },
      {
        label: "Spa",
        icon: "spa-face-mask-treatment-for-woman-svgrepo-com.svg",
      },
      { label: "Divertisment", icon: "playing-cards-12-svgrepo-com.svg" },
      { label: "Park Acvatic", icon: "aqua-park-svgrepo-com.svg" },
    ];
    for (const facilty of offerFacilitiesArray) {
      for (const facilityObj of facilities) {
        if (facilty.includes(facilityObj.label)) {
          finalOfferFacilities.push(facilityObj);
        }
      }
    }
    return finalOfferFacilities;
  }
};
</script>
  <style lang="scss">
.current-offer-wrapper {
  width: 80%;
  margin: auto;
  margin-top: 50px;
  padding: 1rem 0 3rem 0;
  .offers-title {
    width: 100%;
    margin: 1rem auto 3rem auto;
  }
  .p-button {
    background: var(--color-2);
    border: 1px solid var(--color-2);
  }
}
.current-offer-container {
  width: 100%;
  margin: auto;
  display: flex;
  flex-flow: row wrap;
  gap: 2rem;
  img {
    width: 50%;
    height: auto;
    object-fit: cover;
    border-radius: var(--border-radius);
  }
}

.current-offer-detail {
  font-size: 1.1rem;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
  span {
    color: var(--color-2);
  }
}

.current-offer-title {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-2);
}

.current-offer-location {
  font-size: 1.3rem;
  color: var(--gray-600);
  font-style: italic;
}

.current-offer-info {
  position: relative;
  width: 45%;
  .p-rating {
    margin: 1rem 0;
  }
  .p-button {
    margin: 4rem 0 0 0;
  }
}

.current-offer-details {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      font-size: 1.2rem;
      font-style: italic;
      color: var(--color-2);
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }
  }
  img {
    width: 40px;
    height: 40px;
  }
}
.current-offer-facilities {
  font-size: 1.5rem;
  color: var(--gray-600);
}

.current-offer-price {
  width: fit-content;
  margin-top: 3rem;
  text-align: right;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
}

.current-offer-price-text {
  font-size: 0.9rem;
  color: var(--gray-600);
  font-style: italic;
  font-weight: bold;
  line-height: 15px;
}

.current-offer-price-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-2);
}

.current-offer-price-detail {
  font-size: 1.7rem;
  font-weight: bold;
  color: var(--color-2);
}

.current-offer-desc {
  width: 100%;
  margin: auto;
  margin-top: 5rem;
  margin-bottom: 10rem;
}

.current-offer-desc-container {
  display: flex;
  gap: 2rem;
  padding: 0 5rem;
  div {
    width: 100%;
    text-align: justify;
    color: var(--color-2);
    font-size: 1.2rem;
  }
  section {
    width: 25%;
    border-right: 1px solid var(--color-2);
  }
}

.current-offer-form {
  .offers-title {
    width: 40vw;
  }
  width: fit-content;
  margin: auto;
  .rezervation {
    width: fit-content;
    margin: auto;
    .p-button {
      width: 100%;
      position: relative;
    }
  }
}

.tour-dates {
  margin-bottom: 6rem;
  ul {
    li {
      font-style: normal !important;
      color: var(--gray-600);
    }
    span {
      font-weight: bold;
      font-style: italic;
      color: var(--color-2);
    }
  }
}

@media screen and (max-width: 1366px) {
  .current-offer-container {
    justify-content: center;
  }
  .current-offer-desc-container {
    section {
      width: 40%;
    }
  }
  .current-offer-info {
    text-align: center;
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  .p-rating {
    width: fit-content;
  }
  .current-offer-price {
    width: 100%;
    text-align: center;
    position: relative;
  }
}
</style>