<template>
  <div>
    <!-- a hidden div with id:"output" with value=generated_text
    to be retrieved by the outer web view component-->
    <div id="output" style="display: none; visibility: hidden">
      {{ hisData.output.val }}
    </div>
    <el-container class="container" style="height: 100vh">
      <el-aside class="aside" width="200px">
        <SideBar
            class="side-bar"
            @menu-item-selected="updateReferenceDocuments"
        ></SideBar>
      </el-aside>

      <el-main class="main" style="height: 100%">
        <el-row style="height: 100%">
          <el-col class="left-column" :span="12">
            <LeftColumn
                :selectedMenuItemIndex="selectedMenuItemIndex"
                style="height: 100%; box-sizing: border-box"
            ></LeftColumn>
          </el-col>
          <el-col class="right-column" :span="12">
            <RightColumn style="height: 100%; box-sizing: border-box" ></RightColumn>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import axios from 'axios';
import apiClient from '~/axios-config';

const hisData = ref({
  _id: "",
  user_id: "",
  medical_specialty: "",
  generation_preset: "",
  reference_documents: [
    {
      title: "Error",
      text: "Fails to get the data. Please see the console.log and check the if backend API is out of service (500 server error) or any frontend input parameter is wrong (400 client error).",
    },
  ],
  generated_text: "",
  output: {
    type: "",
    value: "",
    structure: {
      "1. Discharge Diagnosis": "",
      "2. Surgical Procedures": "",
      "3. Hospital Course": "",
      "4. Therapeutic Procedures": "",
      "5. Complication": "",
    },
  },
});

const outputValue = ref("output value here");
const hisDataId = ref("");
const selectedMenuItemIndex = ref(0);

provide('hisData', hisData);

const getPersonalPrompt = async (user_id: string, medical_specialty: string, generation_preset: string) => {
  try {
    const response = await axios.post("/get_personal_prompt", {
      user_id,
      medical_specialty,
      generation_preset,
    });
    console.log("response from get_personal_prompt:", response.data);
    return response.data.value;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const getQualityAnalysis = async (user_id: string, medical_specialty: string, generation_preset: string) => {
  try {
    const response = await apiClient.post("/get_quality_analysis", {
      user_id,
      medical_specialty,
      generation_preset,
    });
    console.log("response from get_quality_analysis:", response.data);
    return response.data.value;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const updateReferenceDocuments = (index: number) => {
  selectedMenuItemIndex.value = index;
};

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  hisDataId.value = urlParams.get("his_data_id") || "";
  console.log("his_data_id:", hisDataId.value);
  console.log("baseURL:", axios.defaults.baseURL);

  if (hisDataId.value === "test") {
    console.log("Using the default hisData which is stored in the frontend:", hisData.value);
    return;
  }

  try {
    const response = await apiClient.post("/get_his_data", {
      his_data_id: hisDataId.value,
    });
    hisData.value = response.data.value;
    hisData.value.output.val = hisData.value.output.structure;
    hisData.value.reference_documents.forEach((referenceDocument: any) => {
      referenceDocument.readonly = false;
      if (referenceDocument.title === "Prompt" && hisData.value.output.type === "json") {
        referenceDocument.readonly = true;
      }
    });
    console.log("hisData:", hisData.value);
  } catch (error) {
    console.log(error);
  }
});
</script>
