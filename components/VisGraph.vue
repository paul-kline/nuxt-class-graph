<template>
  <div>
    VisGraph works
    <v-autocomplete
      item-value="id"
      :item-text="e => e.id + ' ' + e.name"
      :items="courses"
      :value="selectedCourseID"
      @change="selectionChanged"
    ></v-autocomplete>
    <div id="cy"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as vis from "vis-network";
import * as visdat from "vis-data";
import { CourseMaster, CourseMaster } from "~/ts/Utils";
type Op = "AND" | "OR";
type Ls = "Range" | "List";
type List = { credits: number; ls: string[]; gpa?: number; type: Ls };
type Conj = { op: Op; left: Req; right: Req };
type Req = string | Conj | Course | List;
type Course = { course: string; gpa: number };
function isCourse(x: Course | Conj | List): x is Course {
  return (x as Course).course !== undefined;
}
function isList(x: Course | Conj | List): x is List {
  return (x as List).credits !== undefined;
}
let currentCourse: CourseMaster | null = null; //I know this is naughty but I really really need this to prevent ranges from repeating itself as dependency.
let network: vis.Network | null = null;
const SHAPES = {
  prereq: "text",
  coreq: "text",
  course: "circle",
  major: "box",
  level: "box",
  conjuction: "triangle",
  disjuction: "triangleDown"
};
@Component
export default class VisGraph extends Vue {
  @Prop() course!: CourseMaster;
  @Prop() courses!: CourseMaster[];

  nodes: visdat.DataSet<any, "id"> | null = null;

