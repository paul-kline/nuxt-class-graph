<template>
  <div>
    cytoGraph works
    <div id="cy"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CourseMaster } from "~/ts/Utils";
import cytoscape from "cytoscape";
//@ts-ignore
// import popper from "cytoscape-popper";
// cytoscape.use(popper);
@Component
export default class CytoGraph extends Vue {
  @Prop() course!: CourseMaster;
  @Prop() courses!: CourseMaster[];
  cy: cytoscape.Core | null = null;

  mounted() {
    console.log("mounted");
    console.log(this.course, this.courses);
    (window as any).cytoscape = cytoscape;
    // setTimeout(() => {
    console.log("in settimeout");
    this.cy = cytoscape({
      container: document.getElementById("cy"), // container to render in

      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: "a" }
        },
        {
          // node b
          data: { id: "b" }
        },
        {
          // edge ab
          data: { id: "ab", source: "a", target: "b" }
        }
      ],

      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            "background-color": "#666",
            label: "data(id)"
          }
        },

        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier"
          }
        }
      ],

      layout: {
        name: "grid",
        rows: 1
      }
    });
    console.log(this.cy);
    // }, 3000);

    console.log("cy is", this.cy, cytoscape);
  }
}
</script>
<style>
#cy {
  width: 90vw;
  height: 85vh;
  display: block;
  border: 1px;
  border-style: solid;
  background: grey;
}
</style>
