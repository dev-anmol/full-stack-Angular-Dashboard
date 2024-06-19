const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
const app = express();
const dotenv = require('dotenv');
const port = process.env.PORT;


dotenv.config();
app.use(cors());

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    driver: 'msnodesqlv8',
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 3000,
    }
}

let pool;
async function establishConnectionPool() {
    try {
        pool = await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

establishConnectionPool();

app.get('/', (req, res) => {
    console.log('initialized');
    console.log(port);
    res.json({
        msg: "hi, its working"
    })
})

app.get('/data-energy', async (req, res) => {
    try {
        const result = await pool.request().query('select * from Data_Energy');
        if (result.recordset.length === 0) {
            throw new Error('Error connecting to the database');
        }
        res.status(200).send(result.recordset)
    } catch (err) {
        if (err) {
            console.log('Error fetching the data from the database', err);
            res.status(404).json({
                msg: err,
            })
        }
    }
});

app.get('/data-energy/:id', async (req, res) => {
    const deviceId = req.params.id;
    try {
        const result = await pool.request()
            .input('deviceId', sql.Int, deviceId)
            .query('select * from Data_Energy WHERE DeviceId = @deviceId AND DATEPART(year, ReadingDateTime) = 2024 AND DATEPART(month, ReadingDateTime) = 4');
        if (result.recordset.length === 0) {
            throw new Error('No Data found in the database');
        }
        res.status(200).send(result.recordset);
    } catch (err) {
        if (err) {
            console.log('Error fetching the data from the database', err);
            res.status(404).json({
                msg: err,
            });
        }
    }
});

app.get('/form-data', async (req, res) => {
    try {
        const formData = {
            view: req.query.view,
            analysisType: req.query.analysisType,
            compareBy: req.query.compareBy,
            plotBy: req.query.plotBy,
            selectedHours: req.query.selectedHours,
            dataRange: req.query.dataRange,
            day: req.query.day,
            dataOption: req.query.dataOption,
            startMonth: req.query.startMonth,
            endMonth: req.query.endMonth,
        }
        console.log(formData);
        const result = await pool.request()
            .input('startMonth', sql.Date, formData.startMonth)
            .input('endMonth', sql.Date, formData.endMonth)
            .query('SELECT * FROM Data_Energy WHERE CAST(ReadingDateTime AS DATE) >= @startDate AND CAST(ReadingDateTime AS DATE) <= @endDate;');

        if (result.recordset.length === 0) {
            throw new Error('No Data Found in the Database');
        }
        res.status(200).send(result);

    } catch (error) {
        if (error) {
            console.log('Error fetching the data from the databse', error)
        }
    }
})


app.listen(3000, (err) => {
    if (err) {
        console.log('error', err);
    }
    console.log(`Server is running on 3000`);
});