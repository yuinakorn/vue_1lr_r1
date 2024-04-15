<template>
  <footer class="main-footer">
    <strong>Copyright &copy; {{ this.year }} <a href="https://cmhis.org">iHIMS</a>.</strong>
    All rights reserved.
    <div class="float-right d-none d-sm-inline-block">
<!--      Theme by <a href="https://adminlte.io/">AdminLTE</a> <b>Version</b> 3.1.0-->
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooTer",
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};

</script>

<style>

</style>