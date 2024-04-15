<template>
  <h3>This is backend</h3>
  <p>{{ hcode }}</p>
  <div class="container-fluid">
    <form @submit.prevent="submitForm">
      <label for="admit_date">กรอกข้อมูล</label>
      <input type="text" class="form-control" v-model="hcode" name="hcode" placeholder="hcode">
      <input type="text" class="form-control" v-model="cid" name="cid" placeholder="cid">
      <input type="text" class="form-control" v-model="an" name="an" placeholder="an">
      <input type="text" class="form-control" v-model="fname" name="fname" placeholder="ชื่อ">
      <input type="submit" class="btn btn-success" value="บันทึก">
    </form>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  name: "CreateAdmit",
  data() {
    return {
      hcode: '',
      cid: '',
      an: '',
      fname: '',
    }
  },
  mounted() {

  },
  methods: {
    async submitForm() {
      const formData = {
        hcode: this.hcode,
        cid: this.cid,
        an: this.an,
        fname: this.fname,
      }
      const options = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const encodedFormData = qs.stringify(formData)

      await axios.post("http://localhost:3003/admit/", encodedFormData, options)
          .then(response => {
            let data = response.data
            this.hcode = data.hcode
            console.log(data.status)
          })
          .catch(error => {
            console.log(error)
          })

    }
  }
}
</script>

<style scoped>

</style>