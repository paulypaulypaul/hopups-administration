import type { Component } from "vue";
import ButtonComponent from "primevue/button";
import InputTextComponent from "primevue/inputtext";
import InputNumberComponent from "primevue/inputnumber";
import PasswordComponent from "primevue/password";
import SelectComponent from "primevue/select";
import DialogComponent from "primevue/dialog";
import TextareaComponent from "primevue/textarea";
import ChartComponent from "primevue/chart";

export const PRIME_COMPONENTS: Record<string, Component> = {
  Button: ButtonComponent,
  InputText: InputTextComponent,
  InputNumber: InputNumberComponent,
  Password: PasswordComponent,
  Select: SelectComponent,
  Dialog: DialogComponent,
  Textarea: TextareaComponent,
  Chart: ChartComponent
};
