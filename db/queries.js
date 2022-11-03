const tables = require('./tables');

const tableNames = tables.tableNames;
const deptColumns = tables.deptColumns;
const createDeptSql = `CREATE TABLE IF NOT EXISTS ${tableNames.department}(
        ${deptColumns.deptName} TEXT PRIMARY KEY NOT NULL,
        ${deptColumns.building} TEXT NOT NULL,
        ${deptColumns.budget} INTEGER NOT NULL
    );`

const instructorColumns = tables.instructorColumns;
const createInstructorSql = `CREATE TABLE IF NOT EXISTS ${tableNames.instructor}(
        ${instructorColumns.id} INTEGER PRIMARY KEY NOT NULL,
        ${instructorColumns.name} TEXT NOT NULL,
        ${instructorColumns.salary} INTEGER NOT NULL,
        ${instructorColumns.department_name} TEXT,
        FOREIGN KEY (${instructorColumns.department_name}) REFERENCES ${tableNames.department}(${deptColumns.deptName})
    );`

const studentColumns = tables.studentColumns;
const createStudentsSql = `CREATE TABLE IF NOT EXISTS ${tableNames.student}(
        ${studentColumns.id} INTEGER PRIMARY KEY NOT NULL,
        ${studentColumns.name} TEXT NOT NULL,
        ${studentColumns.total_credits} INTEGER NOT NULL,
        ${studentColumns.instructor_id} INTEGER,
        ${studentColumns.department_name} TEXT,
        FOREIGN KEY(${studentColumns.instructor_id}) REFERENCES ${tableNames.instructor}(${instructorColumns.id}),
        FOREIGN KEY(${studentColumns.department_name}) REFERENCES ${tableNames.department}(${deptColumns.deptName})
    );`


const sectionColumns = tables.sectionColumns;
const createSectionsSql = `CREATE TABLE IF NOT EXISTS ${tableNames.section}(
    ${sectionColumns.id} TEXT PRIMARY KEY NOT NULL,
    ${sectionColumns.semester} INTEGER NOT NULL CHECK(${sectionColumns.semester} <= 8),
    ${sectionColumns.year} INTEGER NOT NULL CHECK(${sectionColumns.year} <= 4)
)`;


const attendanceColumns = tables.attendanceColumns;
const createAttendanceSql = `CREATE TABLE IF NOT EXISTS ${tableNames.attendance}(
    ${attendanceColumns.id} INTEGER ,
    ${attendanceColumns.name} TEXT,
    ${attendanceColumns.present} INTEGER,
    ${attendanceColumns.absent} INTEGER
);`


module.exports = {
    createDepartments: createDeptSql,
    createInstructors: createInstructorSql,
    createStudents: createStudentsSql,
    createSections: createSectionsSql,
    createAttendance: createAttendanceSql
}