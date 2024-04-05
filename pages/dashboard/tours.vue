<template>
  <div v-if="store.isLoggedIn">
    <DataTable
      v-model:filters="tourFilters"
      :value="tours"
      paginator
      :rows="6"
      filterDisplay="row"
      removableSort
    >
      <template #header>
        <div class="table-header">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="tourFilters['global'].value"
              placeholder="Cautare globala"
            />
          </span>
          <Button
            icon="pi pi-plus"
            class="p-button-success"
            label="Adauga circuit nou"
            @click="openCreateTour()"
          />
          <Button
            icon="pi pi-refresh"
            class="p-button-warning"
            label="Actualizare"
            @click="getTours()"
          />
        </div>
      </template>
      <Column field="title" header="Titlu"></Column>
      <Column field="price" header="Pret"></Column>
      <Column field="country" header="Tara"></Column>
      <Column field="duration" header="Durata"></Column>
      <Column field="available" header="Locuri"></Column>
      <Column field="rating" header="Stele"></Column>
      <Column field="departure" header="Plecare"></Column>
      <Column field="arrival" header="Sosire"></Column>
      <Column>
        <template #body="slotProps">
          <div class="table-actions">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success"
              @click="editTour(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="deleteTour($event, slotProps.data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog
      class="tour-dialog"
      modal
      v-model:visible="createTourVisible"
      header="Creeaza circuit"
    >
      <form>
        <div class="form-row">
          <div class="form-column">
            <FloatLabel>
              <InputText id="title" v-model="newTour.title" />
              <label for="title">Titlu</label>
            </FloatLabel>
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-euro" />
                <InputText id="price" v-model="newTour.price" type="number" />
              </IconField>
              <label for="price">Pret</label>
            </FloatLabel>
          </div>
          <div class="form-column">
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-map-marker" />
                <InputText id="location" v-model="newTour.location" />
              </IconField>
              <label for="location">Locatie</label>
            </FloatLabel>
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-map" />
                <InputText id="country" v-model="newTour.country" />
              </IconField>
              <label for="country">Tara</label>
            </FloatLabel>
          </div>
        </div>
        <div class="form-row">
          <div class="form-column">
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-sun" />
                <InputText id="duration" v-model="newTour.duration" />
              </IconField>
              <label for="duration">Zile</label>
            </FloatLabel>
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-users" />
                <InputText
                  id="adults"
                  type="number"
                  v-model="newTour.available"
                />
              </IconField>
              <label for="adults">Locuri</label>
            </FloatLabel>
          </div>
          <div class="form-column">
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-star" />
                <InputText
                  id="rating"
                  type="number"
                  :min="1"
                  :max="5"
                  v-model="newTour.rating"
                />
              </IconField>
              <label for="rating">Stele</label>
            </FloatLabel>
          </div>
          <div class="form-column">
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-angle-double-right" />
                <InputText id="departure" v-model="newTour.departure" />
              </IconField>
              <label for="departure">Plecare</label>
            </FloatLabel>
          </div>
        </div>
        <div class="form-row">
          <div class="form-column">
            <FloatLabel>
              <IconField>
                <InputIcon class="pi pi-angle-double-left" />
                <InputText id="arrival" v-model="newTour.arrival" />
              </IconField>
              <label for="arrival">Sosire</label>
            </FloatLabel>

            <Dropdown
              v-model="newTour.type"
              :options="['Intern', 'Extern']"
              placeholder="Tip circuit"
            />
          </div>
        </div>
        <div class="form-column description">
          <h5>Descriere</h5>
          <span style="width: 100%">
            <Textarea id="description" v-model="newTour.description" />
          </span>
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
            <i class="pi pi-upload"></i>
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
          @click="saveTour"
        />
      </template>
    </Dialog>
    <ConfirmPopup></ConfirmPopup>
    <Toast />
  </div>
</template>
<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import { FilterMatchMode } from "primevue/api";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import { useConfirm } from "primevue/useconfirm";
import ConfirmPopup from "primevue/confirmpopup";
import Dropdown from "primevue/dropdown";
import { useMainStore } from "~/stores/main";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const allTours = await useFetch("/api/toursInfo");
const store = useMainStore();
const confirm = useConfirm();

const tours = ref([]);
const newTour = ref({});
const createTourVisible = ref(false);
const isEditingTour = ref(false);

const imageFile = ref(null);
const imagePreview = ref("");

const tourFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
  if (!store.isLoggedIn) {
    navigateTo("/dashboard");
  }
  tours.value = allTours.data.value.rows;
});

const getTours = async () => {
  const response = await useFetch("/api/toursInfo");
  tours.value = response.data.value.rows;
  toast.add({
    severity: "success",
    summary: "Succes",
    detail: "Circuitele au fost actualizate cu succes",
    life: 3000,
  });
};

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
const onFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
    imageFile.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const deleteTour = (event, offer) => {
  confirm.require({
    target: event.currentTarget,
    message: "Esti sigur ca vrei sa stergi acest circuit?",
    header: "Confirm",
    acceptClass: "p-button-danger",
    acceptLabel: "Da",
    rejectLabel: "Nu",
    icon: "pi pi-info-circle",
    accept: () => {
      useFetch("/api/deleteTour", {
        method: "POST",
        body: offer.id,
      }).then(() => {
        getTours();
        toast.add({
          severity: "success",
          summary: "Succes",
          detail: "Circuitul a fost sters cu succes",
          life: 3000,
        });
      });
    },
  });
};

const openCreateTour = () => {
  newTour.value = {};
  createTourVisible.value = true;
  isEditingTour.value = false;
  imagePreview.value = "";
};

const editTour = (offer) => {
  newTour.value = offer;
  isEditingTour.value = true;
  createTourVisible.value = true;
  imagePreview.value = offer.img;
};

const saveTour = (e) => {
  e.preventDefault();

  if (isEditingTour.value === true) {
    useFetch("/api/newTour", { method: "POST", body: newTour.value })
      .then(() => {
        createTourVisible.value = false;
        isEditingTour.value = false;
        getTours();
      })
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Succes",
          detail: "Circuitul a fost salvat cu succes",
          life: 3000,
        });
      });
  } else {
    newTour.value.img = imageFile.value;
    useFetch("/api/newTour", { method: "POST", body: newTour.value })
      .then(() => {
        createTourVisible.value = false;
        getTours();
      })
      .then(() => {
        toast.add({
          severity: "success",
          summary: "Succes",
          detail: "Circuitul a fost salvat cu succes",
          life: 3000,
        });
      });
  }
};
</script>
<style lang="scss">
.tour-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tour-dialog {
  width: 100vw;
  max-height: 100%;
  height: 100vw;
  .p-dialog-content {
    height: 100%;
    display: flex;
    gap: 2rem;
  }
  form {
    margin-top: 1rem;
    display: flex;
    flex-flow: column;
    gap: 1.5rem;

    .p-inputtext {
      width: 10vw;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-column {
      display: flex;
      gap: 1rem;
      i {
        top: 1.2em;
      }
    }
    .description {
      display: flex;
      flex-flow: column;
      h5 {
        margin: 0;
      }
    }
    .p-inputtextarea {
      width: 100%;
      min-height: 20rem;
      resize: none;
    }
    #details {
      min-height: 5rem;
    }
  }
  .image-preview {
    overflow: hidden;
    object-fit: contain;
    object-position: center;
    width: 400px;
    height: 400px;
    border: 1px solid var(--surface-border);
    border-radius: var(--border-radius);
  }
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
</style>