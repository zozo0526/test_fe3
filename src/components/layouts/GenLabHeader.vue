<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import emitter from '~/eventBus';
import {Icon} from "@iconify/vue";

const userId = ref(null);

const updateUserId = (id) => {
  userId.value = id;
};

onMounted(() => {
  emitter.on('userIdUpdated', updateUserId);
});

onUnmounted(() => {
  emitter.off('userIdUpdated', updateUserId);
});
</script>

<template>
  <el-container>
    <el-header class="bg-blue-800 text-white h-auto">
      <el-row>
        <el-col :span="4" class="flex items-center ">
          <el-icon :size="18" i-mdi-user-card-details class="mr-2" ></el-icon>
          {{ userId }}
        </el-col>
        <el-col :span="16">
          <h3 class="text-center my-2">GenLab</h3>
        </el-col>
        <el-col :span="4">
          &nbsp;
        </el-col>
      </el-row>
    </el-header>
  </el-container>
</template>


