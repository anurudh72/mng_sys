const router = require('express').Router();
const tables = require('../db/tables');
const db = require('../db/database').getDatabase();
const { validateSection } = require('../db/models');

router.get("/", (req, res) => {
    const sqlQuery = `SELECT * FROM ${tables.tableNames.section}`;
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            return res.status(500).send({
                message: "An error occurred."
            })
        }
        // res.send(rows);
        res.render("../FrontEnd/sections.ejs", { sections: rows });
    });
});

router.get("/create", function(req, res) {
    res.render("../FrontEnd/createSection.ejs")
});

router.get("/:id/idcoursestd", (req, res) => {

    const cid = req.params.id;
    console.log("wdc " + cid);
    // console.log('nmnmnmnmn' + nm);
    const sqlQuery = `SELECT * from attendance WHERE course='${cid}';`

    // SELECT * FROM student as s ,attendance as a WHERE (s.coursea = '${cid}' or s.courseb = '${cid}') and s.id=a.id and
    // (s.coursea=a.course or s.courseb=a.course)

    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred"
            });
        }
        // res.send(rows);
        res.render("../FrontEnd/studentbycourse.ejs", { attendance: rows, sid: req.params.id });
    });
});

router.post("/", (req, res) => {
    // const { error } = validateSection(req.body);
    // if (error) {
    //     return res.status(400).send({
    //         message: error.details[0].message
    //     });
    // }

    const Id = req.body.id;
    const Sem = req.body.semester;
    const Yr = req.body.year;
    const sqlQuery = `
    INSERT INTO ${tables.tableNames.section}
    (id, semester, year)
    VALUES ('${Id}', ${Sem}, ${Yr})`;

    db.run(sqlQuery, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occured while trying to save the section details"
            });
        }
        res.redirect("/sections")
    });
});

router.post("/:id/delete", (req, res) => {
    const sqlQuery = `
    DELETE FROM ${tables.tableNames.section}
    WHERE ${tables.sectionColumns.id} = ?`;

    db.run(sqlQuery, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                message: "An error occurred while trying to delete this section."
            });
        }
        res.redirect("/sections");
    });
});

router.get("/search1", function (req, res) {
    res.render("../FrontEnd/search.ejs");
});

router.post("/:id/search2", (req, res) => {

    const id = req.params.id;
    console.log('adada ' + id);

    console.log('shdvas ');

    const iname = req.body.name;
    const icourse = req.body.course;


    console.log('naame ' + iname);
    console.log('cou ' + icourse);


    const sqlQuery1 = `
    select * from student where name LIKE '%${iname}%' and ( coursea LIKE '%${icourse}%' or courseb LIKE '%${icourse}%');`
    const sqlQuery2 = `
    select * from student where name LIKE '%${iname}%' ;`
    const sqlQuery3 = `
    select * from student where coursea LIKE '%${icourse}%' or courseb LIKE '%${icourse}%' ;`

    if (iname && icourse) {
       db.all(sqlQuery1, (err, rows) => {
        console.log(' afjasdfkjas  ');
        if (err) console.log(err);
        if (!rows) console.log('chumtiya');
        else return res.render("../Frontend/searchresult.ejs", { students: rows });
        res.redirect("/students/search1");
    });
    }
    else if (iname) {

    console.log('22222222');
    db.all(sqlQuery2, (err, rows) => {
        console.log(' afjasdfkjas  ');
        if (err) console.log(err);
        if (!rows) console.log('chumtiya');
        else return res.render("../Frontend/searchresult.ejs", { students: rows });
        res.redirect("/students/search1");
    });
    
    }
    else if(icourse) {
        db.all(sqlQuery3, (err, rows) => {
            console.log(' afjasdfkjas  ');
            if (err) console.log(err);
            if (!rows) console.log('chumtiya');
            else return res.render("../Frontend/searchresult.ejs", { students: rows });
            res.redirect("/students/search1");
        });
    }
    
})

module.exports = router;