<template>
  <header class="dashboard-header" v-if="store.isLoggedIn">
    <span class="dashboard-logo">
      <logo :bg="`var(--color-5)`" :plane="`var(--color-2)`" />
      <div class="dashboard-logo-text">Livia Travel</div>
    </span>
    <Avatar
      label="A"
      size="large"
      shape="circle"
      style="cursor: pointer; background-color: var(--color-5)"
      @click="toggleUserPanel"
    />
    <OverlayPanel ref="userMenu">
      <ul>
        <li @click="dialogVisible = !dialogVisible">
          <div class="menu-icon cog-icon"><i class="pi pi-cog"></i></div>
          <div class="menu-text pass-text">Schimba Parola</div>
        </li>
        <li @click="logout()">
          <div class="menu-icon logout-icon">
            <i class="pi pi-sign-out"></i>
          </div>
          <div class="menu-text exit-text">Deconectare</div>
        </li>
      </ul>
    </OverlayPanel>
  </header>
  <div class="dashboard-container">
    <section v-if="store.isLoggedIn">
      <nav class="dashboard-nav">
        <router-link to="/dashboard/offers"
          ><i class="pi pi-file-edit"></i><span>Oferte</span></router-link
        >
        <router-link to="/dashboard/tours"
          ><i class="pi pi-users"></i><span>Circuite</span></router-link
        >
      </nav>
    </section>
    <main class="dashboard-main">
      <slot />
    </main>
    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="Confirmare"
      class="p-fluid"
    >
      <p class="pass-change">
        <span class="p-float-label">
          <InputText id="username" v-model="newInfo.username" />
          <label for="username">Username</label>
        </span>
        <span class="p-float-label">
          <Password id="oldPassword" v-model="newInfo.oldPassword" />
          <label for="oldPassword">Parola Veche</label>
        </span>
        <span class="p-float-label">
          <Password id="newPasswod" v-model="newInfo.newPassword" />
          <label for="newPasswod">Parola noua</label>
        </span>
      </p>
      <Button class="p-button p-button-info" @click="changePass()"
        >Schimba</Button
      >
    </Dialog>
    <Toast />
  </div>
</template>
<script setup>
import Dialog from "primevue/dialog";
import { useMainStore } from "~/stores/main";
import OverlayPanel from "primevue/overlaypanel";
import Logo from "~/components/Logo.vue";
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import {useToast } from "primevue/usetoast";
const toast = useToast();
const store = useMainStore();
const userMenu = ref();
const dialogVisible = ref(false);
const logout = () => {
  store.toggleLogin(false);
  navigateTo("/dashboard");
};

const toggleUserPanel = (event) => {
  userMenu.value.toggle(event);
};

const newInfo = ref({
  username: "",
  oldPassword: "",
  newPassword: "",
});

const changePass = () => {
  useFetch("/api/changePassword", {
    method: "POST",
    body: newInfo.value,
  }).then(() => {
    toast.add({
      severity: "success",
      summary: "Succes",
      detail: "Parola a fost schimbata cu succes",
      life: 3000,
    })
    dialogVisible.value = false;
  })
};
</script>
<style lang="scss">
.dashboard-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  svg {
    width: 3rem;
  }
}
.dashboard-logo-text {
  color: var(--color-5);
  font-weight: 400;
}
.dashboard-header {
  margin: 0.5rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0.5rem 2rem;
  background: var(--color-2);
  span {
    font-size: 1.5rem;
  }
}

.p-overlaypanel-content {
  ul {
    padding: 0;
    list-style: none;
    li {
      margin: 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
  }
}
.menu-icon {
  width: 30px;
}

.cog-icon,
.pass-text {
  fill: var(--blue-500);
  color: var(--blue-500);
}

.logout-icon,
.exit-text {
  fill: var(--red-500);
  color: var(--red-500);
}

.pass-change {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
.p-button-info {
  display: flex;
  justify-content: center;
}

.dashboard-nav {
  width: 10vw;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-top: 1rem;
  gap: 0.8rem;
  background: var(--color-2);
  border-radius: 5px;
  a {
    width: 80%;
    text-align: center;
    text-decoration: none;
    font-size: 0.7vw;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    text-transform: uppercase;
    color: var(--color-5);
  }
  a:hover {
    background: var(--color-1);
    border-radius: 5px;
  }
  .pi {
    font-size: 1.3rem;
  }
  span {
    width: 80%;
    text-align: left;
  }
}
.dashboard-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 70px - 1vw);
  margin: 0.5rem;
  gap: 0.5rem;
  flex-flow: row nowrap;
}
.dashboard-main {
  width: 90%;
  padding: 0 1rem;
  border-radius: var(--border-radius);
}
</style>