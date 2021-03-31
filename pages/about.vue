<template>
  <div>
    <div>
      <h1>Background</h1>
      I built this tool after needing to find the entire prereq tree for a
      class. In typical computer scientist fashion, we like to "spend 10 hours
      automating a 5 minute task."
      <p>
        The first step was to harvest all course information listed in the
        portal CourseMaster page. This is now part of the
        <a
          href="https://chrome.google.com/webstore/detail/cams-helper/nohnkhiaaclbbanceebnjbmchpmjgffn?hl=en-US"
          target="_blank"
          >Cams Helper extension</a
        >
        so that future changes can easily be reflected here. At the time of this
        writing, there are 518 Blackburn courses. After all course information
        was harvested, the co and prerequisite formulas were tokenized. Tokens
        include brackets and parentheses, a course, a course with gpa
        requirement, a major requirement, a class standing requirement, "AND",
        "OR", number of credits from a list of classes, and a number of credits
        from a range of classes with or without a GPA requirement (Ranges get
        interpolated at time of render). Tokens are then parsed using a
        variation of the
        <a
          href="https://en.wikipedia.org/wiki/Shunting-yard_algorithm"
          target="_blank"
          >Shunting-yard algorithm</a
        >
        using the AND/OR operators and the location of parentheses. The co/pre
        req parse trees are attached to the course master data which is embedded
        in this application. The render method handles flattening AND/OR parse
        trees to avoid superfluous dis/con junctions.
      </p>
    </div>

    <div>
      Errors in requirements are the fault of incorrect requirements (usually
      lack of parentheses) listed in the portal from where they were harvested.
      Errors in layout are due to the visjs graph layout algorithm, which I
      agree are frustrating, but I'm not about to write my own network graph
      library. Sometimes, you may prefer to move things in the 'fluid' layout to
      avoid overlaps, then change to the hierarchical layout.
    </div>
    <div>
      <h1>Usage</h1>
      <h3>Finding a course</h3>
      <p>
        In the text box, start typing the department code followed by (no space)
        the course number to select a course for which you wish to view the
        pre/co reqs. You may also filter by the title of the course if the
        dept/course number is not known.
      </p>
      <h3>Limiting size</h3>
      <p>
        By default, the dependency graph displayed is recursive-- that is to
        say, all the pre/co reqs for all pre/co reqs (and so on and so forth)
        are also displayed. Sometimes, this can become unwieldy (as it is with
        ED422 for example, which has a large list of classes). Therefore, you
        have the option on the right hand side to select "Direct Requirements
        only" which will only list the immediate class requirements in the
        co/pre reqs.
      </p>
      <h3>Fit-to-screen</h3>
      <p>
        At any time, the 'stabilize' button will stop any animation and ensure
        the entire graph is optimally displayed within the window.
      </p>
      <h3>Re-arranging</h3>
      <p>
        An alternative graph view can be employed by clicking the 'fluid layout'
        button. This physics simulation tries to space everything equally
        repulsively. Sometimes, you may prefer to move things in this layout to
        avoid overlaps, then change to the hierarchical layout.
      </p>
      <div>
        <h1>Layout</h1>
        <h3>Arranging</h3>
        <p>
          Scrolling up or down will zoom in/out. You may also click and drag the
          background to move about, as well as click and drag nodes (if in fluid
          layout) to move them. (see re-arranging section above).
        </p>
        <h3>Interpretting shapes</h3>
        <p>
          The selected course will appear white in the graph. All courses are
          circles. Co and pre requisite edges are labeled. If there are multiple
          requirements for a requisite, an upward pointing triangle (similar to
          conjuction '/\') connects them. If there is a choice requisite
          (commonly 'x' credits from list of classes, or sophomore standing or
          above, for example), a downward pointing triangle (similar to
          disjuction '\/') joins them.
        </p>
        <p>Class standing or Major requirements are drawn in boxes.</p>
        <h3>Course Information</h3>
        <p>
          Additional course information like credits, course name, and
          description will be displayed when a course node is hovered over or
          clicked on.
        </p>
        <p>
          Sometimes, a course is listed both as a pre-req and a co-req, so for
          clarification, be sure to hover over the course node to read the
          description.
        </p>
      </div>
      <a href="https://github.com/paul-kline/nuxt-class-graph" target="_blank"
        >Source code</a
      >
    </div>
  </div></template
>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>
<style></style>
