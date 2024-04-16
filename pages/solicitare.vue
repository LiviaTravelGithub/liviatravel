<template>
  <div class="request-container">
    <Title :text="'Solicita oferta'" />
    <div class="request-form">
      <div class="request-row">
        <div class="request-column">
          <span class="p-float-label">
            <InputText
              id="last_name"
              type="text"
              v-model="formData.last_name"
            />
            <label for="last_name">Nume de familie</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <InputText
              id="first_name"
              type="text"
              v-model="formData.first_name"
            />
            <label for="first_name">Prenume</label>
          </span>
        </div>
      </div>
      <div class="request-row">
        <div class="request-column">
          <span class="p-float-label">
            <InputText id="email" type="text" v-model="formData.email" />
            <label for="email">Email</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <InputText id="phone" type="text" v-model="formData.phone" />
            <label for="phone">Telefon</label>
          </span>
        </div>
      </div>
      <div class="request-row">
        <div class="request-column">
          <span class="p-float-label">
            <InputText id="adults" type="number" v-model="formData.adults" />
            <label for="adults">Aduti</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <InputText
              id="children"
              type="number"
              v-model="formData.children"
            />
            <label for="children">Copii</label>
          </span>
        </div>
      </div>
      <div class="request-row date-row">
        <div class="request-column date-column">
          <span class="p-float-label">
            <Calendar id="start_date" v-model="formData.start_date" showIcon />
            <label for="date">Data plecarii</label>
          </span>
          <span class="p-float-label">
            <Calendar id="end_date" v-model="formData.end_date" showIcon />
            <label for="end_date">Data intoarcere</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <InputText id="duration" type="text" v-model="formData.duration" />
            <label for="duration">Nopti</label>
          </span>
        </div>
      </div>
      <div class="request-row">
        <div class="request-column">
          <span class="p-float-label">
            <InputText
              id="destination"
              type="text"
              v-model="formData.destination"
            />
            <label for="destination">Destinatie</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <Dropdown
              id="transport"
              v-model="formData.transport"
              :options="dropdownOptions.transport"
              optionLabel="label"
              optionValue="value"
            />
            <label for="transport">Transport</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <Dropdown
              id="stay_type"
              v-model="formData.stay_type"
              :options="dropdownOptions.stay_type"
              optionLabel="label"
              optionValue="value"
            />
            <label for="stay_type">Cazare</label>
          </span>
        </div>
      </div>
      <div class="request-row">
        <div class="request-column">
          <span class="p-float-label">
            <InputText id="budget" type="number" v-model="formData.budget" />
            <label for="stars">Buget maxim</label>
          </span>
        </div>
        <div class="request-column">
          <span class="p-float-label">
            <Dropdown
              id="currency"
              v-model="formData.currency"
              :options="dropdownOptions.currency"
              optionLabel="label"
              optionValue="value"
            />
            <label for="currency">Moneda</label>
          </span>
        </div>
      </div>
      <div class="request-row">
        <div class="request-column">
          <span class="p-float-label">
            <Textarea id="comment" type="text" v-model="formData.comment" />
            <label for="comment">Alte cerinte</label>
          </span>
        </div>
      </div>
      <div class="request-row">
        <div class="request-column checkbox-container">
          <Checkbox id="accept" v-model="formData.accept" :binary="true" />
          <label for="accept"
            >Sunt de acord ca datele mele cu caracter personal sa fie prelucrate
            in vederea comunicarii ofertei/informatiilor solicitate.</label
          >
        </div>
      </div>
      <div class="request-row">
        <Button label="Trimite oferta" @click="submitOffer()" />
      </div>
    </div>
  </div>
  <Toast />
</template>
<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Title from "../components/Title.vue";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { useMainStore } from "~/stores/main";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const toast = useToast();
const store = useMainStore();

const formData = ref({
  last_name: "",
  first_name: "",
  email: "",
  phone: "",
  adults: "",
  children: "",
  start_date: "",
  end_date: "",
  duration: "",
  destination: "",
  transport: "",
  stay_type: "",
  budget: "",
  comment: "",
  currency: "",
  accept: false,
});

