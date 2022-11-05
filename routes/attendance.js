const express = require('express');
const router = express.Router();
const db = require('../db/database').getDatabase();
const tables = require('../db/tables');
const { validateStudent } = require('../db/models');
// const attendance = tables.tableNames.attendance;

router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM attendance`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/attendance.ejs", { attendance: rows });
    });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const sqlQuery = `SELECT * FROM ${tables.tableNames.student} WHERE ${tables.studentColumns.id} = ?`;
    db.get(sqlQuery, [req.params.id], (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        if (!rows) {
            return res.status(404).send({
                message: "A student with the requested ID was not found."
            });
        }
        // return res.send(rows);
        res.render("../FrontEnd/studentById.ejs", { attendance: rows });
    });
});

router.post("/", (req, res) => {

    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;
    const iid = req.body.instructor_id;
    const icoursea = req.body.course;



    db.get(`SELECT * FROM instructor WHERE id ='${iid}' and department_name = '${idept}'`, (errr, ro) => {
        if (errr) console.log(errr);
        else if (ro) {
            db.run(`
            insert into student ( name, total_credits, instructor_id, department_name , coursea , courseb ) values ('${iname}', ${icreds}, '${iid}', '${idept}','${icoursea}','${icourseb}');  
            `, (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: "An error occured while trying to save the student details"
                    });
                }
                // if (!rows) {
                //     // return res.status(404).send({
                //     //     message: "A student with the requested ID was not found."
                //     // });
                // }
            });

            db.run(`  insert into attendance (id, name, present, absent,course)
                      select student.id, '${iname}', 0, 0,coursea
                      from student 
                      where id = ( select max(id) from student);
            `, (err, rows) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: "An error occured while trying to save the student details"
                    });
                }
                // if (!rows) {
                //     // return res.status(404).send({
                //     //     message: "A student with the requested ID was not found."
                //     // });
                // }
            });



            res.redirect("/");
        } else return res.redirect("/instructors/lol");
    });


});

router.post("/:id/present", (req, res) => {
    // const ip = req.body.present;
    // const ia = req.body.absent;
    const icourse = req.body.course;
    const iid = req.params.id;
    console.log("id is " + iid);
    console.log("course/ is " + icourse);
    const sqlQuery = `
    UPDATE ${tables.tableNames.attendance}
    SET present = present + 1 , absent = absent + 1
    WHERE ${tables.attendanceColumns.id} = ? and  ${tables.attendanceColumns.course}='${icourse}'; `
        // const sqlQuery = `
        // update attendance 
        // set present = present+1,absent=absent+1 where id==? `;

    // db.run(sqlQuery, [req.params.id], (err) => {
    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to update this student."
            });
        }
    });
    res.redirect(`/sections/${icourse}/idcoursestd`);
})

router.post("/:id/absent", (req, res) => {
    // const ia = req.body.absent;
    // const sqlQuery = `
    // UPDATE ${tables.tableNames.attendance}
    // SET absent = ${ia}+1 
    // WHERE ${tables.attendanceColumns.id} == ?`
    const icourse = req.body.course;
    // const iid = req.params.id;
    const sqlQuery = `
    update attendance set  absent=absent+1 where id==? `;

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to update this student."
            });
        }
    });
    res.redirect(`/sections/${icourse}/idcoursestd`);
    // res.redirect(`/sections/${icourse}/idcoursestd`);
})

module.exports = router;