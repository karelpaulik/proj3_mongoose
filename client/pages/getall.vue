<template>
    <div>
      <pre>{{ data }}</pre>
      <div v-for="rec in data" :key="rec.id" >
        <div>Id: {{ rec._id }}</div>
        <div>fName: {{ rec.fName }}</div>
        <div>lName: {{ rec.lName }}</div>
        <div style=""><b>Full name: </b> {{ `${rec.fName} ${rec.lName}` }}</div>
        <div v-if="rec.age">age: {{ rec.age }}</div>
        <!-- Následující platilo pro: na serveru: { raw: true } -->
        <!-- <div>city(parsed): {{ JSON.parse(rec.city) }}</div>
        <div v-for="c in JSON.parse(rec.city)">
          city: {{ c }}
        </div> -->
        <div v-if="rec.city">city: {{ rec.city }}</div>
        <div v-for="c in rec.city">
          city: {{ c }}
        </div>
        <div v-if="rec.files">
          <div v-for="file in rec.files">
            <img :src="`http://localhost:5000/${file.path}`" width="400">
          </div>
        </div>
        <hr>
      </div>
    </div>
  </template>
  
  <script setup>

  const { data } = await useFetch('/player', {
    method: 'get',
    baseURL: 'http://localhost:5000'
    //change from home
  });

  console.log(data);
  
  </script>
  