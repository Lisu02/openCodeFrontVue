<script setup>
import { defineProps, defineComponent, onMounted, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import api from "@/services/axios";
import { toRefs } from "vue";

const props = defineProps({
  isPlayground: {
    type: Boolean,
    default: true,
  },
  taskId: {
    type: String,
    default: "-1",
  },
});

const { isPlayground, taskId } = toRefs(props);

const mycode = ref(`print("Hello, from python3 world!")`);
const selectedLanguage = ref("PYTHON3");
const extensions = ref([python(), oneDark]);
const resultFromBackend = ref("");
const taskInfo = ref({});
// Codemirror EditorView instance ref

const view = shallowRef();
const handleReady = (payload) => {
  view.value = payload.view;
};

async function getStarterCodeForUser() {
  try {
    const codeResponse = await api.get(`/solve/${taskId.value}`);
    taskInfo.value = codeResponse.data;
  } catch (error) {
    console.error("Error fetching code for task", error);
    taskInfo.value = {
      codeForUserGCC: "Error fetching code for task",
      codeForUserPYTHON3: "Error fetching code for task",
    };
  } finally {
    mycode.value = taskInfo.value.codeForUserPYTHON3;
    extensions.value = [python(), oneDark];
  }
}

if (isPlayground.value === false) {
  getStarterCodeForUser();
}

const runCodeClick = async () => {
  if (isPlayground.value) {
    await runPlayground();
  } else {
    await runSolution();
  }
};

async function runSolution() {
  const newSolution = {
    solvingTaskId: Number(taskId.value),
    programmingLanguage: selectedLanguage.value,
    solutionCode: mycode.value,
    runTime: 0,
    memoryUsage: 0,
  };
  try {
    const response = await api.post(`/solve`, newSolution);
    resultFromBackend.value = response.data;
  } catch (error) {
    console.error("Solution failed", error);
    resultFromBackend.value = "Posting solution failed ERROR";
  }
}

async function runPlayground() {
  const newCode = {
    programmingLanguage: selectedLanguage.value,
    code: mycode.value,
  };
  try {
    const response = await api.post(`/playgroundCompile/v2`, newCode);
    resultFromBackend.value = response.data;
  } catch (e) {
    console.error("Code post failed", e);
  }
}

const log = console.log;

const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
};

// Zmiana języka
const changeLanguage = () => {
  switch (selectedLanguage.value) {
    case "PYTHON3":
      extensions.value = [python(), oneDark];
      if (isPlayground.value) {
        mycode.value = `print("Hello, from python3 world!")`;
      } else {
        mycode.value = taskInfo.value.codeForUserPYTHON3;
      }

      break;
    case "c":
      extensions.value = [cpp(), oneDark];
      if (isPlayground.value) {
        mycode.value = `#include <stdio.h>\n\nint main() {\n  printf("Hello, from C world!\\n");\n  return 0;\n}`;
      } else {
        mycode.value = taskInfo.value.codeForUserGCC;
      }
      break;
  }
};
</script>

<template>
  <div class="options">
    <label for="language">Choose language: </label>
    <select id="language" v-model="selectedLanguage" @change="changeLanguage">
      <option value="PYTHON3">Python3</option>
      <option value="c">C</option>
    </select>
  </div>

  <codemirror
    v-model="mycode"
    :style="{ height: '450px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="4"
    :extensions="extensions"
    @ready="handleReady"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
  <button class="btn-runCode" @click="runCodeClick">Run Code</button>
  <div id="output">
    <textarea readonly v-model="resultFromBackend"></textarea>
  </div>
</template>

<style scoped>
codemirror {
  font-size: 30px;
}

textarea {
  color: #ccc;
  width: 99%;
  height: 90%;
  background-color: #333;
  font-family: sans-serif;
  font-size: 18px;
  resize: none;
  border: none;
}

select {
  margin-bottom: 5px;
  padding-top: 5px;
  font-size: 16px;
}

.options {
  padding-left: 25px;
  font-size: 24px;
  font-family: sans-serif;
  background-color: #292c35;
  color: #00bd7e;
  border-bottom: 2px solid black;
}

.btn-runCode {
  width: 100%;
  height: 50px;
  font-family: sans-serif;
  font-size: 24px;
  cursor: pointer;
  font-weight: bold;
  background-color: #00d38d;
}

.btn-runCode:hover {
  background-color: #009c68;
}

.output {
  background-color: #333;
  width: 100%;
  height: 150px;
}

#output {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 10px;
  background-color: #333;
  height: 250px;
  overflow-y: auto;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9rem;
  color: black;
}
</style>
