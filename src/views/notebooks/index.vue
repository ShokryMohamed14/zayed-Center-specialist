<template>
  <div>
    <el-card v-if="itemData && itemData._id" class="box-card">
      <p>File: {{ itemData.filename }}</p>
      <el-button type="primary" @click="downloadFile">Download</el-button>
      <el-button type="danger" @click="deleteFile">Delete</el-button>
    </el-card>
    <div v-else>
      <el-upload
        ref="fileUpload"
        action=""
        :http-request="uploadFile"
        auto-upload
        show-file-list="false"
        accept=".doc,.docx"
      >
        <el-button type="primary">Select File</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useNotebooksStore } from "@/stores/notebook";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";

const store = useNotebooksStore();
const { itemData } = storeToRefs(store);

const router = useRouter();
const id = ref(router.currentRoute.value.params.id);

onMounted(async () => {
  await store.fetchItem(id.value);
});

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = `http://localhost:3000/notebooks/${itemData.value.filename}`;
  link.download = itemData.value.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const deleteFile = async () => {
  try {
    await store.deleteItem(itemData.value._id);
    ElMessage.success("File Deleted successfully");
    await store.fetchItem(id.value);
  } catch (error) {
    ElMessage.error("Failed to delete file");
    console.error(error);
  }
};

const uploadFile = async (params) => {
  const { file } = params;
  const formData = new FormData();
  const isWord =
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (!isWord) {
    ElMessage.error("You can only upload Word files.");
    return;
  }
  formData.append("file", file);

  try {
    await store.create(id.value, formData);
    ElMessage.success("File uploaded successfully");
    await store.fetchItem(id.value);
    // Handle post-upload logic, e.g., refresh the data or display success message
  } catch (error) {
    ElMessage.error("Failed to upload file");
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  margin: 20px;
}
</style>
