<template>
  <div class="parent-container">
    <div class="child-top">
      <el-menu class="el-menu-vertical no-right-border" @select="handleSelect">
        <div v-if="hisData && hisData.reference_documents">
          <el-menu-item v-for="(item, i) in hisData.reference_documents" :key="i" :index="i.toString()"
                        v-show="item.title !== 'Prompt'">
            <div class="icon-container">
              <el-icon :size="16"><Icon :icon="iconName(item.title)" /></el-icon>
            </div>
            {{ item.title }}
          </el-menu-item>
        </div>
      </el-menu>
    </div>
    <div class="child-bottom">
      <el-popover
          :width="200"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0 10px 38px -10px, rgb(14 18 22 / 20%) 0 10px 20px -15px; padding: 20px;"
      >
        <template #reference>
          <div class="h-left">
            <img alt="Vue logo" src="../assets/question_mark.png">
            <p>Service Center</p>
          </div>

        </template>
        <template #default>
          <div
              class="demo-rich-conent"
              style="display: flex; gap: 16px; flex-direction: column"
          >
            <img
                src="../assets/qr_code.png"
                style="margin-bottom: 8px"
                alt=""/>
            <div>
              <p
                  class="demo-rich-content__name"
                  style="margin: 0; font-weight: 500"
              >
                Line 客服
              </p>
              <p
                  class="demo-rich-content__mention"
                  style="margin: 0; font-size: 14px; color: var(--el-color-info)"
              >
                Line ID: @197vmbxk
              </p>
            </div>

            <p class="demo-rich-content__desc" style="margin: 0">
              使用上有什麼心得或建議，歡迎加 Line 告訴我們！😀
            </p>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed } from 'vue';
import { Icon } from "@iconify/vue";
const hisData = inject('hisData');
const selectedMenuItemIndex = inject('selectedMenuItemIndex');
const emit = defineEmits(['menu-item-selected']);
function handleSelect(index) {
  // transmit the selected menu item index to the parent component
  emit('menu-item-selected', parseInt(index)); // convert string to number because the index is a string
}

const iconName = computed(() => (title) => {
  const titleLowerCase = title.toLowerCase();
  switch (titleLowerCase) {
    case 'prompt':
      return `fa6-solid:comment`;
    case 'admission note':
      return `fa6-solid:book-medical`;
    case 'discharge summary':
      return `fa6-solid:file-medical`;
    case 'progress note':
      return `fa6-solid:calendar-day`;
    case 'nursing note':
      return `fa6-solid:user-nurse`;
    case 'physician note':
      return `fa6-solid:user-md`;
    case 'ecg report':
      return `fa6-solid:heartbeat`;
    case 'pathology report':
      return `fa6-solid:microscope`;
    case 'lab data':
      return `fa6-solid:vial`;
    case 'exam report':
      return `fa6-solid:lungs`;
    case 'vital sign':
      return `fa6-solid:heart-pulse`;
    case 'medication':
      return `fa6-solid:pills`;
    case 'custom info':
      return `fa6-solid:user-pen`;
    case 'operation note':
      return `fa6-solid:file-waveform`;
    case 'quality analysis':
      return `fa6-solid:list-check`;
    default:
      return `fa6-solid:file-lines`;
  }
});
</script>

<style scoped>
.parent-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.child-top {
  /* Additional styling as needed */
}

.child-bottom {
  margin-top: auto;
  margin-bottom: 32px;
}

.h-left {
  display: flex;
  justify-content: flex-start;
}

.child-bottom img {
  margin: 16px;
  width: 18px;
  height: 18px;
}

.child-bottom p {
  margin-top: 16px;
  margin-bottom: 16px;
}

.no-right-border {
  border-right-width: 0;
}

.el-menu-item {
  font-size: 18px;
}

.icon {
  margin-right: 12px;
}

el-menu {
  background-color: rgb(234, 255, 234);
  height: 100%;
  width: 100%;
  border-right-width: 0;
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
</style>
