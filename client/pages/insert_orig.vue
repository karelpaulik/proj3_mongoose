<template>
    <div>
        <form @submit.prevent="send">
            <input v-model="fd.fName" placeholder="fName" />
            <input v-model="fd.lName" placeholder="lName" />
            <input v-model="fd.age" placeholder="age" />
            <q-editor v-model="fd.richText" min-height="5rem" />
        </form>
        <button @click="send">submit</button>    
    </div>
</template>
  
<script setup>
  import { ref, reactive }  from 'vue';

  const runtimeConfig = useRuntimeConfig()

  const fd = reactive({
    fName: '',
    lName: '',
    age: null,
    richText: ''
  })

  const { data, refresh } = await useFetch( () => '/player', {
    method: 'post',
    baseURL: runtimeConfig.public.baseURL,
    immediate: false,
    watch: false,
    body: fd
  });

  function send() {
    refresh();
  }  
</script>
  