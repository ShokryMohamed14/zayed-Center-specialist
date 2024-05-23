<template>
  <section>
    <div id="kt_app_content_container" class="app-container container-fluid">
      <div class="card mb-5 mb-xl-10" id="kt_patients_details_view">
        <div class="card-header cursor-pointer">
          <div class="card-title m-0">
            <h3 class="fw-bold m-0">بيانات المريض</h3>
          </div>
          <div>
            <button @click="printData" class="btn btn-secondary mt-3">
              طباعة البيانات
            </button>
          </div>
        </div>

        <div class="p-9" id="DataView">
          <div class="row mb-7">
            <div v-if="viewData" class="row">
              <div class="col-12">
                <div class="row card-header" style="border: none">
                  <div class="mb-3">
                    <div class="image-preview">
                      <label for="imageInput">
                        <img
                          :src="
                            imageData ||
                            `http://localhost:3000/img/patients/${viewData.photo}`
                          "
                          alt="Image Preview"
                          v-if="imageData || viewData.photo !== 'default.jpg'"
                        />
                        <div v-else class="placeholder">لا يوجد صورة</div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="row mt-7">
                  <!-- other info items -->
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="اسم المريض"
                      :data="viewData.name"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم التسلسلي"
                      :data="viewData.serial"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="العمر"
                      :data="viewData.age"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="تاريخ الميلاد"
                      :data="viewData.birthday"
                      type="date"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم القومي"
                      :data="viewData.nationalId"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الفئة"
                      :data="viewData.degree"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرتبة"
                      :data="viewData.rank"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="اسم الاب"
                      :data="viewData.fatherName"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم القومي للاب"
                      :data="viewData.fatherId"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="اسم الام"
                      :data="viewData.motherName"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الرقم القومي للام"
                      :data="viewData.motherId"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="العنوان"
                      :data="viewData.address"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="الهاتف"
                      :data="viewData.phone"
                      type="string"
                    />
                  </div>
                  <div class="mb-3 col-lg-6">
                    <info-item
                      label="رقم الواتساب"
                      :data="viewData.whatsapp"
                      type="string"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title m-0">
              <h3 class="fw-bold م-0">جدول المريض</h3>
            </div>
          </div>
          <div class="p-9">
            <div>
              <div class="table-container" id="TableData">
                <div class="table-responsive">
                  <table
                    ref="tableRef"
                    class="table table-bordered table-hover"
                  >
                    <thead>
                      <tr>
                        <th>الأيام</th>
                        <th v-for="(header, index) in tableHeader" :key="index">
                          {{ header }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(day, dayIndex) in weekDays"
                        :key="dayIndex"
                        v-show="hasSessions[dayIndex]"
                      >
                        <td>{{ day }}</td>
                        <td
                          v-for="(session, sessionIndex) in sessionsTable[
                            dayIndex
                          ]"
                          :key="sessionIndex"
                        >
                          {{ session }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, getCurrentInstance, computed } from "vue";
import { usePatientsStore } from "@/stores/patients";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import InfoItem from "@/components/info-item.vue";

const store = usePatientsStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const viewData = ref({});
const sessions = ref([]);
const imageData = ref<string | null>(null);
const weekDays = ref([
  "السبت",
  "الاحد",
  "الاثنين",
  "الثلاثاء",
  "الاربعاء",
  "الخميس",
]);
const tableHeader = ref([
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
  "12:00 - 12:30",
  "12:30 - 01:00",
  "01:00 - 01:30",
  "01:30 - 02:00",
  // "02:00 - 02:30",
  // "02:30 - 03:00",
  // "03:00 - 03:30",
  // "03:30 - 04:00",
  // "04:00 - 04:30",
  // "04:30 - 05:00",
]);
const sessionsTable = ref(
  new Array(weekDays.value.length)
    .fill(null)
    .map(() => new Array(tableHeader.value.length).fill(""))
);

