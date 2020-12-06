<template>
  <v-container v-if="!loading" id="medications-table" fluid tag="section">
    <base-material-card
      icon="mdi-medical-bag"
      inline
      title="Medications"
      color="secondary"
      class="px-5 py-3 mb-5"
    >
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

export default {
  name: "MedicationsTable",

  components: {},

  data: () => ({
    loading: false,
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
  async created() {},
  methods: {},
};
</script>
