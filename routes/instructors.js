const router = require('express').Router();
const tables = require('../db/tables');
const db = require('../db/database').getDatabase();

const { validateInstructor } = require('../db/models');

router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.instructor}`
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred."
            })
        }
        res.render("../FrontEnd/instructors.ejs", { instructor: rows });
    });
});


router.get("/lol", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.instructor}`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/errorins.ejs", { instructor: rows });
    });
});

router.get("/create", (req, res) => {
    res.render('../FrontEnd/createInstructor.ejs');
});
  
 
router.post("/", (req, res) => {
    const { error } = validateInstructor(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const iname = req.body.name;
    const idept = req.body.department_name;
    const isalary = req.body.salary;
    const sqlQuery = `
    INSERT INTO ${tables.tableNames.instructor}
    (name, salary, department_name)
    VALUES ('${iname}', ${isalary}, '${idept}')`;

    db.get(`SELECT * FROM department WHERE deptName ='${idept}'`, (err, row) => {
        if (err) console.log(err.message);
        else if (row) {
            db.run(sqlQuery, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: "An error occured while trying to save the instructor details"
                    });
                }
                res.redirect("/instructors");
            });
           
        }
        else return res.redirect("/departments/lol");
    });


});


router.post("/:id/delete", (req, res) => {
    const sqlQuery =
        `DELETE FROM ${tables.tableNames.instructor}
    WHERE ${tables.instructorColumns.id} = ?`;
    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to delete the instructor"
            });
        }
        return res.redirect("/instructors");
    });
})

module.exports = router;
