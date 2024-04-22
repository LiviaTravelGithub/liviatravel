<template>
  <section class="offers">
    <section class="offers-sidebar">
      <h2>
        Filtreaza
        <i class="pi pi-filter"></i>
        <i
          class="pi pi-refresh"
          @click="clearFilters()"
          title="Sterge filtrele"
          v-if="showClearButton"
        ></i>
      </h2>
      <span class="search-container">
        <i class="pi pi-search"></i>
        <AutoComplete
          v-model="searchValue"
          :suggestions="searchSuggestions"
          @complete="offerSearch"
          placeholder="Cauta dupa nume"
          optionLabel="title"
          @clear="clearFilter"
          @item-select="offerItemSelect"
        />
      </span>
      <Accordion :multiple="true" class="filter-section" :active-index="[0]">
        <AccordionTab header="Tip oferta">
          <div>
            <RadioButton
              v-model="offerType"
              id="offers-category"
              value="offers"
            />
            <label for="offers-category">Sejur</label>
          </div>
          <div>
            <RadioButton
              v-model="offerType"
              id="tours-category"
              value="tours"
            />
            <label for="tours-category">Circuit</label>
          </div>
        </AccordionTab>
        <AccordionTab header="Locatie oferta">
          <div>
            <RadioButton
              v-model="offerLocation"
              id="offers-category"
              value="intern"
            />
            <label for="offers-category">Interna</label>
          </div>
          <div>
            <RadioButton
              v-model="offerLocation"
              id="tours-category"
              value="extern"
            />
            <label for="tours-category">Externa</label>
          </div>
        </AccordionTab>
        <AccordionTab header="Pret">
          <div class="price-section-inputs">
            <InputText v-model.number="priceFilterValue[0]" />
            <InputText v-model.number="priceFilterValue[1]" />
          </div>
          <Slider
            v-model="priceFilterValue"
            range
            :min="priceMin"
            :max="priceMax"
          />
        </AccordionTab>
        <AccordionTab header="Stele">
          <div
            class="stars-checkbox"
            v-for="(category, index) in OFFERS_UTIL.starsCategory"
            :key="index"
          >
            <RadioButton
              v-model="starsFilterValue"
              :id="`${category.value}-stars`"
              :value="category.value"
            />
            <label :for="`${category.value}-stars`">{{ category.label }}</label>
          </div>
        </AccordionTab>
        <AccordionTab header="Tara">
          <div
            class="country-checkbox"
            v-for="(category, index) in countryCategory"
            :key="index"
          >
            <RadioButton
              v-model="countryFilterValue"
              :id="`${category.value}-country`"
              :value="category.value"
            />
            <label :for="`${category.value}-country`">{{
              category.label
            }}</label>
          </div>
        </AccordionTab>
      </Accordion>
      <Button label="Filtreaza" @click="applyFilters()" />
    </section>

    <section class="offers-view-wrapper">
      <div class="offers-wrapper" v-if="!offersLoading">
        <OfferCard
          v-for="offer in displayedOffers"
          :key="offer.title"
          :offer="offer"
        />
        <div class="no-offers" v-if="displayedOffers.length === 0">
          Nu exista oferte pentru filtrele selectate.
        </div>
      </div>
      <div class="skeleton-wrapper" v-if="offersLoading">
        <Skeleton
          v-for="i in rowsPerPage"
          :key="i"
          width="18vw"
          height="50vh"
        />
      </div>
      <div class="paginator-container">
        <Paginator
          ref="paginatorRef"
          :rows="rowsPerPage"
          :totalRecords="filteredOffers.length"
          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink JumpToPageDropdown"
          @page="handlePaginatorChange"
        >
        </Paginator>
      </div>
    </section>
  </section>
</template>
<script setup>
import Button from "primevue/button";
import AutoComplete from "primevue/autocomplete";
import Slider from "primevue/slider";
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "~/stores/main";
import OfferCard from "../components/OfferCard.vue";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Paginator from "primevue/paginator";
import Skeleton from "primevue/skeleton";

const store = useMainStore();

const allOffers = await useFetch("/api/offersInfo");
const allTours = await useFetch("/api/toursInfo");

const allInfo = {
  offers: allOffers.data.value.rows,
  tours: allTours.data.value.rows,
};

const rowsPerPage = ref(6);
const paginatorRef = ref(null);

const offerLocation = ref(null);
const offerType = ref("offers");
const searchValue = ref("");
const searchSuggestions = ref([]);
const filteredOffers = ref([]);
const starsFilterValue = ref();
const countryFilterValue = ref();
const countryCategory = ref([]);

const priceMin = ref(0);
const priceMax = ref(100);
const displayedOffers = ref([]);
const currentPage = ref(0);
const showClearButton = ref(false);
const offersLoading = ref(false);

const priceFilterValue = ref([priceMin.value, priceMax.value]);

