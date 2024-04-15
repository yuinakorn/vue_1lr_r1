<template>
  <!-- Preloader -->
  <div
      class="preloader flex-column justify-content-center align-items-center"
  >
    <img
        class="animation__fade"
        src="../assets/img/pulse.png"
        alt="AdminLTELogo"
        height="200"

    />
  </div>
</template>

<script>
export default {}
</script>

<style>
.animation__fade {
  opacity: 0;
  animation: fade 2s ease-in-out infinite;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>