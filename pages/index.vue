<template>
  <VisGraph :course="course" :courses="courses" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { getCourses } from "~/ts/Utils";

console.log("added event listener to window");
// import CytoGraph from "~/components/CytoGraph.vue";
import VisGraph from "~/components/VisGraph.vue";
@Component({ components: { VisGraph } })
export default class Index extends Vue {
  courses = getCourses();
  course = this.courses[Math.floor(Math.random() * this.courses.length)];
  mounted() {
    console.log("courses are", getCourses());
    window.addEventListener(
      "message",
      event => {
        if (event.origin !== "https://portals.blackburn.edu") {
          console.log("rejected origin", event);
          return;
        }
        const data = event.data;
        console.log("message received: ", event);
        data.courses.forEach((c: any) => {
          (c as any).label = c.department + " " + c.number;
        });
        console.log("setting courese to", data.courses);
        this.courses = data.courses;

        // ...
      },
      false
    );
    setTimeout(() => {
      if (!window.opener) return;
      window.opener.postMessage("I'm readyydy", "*");
    }, 0);
  }
}
</script>
<style></style>
