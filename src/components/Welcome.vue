<template>
  <div class="bgc">
    <span>Welcome</span>
  </div>
</template>
      
<script>
export default {
  name: 'Welcome',
}
</script>
      
<style scoped>
.bgc {
  height: 100%;
  margin: 0;
  padding: 0;
  background-image: linear-gradient(to right, #005aa7
, #6dd5fa, #ffffff);
}
span {
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  color: transparent;
  text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.6),
    0px 4px 4px rgba(0, 0, 0, 0.05);
  letter-spacing: 0.2rem;
}
</style>