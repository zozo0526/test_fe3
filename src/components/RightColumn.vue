<template>
  <div id="right-column-root" class="h-fulll ml-10" style="box-sizing: border-box">
    <div class="titled-document-root w-full text-left" style="height: 90%; box-sizing: border-box">
      <TitledDocument :documentType="hisData.output.type" :value="hisData.generated_text" :readonly="isReadOnly"
        @update:value="(value) => {
          hisData.generated_text = value;
        }
          " @buttonClicked="generateButtonClicked" :shouldShowButton="true"
        :titleText="hisData.generation_preset" :textAreaPlaceholder="generativeResultPlaceholder"
        :isDisabled="isDisabled" :isLoading="isLoading" :buttonText="buttonText" />

      <el-dialog v-model="dialogVisible" title="" width="30%" :before-close="handleClose">
        <span>{{ alert_message }}</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, reactive, onMounted, onUnmounted } from 'vue';
import axios from "axios";
import TitledDocument from "./TitledDocument.vue";
import { socket } from "~/socket.mjs";

const hisData = inject("hisData");

const buttonText = ref("Generate");
const prompt = ref("");
const generativeResultPlaceholder = ref("Click the 'Generate' button.");
const isLoading = ref(false);
const isDisabled = ref(false);
const isReadOnly = ref(false);
const promptIndex = ref(0);
const dialogVisible = ref(false);
const alert_message = ref("");
const jsonObject = reactive({});
const generative_stream_enabled = ref(true);

const lock_ui = () => {
  isLoading.value = true;
  isDisabled.value = true;
  isReadOnly.value = true;
};

const unlock_ui = () => {
  isLoading.value = false;
  isDisabled.value = false;
  isReadOnly.value = false;
};

