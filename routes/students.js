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
    const { error } = validateStudent(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;

    db.get(`SELECT * FROM department WHERE deptName ='${idept}'`, (err, row) => {
        if (err) console.log(err);
        else if (row) {
            db.run(`insert into student ( name, total_credits, department_name) values ('${iname}', ${icreds}, '${idept}');`, (err, rows) => {
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
        else res.send({
            message: "An error occurred while INSERTING this delete this student. Please go back and choose a department from available departments:)"
        });
    });


    // db.each("SELECT * FROM Dog WHERE breed = 'Labrador'", 
    //   (error, row) => {
    //   /*gets called for every row our query returns*/
    //     console.log(`${row.name} is a good dog`);
    //   });


});
router.post("/:id/delete", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.student}
    WHERE ${tables.studentColumns.id} == ?`

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this student."
            });
        }
        return res.redirect("/students");
    });
});
router.post("/:id/update", (req, res) => {

    res.render("../Frontend/updateStudent.ejs", { "sid": req.params.id })

});
router.post("/:id/update2", (req, res) => {
    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;

    const sqlQuery = `
    UPDATE ${tables.tableNames.student}
    SET name = '${iname}', total_credits = ${icreds}, department_name = '${idept}'
    WHERE ${tables.studentColumns.id} == ? ;`

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to update this student."
            });
        }
        return res.redirect("/students");
    });
})


module.exports = router;
