<template>
  <div class="task-form">
    <h2>Tworzenie zadania programistycznego</h2>
    <form @submit.prevent="submitTask">
      <!-- Formularz podstawowych informacji o zadaniu -->
      <div class="card mb-3">
        <div class="card-header">
          <h4>Informacje o zadaniu</h4>
        </div>
        <div class="card-body">
          <div>
            <label for="functionName">Nazwa funkcji:</label>
            <input
              type="text"
              v-model="task.functionName"
              required
              class="form-control"
              pattern="[A-Za-z0-9]+"
              title="Tylko litery i cyfry bez spacji"
            />
          </div>

          <div>
            <label for="returnType">Typ zwracany:</label>
            <select v-model="task.returnType" required class="form-control">
              <option value="INT">INT</option>
              <option value="FLOAT">FLOAT</option>
              <option value="DOUBLE">DOUBLE</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="CHAR">CHAR</option>
              <option value="STRING">STRING</option>
              <option value="INTVECTOR">INTVECTOR</option>
              <option value="CHARVECTOR">CHARVECTOR</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Karty dla argumentów -->
      <div class="argument-card">
        <h2>Argumenty</h2>
        <div
          v-for="(arg, index) in task.argumentList"
          :key="arg.id"
          class="card mb-3"
        >
          <div class="card-header">
            <h4>Argument {{ index + 1 }}</h4>
          </div>
          <div class="card-body">
            <label for="type">Typ:</label>
            <select
              v-model="arg.type"
              @change="updateTestArguments"
              required
              class="form-control"
            >
              <option value="INT">INT</option>
              <option value="FLOAT">FLOAT</option>
              <option value="DOUBLE">DOUBLE</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="CHAR">CHAR</option>
              <option value="STRING">STRING</option>
              <option value="INTVECTOR">INTVECTOR</option>
              <option value="CHARVECTOR">CHARVECTOR</option>
            </select>

            <label for="name">Nazwa:</label>
            <input
              type="text"
              v-model="arg.name"
              required
              class="form-control"
            />

            <button
              type="button"
              @click="removeArgument(index)"
              class="btn btn-danger mt-2 button-remove"
            >
              Usuń argument
            </button>
          </div>
        </div>

        <button type="button" @click="addArgument" class="btn btn-primary">
          Dodaj argument
        </button>
      </div>

      <!-- Karty dla testów -->
      <div class="test-card">
        <h2>Testy</h2>
        <div
          v-for="(test, index) in task.testList"
          :key="test.id"
          class="card mb-3"
        >
          <div class="card-header">
            <h4>Test {{ index + 1 }}</h4>
          </div>
          <div class="card-body">
            <div
              v-for="(testArg, argIndex) in test.testInputArgumentDTOList"
              :key="testArg.id"
            >
              <label for="testArgument"
                >Argument testowy {{ argIndex + 1 }}:</label
              >
              <input
                type="text"
                v-model="testArg.testArgument"
                @input="updateArgumentSize(testArg)"
                required
                class="form-control"
              />
            </div>

            <label for="expectedValue">Wartość oczekiwana:</label>
            <input
              type="text"
              v-model="test.expectedValue"
              required
              class="form-control"
            />
            <button
              type="button"
              @click="removeTest(index)"
              class="btn btn-danger mt-2 button-remove"
            >
              Usuń test
            </button>
          </div>
        </div>
        <button type="button" @click="addTest" class="btn btn-primary">
          Dodaj test
        </button>
      </div>

      <div class="task-description-container">
        <div class="task-description">
          <textarea
            v-model="taskDescription"
            placeholder="Wpisz opis zadania programistycznego..."
            rows="6"
            cols="50"
          ></textarea>
        </div>
      </div>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <!-- Przycisk do wysłania formularza -->
      <button type="submit" class="btn btn-success mt-3">Zapisz zadanie</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/axios"; // Zakładając, że masz plik axios.js do konfiguracji axios
import { watch } from "vue";

const router = useRouter();

// Typy zwracane i argumentów
const returnTypes = [
  "INT",
  "FLOAT",
  "DOUBLE",
  "BOOLEAN",
  "CHAR",
  "STRING",
  "INTVECTOR",
  "CHARVECTOR",
];

const successMessage = ref("");
const errorMessage = ref("");

const taskDescription = ref("");

// Inicjalizacja danych zadania
const task = ref({
  id: null,
  returnType: "INT",
  functionName: "",
  argumentList: [{ id: 1, type: "INT", name: "arg1" }],
  testList: [
    {
      id: 1,
      testInputArgumentDTOList: [
        { id: 1, type: "INT", testArgument: "", size: 0 },
      ],
      expectedValue: "",
    },
  ],
});

// Funkcja dodająca argument
const addArgument = () => {
  task.value.argumentList.push({
    id: task.value.argumentList.length + 1,
    type: "INT",
    name: `arg${task.value.argumentList.length + 1}`,
  });
  updateTestArguments(); // Aktualizacja argumentów w testach po dodaniu nowego argumentu
};

