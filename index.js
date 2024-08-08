const { Sequelize, DataTypes } = require("sequelize");
const express = require('express');
const app = express();
app.use(express.json());



const sequelize = new Sequelize('emp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });


/////////////////////////////////////////////////////

const emp1 = sequelize.define('empl', {
    empid: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    empname: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    city: {
        type: DataTypes.STRING
    },
    salary: {
        type: DataTypes.INTEGER
    }
});

emp1.sync().
then(() => {
    console.log('Book table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });


//-----------------------------------

app.get('/users', async (req, res) => {                     // async, await method
        try {
            const results = await emp1.findAll();
            res.send(results);
        } catch (error) {
            res.status(500).send("Error: " + error);
        }
    });
    
    //---------------------------------------------------   POST
    
    app.post('/addusers', (req, res) => {
        let { empid, empname, city, salary } = req.body;
        emp1.create({ empid, empname, city, salary })
            .then((result) => res.send(result))
            .catch((err) => res.send(err));
    });
    


    ///////put///////

    app.put('/updateuser/:empid', async (req, res) => {
        const empid = req.params.empid;
        const { empname, city, salary } = req.body;
        try {
            const updatedEmp = await emp1.update({ empname, city, salary }, {
                where: { empid }
            });
            res.send(updatedEmp);
        } catch (error) {
            res.status(500).send("Error: " + error);
        }
    });
    

    app.delete('/deleteuser/:empid', async (req, res) => {
        const empid = req.params.empid;
        try {
            const deletedEmp = await emp1.destroy({
                where: { empid }
            });
            res.send(deletedEmp);
        } catch (error) {
            res.status(500).send("Error: " + error);
        }
    });
    
    

//--------------------

app.listen(5000, () => {
    console.log("Server Running")
})