onMounted(() => {
  if (allOffers !== null && allTours !== null) {
    store.toggleLoader(false);
  }
  setTimeout(() => {
    switch (offerType.value) {
      case "offers":
        filteredOffers.value = allOffers.data.value.rows;
        break;
      case "tours":
        filteredOffers.value = allTours.data.value.rows;
        break;
      default:
        break;
    }
    OFFERS_UTIL.loadCategories();
    displayedOffers.value = filteredOffers.value.slice(0, rowsPerPage.value);
  }, 300);
});

function handlePaginatorChange(event) {
  currentPage.value = event.page;
  let startIndex = currentPage.value * rowsPerPage.value;
  let endIndex = startIndex + rowsPerPage.value;
  displayedOffers.value = filteredOffers.value.slice(startIndex, endIndex);
  window.scrollTo(0, 0);
}

const OFFERS_UTIL = {
  priceRange: function () {
    let tempArray = [];
    for (const offer of allInfo[offerType.value]) {
      tempArray.push(offer.price);
    }

    return {
      min: Math.min(...tempArray),
      max: Math.max(...tempArray),
    };
  },
  offerCategory: [
    { label: "Oferte", value: "offers" },
    { label: "Circuite", value: "tours" },
  ],
  starsCategory: [
    { label: "1 Stele", value: "1" },
    { label: "2 Stele", value: "2" },
    { label: "3 Stele", value: "3" },
    { label: "4 Stele", value: "4" },
    { label: "5 Stele", value: "5" },
  ],
  loadCountryCategories: function () {
    let tempArray = [];
    for (const offer of allInfo[offerType.value]) {
      tempArray.push(offer.country);
    }
    let uniqueArray = [...new Set(tempArray)];
    let finalArray = [];
    for (const country of uniqueArray) {
      finalArray.push({ label: country, value: country });
    }
    return finalArray;
  },
  findFiltereOffer: (...arrays) => {
    const nonEmptyArrays = arrays.filter((array) => array.length > 0);

    if (nonEmptyArrays.length === 0) {
      // If all arrays are empty or no non-empty arrays, return an empty array
      return [];
    }

    return nonEmptyArrays.reduce((commonOfffer, currentArray) => {
      return commonOfffer.filter((offer) => {
        return currentArray.includes(offer);
      });
    });
  },
  loadCategories: () => {
    countryCategory.value = OFFERS_UTIL.loadCountryCategories();
    priceMin.value = OFFERS_UTIL.priceRange().min;
    priceMax.value = OFFERS_UTIL.priceRange().max;
    priceFilterValue.value = [priceMin.value, priceMax.value];
  },
};

function filterOffers() {
  console.log(allInfo[offerType.value]);
  const finalOffers = allInfo[offerType.value].filter((offer) => {
    const locationMatch =
      !offerLocation.value || offer.type.toLowerCase() === offerLocation.value;
    const starMatch =
      !starsFilterValue.value || offer.rating === starsFilterValue.value;
    const countryMatch =
      !countryFilterValue.value || offer.country === countryFilterValue.value;
    const priceMatch =
      parseInt(offer.price) >= priceFilterValue.value[0] &&
      parseInt(offer.price) <= priceFilterValue.value[1];
    return locationMatch && starMatch && countryMatch && priceMatch;
  });

  filteredOffers.value = finalOffers;
  displayedOffers.value = finalOffers.slice(0, rowsPerPage.value);

  if (
    starsFilterValue.value ||
    countryFilterValue.value ||
    offerLocation.value
  ) {
    showClearButton.value = true;
  }
}

const applyFilters = async () => {
  offersLoading.value = true;
  await filterOffers();
  setTimeout(() => {
    offersLoading.value = false;
  }, 800);
};

const offerSearch = (event) => {
  let filtered = allInfo[offerType.value].filter((offer) => {
    return offer.title.toLowerCase().includes(event.query.toLowerCase());
  });
  console.log(filtered);
  searchSuggestions.value = filtered;
  displayedOffers.value = filtered.slice(0, rowsPerPage.value);
};

const clearFilters = () => {
  starsFilterValue.value = null;
  countryFilterValue.value = null;
  offerLocation.value = null;
  priceFilterValue.value = [priceMin.value, priceMax.value];
  showClearButton.value = false;
  filterOffers();
};

const clearFilter = () => {
  searchValue.value = "";
  filteredOffers.value = allInfo[offerType.value];
};

const offerItemSelect = (event) => {
  filteredOffers.value = [];
  filteredOffers.value.push(event.value);
};

