<template>
  <form class="rezervation">
    <h3>Detalii Personale</h3>
    <div class="form-row">
      <span class="p-float-label">
        <InputText
          id="lastName"
          type="text"
          v-model="rezervationData.lastName"
        />
        <label for="lastName">Nume</label>
      </span>
      <span class="p-float-label">
        <InputText
          id="firstName"
          type="text"
          v-model="rezervationData.firstName"
        />
        <label for="firstName">Prenume</label>
      </span>
    </div>
    <div class="form-row">
      <span class="p-float-label">
        <InputText id="email" type="text" v-model="rezervationData.email" />
        <label for="email">Email</label>
      </span>
      <span class="p-float-label">
        <InputText id="phone" type="text" v-model="rezervationData.phone" />
        <label for="phone">Telefon</label>
      </span>
    </div>
    <div class="form-row">
      <span class="p-float-label">
        <InputNumber
          id="adults"
          type="number"
          v-model="rezervationData.adults"
        />
        <label for="adults">Adulti</label>
      </span>
      <span class="p-float-label">
        <InputNumber id="rooms" type="number" v-model="rezervationData.rooms" />
        <label for="rooms">Camere</label>
      </span>
    </div>
    <div class="form-row">
      <span class="p-float-label">
        <InputNumber
          id="children"
          type="number"
          v-model="rezervationData.children"
        />
        <label for="children">Copii</label>
      </span>
      <span class="p-float-label">
        <Calendar
          id="date"
          dateFormat="dd/mm/yy"
          v-model="rezervationData.date"
          :manualInput="false"
          showButtonBar
        />
        <label for="date">Data Intrare</label>
      </span>
    </div>
    <h3>Detalii Rezervare</h3>
    <div class="form-row-details">
      <table>
        <tr>
          <td class="table-label">Oferta:</td>
          <td>{{ formTitle }}</td>
        </tr>
        <tr>
          <td class="table-label">Locatie:</td>
          <td>
            {{ formLocation }}
            {{ formCountry }}
          </td>
        </tr>
        <tr>
          <td class="table-label">Durata:</td>
          <td>{{ startDate() }}&mdash;{{ endDate() }}</td>
        </tr>
        <tr>
          <td class="table-label">Pret:</td>
          <td>{{ calculatedPrice() }} &euro;</td>
        </tr>
      </table>
    </div>
    <NuxtTurnstile ref="turnstile" v-model="rezervationData.captchaToken" />
    <Button label="Rezerva" @click="rezerve()" />
  </form>
  <Dialog header="Va rugam asteptati..." v-model:visible="dialogVisible" modal />
  <Toast />
</template>
<script setup>
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import { useMainStore } from "~/stores/main";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { onMounted } from "vue";
import Toast from "primevue/toast";
const toast = useToast();

const store = useMainStore();
const finalPrice = ref(0);

const turnstile = ref();
const dialogVisible = ref(false);

const rezervationData = ref({
  adults: 1,
  rooms: 1,
  children: 0,
});

const formTitle = ref("");
const formPrice = ref(0);
const formLocation = ref("");
const formCountry = ref("");

onMounted(() => {
  if (store.rezervationOffer === null) {
    store.setOffer(JSON.parse(localStorage.getItem("rezervationOffer")));
  }

  formTitle.value = store.rezervationOffer.title;
  formPrice.value = store.rezervationOffer.price;
  formLocation.value = store.rezervationOffer.location;
  formCountry.value = store.rezervationOffer.country;

  finalPrice.value = calculatedPrice();
});

const calculatedPrice = () => {
  const price =
    parseInt(formPrice.value, 10) * parseInt(rezervationData.value.rooms, 10) +
    parseInt(rezervationData.value.children, 10) * 100;
  return price;
};

function startDate() {
  let day = "";
  let month = "";
  let year = "";
  let date;

  if (rezervationData.value.date !== undefined) {
    date = new Date(rezervationData.value.date);
  } else {
    date = new Date();
  }

  day = String(date.getDate()).padStart(2, "0");
  month = String(date.getMonth() + 1).padStart(2, "0");
  year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

function endDate() {
  let year;
  let month;
  let day;
  let date;

  if (rezervationData.value.date !== undefined) {
    date = new Date(rezervationData.value.date);
  } else {
    date = new Date();
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const givenDateTimestamp = date.getTime(); // Get the timestamp of the given date
  const sevenDaysLaterTimestamp = givenDateTimestamp + 7 * millisecondsPerDay; // Add 7 days' worth of milliseconds
  const sevenDaysLaterDate = new Date(sevenDaysLaterTimestamp); // Convert the timestamp back to a date

  year = String(sevenDaysLaterDate.getFullYear());
  month = String(sevenDaysLaterDate.getMonth() + 1).padStart(2, "0");
  day = String(sevenDaysLaterDate.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}

function rezerve() {
  dialogVisible.value = true;
  let rezervationInfo = {
    firstName: rezervationData.value.firstName,
    lastName: rezervationData.value.lastName,
    email: rezervationData.value.email,
    phone: rezervationData.value.phone,
    adults: rezervationData.value.adults,
    rooms: rezervationData.value.rooms,
    children: rezervationData.value.children,
    offerDuration: `${startDate()} - ${endDate()}`,
    offerPrice: store.rezervationOffer.price,
    oferta: formTitle.value,
    location: `${formLocation.value}, ${formCountry.value}`,
    captchaToken: rezervationData.value.captchaToken,
  };

  if(rezervationData.value.firstName === undefined || rezervationData.value.lastName === undefined || rezervationData.value.email === undefined || rezervationData.value.phone === undefined || rezervationData.value.date === undefined) {
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
          useFetch("/api/rezervation", {
            method: "POST",
            body: {
              rezervationInfo: rezervationInfo,
            },
          }).then(() => {
            rezervationData.value.firstName = "";
            rezervationData.value.lastName = "";
            rezervationData.value.email = "";
            rezervationData.value.phone = "";
            rezervationData.value.adults = 1;
            rezervationData.value.rooms = 1;
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
      summary: "Eroare",
      detail: "Rezervarea nu a putut fi plasata",
      life: 3000,
    });
  }
}
</script>
<style lang="scss">
.rezervation {
  h3 {
    color: var(--color-2);
    border-bottom: 1px solid var(--color-2);
    padding-bottom: 0.5rem;
  }

  .p-button {
    margin-top: 2rem;
    position: absolute;
    right: 1rem;
    background: var(--color-2);
  }
  padding-bottom: 2rem;
}
.form-row {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  .p-float-label {
    margin-top: 0.5rem;
  }
}

.table-label {
  color: var(--color-2);
  font-weight: 600;
  font-size: 1.2rem;
  padding-right: 1rem;
}
</style>