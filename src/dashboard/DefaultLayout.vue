<template>
  <div>
    <!--    <Preloader/>-->
    <Navbar />
    <Sidebar />
    <div class="content-wrapper">
      <!-- <section class="content"> -->
      <div class="container-fluid fixed-height-container">
        <slot />
      </div>
      <!-- </section> -->
    </div>
    <!-- <Footer /> -->
    <ControlSidebar />
  </div>
</template>

<script>
import $ from 'jquery'
import "admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css"
import "admin-lte/plugins/select2/css/select2.min.css"

// import Preloader from "./PreLoader.vue"
import Navbar from "./NavBar.vue";
import Sidebar from "./SideBar.vue";
// import Footer from "./FooTer.vue";
import ControlSidebar from "./ControlSidebar.vue"
import "../assets/css/style.css"
export default {
  name: "DefaultLayout",
  components: {
    // Preloader,
    Navbar,
    Sidebar,
    // Footer,
    ControlSidebar
  },
  created() {
    // $('.sidebar-mini').addClass('sidebar-collapse');
  },
  methods: {
    initializeSelect2() {
      //Initialize Select2 Elements
      $(".select2").select2();

      //Initialize Select2 Elements
      $(".select2bs4").select2({
        theme: "bootstrap4",
      });
    },
  },
}
</script>

<style scoped>
.fixed-height-container {
  height: 94vh;
  overflow-y: auto;
  /* Add scrollbar if content overflows vertically */
}
</style>