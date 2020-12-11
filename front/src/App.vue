<template>
  <router-view />
</template>

<script>
  import Service from "@/services/Service";
  export default {
    name: 'App',
    data: () => ({
      client: new Service(),
    }),
  }
</script>
