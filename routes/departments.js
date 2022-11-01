const router = require('express').Router();
const tables = require('../db/tables');
const db = require('../db/database').getDatabase();
const { validateDepartment, validateTeaches } = require('../db/models');

router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.department}`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/departments.ejs", { departments: rows });
    });
});

router.get("/create", (req, res) => {
    res.render('../FrontEnd/createDepartment.ejs');
});

router.post("/", (req, res) => {
    console.log("Request to post department received.")
    const { error } = validateDepartment(req.body);
    if (error) {
        return res.status(400).send({
            message: error.details[0].message
        });
    }

    const deptName = req.body.deptName;
    const building = req.body.building;
    const budget = req.body.budget;
    const sqlQuery = `
    INSERT INTO ${tables.tableNames.department}
    (deptName, building, budget)
    VALUES ('${deptName}', '${building}', ${budget})`

    db.run(sqlQuery, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occured while trying to save the department details"
            });
        }
        res.redirect("/departments");
    });
});

router.post("/:name/delete", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.department}
    WHERE ${tables.deptColumns.deptName} = ?
    COLLATE NOCASE`

    db.run(sqlQuery, [req.params.name], (err) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred while trying to delete this department"
            });
        }
        res.redirect("/departments");
    })
})

module.exports = router;
