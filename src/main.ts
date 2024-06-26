import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";

import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";
import filters from "@/core/helpers/filters";
import VueHtmlToPaper from "@/core/plugins/vue-html-to-paper"; // Correct import

import "@/core/plugins/prismjs";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.$filters = filters;

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

app.use(i18n);

app.use(VueHtmlToPaper); // Use the plugin

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");
