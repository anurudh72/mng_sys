module.exports.tableNames = {
    department: "department",
    student: "student",
    section: "section",
    instructor: "instructor",
    attendance: "attendance",
    password: "password"

};

module.exports.deptColumns = {
    deptName: "deptName",
    building: "building",
    budget: "budget"
};

module.exports.instructorColumns = {
    id: "id",
    name: "name",
    salary: "salary",
    department_name: "department_name",

};

module.exports.studentColumns = {
    id: "id",
    name: "name",
    total_credits: "total_credits",
    instructor_id: "instructor_id",
    department_name: "department_name",
    coursea: "coursea",
    courseb: "courseb"
};

module.exports.sectionColumns = {
    id: "id",
    semester: "semester",
    year: "year",
    instructor_id: "instructor_id",
    credits: "credits"
};


module.exports.attendanceColumns = {
    id: "id",
    course: "course",
    present: "present",
    absent: "absent"
};
module.exports.passwordColumns = {
    course: "course",
    user: "user",
    pass: "pass"
};