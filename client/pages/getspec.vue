<template>
    <div>
      <input v-model="pk" placeholder="PK of record" @keydown.enter="send">
      <pre>{{ data }}</pre>
      <!-- <pre>{{ dtUpdate }}</pre> -->
      <!-- <div v-if="data" v-html="data.richText"></div> -->
      <div v-if="data">
        <q-editor v-model="data.richText" 
          :definitions="{
            upload: {
              tip: 'Upload',
              icon: 'cloud_upload',
              label: 'Upload',
              handler: update
            }
          }"
          :toolbar="[
            ['bold', 'italic', 'strike', 'underline'],
            ['undo', 'redo'],
            ['upload'],
            ['viewsource']
          ]"
        />
        <hr>
        
        <div v-if="data.files">
          <div v-for="file in data.files">
            <img :src="`${runtimeConfig.public.baseURL}/${file.path}`" width="400">
          </div>
        </div>

      </div>     
    </div>
</template>
  
<script setup>
  import { ref }  from 'vue';

  const runtimeConfig = useRuntimeConfig()
  const pk = ref('')

  //const { data, refresh } = await useFetch( `/player/${pk.value}`, {  //Toto nefunguje
  const { data, refresh } = await useFetch( () => '/player/' + pk.value, {  
    method: 'get',
    baseURL: runtimeConfig.public.baseURL,
    immediate: false,
    watch: false
  });

  const { data: dtUpdate, refresh: rfUpdate } = await useFetch( () => '/player/' + pk.value, {
    method: 'put',
    baseURL: runtimeConfig.public.baseURL,
    immediate: false,
    watch: false,
    body: data
  });

  function send() {
    refresh();
  }

  function update() {
    rfUpdate();
  }
</script>
  