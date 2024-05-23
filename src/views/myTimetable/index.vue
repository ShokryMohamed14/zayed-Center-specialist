<template>
  <section>
    <div id="kt_app_content_container" class="app-container container-fluid">
      <div class="card mb-5 mb-xl-10" id="kt_patients_details_view">
        <div class="card">
          <div class="card-header">
            <div class="card-title m-0">
              <h3 class="fw-bold m-0">جدول الجلسات</h3>
            </div>
          </div>
          <div class="p-9">
            <div>
              <div class="table-container">
                <div class="table-responsive">
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>الأيام</th>
                        <!-- Week days column -->
                        <th v-for="(header, index) in tableHeader" :key="index">
                          {{ header }}
                        </th>
                        <!-- Time slots -->
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(day, dayIndex) in weekDays">
                        <tr>
                          <td>{{ day }}</td>
                          <!-- Week days -->
                          <td
                            v-for="(session, sessionIndex) in sessionsTable[
                              dayIndex
                            ]"
                            :key="sessionIndex"
                          >
                            {{ session }}
                          </td>
                          <!-- Session data -->
                        </tr>
                      </template>
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
import { ref, onMounted, onUnmounted } from "vue";
import { useSpecialistSessionsStore } from "@/stores/specialistSessions";
import { useRouter } from "vue-router";
const store = useSpecialistSessionsStore();

const sessions = ref([]);
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
]);

const sessionsTable = ref(
  Array.from({ length: weekDays.value.length }, () =>
    Array(tableHeader.value.length).fill("")
  )
);

// Function to convert time string to index in the table header
function timeToIndex(time: string): number {
  let [hour, minute] = time.split(":").map(Number);
  if (hour < 9) {
    hour += 12; // Convert to 24-hour format
  }
  return (hour - 9) * 2 + (minute >= 30 ? 1 : 0);
}

onMounted(async () => {
  await store.fetchList();
  sessions.value = store.ListData;
  populateTable();
});

onUnmounted(() => {
  //   store.resetItemData();
});

function populateTable() {
  sessions.value.forEach((session) => {
    console.log("Processing session:", session);
    const dayIndex = weekDays.value.findIndex((day) => day === session.day);
    const fromIndex = timeToIndex(session.from);
    const toIndex = timeToIndex(session.to);
    console.log("Day Index:", dayIndex);
    console.log("From Index:", fromIndex);
    console.log("To Index:", toIndex);
    if (dayIndex !== -1 && fromIndex !== -1 && toIndex !== -1) {
      for (let i = fromIndex; i < toIndex; i++) {
        sessionsTable.value[dayIndex][i] = session.patient.name;
      }
    }
    console.log("Updated sessionsTable:", sessionsTable.value);
  });
}
</script>

<style scoped>
/* Add your CSS styling here */
.table-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  max-width: 100%; /* Adjust the max-width as needed */
  font-size: 15px;
}

.table-responsive {
  overflow: auto; /* Ensure table content scrolls */
}

.table {
  width: max-content; /* Set table width to max-content for horizontal scrolling */
  background-color: transparent;
  width: 100%; /* Set table width to 100% */
  border-collapse: collapse; /* Collapse border spacing */
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #ebedf2;
  white-space: wrap; /* Prevent text wrapping */
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
  margin-bottom: 5px; /* Adjust the margin to separate the name from the bin icon */
}

.bin-icon {
  color: red;
}

.bin-icon-container {
  text-align: center;
}

/* Increase font size of button and dropdown text */
.el-button,
.el-dropdown-item {
  font-size: 16px;
  padding: 20px;
}

/* Your existing CSS styles for .table, .table th, .table td, etc. */
</style>
