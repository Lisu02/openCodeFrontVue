import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const port = 10000;
const app = createApp(App);

app.use(router);
app.listen(port, "0.0.0.0", () => {
  console.log(`Example listening on port ${port}`);
});

app.mount("#app");
