<template>
    <div>
      <input v-model="pk" placeholder="PK of record" @keydown.enter="del">
      <pre>{{ data }}</pre>
    </div>
</template>
  
<script setup>
  import { ref }  from 'vue';

  const pk = ref('')

  const { data, refresh } = await useFetch( () => '/player/' + pk.value, {
    method: 'delete',
    baseURL: 'http://localhost:5000',
    immediate: false,
    watch: false
  });

  function del() {
    refresh();
  }
  
</script>