<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import DefaultLayout from "./dashboard/DefaultLayout.vue";
import LoginLayout from "@/dashboard/LoginLayout.vue";

export default {
  name: "App",
  components: {
    DefaultLayout,
    LoginLayout
  },
  computed: {
    layout() {
      // determine which layout to use based on the current route or application state
      // for example:
      return this.$route.path === '/login' ? 'LoginLayout' : 'DefaultLayout';
    },
    // layout() {
    //   const route = this.$route
    //   const defaultLayout = 'default-layout'
    //   const loginLayout = 'login-layout'
    //   if (route.meta.layout === loginLayout) {
    //     return loginLayout
    //   }
    //   return defaultLayout
    // }
  }
};
</script>

<style>
body {
  font-family: 'Kanit', sans-serif !important;
}

</style>
