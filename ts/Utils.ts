import courses from "./courses.json";
type CourseMaster = {
  department: string;
  number: number;
  type: string;
  name: string;
  division: string;
  credits: number;
  description: string;
  prereqFormula: string;
  coreqFormula: string;
  prereqTree: any;
  coreqTree: any;
  id: string; //this field is simply concatenation of department and number.
};
let _courses: CourseMaster[] | undefined = undefined;
function getCourses(): CourseMaster[] {
  if (!_courses) {
    _courses = courses as CourseMaster[];
  }
  return _courses;
}

export { getCourses, CourseMaster };
