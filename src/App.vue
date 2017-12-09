<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html,body{
  height: 100%;
  overflow:hidden;
}
#app {
  color: #2c3e50;
  min-height: 600px;
  height: 100%;
}
*{
  margin: 0;
  padding: 0;
}
</style>
