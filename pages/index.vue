<template>
  <CytoGraph :course="course" :courses="courses" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { getCourses } from "~/ts/Utils";
import CytoGraph from "~/components/CytoGraph.vue";
@Component({ components: { CytoGraph } })
export default class Index extends Vue {
  courses = getCourses();
  course = this.courses[Math.floor(Math.random() * this.courses.length)];
  mounted() {
    console.log("courses are", getCourses());
  }
}
</script>
<style></style>
