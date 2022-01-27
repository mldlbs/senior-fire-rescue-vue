<template>
  <div><router-view :key="key" /></div>
</template>
<script>
export default {
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>
