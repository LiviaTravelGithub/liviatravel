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
        <InputText
          id="email"
          type="text"
          v-model="rezervationData.email"
        />
        <label for="email">Email</label>
      </span>
      <span class="p-float-label">
        <InputText
          id="phone"
          type="text"
          v-model="rezervationData.phone"
        />
        <label for="phone">Telefon</label>
      </span>
    </div>
    <div class="form-row">
      <span class="p-float-label">
        <InputText
          id="adults"
          type="number"
          v-model="rezervationData.adults"
        />
        <label for="adults">Adulti</label>
      </span>
      <span class="p-float-label">
        <InputText
          id="rooms"
          type="number"
          v-model="rezervationData.rooms"
        />
        <label for="rooms">Camere</label>
      </span>
    </div>
    <div class="form-row">
      <span class="p-float-label">
        <InputText
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
          showButtonBar
        />
        <label for="date">Data Intrare</label>
      </span>
    </div>
    <h3>Detalii Rezervare</h3>
    <div class="form-row-details">
      <table>
        <tr>
          <td class="table-label">Hotel:</td>
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
    <Button label="Rezerva" @click="rezerve()" />
  </form>
</template>
<script setup>
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import { useMainStore } from "~/stores/main";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { onMounted } from "vue";
const toast = useToast();

const store = useMainStore();

const rezervationData = ref({});

const formTitle = ref("");
const formRooms = ref(1);
const formChildren = ref(0);
const formPrice = ref(0);
const formLocation = ref("");
const formCountry = ref("");


onMounted(() => {
  if(store.rezervationOffer === null){
    store.setOffer(JSON.parse(localStorage.getItem("rezervationOffer")));
  }

  formTitle.value = store.rezervationOffer.title;
  formRooms.value = store.rezervationData.rooms;
  formChildren.value = store.rezervationData.children;
  formPrice.value = store.rezervationOffer.price;
  formLocation.value = store.rezervationOffer.location;
  formCountry.value = store.rezervationOffer.country;
});

const calculatedPrice = () => {
  const price =
    parseInt(formPrice.value, 10) *
      parseInt(formRooms.value, 10) +
    parseInt(formChildren.value, 10) * 100;
  return price;
};

function startDate() {
  let day = "";
  let month = "";
  let year = "";

  if (store.rezervationData.date !== "") {
    const date = new Date(store.rezervationData.date);
    day = String(date.getDate()).padStart(2, "0");
    month = String(date.getMonth() + 1).padStart(2, "0");
    year = String(date.getFullYear()).slice(-2);
  } else {
    day = "01";
    month = "01";
    year = "01";
  }
  return `${day}/${month}/${year}`;
}

function endDate() {
  let year;
  let month;
  let day;

  if (store.rezervationData.date !== "") {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const givenDateTimestamp = new Date(store.rezervationData.date).getTime(); // Get the timestamp of the given date
    const sevenDaysLaterTimestamp = givenDateTimestamp + 7 * millisecondsPerDay; // Add 7 days' worth of milliseconds
    const sevenDaysLaterDate = new Date(sevenDaysLaterTimestamp); // Convert the timestamp back to a date

    year = String(sevenDaysLaterDate.getFullYear());
    month = String(sevenDaysLaterDate.getMonth() + 1).padStart(2, "0");
    day = String(sevenDaysLaterDate.getDate()).padStart(2, "0");
  } else {
    year = "01";
    month = "01";
    day = "01";
  }

  return `${day}/${month}/${year}`;
}

function rezerve() {
  console.log(store.rezervationData, store.rezervationOffer);

  let rezervationInfo = {
    firstName: rezervationData.firstName,
    lastName: rezervationData.lastName,
    email: rezervationData.email,
    phone: rezervationData.phone,
    adults: rezervationData.adults,
    rooms: rezervationData.rooms,
    children: rezervationData.children,
    date: rezervationData.date.toString(),
    offerDuration: `${startDate()} - ${endDate()}`,
    offerPrice: store.rezervationOffer.price,
  };

  const people =
    parseInt(store.rezervationData.adults, 10) +
    parseInt(store.rezervationData.children, 10);

  try {
    axios.post(`${store.url}/newRezervation`, rezervationInfo).then((res) => {
      if (res.status === 200) {
        store.setRezervationVisible(false);
        store.loadOffers();
        toast.add({
          severity: "success",
          summary: "Rezervare",
          detail: "Rezervare cu succes!",
          life: 3000,
        });
      } else {
        console.log(res);
      }
    });
  } catch (error) {
    console.log(error);
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