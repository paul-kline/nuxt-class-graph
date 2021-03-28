<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" style="min-width:11.8em" />
      <v-tabs align-with-title>
        <v-tab v-for="item in items" :key="item.title" :to="item.to">{{
          item.title
        }}</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-container>
        <keep-alive>
          <nuxt keep-alive />
        </keep-alive>
      </v-container>
    </v-main>

    <v-footer app>
      <span>PaulKlineLabs &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "mdi-apps",
          title: "Graph",
          to: "/"
        },
        {
          icon: "mdi-about",
          title: "About",
          to: "/about"
        }
      ],

      title: "Course Dependency Graph"
    };
  }
};
</script>
