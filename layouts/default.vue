<template>
  <header class="main-header">
    <div class="logo-container">
      <img class="logo" src="~/public/img/logo.svg" alt="logo" />
      <div class="logo-text">Livia Travel</div>
    </div>
    <i class="pi pi-bars" @click="mainStore.toggleSidebar(true)"></i>
    <nav class="main-navigation">
      <NuxtLink to="/">Acasa</NuxtLink> |
      <NuxtLink to="/oferte">Sejururi/Circuite</NuxtLink> |
      <NuxtLink to="/contact">Contact</NuxtLink> |
      <NuxtLink to="/solicitare">Solicita Oferta</NuxtLink>
    </nav>
  </header>
  <main>
    <slot />
  </main>
  <footer>
    <div class="footer-container">
      <div class="footer-logo">
        <Logo :bg="`var(--color-5)`" :plane="`var(--color-2)`" />
        <div>Livia Travel</div>
      </div>
      <p>
        Tu fă-ţi bagajele şi noi ne ocupăm de restul!
      </p>
    </div>
    <div class="footer-container">
      <h3>Contact</h3>
      <ul class="footer-contact">
        <li><i class="pi pi-facebook" /> <a href="https://www.facebook.com/people/LIVIA-Travel/100057546485308/" target="_blank">Livia Travel</a></li>
        <li>
          <i class="pi pi-envelope" /> <a href="mailto:agentie@clipastour.ro">agentie@clipastour.ro</a>
        </li>
        <li>
          <i class="pi pi-phone" /><a href="tel:0725121246">0725 121 246</a>
        </li>
      </ul>
    </div>
    <div class="footer-container">
      <h3>Adresa</h3>
      <div class="footer-address">
        <i class="pi pi-map-marker" /> Bulevardul Carol I nr. 36 parter, Campina, Prahova
      </div>
      <div class="footer-program">
        <div>Luni-Vineri:</div>
        09:00-18:00
      </div>
      <div class="footer-program">
        <div>Sambata:</div>
        09:00-15:00
      </div>
      <div class="footer-program">
        <div>Duminica:</div>
        Inchis
      </div>
    </div>
  </footer>
  <div class="loader-container" v-if="mainStore.showLoader">
    <div class="spinner-container">
      <div class="loader-spinner-1"></div>
      <div class="loader-spinner-2"></div>
      <div class="loader-spinner-3"></div>
    </div>
    <div class="loader-logo">
      <Logo :bg="`var(--color-2)`" :plane="`#fff`" />
      <div>Livia Travel</div>
    </div>
  </div>
  <Sidebar v-model:visible="mainStore.sidebarOpen" :baseZIndex="10000">
    <template #header>
      <img class="logo" src="/img/logo.svg" alt="logo" />
      <div class="logo-text">Livia Travel</div>
    </template>
    <div class="sidebar-container">
      <NuxtLink to="/">Acasa</NuxtLink>
      <NuxtLink to="/oferte">Sejururi/Circuite</NuxtLink>
      <NuxtLink to="/contact">Contact</NuxtLink>
      <NuxtLink to="/solicitare">Solicita Oferta</NuxtLink>
    </div>
  </Sidebar>
</template>
<script setup>
import Logo from "~/components/Logo.vue";
import { useMainStore } from "~/stores/main";
import { onMounted } from "vue";
import Sidebar from "primevue/sidebar";
const mainStore = useMainStore();
const showSidebar = ref(false);

onMounted(() => {
  mainStore.toggleLoader(true);
});
</script>
<style lang="scss">
@import "~/assets/css/app.header.scss";
@import "~/assets/css/app.footer.scss";
@import "~/assets/css/app.loader.scss";
</style>