  edges: visdat.DataSet<any, "id"> | null = null;
  selectedCourseID: string = "";
  selectedCourse: CourseMaster | undefined = undefined;
  findCourse(id: string, courses = this.courses): CourseMaster | undefined {
    return courses.find(c => c.id == id);
  }
  selectionChanged(e: string) {
    this.selectedCourse = this.findCourse(e);
    const c = this.selectedCourse;
    if (!c) {
      console.error("impossible! class e did not exist:", e);
      return;
    }
    if (this.nodes && this.edges) {
      this.nodes.clear();
      console.log("selectedCourse", c, c?.prereqTree, c?.coreqTree);
      //@ts-ignore
      c.shape = SHAPES.course;
      const [nodes, edges] = this.mkNodesAndEdgesFor(c);
      //@ts-ignore
      c.color = "white";
      this.nodes.add(c);
      const ns = this.nodes;
      nodes.forEach(n => {
        ns.add(n);
      });
      this.edges.clear();
      const eds = this.edges;

      edges.forEach(e => {
        eds.add(e);
      });

      // console.log(
      //   "finished adding edges and nodes",
      //   this.nodes.getIds(),
      //   this.edges.getDataSet().map(x => x)
      // );
      (window as any).graph = network;
      (window as any).edges = this.edges;
      if (this.nodes && this.edges) {
        // console.log("setting data");
        // this.network?.setData({ nodes: this.nodes, edges: this.edges });
      }
    }
  }
  mkNodesAndEdgesFor(
    c: CourseMaster,
    nodes: any[] = [],
    edges: any[] = []
  ): [any[], any[]] {
    currentCourse = c; //I know this is naughty, but I really really need it for not duplicating list occurances in ranges.
    if (c.prereqTree) {
      console.log(
        "prereq exists for class:",
        c.id,
        "Formula: ",
        c.prereqFormula,
        "obj",
        c.prereqTree
      );
      //initialize prereqs.
      const prereqNode = {
        id: "prereq" + c.id,
        label: "PREREQS",
        shape: SHAPES.prereq
      };
      if (!nodes.find(x => x.id == "prereq" + c.id)) {
        const preReqEdge = {
          from: c.id,
          to: "prereq" + c.id
        };
        nodes.push(prereqNode);
        edges.push(preReqEdge);
      }
      [nodes, edges] = this.processReqTree(
        c.prereqTree,
        prereqNode,
        true,
        true,
        nodes,
        edges
      );
    }
    if (c.coreqTree) {
      console.log("COreq exists for class:", c.id, "formula: ", c.coreqFormula);
      //initialize coreqs.
      const coreqNode = {
        id: "coreq" + c.id,
        label: "COREQS",
        shape: SHAPES.coreq
      };
      if (!nodes.find(x => x.id == "coreq" + c.id)) {
        const coReqEdge = {
          from: c.id,
          to: "coreq" + c.id
        };
        nodes.push(coreqNode);
        edges.push(coReqEdge);
      }

      [nodes, edges] = this.processReqTree(
        c.coreqTree,
        coreqNode,
        false,
        true,
        nodes,
        edges
      );
    }
    return [nodes, edges];
  }
  processReqTree(
    req: Req,
    src: any,
    isPreReq: boolean,
    isAnd: boolean = true,
    nodes: any[] = [],
    edges: any[] = []
  ): [any[], any[]] {
    // console.log("nodes, edges", nodes, edges);
    // console.log("processing req:", req);
    function addEdge(from: string, to: string) {
      // console.log("adding edge", from, to);
      if (edges.find(x => x.from == from && x.to == to)) {
        // console.log("REFUSING TO ADD EDGE AGAIN:", from, to);
        return;
      }
      edges.push({
        from: from,
        to: to,
        // label: isPreReq ? "PRE" : "CO",
        color: isAnd ? "red" : "green",
        width: 2
      });
    }
    function addNode(id: string, label: string, shape: string) {
      if (nodes.find(x => x.id == id)) {
        // console.log("REFUSING TO ADD NODE (EXISTS) " + id);
      } else {
        nodes.push({
          id: id,
          label: label,
          shape: shape,
          group: isPreReq ? "prereq" : "coreq"
        });
      }
    }
    if (typeof req == "string") {
      //level req, single class no gpa req, major req.
      if (req.startsWith("Level")) {
        //it is a level req.
        if (!nodes.find(x => x.id == req)) {
          addNode(req, req, SHAPES.level);
        }
        addEdge(src.id, req);

        return [nodes, edges];
      } else if (req.startsWith("Major")) {
        //it is a major req.
        if (!nodes.find(x => x.id == req)) {
          addNode(req, req, SHAPES.major);
        }
        addEdge(src.id, req);

        return [nodes, edges];
      } else {
        //it is a class req with no gpa.
        if (!nodes.find(x => x.id == req)) {
          addNode(req, req, SHAPES.course);
        }
        addEdge(src.id, req);

        const c = this.findCourse(req);
        if (c) {
          return this.mkNodesAndEdgesFor(c, nodes, edges);
        } else {
          console.error("I expected to find class but I didn't. ID was: ", c);
          return [nodes, edges];
        }
      }
    } else if (isCourse(req)) {
      // console.log("REQ IS: ", req);
      //if course prop exists, this is {course:str,gpa:num};
      if (!nodes.find(x => x.id == req.course)) {
        addNode(req.course, req.course + "\ngpa: " + req.gpa, SHAPES.course);
      }
      addEdge(src.id, req.course);

      const c = this.findCourse(req.course);
      if (c) {
        return this.mkNodesAndEdgesFor(c, nodes, edges);
      } else {
        console.error(
          "I expected to find class in isCourse(req) but I didn't. ID was: ",
          req.course
        );
        return [nodes, edges];
      }
    } else if (isList(req)) {
      const origID = src.id;
      const id = src.id + req.credits + req.ls[0] + "LS";
      const src2 = {
        id: id,
        label:
          "" +
          req.credits +
          " credits from" +
          (req.gpa ? " (GPA: " + req.gpa + ")" : "")
      };
      addNode(src2.id, src2.label, SHAPES.major);
      addEdge(src.id, src2.id);
      src = src2;
      let ls;
      if (req.type == "List") {
        ls = req.ls;
      } else {
        //it's a range, I have a whole bunch to get.

        const l = req.ls[0].match(/([A-Z]+)(\d+)/) as any[];
        const dept = l[1];
        const lowest = Number.parseInt(l[2], 10);
        const h = req.ls[req.ls.length - 1].match(/([A-Z]+)(\d+)/) as any[];
        const highest = Number.parseInt(h[2], 10);
        ls = this.courses
          .filter(
            x =>
              x.department == dept &&
              x.number >= lowest &&
              x.number <= highest &&
              (currentCourse ? x.id != currentCourse.id : true)
          )
          .map(x => x.department + x.number);
      }
      console.log("origID", origID, "list contains", ls);
      ls.forEach(c => {
        const cc = this.findCourse(c);
        addNode(c, c, SHAPES.course);
        addEdge(src.id, c);
        if (cc) {
          [nodes, edges] = this.mkNodesAndEdgesFor(cc, nodes, edges);
        } else {
          console.error(
            "this shouldn't be possible. couldn't find course: ",
            c
          );
        }
      });
      return [nodes, edges];
    } else {
      //req is conjuction
      const isAnd2 = req.op == "AND";
      if (isAnd2) {
        if (src.id.endsWith("AND")) {
          //then keep it.
        } else {
          const src2 = { id: src.id + "AND", label: "ALL" };
          addNode(src2.id, src2.label, SHAPES.conjuction);
          addEdge(src.id, src2.id);
          src = src2;
        }
      } else {
        //it is OR.
        if (src.id.endsWith("OR")) {
          //then keep it.
        } else {
          const src2 = { id: src.id + "OR", label: "ONE OF" };
          addNode(src2.id, src2.label, SHAPES.disjuction);
          addEdge(src.id, src2.id);
          src = src2;
        }
      }

      //
      [nodes, edges] = this.processReqTree(
        req.left,
        src,
        isPreReq,
        isAnd2,
        nodes,
        edges
      );
      [nodes, edges] = this.processReqTree(
        req.right,
        src,
        isPreReq,
        isAnd2,
        nodes,
        edges
      );
      return [nodes, edges];
    }
  }
  mounted() {
    console.log("mounted");
    // console.log("vis-network", vis);
    // console.log("vis-dat", visdat);
    console.log(this.course, this.courses);
    (window as any).courses = this.courses;
    console.log(
      "courese with lists",
      this.courses.filter(x =>
        (x.prereqFormula + x.coreqFormula).includes("From")
      )
      // .map(
      //   x =>
      //     x.department +
      //     x.number +
      //     "\n" +
      //     x.prereqFormula +
      //     "\n" +
      //     x.coreqFormula
      // )
    );
    this.courses.forEach(c => {
      (c as any).label = c.department + " " + c.number;
      // if (c.prereqTree) {
      //   console.log(c.prereqTree);
      // }
      // if (c.coreqTree) {
      //   console.log(c.coreqTree);
      // }
    });
    this.mkNetwork();
  }

  mkNodes(): any[] {
    return this.courses.filter(x => x.department == "CS");
  }
  mkNetwork() {
    // var nodes = new visdat.DataSet([
    //   { id: 1, label: "Node 1" },
    //   { id: 2, label: "Node 2" },
    //   { id: 3, label: "Node 3" },
    //   { id: 4, label: "Node 4" },
    //   { id: 5, label: "Node 5" }
    // ]);
    this.nodes = new visdat.DataSet(this.mkNodes());

    // create an array with edges
    //@ts-ignore
    // var edges = new visdat.DataSet([
    //   { from: 1, to: 3 },
    //   { from: 1, to: 2 },
    //   { from: 2, to: 4 },
    //   { from: 2, to: 5 }
    // ]);

    this.edges = new visdat.DataSet([]);
    // create a network
    var container = document.getElementById("cy");

    // provide the data in the vis format
    var data = {
      nodes: this.nodes,
      edges: this.edges
    };
    var options = {};

    // initialize your network!
    //@ts-ignore
    network = new vis.Network(container, data, options);
  }
}
</script>
<style>
#cy {
  width: 80vw;
  height: 70vh;
  display: block;
  border: 1px;
  border-style: solid;
  background: grey;
}
</style>
