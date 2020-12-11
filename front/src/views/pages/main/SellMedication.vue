<template>
  <!-- <v-container id="add-user-modal" fluid tag="section"> -->
  <v-card>
    <v-card-title>
      <h4>Sell Medication</h4>
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.stop.prevent="checkForm()"
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
        <v-select
          v-model="sale.medicationId"
          :items="medications"
          item-text="name"
          item-value="id"
          :rules="[required]"
          label="Medications"
          multiple
          hint="Select medications for the prescriptions"
          persistent-hint
        ></v-select>

        <v-select
          v-model="sale.prescriptionId"
          :items="prescriptions"
          item-text="prescriptionId"
          :rules="[required]"
          item-value="id"
          label="Prescription"
          hint="Select the prescription"
          persistent-hint
        ></v-select>

        <v-card-actions class="pl-0 dxa_modal_actions">
          <v-btn
            color="success"
            min-width="100"
            :loading="loading"
            type="submit"
            >Save</v-btn
          >
          <v-btn color="red" min-width="100" @click="$emit('close', null)">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-form>
      <v-alert class="ma-2" v-if="error" type="error">{{ $t(error) }}</v-alert>
    </v-card-text>
  </v-card>
  <!-- </v-container> -->
</template>

<style lang="scss" scoped>
.colorpickerTitle {
  margin-bottom: 7px;
  font-weight: 500;
  color: #01d281 !important;
}
.colorpickerArea {
  font-weight: 500;
  color: #01d281 !important;
  margin-bottom: 15px;
}
</style>

<script>
import Service from "@/services/Service";

export default {
  name: "CreatePrescriptionModal",

  props: {
    sales_size: Number,
    prescriptions: Array,
    medications: Array,
  },

  async created() {
    this.service = new Service();
      this.sale = {
        saleId: "SAL" + ("0" + (this.sales_size + 1).toString()).slice(-2),
        medicationId: null,
        prescriptionId: null,
      };
  },

  data: () => ({
      service: null,
      loading: false,
      valid: true,
      lazy: false,
      error: null,

      sale: {
        saleId: "SAL" + ("0" + (this.sales_size + 1).toString()),
        medicationId: null,
        prescriptionId: null,
      },
  }),
  computed: {
    required() {
      return (value) => !!value || this.$t("required");
    },
  },

  methods: {
    checkForm: function () {
      if (this.loading) {
        return;
      }
      this.loading = true;
      var result = this.$refs.form.validate();
      if (result) {
        this.submit();
      } else {
        this.loading = false;
      }
    },

    async submit() {
      console.log(this.service)
      this.sale.medicationId = this.sale.medicationId[0];
      this.service
        .postRequest("/sell_med", this.sale)
        .then((resp) => {
          this.$emit("close", this.sale);
        })
        .catch((error) => {});
    },
  },
};
</script>