const stringifyWithoutEscape = (jsonData) => {
      let jsonString = JSON.stringify(jsonData);
      jsonString = jsonString.replace(/\\\//g, "\\/");
      jsonString = jsonString.replace(/\\n/g, "\n");
      jsonString = jsonString.replace(/\\r/g, "\r");
      return jsonString;
};

const reEscape = (str) => {
      let result = str;
      result = result.replace(/\n/g, "\\n");
      result = result.replace(/\r/g, "\\r");
      result = result.replace(/\//g, "\\/");
      return result;
};

const handleClose = (done) => {
      done();
};

const generateButtonClicked = () => {
  lock_ui();
      if (hisData.value.output.type === "json") {
    generative_stream_enabled.value = false;
        for (let key in hisData.value.output.structure) {
          hisData.value.output.structure[key] = "";
        }
      } else {
    generative_stream_enabled.value = true;
      }
      hisData.value.generated_text = "";
  savePrompt();
};

const savePrompt = async () => {
  generativeResultPlaceholder.value = "Saving the prompt...";
      try {
        for (let i = 0; i < hisData.value.reference_documents.length; i++) {
          if (hisData.value.reference_documents[i].title === "Prompt") {
        prompt.value = hisData.value.reference_documents[i].text;
            break;
          }
        }
        const inputData = {
      text: prompt.value,
          user_id: hisData.value.user_id,
          medical_specialty: hisData.value.medical_specialty,
          generation_preset: hisData.value.generation_preset,
        };
        const response = await axios.post("/save_prompt", inputData);
        if (response.data.status === "success") {
      generativeResultPlaceholder.value += "Success.\n";
      uploadHisData();
        } else {
      generativeResultPlaceholder.value += "Fail.\n" + response.data.message;
      unlock_ui();
        }
      } catch (error) {
    generativeResultPlaceholder.value += "Fail.\nAPI error: " + error;
    unlock_ui();
      }
};

const uploadHisData = async () => {
  generativeResultPlaceholder.value += "Uploading the his_data...";
      try {
        const inputData = hisData.value;
        const response = await axios.post("/upload_his_data", inputData);
        if (response.data.status === "success") {
      generativeResultPlaceholder.value += "Success.\n";
          const hisDataId = response.data.value;
      if (generative_stream_enabled.value) {
        getGenerativeStream(hisDataId);
          } else {
        getGenerativeResult(hisDataId);
          }
        } else {
      generativeResultPlaceholder.value += "Fail.\n" + response.data.message;
      unlock_ui();
        }
      } catch (error) {
        if (error.response) {
      generativeResultPlaceholder.value += "Fail.\nAPI error: " + error.response.data.message;
        } else {
      generativeResultPlaceholder.value += "Fail.\nAPI error: " + error;
        }
    unlock_ui();
      }
};

const getGenerativeStream = async (hisDataId) => {
      socket.emit("get_generative_stream", hisDataId, () => {
        console.log("Finished get_generative_stream");
      });
};

const getGenerativeResult = async (hisDataId) => {
  generativeResultPlaceholder.value += "Generating the result (might take a bit long time)...";
      try {
    const inputData = { his_data_id: hisDataId };
        const response = await axios.post("/get_generative_result", inputData);
        if (response.data.status === "success") {
      generativeResultPlaceholder.value += "Success.\n";
          hisData.value.generated_text = response.data.value;
          if (hisData.value.output.type === "json") {
            hisData.value.output.val = hisData.value.output.structure;
        jsonObject.value = JSON.parse(hisData.value.generated_text);
        if (Object.keys(jsonObject.value).sort().join(",") !== Object.keys(hisData.value.output.structure).sort().join(",")) {
          alert_message.value = "The generated structure is not the same as the required json structure.";
          unlock_ui();
              return;
            } else {
          const jsonString = JSON.stringify(jsonObject.value);
          hisData.value.output.structure = jsonObject.value;
          hisData.value.output.val = jsonString;
            }
          } else {
            hisData.value.output.val = hisData.value.generated_text;
          }
        } else {
      alert_message.value = response.data.message;
      dialogVisible.value = true;
      generativeResultPlaceholder.value += "Fail.\nAPI error:" + response.data.message;
        }
      } catch (error) {
    generativeResultPlaceholder.value += "\nFail.\nError when get_generative_result: " + error.response.data.message;
    alert_message.value = error.response.data.message;
    dialogVisible.value = true;
      } finally {
    unlock_ui();
      }
};

onMounted(() => {
  socket.on("generative_stream", (msg) => {
    if (msg.status === "finish") {
      unlock_ui();
      generativeResultPlaceholder.value += "\nGenerating stream: finished.";
    } else if (msg.status === "fail") {
      unlock_ui();
      generativeResultPlaceholder.value += "\nGenerating stream: fail. Message: " + msg.message;
    } else if (msg.status === "stream") {
      hisData.value.generated_text += msg.value;
      if (hisData.value.output.type === "text") {
        hisData.value.output.val = hisData.value.generated_text;
      } else if (hisData.value.output.type === "json") {
        // hisData.value.output.val = JSON.parse(hisData.value.generated_text);
      } else {
        generativeResultPlaceholder.value += "\nGenerating stream with unknown output type. Please contact with the system administrators: \n" + hisData.value.output.type;
      }
    } else {
      generativeResultPlaceholder.value += "\nGenerating stream with unknown status: " + msg.status + "\nMessage: " + msg.message;
    }
  });

  socket.on("redacting_sensitive_info", (msg) => {
    if (msg.status === "start") {
      generativeResultPlaceholder.value += "\nRedacting sensitive info: start.";
    } else if (msg.status === "finish") {
      generativeResultPlaceholder.value += "\nRedacting sensitive info: finish.";
    } else if (msg.status === "fail") {
      unlock_ui();
      generativeResultPlaceholder.value += "\nRedacting sensitive info: fail. Message: " + msg.message;
    }
  });

  socket.on("alert_message", (msg) => {
    generativeResultPlaceholder.value += "\n" + "status: " + msg["status"] + "\n" + "message: " + msg["message"];
    alert_message.value = msg["message"];
    dialogVisible.value = true;
    unlock_ui();
  });
});

onUnmounted(() => {
  socket.off("generative_stream");
  socket.off("redacting_sensitive_info");
  socket.off("alert_message");
});
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
