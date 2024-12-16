<template>
  <div id="left-column-root" class="h-full border-box">
      <el-tabs v-model="activeName" class="demo-tabs h-full mx-5" @tab-click="handleClick">
        <el-tab-pane label="參考資料" name="first" class="h-full">
          <el-row class="h-full pb-20">
            <el-col :span="6" class="h-full">
                <el-aside class="aside h-full">
                <SideBar
                    class="side-bar mt-2"
                    @menu-item-selected="updateReferenceDocuments"
                ></SideBar>
              </el-aside>
            </el-col>
            <el-col :span="18" class="h-full">
              <div class="titled-document-root text-left font-bold text-2xl h-full" style="box-sizing: border-box;" v-if="hisData && hisData.reference_documents">
                <TitledDocument
                    v-for="(referenceDocument, index) in hisData.reference_documents" :key="index"
                    v-show="selectedMenuItemIndex === index  && referenceDocument.title !== 'Prompt'"
                    :value="referenceDocument.text"
                    @update:value="(value) => {
                      referenceDocument.text = value;
                    }"
                    @buttonClicked="handleButtonClicked(referenceDocument)"
                    :shouldShowButton="getDocumentAction(referenceDocument) != ''" :titleText="referenceDocument.title"
                    :textAreaPlaceholder="textAreaPlaceholder" :buttonText="getDocumentAction(referenceDocument)"
                    :isDisabled="referenceDocument.isDisabled" :isLoading="referenceDocument.isLoading"
                    :readonly="referenceDocument.readonly"/>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="提示詞" name="second" class="h-full">
          <el-row class="h-full pb-20">
          <el-col :span="6">
            <el-aside class="aside">
              <SideBar
                  class="side-bar mt-6"
                  @menu-item-selected="updateReferenceDocuments"
              ></SideBar>
            </el-aside>
          </el-col>
          <el-col :span="18">
            <div class="h-full">
              <TitledDocument
                  v-for="(referenceDocument, index) in hisData.reference_documents" :key="index"
                  v-show="referenceDocument.title === 'Prompt'"
                  :value="referenceDocument.text"
                  @update:value="(value) => {
                          referenceDocument.text = value;
                        }"
                  @buttonClicked="handleButtonClicked(referenceDocument)"
                  :shouldShowButton="getDocumentAction(referenceDocument) != ''" :titleText="referenceDocument.title"
                  :textAreaPlaceholder="textAreaPlaceholder" :buttonText="getDocumentAction(referenceDocument)"
                  :isDisabled="referenceDocument.isDisabled" :isLoading="referenceDocument.isLoading"
                  :readonly="referenceDocument.readonly"/>
            </div>
          </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script setup>
import { inject, ref, computed } from 'vue';
import TitledDocument from './TitledDocument.vue';
import axios from 'axios';
// import { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab, event) => {
  console.log(tab, event)
}
const hisData = inject('hisData');
const selectedMenuItemIndex = inject('selectedMenuItemIndex');
const textAreaPlaceholder = ref(
  'No Data in this section. You may add your own memo here or copy and paste from other sources.'
);

const updateReferenceDocuments = (index) => {
  selectedMenuItemIndex.value = index;
};

const promptList = () => {
  selectedMenuItemIndex.value = index;
};

const getDocumentAction = (referenceDocument) => {
  if (referenceDocument.title === 'Prompt') {
    return '';
  } else if (referenceDocument.title === 'Quality Analysis') {
    return 'Perform';
      } else {
    return '';
      }
};

const handleButtonClicked = (referenceDocument) => {
  if (referenceDocument.title === 'Quality Analysis') {
    saveQualityAnalysis(referenceDocument);
  }
  console.log('handleButtonClicked', referenceDocument.title);
};

const saveQualityAnalysis = async (referenceDocument) => {
  console.log('saveQualityAnalysis');
      referenceDocument.isDisabled = true;
      referenceDocument.isLoading = true;

      try {
    const response = await axios.post('/save_quality_analysis', {
            user_id: hisData.value.user_id,
            medical_specialty: hisData.value.medical_specialty,
            generation_preset: hisData.value.generation_preset,
            text: referenceDocument.text,
    });
    if (response.data.status === 'success') {
      uploadHisData(referenceDocument);
        } else {
      console.log('Fail response', response.data.message);
          referenceDocument.isDisabled = false;
          referenceDocument.isLoading = false;
        }
      } catch (error) {
    console.log('Error', error);
        referenceDocument.isDisabled = false;
        referenceDocument.isLoading = false;
      }
};

const uploadHisData = async (referenceDocument) => {
      try {
        const inputData = hisData.value;
    const response = await axios.post('/upload_his_data', inputData);
    if (response.data.status === 'success') {
          const hisDataId = response.data.value;
      console.log('hisDataId', hisDataId);
      getQualityAnalysisResult(referenceDocument, hisDataId);
        } else {
      console.log('Fail response', response.data.message);
      referenceDocument.isDisabled = false;
      referenceDocument.isLoading = false;
        }
      } catch (error) {
    referenceDocument.isDisabled = false;
    referenceDocument.isLoading = false;
      }
};

const getQualityAnalysisResult = async (referenceDocument, hisDataId) => {
      try {
    const response = await axios.post('/get_quality_analysis_result', {
            his_data_id: hisDataId,
    });
    if (response.data.status === 'success') {
          const qualityAnalysisResult = response.data.value;
      console.log('qualityAnalysisResult', qualityAnalysisResult);

          const qualityReportIndex = hisData.value.reference_documents.findIndex(
        (item) => item.title === 'Quality Report'
          );
          if (qualityReportIndex !== -1) {
        hisData.value.reference_documents[qualityReportIndex].text = qualityAnalysisResult;
          } else {
            hisData.value.reference_documents.push({
          title: 'Quality Report',
              text: qualityAnalysisResult,
            });
          }

      hisData.value.selected_menu_item_index = hisData.value.reference_documents.length - 1;

          referenceDocument.isDisabled = false;
          referenceDocument.isLoading = false;
        } else {
      console.log('Fail response', response.data.message);
          referenceDocument.isDisabled = false;
          referenceDocument.isLoading = false;
        }
      } catch (error) {
    console.log('Error', error);
        referenceDocument.isDisabled = false;
        referenceDocument.isLoading = false;
      }
};
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
