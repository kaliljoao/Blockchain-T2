<template>
  <v-container v-if="!loading" id="prescriptions-table" fluid tag="section">
    <base-material-card
      icon="mdi-clipboard-text"
      inline
      title="Prescriptions"
      color="secondary"
      class="px-5 py-3 mb-5"
    >
      <v-btn
        color="green"
        rounded
        @click="open_dialog(null)"
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
            <th>Medications</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Hospital</th>
            <!-- <th class="text-center">Edit</th> -->
            <th class="text-center">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(p, index) in prescriptions" :key="index">
            <td>{{ p.Record.medications.length }}</td>
            <td>{{ check_obj_name(p.Record.patientId, patients) }}</td>
            <td>{{ check_obj_name(p.Record.doctorId, doctors) }}</td>
            <td>{{ check_obj_name(p.Record.hospitalId, hospitals) }}</td>
            <!-- <td class="text-center">
              <v-btn
                class="px-2 ml-1 secondary"
                @click="open_dialog(p)"
                min-width="0"
                small
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </td> -->
            <td class="text-center">
              <v-btn
                class="px-2 ml-1"
                @click="open_delete_dialog(p)"
                color="red"
                min-width="0"
                small
              >
                <v-icon small>mdi-trash-can</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <v-dialog v-if="dialog" v-model="dialog" max-width="40%" scrollable>
      <CreatePrescriptionModal
        :prescription_prop="editPrescription"
        :prescriptions_size="prescriptions.length"
        :doctors="doctors"
        :patients="patients"
        :medications="medications"
        :hospitals="hospitals"
        @close="reset_dialog"
      ></CreatePrescriptionModal>
    </v-dialog>
    <v-dialog v-if="delete_dialog" v-model="delete_dialog" max-width="40%">
      <DeleteConfirmationModal
        :obj="delete_obj"
        name="this prescription"
        @close="delete_dialog = false"
        @delete="delete_prescription"
      ></DeleteConfirmationModal>
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
import CreatePrescriptionModal from "@/views/pages/main/CreatePrescription";
import DeleteConfirmationModal from "@/views/pages/DeleteConfirmationModal";
import Service from "@/services/Service";

export default {
  name: "PrescriptionsTable",

  components: {
    CreatePrescriptionModal,
    DeleteConfirmationModal,
  },

  data: () => ({
    client: new Service(),
    loading: false,
    dialog: false,
    delete_obj: null,
    delete_dialog: false,
    editPrescription: null,
    prescriptions: [
      
    ],
    doctors: [
      {
        id: "DOC1",
        name: "Caio Melo",
      },
      {
        id: "DOC2",
        name: "Albert Einstein",
      },
      {
        id: "DOC3",
        name: "Gabriel Barbosa",
      },
    ],
    patients: [
      {
        id: "PAT1",
        name: "Fernando Santos",
      },
      {
        id: "PAT2",
        name: "João Pedro Kalil",
      },
      {
        id: "PAT3",
        name: "Neymar Júnior",
      },
    ],
    hospitals: [
      {
        id: "HOS01",
        name: "Saint Marcus",
      },
      {
        id: "HOS02",
        name: "Santa Cruz General",
      },
      {
        id: "HOS03",
        name: "Copacabana ER",
      },
    ],
    medications: [
      
    ],
  }),
  async created() {
    await this.client.getRequest("/get_all_meds").then(resp => {
      resp.forEach(el => {
        this.medications.push(el.Record)
      })
    });
    this.prescriptions = await this.client.getRequest("/get_all_presc");
    this.prescriptions.forEach(element => {
      element.Record.medications = element.Record.medications.substring(1).split(',');
    });

    // this.medications = await this.client.getRequest("/get_all_meds");
  },
  methods: {
    check_obj_name(id, list) {
      console.log(list)
      var filtered = list.filter((x) => x.id == id)[0];
      return filtered.name;
    },
    open_delete_dialog: function (prescription) {
      this.delete_dialog = true;
      this.delete_obj = prescription;
    },
    open_dialog: function (prescription) {
      this.editPrescription = prescription;
      this.dialog = true;
    },
    reset_dialog(prescription) {
      if (this.editPrescription != null) {
        if (prescription != null) {
          var index = this.prescriptions.indexOf(this.editPrescription);
          this.prescriptions.splice(index, 1);
          this.prescriptions.push(prescription);
        }
        this.editPrescription = null;
      } else {
        if (prescription != null) {
          this.prescriptions.push(prescription);
        }
      }
      this.dialog = false;
    },
    delete_prescription: function (prescription) {
      var index = this.prescriptions.indexOf(prescription);
      this.prescriptions.splice(index, 1);
      this.delete_dialog = false;
      this.delete_obj = null;
    },
  },
};
</script>
