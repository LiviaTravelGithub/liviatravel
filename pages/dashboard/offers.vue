<template>
  <DataTable
    v-model:filters="filters"
    paginator
    :rows="6"
    filterDisplay="row"
    :value="offers"
    removableSort
  >
    <template #header>
      <div class="table-header">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Cautare globala"
          />
        </IconField>
        <Button
          class="p-button-success"
          label="Creeaza oferta"
          @click="openCreateOffer()"
        />
        <Button
          icon="pi pi-refresh"
          class="p-button-warning"
          label="Actualizeaza tabelul"
          @click="getOffers()"
        />
      </div>
    </template>
    <Column field="title" sortable header="Titlu"></Column>
    <Column field="price" sortable header="Pret"></Column>
    <Column field="location" sortable header="Locatie"></Column>
    <Column field="country" sortable header="Tara"></Column>
    <Column field="duration" sortable header="Nopti"></Column>
    <Column field="rating" sortable header="Stele"></Column>
    <Column field="details" sortable header="Detalii">
      <template #body="slotProps">
        {{ formatDetails(slotProps.data.details) }}
      </template>
    </Column>
    <Column field="is_special" sortable header="Oferta Speciala">
      <template #body="slotProps">
        <i
          class="pi"
          :class="slotProps.data.is_special ? 'pi-check' : 'pi-times'"
        ></i>
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <div class="table-actions">
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-success"
            @click="editOffer(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="deleteOffer($event, slotProps.data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
  <Dialog
    class="offer-dialog"
    modal
    v-model:visible="createOfferVisible"
    header="Creeaza oferta"
  >
    <form>
      <div class="form-row">
        <div class="form-column">
          <FloatLabel>
            <IconField>
              <InputText id="title" v-model="newOffer.title" />
            </IconField>
            <label for="title">Titlu</label>
          </FloatLabel>
          <FloatLabel>
            <IconField>
              <InputIcon class="pi pi-euro" />
              <InputText id="price" v-model="newOffer.price" type="number" />
            </IconField>
            <label for="price">Pret</label>
          </FloatLabel>
        </div>
        <div class="form-column">
          <FloatLabel>
            <IconField>
              <InputIcon class="pi pi-map-marker" />
              <InputText id="location" v-model="newOffer.location" />
            </IconField>
            <label for="location">Locatie</label>
          </FloatLabel>
          <FloatLabel>
            <IconField>
              <InputIcon class="pi pi-map" />
              <InputText id="country" v-model="newOffer.country" />
            </IconField>
            <label for="country">Tara</label>
          </FloatLabel>
        </div>
      </div>
      <div class="form-row">
        <div class="form-column">
          <IconField>
            <InputIcon class="pi pi-clock" />
            <InputText id="duration" v-model="newOffer.duration" />
          </IconField>
        </div>
        <div class="form-column">
          <IconField>
            <InputIcon class="pi pi-star" />
            <InputText
              id="rating"
              type="number"
              :min="1"
              :max="5"
              v-model="newOffer.rating"
            />
          </IconField>
        </div>
        <div class="form-column">
          <FloatLabel>
            <IconField>
              <Dropdown
                v-model="newOffer.type"
                :options="['Intern', 'Extern']"
              />
            </IconField>
            <label for="type">Tip oferta</label>
          </FloatLabel>
        </div>
        <div class="form-colum new-special-offer">
          <h5>Oferta Zilei?</h5>
          <IconField>
            <ToggleButton
              id="isSpecial"
              v-model="newOffer.is_special"
              onLabel="Da"
              offLabel="Nu"
            />
          </IconField>
        </div>
      </div>
      <div class="form-column description">
        <IconField>
          <h5>Descriere</h5>
          <Textarea id="description" v-model="newOffer.description" />
        </IconField>
      </div>
      <div class="form-column-details">
        <h5>Facilitati</h5>
        <div
          class="details-container"
          v-for="(detail, index) in detailType"
          :key="index"
        >
          <Checkbox v-model="detailValue" :value="detail.label" />
          <label>{{ detail.label }}</label>
        </div>
      </div>
    </form>
    <div class="image-upload">
      <section>
        <img :src="imagePreview" alt="" />
        <div class="file-info" v-if="imageFile">
          Filename: {{ imageFile.name }} <br />
          File size: {{ formatBytes(imageFile.size, 2) }}
        </div>
      </section>
      <section>
        <div class="p-button p-button-success file-upload">
          <InputIcon class="" />
          <span class="p-button-label">Alege Imagine</span>
          <input type="file" @change="onFileChange" accept="image/*" />
        </div>
      </section>
    </div>
    <template #footer>
      <Button
        type="submit"
        label="Salveaza"
        class="p-button-success"
        @click="saveOffer"
      />
    </template>
  </Dialog>
  <ConfirmPopup></ConfirmPopup>
</template>
<script setup>
import { useMainStore } from "~/stores/main";
import ToggleButton from "primevue/togglebutton";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { useConfirm } from "primevue/useconfirm";
import ConfirmPopup from "primevue/confirmpopup";
import Dropdown from "primevue/dropdown";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

const router = useRouter();
const store = useMainStore();

const confirm = useConfirm();

const createOfferVisible = ref(false);
const isEditingOffer = ref(false);

const offers = ref([]);
const imageFile = ref(null);
const imagePreview = ref("");

const allOffers = await useFetch("/api/offersInfo");

const newOffer = ref({
  title: "",
  description: "",
  price: 0,
  location: "",
  country: "",
  details: "",
  img: "",
  duration: 1,
  available: 1,
  rating: 1,
  is_special: false,
  type: "Intern",
});

const detailType = [
  { label: "Facilitati Copii" },
  { label: "Activitati Sportive" },
  { label: "Piscina" },
  { label: "Parcare" },
  { label: "Plaja" },
  { label: "Spa" },
  { label: "Divertisment" },
  { label: "Park Acvatic" },
];

const detailValue = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  price: { value: null, matchMode: FilterMatchMode.CONTAINS },
  location: { value: null, matchMode: FilterMatchMode.CONTAINS },
  country: { value: null, matchMode: FilterMatchMode.CONTAINS },
  rooms: { value: null, matchMode: FilterMatchMode.CONTAINS },
  adults: { value: null, matchMode: FilterMatchMode.CONTAINS },
  children: { value: null, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  details: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const formatBytes = function (bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const openCreateOffer = () => {
  isEditingOffer.value = false;
  createOfferVisible.value = true;
  newOffer.value = {
    title: "",
    description: "",
    price: 0,
    location: "",
    country: "",
    details: "",
    img: "",
    duration: 1,
    available: 1,
    rating: 1,
    is_special: false,
    type: "Intern",
  };
};

onMounted(() => {
  if (!store.isLoggedIn) {
    router.push("/dashboard");
  }
  offers.value = allOffers.data.value.rows;
});

const getOffers = async () => {
  const response = await useFetch("/api/offersInfo");
  offers.value = response.data.value.rows;
};

const formatDetails = (details) => {
  const detailsArray = details.split(", ");
  const filteredArray = detailsArray.filter((detail) => detail !== "");
  return filteredArray.join(", ");
};

const formatOffer = (offer) => {
  let finalDetails = "";

  for (const iterator of detailValue.value) {
    finalDetails += iterator + ", ";
  }

  for (const key in newOffer.value) {
    const value = newOffer.value[key];
    if (value === "") {
      newOffer.value[key] = null;
    }
  }

  return {
    title: offer.title,
    description: offer.description,
    price: offer.price,
    location: offer.location,
    country: offer.country,
    rating: offer.rating,
    duration: offer.duration,
    details: finalDetails,
    img: offer.img,
    is_special: offer.is_special,
    type: offer.type,
  };
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
    imageFile.value = file;
  };
  reader.readAsDataURL(file);
};

const editOffer = (offer) => {
  newOffer.value = offer;
  isEditingOffer.value = true;
  createOfferVisible.value = true;
  detailValue.value = newOffer.value.details.split(", ");
  imagePreview.value = offer.img;
  newOffer.value.type = offer.type;
};

const saveOffer = (e) => {
  e.preventDefault();
  const offer = formatOffer(newOffer.value);

  if (isEditingOffer.value) {
    useFetch("/api/saveOffer", { method: "POST", body: newOffer.value })
      .then(() => {
        createOfferVisible.value = false;
        isEditingOffer.value = false;
        getOffers();
      })
      .then(() => {});
  } else {
    offer.img = `/img/${imageFile.value.name}`;
    useFetch("/api/newOffer", { method: "POST", body: offer })
      .then(() => {
        createOfferVisible.value = false;
        getOffers();
      })
      .then(() => {
        const formData = new FormData();
        formData.append("image", imageFile.value);
        useFetch("/api/saveImage", {
          method: "POST",
          body: formData,
        });
      });
  }
};

const deleteOffer = (event, offer) => {
  console.log(offer);
  confirm.require({
    target: event.currentTarget,
    message: "Esti sigur ca vrei sa stergi oferta?",
    header: "Confirm",
    acceptClass: "p-button-danger",
    acceptLabel: "Da",
    rejectLabel: "Nu",
    icon: "pi pi-info-circle",
    accept: () => {
      useFetch("/api/deleteOffer", {
        method: "POST",
        body: offer.id,
      }).then(() => {
        getOffers();
      });
    },
  });
};
</script>
<style lang="scss">
.offer-dialog {
  width: 100vw;
  max-height: 100%;
  height: 100vw;
  .p-dialog-content {
    height: 100%;
    display: flex;
    gap: 2rem;
    padding-top: 2rem;
  }
  form {
    display: flex;
    flex-flow: column;
    gap: 1.5rem;
    width: 50%;

    h5 {
      margin: 0 0 0.5rem 0;
    }

    .p-icon-field {
      width: 100%;
    }
    .p-inputtext {
      width: 10vw;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .form-column {
      display: flex;
      gap: 1rem;
      i {
        top: 1.2em;
      }
    }
    .p-inputtextarea {
      width: 100%;
      height: 20rem;
      resize: none;
    }
    #details {
      height: 5rem;
    }
  }
}

.details-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.25rem;
}

.image-upload {
  section {
    display: flex;
    margin-bottom: 1rem;
    gap: 1rem;
  }
  img {
    width: 400px;
    height: 400px;
    object-fit: cover;
    object-position: center center;
  }
}

.file-upload {
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  input {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}

.new-special-offer {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.form-column-details {
  position: relative;
}

.table-actions {
  width: fit-content;
  display: flex;
  gap: 0.5rem;
}

.table-header {
  display: flex;
  gap: 0.5rem;
}
</style>