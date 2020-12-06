<template>
  <v-card class="dxa_modal">
    <v-card-title>
      <h4>
        Are you sure you want to delete {{ name != null ? name.concat("?") : "?" }}
      </h4>
    </v-card-title>
    <v-card-text>
      <v-card-actions>
        <v-btn
          color="success"
          min-width="100"
          :loading="loading"
          @click="delete_click"
          >{{ $t("ok") }}</v-btn
        >
        <v-btn
          color="red"
          min-width="100"
          @click="$emit('close')"
          >{{ $t("cancel") }}</v-btn
        >
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>

<script>
export default {
  name: "DeleteConfirmationModal",
  data: () => ({
    loading: false,
    confirmed: false,
  }),

  async created() {
    this.loading = false;
  },
  computed: {},
  methods: {
    delete_click: function () {
      this.loading = true;
      this.$emit("delete", this.obj);
    },
  },
  props: {
    obj: Object,
    name: String,
  },
};
</script>
