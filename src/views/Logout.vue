<template>
  <div>
    <h3>logging out...</h3>
  </div>
</template>

<script>
import {useRouter} from 'vue-router';

export default {
  name: "LogOut",
  mounted() {
    console.log('logouttttt')
    this.logout();
  },
  methods: {
    logout() {
      // authService.logout();
      localStorage.removeItem('token'); // remove the token from LocalStorage
      const router = useRouter();
      // from LINE
      if(this.$route.query.path && this.$route.query.hcode && this.$route.query.an && this.$route.query.cid) {
        router.push('/login?path=patient&hcode='+this.$route.query.hcode+'&an='+this.$route.query.an+'&cid='+this.$route.query.cid);
      } else {
        router.push('/login');
      }
      // router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>