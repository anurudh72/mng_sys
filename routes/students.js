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
    const icoursea = req.body.coursea;
    const icourseb = req.body.courseb;

    // , coursea , courseb 
    //  ,'${icoursea}','${icourseb}'

    db.get(`SELECT * FROM instructor WHERE id ='${iid}' and department_name = '${idept}'`, (errr, ro) => {
        if (errr) console.log(errr);
        else if (ro) {
            db.run(`
            insert into student ( name, total_credits, instructor_id, department_name ,  coursea , courseb ) 
            
             values ('${iname}', ${icreds}, '${iid}', '${idept}','${icoursea}','${icourseb}')
            
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

            db.run(`  insert into attendance (id, name, present, absent,course  )
                      select student.id, '${iname}', 0, 0 , coursea
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

            db.run(`  insert into attendance (id, name, present, absent  , course )
            select student.id, '${iname}', 0, 0 ,courseb
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
        } else return res.redirect("/instructors/lol");
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

    res.render("../Frontend/updateStudent.ejs", { "sid": req.params.id })

});
router.post("/:id/update2", (req, res) => {

    const iname = req.body.name;
    const icreds = req.body.total_credits;
    const idept = req.body.department_name;
    const iid = req.body.instructor_id;
    const icoursea = req.body.coursea;
    const icourseb = req.body.courseb;
    const sqlQuery = `
    UPDATE ${tables.tableNames.student}
    SET name = '${iname}', total_credits = ${icreds}, department_name = '${idept}', instructor_id = '${iid}',coursea = '${icoursea}',courseb = '${icourseb}' 
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
        } else return res.redirect("/instructors/lol");
    });
})



module.exports = router;