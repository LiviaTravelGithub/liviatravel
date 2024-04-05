<template>
  <div class="login-screen" v-if="!store.isLoggedIn">
    <div class="login-container">
      <h1>Login</h1>
      <span class="p-float-label">
        <InputText type="text" v-model="username" />
        <label>Username</label>
      </span>
      <span class="p-float-label">
        <Password
          inputStyle="width: 100%"
          :feedback="false"
          v-model="password"
        />
        <label>Parola</label>
      </span>
      <Button label="Login" @click="handleLogin()" />
    </div>
  </div>
</template>
<script setup>
import Password from "primevue/password";
import InputText from "primevue/inputtext";
import { useMainStore } from "~/stores/main";

const store = useMainStore();
const username = ref("");
const password = ref("");

const handleLogin = async () => {
  const data = await useFetch("/api/dashboardLogin", {
    method: "POST",
    body: {
      username: username.value,
      password: password.value,
    },
  });

  if (data.data.value.success) {
    navigateTo("/dashboard/offers");
    store.toggleLogin(true);
  }
};
</script>
<style lang="scss">
.login-screen {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-container {
  width: 20vw;
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 2rem;
  .p-button,
  .p-inputtext,
  .p-inputwrapper,
  .p-float-label {
    width: 100%;
  }
}
</style>