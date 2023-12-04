<template>
    <div>
        <form @submit.prevent="send">
          <q-card>
            <input v-model="fd.fName" placeholder="fName" />
            <input v-model="fd.lName" placeholder="lName" />
            <input v-model="fd.age" placeholder="age" type="number"/>
            <q-editor v-model="fd.richText" min-height="5rem" />
            <!-- checkbox ano/ne -->
            <div><q-checkbox v-model="fd.isActive" label="isActive" /></div>
            <!-- checkbox array -->
            <q-checkbox v-model="fd.city" val="brno" label="Brno" />
            <q-checkbox v-model="fd.city" val="praha" label="Praha" />
            <q-checkbox v-model="fd.city" val="olomouc" label="Olomouc" />
            <div>city: {{ fd.city }}</div>
            <!-- select -->
            <q-select v-model="fd.prefColor" :options="['red', 'green', 'bluee']" label="prefColor" clearable outlined />
            <!-- radio -->
            <div>prefShape: {{ fd.prefShape }}</div>
            <div class="q-gutter-sm">
              <q-radio v-model="fd.prefShape" val="line" label="Line" />
              <q-radio v-model="fd.prefShape" val="rectangle" label="Rect" />
              <q-radio v-model="fd.prefShape" val="ellipse" label="Elipse" />
            </div>
            <!-- file/files -->
            <q-file v-model="fd.file" label="Standard" clearable outlined multiple />
          </q-card>
        </form>
        <button @click="send">submit</button>    
    </div>
</template>
  
<script setup>
  import { reactive }  from 'vue';

  const fd = reactive({
    //Pozor je rozdíl, jestli u stringu zadám jako počáteční hodnotu: '', nebo null
    //Pozor, stejně tak je rozdíl u čísla
    fName: '',
    lName: '',
    age: null,
    richText: '',
    isActive: false,  //důležité: určuje def. hodnotu. Pokud nebude true/false, ale bude '' tak bude hodnota nezadaná.
    city: [],
    prefColor: '',
    prefShape: '',
    file: null
  })

  // const { data, refresh } = await useFetch( () => '/player', {
  //   method: 'post',
  //   baseURL: 'http://localhost:5000',
  //   immediate: false,
  //   watch: false,
  //   body: fd
  // });

  async function send() {
    const formData = new FormData();

    for (const property in fd) {
      if ( Array.isArray(fd[property]) ) {    //Jestliže je nějaká vlastnost objektu typ "array"
        for (const item of fd[property]) {
          formData.append(property, item);
        }
      } 
      else {
        if (fd[property] !== null) {          //Jestliže hodnota vlastnosti není null
          formData.append(property, fd[property]);
        }
      } 
    }

    console.log(formData)

    const { data, refresh } = await useFetch( () => '/player', {
      method: 'post',
      baseURL: 'http://localhost:5000',
      immediate: false,
      watch: false,
      //body: formData
      body: fd
    });

    refresh();
  }  
</script>
  