watch(offerType, () => {
  if (offerType.value === "offers") {
    filteredOffers.value = allOffers.data.value.rows;
  } else if (offerType.value === "tours") {
    filteredOffers.value = allTours.data.value.rows;
  }
  displayedOffers.value = filteredOffers.value.slice(0, rowsPerPage.value);
  OFFERS_UTIL.loadCategories();
});
</script>
<style lang="scss">
.offers {
  width: 98%;
  margin: auto;
  margin-top: 50px;
  display: flex;
  flex-flow: row;
  justify-content: space-evenly;
  gap: 1rem;
  padding: 2rem 0;
}
.offers-sidebar {
  width: 15%;
  height: fit-content;
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.5);
  border-radius: var(--border-radius);
  padding: 0 1rem 1rem 1rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  box-sizing: content-box;
  gap: 1rem;
  h2 {
    width: 100%;
    color: var(--color-3);
    text-align: center;
    position: relative;
    i:nth-child(2) {
      position: absolute;
      right: 0;
      top: -0.55rem;
      background: var(--color-2);
      padding: 0.3rem;
      border-radius: 50%;
      color: var(--color-5);
      cursor: pointer;
    }
  }
  .p-radiobutton-box {
    border-radius: 10%;
  }
  .p-radiobutton-box:hover {
    border-color: var(--color-2);
  }
  .p-radiobutton.p-highlight .p-radiobutton-box {
    background: var(--color-2);
    border-color: var(--color-2);
    border-radius: 10%;
  }
  .p-radiobutton-icon {
    background: var(--color-2);
    border-radius: 10%;
  }
  .p-radiobutton-icon::before {
    content: "\2713";
    color: var(--color-5);
    position: absolute;
    font-weight: 800;
    left: 0;
    top: -5px;
  }
  .p-button {
    background: var(--color-2);
    color: var(--color-5);
    border: 1px solid var(--color-2);
  }
  .p-button:hover {
    background-color: var(--color-5) !important;
    color: var(--color-2) !important;
    border: 1px solid var(--color-5) !important;
  }
  .p-button:focus {
    box-shadow: 0px 0px 5px var(--color-5) !important;
  }
}

.filter-section {
  width: 100%;
  .p-accordion-header-action {
    background: var(--color-2) !important;
    color: var(--color-5) !important;
  }
  .p-accordion-content {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
    border-color: var(--color-2);
    padding: 0.5rem;
    div {
      display: flex;
      gap: 0.5rem;
    }
  }
}

.p-accordion .p-accordion-header .p-accordion-header-link {
  border: 1px solid var(--color-2);
}
.p-accordion
  .p-accordion-header:not(.p-disabled).p-highlight
  .p-accordion-header-link {
  border-color: var(--color-2) !important;
}
.p-accordion
  .p-accordion-header:not(.p-highlight):not(.p-disabled):hover
  .p-accordion-header-link {
  border-color: var(--color-2) !important;
}
.p-accordion
  .p-accordion-header:not(.p-disabled).p-highlight:hover
  .p-accordion-header-link {
  border-color: var(--color-2) !important;
}
.p-accordion
  .p-accordion-header:not(.p-disabled)
  .p-accordion-header-link:focus {
  box-shadow: none !important;
}

.search-container {
  height: 2.8rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border: 1px solid var(--gray-400);
  border-radius: 5px;
  .p-inputtext {
    border: none;
    width: 90%;
  }
  .p-inputtext:enabled:focus {
    box-shadow: none;
    border: none;
    outline: none;
  }
  i {
    height: 100%;
    background: var(--color-2);
    color: var(--color-5);
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0 0.7rem;
    box-sizing: content-box;
    border-bottom: 2px solid var(--color-2);
    font-weight: 900;
  }
}

.category-section,
.price-section,
.stars-section,
.country-section {
  width: 100%;
  border: 1px solid var(--gray-300);
  border-radius: 5px;
  padding: 1rem;
  h2 {
    margin-top: 0rem;
  }
}

.price-section-inputs {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
  input {
    width: 45%;
  }
}

.price-section {
  .p-slider-range {
    background: var(--color-3);
  }
  .p-slider-handle {
    border: 2px solid var(--color-3);
  }
  .p-slider-handle:focus,
  .p-slider-handle:hover {
    background: var(--color-3);
  }
}

.stars-checkbox,
.country-checkbox {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.offers-view-wrapper {
  width: 85%;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  .offers-title {
    margin-top: 0;
    margin-bottom: 2rem;
  }
}

.paginator-container {
  width: 100%;
  .p-paginator {
    background: var(--gray-300);
  }
}
.skeleton-wrapper,
.offers-wrapper {
  width: 100%;
  border: 1px solid var(--gray-300);
  box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.5);
  border-radius: 5px;
  height: fit-content;
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 0.5rem;
  gap: 2rem;
  padding: 1rem;
}

.no-offers {
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--color-2);
}

@media screen and (max-width: 1366px) {
  .offers-wrapper {
    justify-content: flex-start;
  }
  .offers-sidebar {
    width: 20%;
  }
}

@media screen and (max-width: 1024px) {
  .offers-sidebar {
    width: 30%;
  }
  .offers-title {
    width: 90%;
  }
  .offers {
    width: 90%;
  }
}
@media screen and (max-width: 851px), (max-width: 414px) {
  .offers {
    display: flex;
    flex-flow: column;
  }
  .offers-sidebar {
    width: 90%;
  }
  .offers-view-wrapper {
    width: 100%;
  }
  .offers-wrapper {
    width: 100%;
    justify-content: center;
  }
}
</style>