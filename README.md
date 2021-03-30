
# nuxt-class-graph
## About
Project is live here: http://coursegraph.pauliankline.com/

Custom Courses can be used in this project so long as the course data conforms to the following:
* Each course is expected to have type CourseMaster:
```js
type CourseMaster = {
  department: string; //required
  number: number; //required
  type: string; //not used
  name: string; //required
  division: string; //not used
  credits: number; //required
  description: string; //required (empty str if no description exists)
  prereqFormula: string; //required to exist, but not needed to be accurate. "" indicates empty prereqTree. non-empty indicates prereqTree exists.
  coreqFormula: string; //same as for prereqFormula.
  prereqTree: any; //null if no pre reqs exist
  coreqTree: any; //null if no co reqs exist
  id: string; //this field is simply concatenation of department and number.
};
```

This is straightforward, except the types of the prereqTree and coreqTree which are lazily listed as any. In reality, they must conform to this type 'Req':
```js
type Req = string | Conj | Course | List; //string type is simply a course ID with no GPA requirement
type Conj = { op: Op; left: Req; right: Req };
type Op = "AND" | "OR";
type Course = { course: string; gpa: number };
type List = { credits: number; ls: string[]; gpa?: number; type: Ls };
type Ls = "Range" | "List";
```
Here is an example instance of CourseMaster:
```js
{
    "department": "CS",
    "number": 220,
    "type": "LEC",
    "id": "CS220",
    "name": "SOFTWARE AND INFORMATION SYSTEMS",
    "division": "NATURAL SCIENCE",
    "credits": 3,
    "description": "User-centered software development and professional practice with particular emphasis on the structure and use of information systems. Topics will include the software lifecycle, design and architectural patterns, the relational database model and its implementation, and a study of database design and normalization. Prerequisites: CS 210, CS 212.",
    "prereqFormula": "CS210LEC AND CS211LEC GPA .67",
    "prereqTree": {
        "op": "AND",
        "left": "CS210",
        "right": {
            "course": "CS211",
            "gpa": 0.67
        }
    },
    "coreqFormula": "",
    "coreqTree": null,
}
```

You may notice that the suffix LEC or LAB has been stripped from course titles in the req Trees. This is because of inconsistent usage from the original source for which this project was initially created and harvested data from (the portal of Blackburn College).
## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
