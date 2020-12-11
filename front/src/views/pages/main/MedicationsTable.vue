<template>
  <v-container v-if="!loading" id="medications-table" fluid tag="section">
    <base-material-card
      icon="mdi-medical-bag"
      inline
      title="Medications"
      color="secondary"
      class="px-5 py-3 mb-5"
    >
      <v-btn
        color="green"
        rounded
        @click="open_sell_dialog(null)"
        absolute
        fab
        top
        right
      >
        <v-icon large>mdi-plus</v-icon>
      </v-btn>
      <v-simple-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Manufacturer</th>
            <th class="text-center">Dosage</th>
            <th class="text-center">Fabrication Date</th>
            <th class="text-center">Expiration Date</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(med, index) in medications" :key="index">
            <td>{{ med.name }}</td>
            <td>{{ med.manufacturer }}</td>
            <td class="text-center">
              {{ med.dosage }}
            </td>
            <td class="text-center">
              {{ med.fabDate }}
            </td>
            <td class="text-center">
              {{ med.expDate }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <v-dialog v-if="dialog" v-model="dialog" max-width="40%" scrollable>
      <CreatePrescriptionModal
        :sales_size="sales.length"
        :medications="medications"
        :prescriptions="prescriptions"
        @close="reset_dialog"
      ></CreatePrescriptionModal>
    </v-dialog>
  </v-container>
  <v-container v-else>
    <v-progress-circular
      style="margin-left: 50%"
      indeterminate
      size="70"
      color="#01D281"
    ></v-progress-circular>
  </v-container>
</template>

<script>
import Service from "@/services/Service";
import SellMedication from "./SellMedication";

export default {
  name: "MedicationsTable",

  components: {
    SellMedication,
  },

  data: () => ({
    client: new Service(),
    loading: false,
    sales: [],
    prescriptions: [],
    medications: [
      {
        manufacturer: "426R",
        name: "Dipirona",
        dosage: "400",
        fabDate: "1574973266",
        expDate: "1665446400",
        status: "stock",
        prescription: null,
      },
      {
        manufacturer: "J205",
        name: "Azitromicina",
        dosage: "200",
        fabDate: "1574973266",
        expDate: "1665446400",
        status: "stock",
        prescription: null,
      },
    ],
  }),
  async created() {
    this.medications = await this.client.getRequest("/get_all_meds");
    this.sales = await this.client.getRequest("/get_all_sells");
    this.prescriptions = await this.client.getRequest("/get_all_presc");
  },
  methods: {
    open_dialog: function () {
      this.dialog = true;
    },
    reset_dialog(sale) {
      if (sale != null) {
        this.sales.push(sale);
      }
      this.dialog = false;
    },
  },
};
</script>
