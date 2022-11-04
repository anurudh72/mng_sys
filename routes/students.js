const express = require('express');
const router = express.Router();
const db = require('../db/database').getDatabase();
const tables = require('../db/tables');
const { validateStudent } = require('../db/models');

router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.student}`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/students.ejs", { students: rows });
    });
});

router.get("/attendance", (req, res) => {
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

router.get("/create", function (req, res) {
    res.render("../FrontEnd/createStudent.ejs");
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
        res.render("../FrontEnd/studentById.ejs", { student: rows });
    });
});

router.post("/", (req, res) => {

    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;
    const iid = req.body.instructor_id;




    db.get(`SELECT * FROM instructor WHERE id ='${iid}' and department_name = '${idept}'`, (errr, ro) => {
        if (errr) console.log(errr);
        else if (ro) {
            db.run(`
            insert into student ( name, total_credits, instructor_id, department_name) values ('${iname}', ${icreds}, '${iid}', '${idept}');  
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

            db.run(`  insert into attendance (id, name, present, absent)
                      select student.id, '${iname}', 0, 0
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


            res.redirect("/students");
        }
        else return res.redirect("/instructors/lol");
    });


});
router.post("/:id/delete", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.student}
    WHERE ${tables.studentColumns.id} == ?`
    const sqlQuery2 = `
    DELETE FROM attendance
    WHERE id == ?`

    
    db.run(sqlQuery2, [req.params.id], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this student."
            });
        }
    });
    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this student."
            });
        }
    });    
    return res.redirect("/students");
});
router.post("/:id/update", (req, res) => {

    res.render({ "sid": req.params.id }, "../Frontend/updateStudent.ejs")

});
router.post("/:id/update2", (req, res) => {

    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;
    const iid = req.body.instructor_id;
    const sqlQuery = `
    UPDATE ${tables.tableNames.student}
    SET name = '${iname}', total_credits = ${icreds}, department_name = '${idept}', instructor_id = '${iid}' 
    WHERE ${tables.studentColumns.id} == ? ;`


    db.get(`SELECT * FROM instructor WHERE id ='${iid}' and department_name = '${idept}'`, (errr, ro) => {
        if (errr) console.log(errr);
        else if (ro) {
            db.run(sqlQuery, [req.params.id], (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: "An error occurred while trying to update this student."
                    });
                }
            });
            res.redirect("/students");
        }
        else return res.redirect("/instructors/lol");
    });
})


router.post("/:id/present", (req, res) => {

    const sqlQuery = `
    UPDATE attendance
    SET present = present + 1
    WHERE id == ?`

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to update this student."
            });
        }
    });
    res.redirect("/students/attendance");
})

router.post("/:id/absent", (req, res) => {

    const sqlQuery = `
    UPDATE attendance
    SET absent = absent + 1
    WHERE id == ?`

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to update this student."
            });
        }
    });
    res.redirect("/students/attendance");
})

module.exports = router;
