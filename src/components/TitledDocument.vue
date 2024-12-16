<template>
  <div class="h-full border-box">
    <el-row class="header shadow">
      <el-col :span="22" class="w-full flex items-center justify-between">
        <div>
          <el-button v-show="shouldShowButton" @click="buttonClicked" :disabled="isDisabled" type="primary"
            class="mr-3">
            <div v-if="isLoading" class="spinner"></div>
            {{ buttonText }}
          </el-button>
          <el-text class="title text-2xl font-semibold">{{ titleText }}</el-text>
        </div>
        <el-button v-show="shouldShowButton" class='i-mdi-content-copy text-right' @click="copyToClipboard" ></el-button>
      </el-col>
      <el-col :span="2">
        <div v-show="readonly" class='icon-container text-right'>
          <i class="fa-solid fa-lock"></i>
        </div>
      </el-col>
    </el-row>
    <el-row class="document-white above shadow h-full">
      <el-col :span="24" class="border-box">
        <div v-if="documentType == 'json'" class="document-json fixed_width_font">
          <JsonDocument />
        </div>
        <textarea
          v-else
          class="document-textarea"
          :value="value"
          :readonly="readonly"
          :placeholder="textAreaPlaceholder"
          @input="updateValue"
        >
        </textarea>

      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  buttonText: String,
  isDisabled: Boolean,
  isLoading: Boolean,
  readonly: Boolean,
  shouldShowButton: Boolean,
  value: String,
  textAreaPlaceholder: String,
  titleText: String,
  documentType: String,
});

const emit = defineEmits(['buttonClicked', 'update:value']);

function buttonClicked() {
  emit('buttonClicked');
}

function updateValue(event) {
  emit('update:value', event.target.value);
  console.log('updateValue', event.target.value);
}

const copyToClipboard = computed((event) => {
  return () => {
    navigator.clipboard.writeText(event.target.value);
  };
});
</script>

<style scoped>
.header {
  z-index: 1;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  height: 54px;
  align-items: center;
  background-color: lightgray;
}

.document-white {
  background-color: white;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.above {
  z-index: 100;
}

.fixed_width_font {
  font-family: "Courier New", Courier, monospace;
  font-size: 16px;
}
.document-textarea {
  z-index: 100;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-color: beige;
  background-color: white;
  padding: 1rem;
  line-height: 1.5;
  text-align: justify;
}

.document-json {
  z-index: 10;
  margin: 0;
  padding: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-color: beige;
  background-color: white;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin-right: 12px;
  animation: spin 2s linear infinite;
}

.icon-container {
  display: flex;
  justify-content: center;
  /* Horizontal centering */
  align-items: center;
  /* Vertical centering */
  height: 24px;
  width: 24px;
}

.icon {
  margin-right: 12px;
}

.text-right {
  text-align: right;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}</style>
