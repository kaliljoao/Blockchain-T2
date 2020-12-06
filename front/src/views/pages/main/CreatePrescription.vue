<template>
  <!-- <v-container id="add-user-modal" fluid tag="section"> -->
  <v-card>
    <v-card-title>
      <h4>Add Prescription</h4>
    </v-card-title>
    <v-card-text>
      <v-form
        @submit.stop.prevent="checkForm()"
        ref="form"
        v-model="valid"
        :lazy-validation="lazy"
      >
        <v-select
          v-model="prescription.medications"
          :items="medications"
          item-text="name"
          item-value="id"
          :rules="[required]"
          label="Medications"
          multiple
          hint="Select medications for the prescription"
          persistent-hint
        ></v-select>
        
        <v-select
          v-model="prescription.patientId"
          :items="patients"
          item-text="name"
          :rules="[required]"
          item-value="id"
          label="Patient"
          hint="Select the patient"
          persistent-hint
        ></v-select>

        <v-select
          v-model="prescription.doctorId"
          :items="doctors"
          item-text="name"
          :rules="[required]"
          item-value="id"
          label="Doctor"
          hint="Select the doctor writing the prescription"
          persistent-hint
        ></v-select>

        
        <v-select
          v-model="prescription.hospitalId"
          :items="hospitals"
          item-text="name"
          :rules="[required]"
          item-value="id"
          label="Hospital"
          hint="Select the hospital"
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
          <v-btn
            color="red"
            min-width="100"
            @click="$emit('close', null)"
          >
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
export default {
  name: "CreatePrescriptionModal",

  props: {
    prescription_prop: Object,
    doctors: Object,
    patients: Object,
    hospitals: Object,
    medications: Object,
  },

  async created() {
    if (this.prescription_prop != null) {
      this.edit = true;
      this.prescription = {
        prescriptionId: this.prescription_prop.prescriptionId,
        medications: this.prescription_prop.medications,
        hospitalId: this.prescription_prop.hospitalId,
        doctorId: this.prescription_prop.doctorId,
        patientId: this.prescription_prop.patientId,
      }
    } else {
      this.edit = false;
      this.prescription = {
        prescriptionId: null,
        medications: [],
        hospitalId: null,
        doctorId: null,
        patientId: null,
      };
    }
  },

  data() {
    return {
      apiService: new ApiService(),
      loading: false,
      edit: false,
      valid: true,
      lazy: false,
      error: null,

     
      prescription : {
        prescriptionId: null,
        medications: [],
        hospitalId: null,
        doctorId: null,
        patientId: null,
      },
    };
  },
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

    submit: async function () {
      this.error = null;

      if (this.edit) {
        this.$emit("close", this.prescription);
      } else {
        this.$emit("close", this.prescription);
      }
    },
  },
};
</script>
