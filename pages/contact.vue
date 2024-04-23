<template>
  <div class="contact-container">
    <div class="info-container">
      <Title :text="`Contact`" />
      <div class="contact-info">
        <div id="facebook" class="contact-card">
          <a
            href="https://www.facebook.com/people/LIVIA-Travel/100057546485308/"
            target="_blank"
          >
            <i class="pi pi-facebook"></i>
            <div class="contact-text">Livia Travel</div>
          </a>
        </div>
        <div id="email" class="contact-card">
          <i class="pi pi-envelope"></i>
          <div class="contact-text">agentie@clipastour.ro</div>
        </div>
        <div id="phone" class="contact-card">
          <i class="pi pi-phone"></i>
          <div class="contact-text">0725 121 246</div>
        </div>
        <div id="program" class="contact-card">
          <i class="pi pi-clock"></i>
          <div class="contact-program-wrapper">
            <div class="contact-program">
              <div>Luni-Vineri:</div>
              09:00-18:00
            </div>
            <div class="contact-program">
              <div>Sambata:</div>
              09:00-15:00
            </div>
            <div class="contact-program">
              <div>Duminica:</div>
              Inchis
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-container" style="height: 600px; width: 800px">
      <l-map
        ref="map"
        v-model:zoom="zoom"
        :center="[45.12323, 25.73624]"
        :use-global-leaflet="false"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        ></l-tile-layer>
        <l-marker :lat-lng="[45.12305, 25.73612]" name="Location">
          <l-tooltip>Livia Travel</l-tooltip>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>
  <script setup>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import Title from "../components/Title.vue";

const map = ref(null);
const zoom = ref(18);
</script>
  <style lang="scss">
.contact-container {
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 50px;
}

.info-container {
  width: 50%;
  .offers-title {
    margin: 0 auto;
  }
}

.contact-info {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 2rem;
  box-sizing: content-box;
  gap: 2rem;
  #facebook {
    background: #4267b2;
    a {
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      gap: 2rem;
    }
  }
  #email {
    background: var(--color-4);
  }
  #phone {
    background: var(--red-400);
  }
}

.contact-card {
  width: 35%;
  height: 35vh;
  background: var(--color-3);
  border-radius: var(--border-radius);
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.5);
  .pi {
    color: #fff;
    font-size: 5vw;
  }
  .contact-text {
    color: #fff;
    font-size: 1.3rem;
  }
}

.contact-program {
  display: flex;
  color: #fff;
  font-size: 1.2rem;
  div {
    width: 120px;
  }
}

.map-container {
  border: 2px solid var(--color-2);
  margin-top: 5vh;
  position: relative;
  z-index: 1;
}

@media screen and (max-width: 1366px) {
  .contact-container {
    height: fit-content;
    justify-content: center;
  }
  .info-container {
    width: 100%;
  }
}

@media screen and (max-width: 851px), (max-width: 414px) {
  .contact-info {
    flex-flow: column;
  }
  .contact-card {
    width: 100%;
    height: 300px;
  }
  .offers-title {
    width: 100%;
    display: none;
  }
  .contact-card i {
    font-size: 3rem !important;
  }
}
</style>