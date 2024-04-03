<template>
  <section class="tour-card">
    <img :src="tour.img" alt="" class="tour-img" />
    <section class="tour-info">
      <div class="tour-title">{{ tour.title }}</div>
      <div class="tour-country">{{ tour.country }}</div>
      <div class="tour-location">{{ tour.location }}</div>
      <div class="tour-departure">
        Plecare: <span>{{ tour.departure }}</span>
      </div>
      <div class="tour-arrival">
        Intoarcere: <span>{{ tour.arrival }}</span>
      </div>
      <div class="tour-duration">
        Durata: <span>{{ tour.duration }} zile</span>
      </div>
      <div class="tour-price">
        <span>{{ tour.price }} &euro;</span> per adult
      </div>
      <h3>Detalii</h3>
      <div class="tour-description">{{ tour.description }}</div>
      <Button label="Mai multe" @click="showTour(tour)" />
    </section>
  </section>
</template>
<script setup>
import Button from "primevue/button";
const props = defineProps({
  tour: {
    type: Object,
    default: function () {
      return {
        title: "Demo Tour",
        country: "Romania",
        location: "Cluj Napoca si Transilvania Nord",
        departure: "06:00 Bucuresti",
        arrival: "22:00 Bucuresti",
        duration: "3",
        price: "750",
        description:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae in atque quam nisi, soluta voluptate libero a obcaecati aspernatur quas possimus odit voluptas iste adipisci. Sunt ipsam tenetur eligendi temporibus? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae in atque quam nisi, soluta voluptate libero a obcaecati aspernatur quas possimus odit voluptas iste adipisci. Sunt ipsam tenetur eligendi temporibus? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae in atque quam nisi, soluta voluptate libero a obcaecati aspernatur quas possimus odit voluptas iste adipisci. Sunt ipsam tenetur eligendi temporibus? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae in atque quam nisi, soluta voluptate libero a obcaecati aspernatur quas possimus odit voluptas iste adipisci. Sunt ipsam tenetur eligendi temporibus?",
        rating: 4,
        available: 25,
        img: "http://localhost:3000/images/chuttersnap-JH0wCegJsrQ-unsplash.jpg",
      };
    },
  },
});

</script>
<style lang="scss">
.tour-card {
  width: 80rem;
  display: flex;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  gap: 2rem;
  position: relative;
  height: 50vh;
  h3 {
    color: var(--color-3);
  }
  img {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
}

.tour-info {
  width: 30rem;
  height: 85%;
  overflow: hidden;
  .p-button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: var(--color-2);
    border: 1px solid var(--color-2);
  }
}

.tour-title {
  font-size: 2rem;
  margin-top: 1rem;
  color: var(--color-3);
}

.tour-country {
  font-style: italic;
  color: var(--gray-600);
}

.tour-location {
  font-style: italic;
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.tour-arrival,
.tour-departure,
.tour-duration {
  color: var(--gray-600);
  span {
    color: var(--color-3);
  }
}

.tour-description {
  color: var(--color-2);
  margin-top: 1rem;
  width: 95%;
  overflow: hidden;
}

.tour-price {
  display: flex;
  flex-flow: column;
  font-style: italic;
  color: var(--gray-600);
  position: absolute;
  right: 1rem;
  top: 1rem;
  span {
    font-style: normal;
    font-size: 2rem;
    color: var(--color-2);
  }
}

@media screen and (max-width: 1440px) {
  .tour-card {
    width: 100%;
    height: 22rem;
    img{
      width: 70%;
    }
  }
  .tour-info{
    height: 77%;
  }
  .tour-info h3{
    margin: 0.5rem 0;
  }
  .tour-description{
    margin: 0;
  }
  .tour-title{
    font-size: 1.5rem;
  }
  
}

@media screen and (max-width: 1024px) {
  .tour-card {
    width: 100%;
    height: 22rem;
    img{
      width: 70%;
    }
  }
  .tour-info{
    height: 77%;
  }
  .tour-info h3{
    margin: 0.5rem 0;
  }
  .tour-description{
    margin: 0;
  }
  .tour-title{
    font-size: 1.5rem;
  }
  .tour-price span{
    font-size: 1.2rem;
  }
  
}
</style>