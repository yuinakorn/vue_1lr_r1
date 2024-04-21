<template>
  <footer class="main-footer">
    <strong>Copyright &copy; {{ this.year }} <a>iHIMS</a>.</strong>
    All rights reserved.
    <div class="float-right d-none d-sm-inline-block">
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