// Funkcja usuwająca argument
const removeArgument = (index) => {
  task.value.argumentList.splice(index, 1);
  updateTestArguments(); // Aktualizacja argumentów w testach po usunięciu argumentu
};

// Funkcja dodająca test
const addTest = () => {
  task.value.testList.push({
    id: task.value.testList.length + 1,
    testInputArgumentDTOList: generateTestArguments(),
    expectedValue: "",
    size: calculateSize(task.value.returnType, ""), // Dodanie pola size na podstawie typu returnType
  });
};

// Funkcja aktualizująca listę testów po zmianach
const updateTestSizes = () => {
  task.value.testList.forEach((test) => {
    test.size = calculateSize(task.value.returnType, test.expectedValue);
  });
};

// Funkcja obliczająca rozmiar na podstawie wartości i typu
const calculateSize = (type, value) => {
  if (type === "INTVECTOR" || type === "CHARVECTOR") {
    return value.split(",").filter((item) => item.trim() !== "").length;
  }
  return 0; // Rozmiar nie dotyczy innych typów
};

// Obserwator dla zmiany expectedValue
watch(
  () => task.value.testList.map((test) => test.expectedValue),
  () => {
    updateTestSizes(); // Automatyczna aktualizacja rozmiaru przy zmianie expectedValue
  }
);

// Funkcja usuwająca test
const removeTest = (index) => {
  task.value.testList.splice(index, 1);
};

// Funkcja aktualizująca listę argumentów w testach
const updateTestArguments = () => {
  task.value.testList.forEach((test) => {
    test.testInputArgumentDTOList = generateTestArguments();
    test.testInputArgumentDTOList.forEach(updateArgumentSize);
  });
};

// Funkcja generująca argumenty w teście zależnie od ilości argumentów w zadaniu
const generateTestArguments = () => {
  return task.value.argumentList.map((arg, index) => ({
    id: index + 1,
    type: arg.type,
    testArgument: "",
    size: 0,
  }));
};

const updateArgumentSize = (testArg) => {
  if (testArg.type === "INTVECTOR" || testArg.type === "CHARVECTOR") {
    const trimmedInput = testArg.testArgument.trim();
    testArg.size = trimmedInput
      ? trimmedInput.split(",").filter((item) => item !== "").length
      : 0;
  }
};

// Przygotowanie danych do wysłania na backend
const prepareDataForBackend = () => {
  const dataToSend = {
    ...task.value,
    testList: task.value.testList.map((test) => ({
      ...test,
      testInputArgumentDTOList: test.testInputArgumentDTOList.map((testArg) => {
        const updatedArg = { ...testArg };
        updateArgumentSize(updatedArg); // Obliczanie size przed wysłaniem
        return updatedArg;
      }),
    })),
  };
  return dataToSend;
};

// Funkcja wysyłająca dane formularza na backend
const submitTask = async () => {
  const taskData = {
    functionName: task.value.functionName,
    returnType: task.value.returnType,
    argumentList: task.value.argumentList,
    testList: task.value.testList,
  };
  const dataToSend = prepareDataForBackend();

  try {
    const response = await api.post("/v1/addTask", dataToSend);
    successMessage.value = "Zadanie zostało pomyślnie zapisane!";
    const taskId = response.data;

    const descriptionData = {
      taskId: taskId,
      description: taskDescription.value,
    };

    const response2 = await api.post(
      "/v1/task/addDescription",
      descriptionData
    );

    setTimeout(() => {
      successMessage.value = "";
      router.push("/chooseTask");
    }, 2000); // Opóźnienie przed przekierowaniem
  } catch (e) {
    errorMessage.value = "Błąd podczas zapisywania zadania. Spróbuj ponownie.";
    console.error("Błąd podczas wysyłania zadania:", e);
    setTimeout(() => {
      errorMessage.value = ""; // Usunięcie komunikatu błędu po kilku sekundach
    }, 5000);
  }
};
</script>

<style scoped>
/* Ustawienia ogólne formularza */
.task-form {
  margin: 20px;
}

h2 {
  background-color: #472caa;
}

label {
  display: block;
  margin-top: 10px;
}

input {
  width: 98%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px; /* Zaokrąglenie inputów */
}

select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px; /* Zaokrąglenie inputów */
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px; /* Zaokrąglenie przycisków */
}

button:hover {
  background-color: #45a049;
}

.button-remove {
  margin-top: 10px;
  padding: 10px;
  background-color: #bd5252;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px; /* Zaokrąglenie przycisków */
}

.button-remove:hover {
  background-color: #913e3e;
}

/* Karty */
.card {
  margin: 15px;
  border-radius: 10px;
  border: 5px solid #000000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
  background-color: #000000;
  padding-top: 5px;
  border-left: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.card-body {
  margin: 10px 10px;
  margin-bottom: 10px;
}

.argument-card {
  margin-bottom: 100px;
}

.test-card {
  margin-bottom: 100px;
}

.card-header h4 {
  margin: 0;
}

.card-body .btn {
  width: 100%;
}

.mb-3 {
  margin-bottom: 20px;
}

.task-description-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.task-description {
  width: 80%;
  max-width: 800px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
}

textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  resize: none;
}

.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 5px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}
</style>