const dropdownOptions = ref({
  transport: [
    { label: "Avion", value: "Avion" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Individual", value: "Individual" },
  ],
  stay_type: [
    { label: "Hotel", value: "Hotel" },
    { label: "Pensiune", value: "Pensiune" },
    { label: "Casa de Vacanta", value: "Casa de Vacanta" },
  ],
  currency: [
    { label: "Euro", value: "Euro" },
    { label: "LEI", value: "LEI" },
  ],
});

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

const submitOffer = () => {
  if (formData.value.accept !== true) {
    toast.add({
      severity: "error",
      summary: "Eroare",
      detail:
        "Acceptati ca datele mele sa fie prelucrate in vederea comunicarii ofertei/informatiilor solicitate.",
      life: 3000,
    });
  } else {
    const { accept: _, ...formInfo } = formData.value;

    formInfo.start_date = formatDate(new Date(formData.value.start_date));
    formInfo.end_date = formatDate(new Date(formData.value.end_date));

    useFetch("/api/customRezervation", {
      method: "POST",
      body: formInfo,
    }).then(() => {
      toast.add({
        severity: "success",
        summary: "Succes",
        detail: "Solicitare realizata cu succes!",
        life: 3000,
      });
      formData.value = {
        last_name: "",
        first_name: "",
        email: "",
        phone: "",
        adults: "",
        children: "",
        start_date: "",
        end_date: "",
        duration: "",
        destination: "",
        transport: "",
        stay_type: "",
        budget: "",
        comment: "",
        currency: "",
        accept: false,
      }
    }).catch((err) => {
      console.log(err)
      toast.add({
        severity: "error",
        summary: "Eroare",
        detail: "Solicitare nu a putut fi plasata. Va rugam sa incercati mai tarziu.",
        life: 3000,
      })
    })
  }
};
</script>
  <style lang="scss">
.request-container {
  padding: 0.5rem 0;
  margin-top: 50px;
  .offers-title {
    margin: 2rem auto;
  }
}

.request-form {
  width: 80%;
  margin: 4rem auto;
}

.request-row {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0 0 0;
  input {
    width: 30vw;
  }
  .request-column {
    display: flex;
    gap: 1vw;
  }
  #destination {
    width: 29vw;
  }
  #duration {
    width: 10vw;
  }
  #transport,
  #currency,
  #stay_type {
    width: 15vw;
  }
  #budget {
    width: 45vw;
  }
  #start_date,
  #end_date {
    width: 24.5vw;
  }
  #comment {
    width: 61vw;
    height: 20vh;
    resize: none;
  }
}

button[type="submit"] {
  width: 85%;
}

.p-button {
  background-color: var(--color-2);
  border: 1px solid var(--color-2);
}

.p-checkbox .p-checkbox-box:hover {
  border-color: var(--color-4);
}

.p-checkbox .p-checkbox-box.p-highlight,
.p-checkbox .p-checkbox-box.p-highlight:hover {
  background: var(--color-3);
  border-color: var(--color-3);
}

@media screen and (max-width: 1366px) {
  .request-form {
    width: 90%;
    input {
      width: 35vw;
    }
    #destination {
      width: 29vw;
    }
    #transport,
    #currency,
    #stay_type {
      width: 20vw;
    }
    #budget {
      width: 50vw;
    }
    #start_date,
    #end_date {
      width: 35vw;
    }
    #duration {
      width: 71vw;
    }
    #comment {
      width: 71vw;
    }
  }
}

@media screen and (max-width: 1024px) {
  .date-row {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
  }

  #start_date,
  #end_date {
    width: 25vw !important;
  }
  #duration {
    width: 52vw !important;
  }

  #transport {
    width: 12vw !important;
  }

  #destination {
    width: 27vw !important;
  }
}
@media screen and (max-width: 851px), (max-width: 414px) {
  .request-container {
    margin-top: 70px;
  }
  .request-form {
    width: 100%;
    margin: 1rem 0;
    input{
      width: 100%;
    }
  }
  .request-row, .request-column{
    flex-flow: column wrap;
    align-items: center;
    #start_date,
    #end_date,
    #duration,
    #transport,
    #destination,
    #stay_type,
    #currency,
    #budget,
    #comment,
    .p-float-label{
      width: 80vw !important;
    }
    .p-input-text {
      width: 100% !important; 
    }
  }

  .checkbox-container{
    width: 80vw;
    flex-flow: row;
    gap: 1rem !important;
    label{
      font-size: 0.8rem;
    }
  }
  
}
</style>