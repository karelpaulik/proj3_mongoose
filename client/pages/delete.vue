<template>
    <div>
      <input v-model="pk" placeholder="PK of record" @keydown.enter="del">
      <pre>{{ data }}</pre>
    </div>
</template>
  
<script setup>
  import { ref }  from 'vue';

  const runtimeConfig = useRuntimeConfig()
  const pk = ref('')

  const { data, refresh } = await useFetch( () => '/player/' + pk.value, {
    method: 'delete',
    baseURL: runtimeConfig.public.baseURL,
    immediate: false,
    watch: false
  });

  function del() {
    refresh();
  }
  
</script>