<template>
  <div id="left-column-root" style="height:100%; box-sizing: border-box;">
    <div class="titled-document-root" style="height:90%; box-sizing: border-box;" v-if="hisData && hisData.reference_documents">
      {{ hisData.reference_documents[0].text }}==={{ hisData.user_id }}
    </div>
    <div class="titled-document-root" style="height:90%; box-sizing: border-box;" v-else>
      <p>hisData is not available</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
const hisData = inject('hisData');
</script>

<style scoped>

</style>
