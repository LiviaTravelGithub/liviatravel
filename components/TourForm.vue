<template>
  <form class="tour-form">
    <div class="form-row tour-form-row">
      <span class="p-float-label">
        <InputText
          id="last_name"
          type="text"
          v-model="rezervationData.lastName"
        />
        <label for="last_name">Nume</label>
      </span>
      <span class="p-float-label">
        <InputText
          id="first_name"
          type="text"
          v-model="rezervationData.firstName"
        />
        <label for="first_name">Prenume</label>
      </span>
    </div>
    <div class="form-row tour-form-row">
      <span class="p-float-label">
        <InputText id="email" type="text" v-model="rezervationData.email" />
        <label for="email">Email</label>
      </span>
      <span class="p-float-label">
        <InputText id="phone" type="text" v-model="rezervationData.phone" />
        <label for="phone">Telefon</label>
      </span>
    </div>
    <div class="form-row tour-form-row">
      <span class="p-float-label">
        <InputText id="adults" type="number" v-model="rezervationData.adults" />
        <label for="adults">Adulti</label>
      </span>
      <span class="p-float-label">
        <InputText
          id="children"
          type="number"
          v-model="rezervationData.children"
        />
        <label for="children">Copii</label>
      </span>
    </div>
    <span class="tour-form-info">
      <ul>
        <li>
          Oferta: <span>{{ rezervationData.title }}</span>
        </li>
        <li>
          Persoane:
          <span>{{
            parseInt(rezervationData.adults, 10) +
            parseInt(rezervationData.children, 10)
          }}</span>
        </li>
        <li>
          Pret:
          <span
            >{{
              parseInt(rezervationData.price, 10) *
                parseInt(rezervationData.adults, 10) +
              parseInt(rezervationData.children, 10)
            }}
            &euro;</span
          >
        </li>
      </ul>
    </span>
    <NuxtTurnstile ref="turnstile" v-model="rezervationData.captchaToken" />
    <Button label="Rezervare" @click="rezerveTour" />
  </form>
  <Dialog header="Va rugam asteptati..." v-model:visible="dialogVisible" modal />
  <Toast />
</template>
<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { useMainStore } from "~/stores/main";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
const toast = useToast();
const store = useMainStore();

const turnstile = ref();
const dialogVisible = ref(false);

const rezervationData = ref({});

onMounted(() => {
  if (store.rezervationTour === null) {
    store.setTour(JSON.parse(localStorage.getItem("rezervationTour")));
  }
  rezervationData.value.title = store.rezervationTour.title;
  rezervationData.value.adults = 1;
  rezervationData.value.children = 0;
  rezervationData.value.price = store.rezervationTour.price;
});

function rezerveTour(e) {
  e.preventDefault();

  dialogVisible.value = true;

  const rezervationInfo = {
    firstName: rezervationData.value.firstName,
    lastName: rezervationData.value.lastName,
    email: rezervationData.value.email,
    phone: rezervationData.value.phone,
    adults: rezervationData.value.adults,
    children: rezervationData.value.children,
    tourName: rezervationData.value.title,
    tourPrice: rezervationData.value.price,
    captcha: rezervationData.value.captchaToken,
  };

  if (
    rezervationData.value.firstName === undefined ||
    rezervationData.value.lastName === undefined ||
    rezervationData.value.email === undefined ||
    rezervationData.value.phone === undefined
  ) {
    toast.add({
      severity: "error",
      summary: "Eroare",
      detail: "Completeaza toate campurile",
      life: 3000,
    });
    return;
  }

  try {
    useFetch("/api/validate", {
      method: "POST",
      body: {
        token: rezervationData.value.captchaToken,
      }
    }).then(
      (response) => {
        if (response.data.value.success) {
          useFetch("/api/tourRezervation", {
            method: "POST",
            body: { rezervationInfo },
          }).then(() => {
            rezervationData.value.firstName = "";
            rezervationData.value.lastName = "";
            rezervationData.value.email = "";
            rezervationData.value.phone = "";
            rezervationData.value.adults = 1;
            rezervationData.value.children = 0;

            dialogVisible.value = false;

            toast.add({
              severity: "success",
              summary: "Rezervare",
              detail: "Rezervarea a fost plasata cu succes",
              life: 3000,
            });
          }).then(() => {
            turnstile.value.reset();
          })
        }
      }
    );
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Rezervare",
      detail: "Rezervarea nu a putut fi plasata",
      life: 3000,
    });
  }
}
</script>
<style lang="scss">
.tour-form {
  .p-button {
    width: 100%;
  }
}

.tour-form-row {
  span {
    width: 50%;
  }
  input {
    width: 100%;
  }
}

.tour-form-info {
  ul {
    list-style: none;
    font-size: 1.5rem;
    margin: 2rem 0;
    padding: 0;
    color: var(--color-2);
    span {
      font-weight: bold;
      color: var(--color-2);
    }
  }
}
</style>