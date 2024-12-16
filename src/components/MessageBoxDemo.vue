<script lang="ts" setup>
import { ref } from 'vue'
import type { Action } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps<{ msg: string, title: string }>()
function toast(type: 'success' | 'warning' | 'info' | 'error' = 'success', msg: string = '') {
  ElMessage({
    type,
    message: msg
  })
}

function open() {
  ElMessageBox.alert(props.msg, props.title, {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      let my_type = 'success'
      if (action !== 'confirm') {
        my_type = 'error'
      }
      toast(my_type, `action: ${action}`)
    },
  })
}
</script>

<template>
  <el-button plain @click="open">
    <slot>Button</slot>
  </el-button>
</template>