const timeToIndex = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return (hour - 8) * 2 + (minute === 30 ? 1 : 0);
};
const hasSessions = computed(() =>
  sessionsTable.value.map((daySessions) =>
    daySessions.some((session) => session !== "")
  )
);

const submitDelete = async () => {
  const confirmed = await Swal.fire({
    title: "تنبيه!",
    text: "هل أنت متأكد أنك تريد حذف هذا المستخدم؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "تأكيد",
    cancelButtonText: "الغاء",
  });
  if (confirmed.isConfirmed) {
    try {
      await store.deleteItem(viewData.value._id).then(() => {
        router.push({ name: "patients-list" });
        Swal.fire({
          text: "تم حذف المستخدم بنجاح",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semobold btn-light-primary",
          },
        });
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        text: "حدث خطأ أثناء محاولة حذف المستخدم",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semobold btn-light-primary",
          cancelButton: "btn fw-semobold btn-light-primary",
        },
      });
    }
  }
};

const printData = async () => {
  const containerId = "kt_app_content_container";
  const container = document.getElementById(containerId);
  if (container) {
    // Hide the card headers temporarily
    const cardHeaders = container.querySelectorAll(".card-header");
    cardHeaders.forEach((header) => {
      header.style.display = "none";
    });

    // Add a class to the container to cancel the card border in print
    container.classList.add("cancel-card-border");

    // Print the content inside the kt_app_content_container div
    await proxy.$htmlToPaper(containerId);

    // Restore the card headers and remove the cancel-card-border class after printing
    cardHeaders.forEach((header) => {
      header.style.display = "flex";
    });
    container.classList.remove("cancel-card-border");
  } else {
    console.error("Element not found!");
  }
};

const previewImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const formData = new FormData();
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    formData.append("photo", input.files[0]);
    reader.onload = (e) => {
      imageData.value = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
    store.uploadImage(formData, viewData.value._id);
  }
};
const removeImage = async () => {
  imageData.value = null;
  await store.deletePhoto(viewData.value._id);
  await store.fetchItem(router.currentRoute.value.params.id);
  await store.getPatientSessions(router.currentRoute.value.params.id);
  viewData.value = store.itemData;
  sessions.value = store.patientSessions;
  populateTable();
};

onMounted(async () => {
  await store.fetchItem(router.currentRoute.value.params.id);
  await store.getPatientSessions(router.currentRoute.value.params.id);
  viewData.value = store.itemData;
  sessions.value = store.patientSessions;
  populateTable();
});

onUnmounted(() => {
  store.resetItemData();
});

function populateTable() {
  sessions.value.forEach((session) => {
    const dayIndex = weekDays.value.findIndex((day) => day === session.day);
    const fromIndex = timeToIndex(session.from);
    const toIndex = timeToIndex(session.to);
    if (dayIndex !== -1 && fromIndex !== -1 && toIndex !== -1) {
      for (let i = fromIndex; i < toIndex; i++) {
        sessionsTable.value[dayIndex][i] = session.department;
      }
    }
  });
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  max-width: 100%;
  font-size: 15px;
}

.table-responsive {
  overflow: auto;
}

.table {
  width: max-content;
  background-color: transparent;
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #ebedf2;
  white-space: wrap;
  text-align: center;
  height: 65px;
}
.table td {
  width: 100px;
}

.user-icon {
  color: green;
}

.submitted-name {
  margin-bottom: 5px;
}

.bin-icon {
  color: red;
}

.bin-icon-container {
  text-align: center;
}

.el-button,
.el-dropdown-item {
  font-size: 16px;
  padding: 20px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.image-preview img {
  width: 200px; /* Fixed width */
  height: 200px; /* Fixed height */
  object-fit: cover; /* Ensures the image covers the container without distorting */
  border-radius: 50%; /* Makes the image circular */
  display: block;
}

.image-preview .placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
}

.image-preview button {
  margin-top: 10px;
}
</style>
