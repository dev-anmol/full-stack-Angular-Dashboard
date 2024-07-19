    const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const app = express();
const dotenv = require('dotenv');
const port = process.env.PORT;


dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    driver: 'msnodesqlv8',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectonTimeout: 15000,  //sets the amount of time to wait while trying to establish a connection before aborting the attempt and generating an error.
        requestTimeout: 300000   //sets the amount of time to wait for a query to complete before aborting the request and generating an error.

    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 3000,
    },
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
            console.log('Error fetching the data from the Database', err);
        }
        res.status(404).json({
            err,
        })
    }
});

app.get('/plotBy/:id', async (req, res) => {
    const plotBy = req.query.plotBy;
    const deviceId = req.params.id;

    let query = '';
    if (plotBy === 'Day') {
        query = 'select * from Data_Energy_Daily where DeviceId = @deviceId AND DATEPART(year, AggregatedReadingDateTime) = 2024 AND DATEPART(month, AggregatedReadingDateTime) = 4';
    } else if (plotBy === 'Hour') {
        query = 'select * from Data_Energy_Hourly where DeviceId = @deviceId AND DATEPART(year, AggregatedReadingDateTime) = 2024 AND DATEPART(month, AggregatedReadingDateTime) = 4';
    } else if (plotBy === '15 Minutes') {
        query = 'select * from Data_Energy_Fifteen_Minutes where DeviceId = @deviceId AND DATEPART(year, AggregatedReadingDateTime) = 2024 AND DATEPART(month, AggregatedReadingDateTime) = 4';
    } else if(plotBy === 'Live'){
        query = 'select * from Data_Energy_Daily where DeviceId = @deviceId AND DATEPART(year, AggregatedReadingDateTime) = 2024 AND DATEPART(month, AggregatedReadingDateTime) = 4';
    }
    else {
        res.status(400).json({
            msg: 'Invalid plotBy value'
        });
        return;
    }
    try {
        const result = await pool.request()
          .input('deviceId', sql.Int, deviceId)
          .query(query);
        console.log('Query executed, rows returned:', result.recordset.length);
        if (result.recordset.length === 0) {
          throw new Error('No Data found in the database');
        }
        res.status(200).send(result.recordset);
      } catch (err) {
        console.error('Error fetching the data from the database', err);
        res.status(404).json({
          msg: err.message,
        });
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

app.get('/form-data/:id', async (req, res) => {
    const deviceId = req.params.id;
    try {
        const formData = {
            "StartDate": req.query.StartDate,
            "EndDate": req.query.EndDate,
        }

        const parameter = {
            'A': req.query['A'],
            'An': req.query['An'],
            'Ag': req.query['Ag'],
            'A1': req.query['A1'],
            'A2': req.query['A2'],
            'A3': req.query['A3'],
            'VLL': req.query['VLL'],
            'VLN': req.query['VLN'],
            'V12': req.query['V12'],
            'V23': req.query['V23'],
            'V31': req.query['V31'],
            'V1': req.query['V1'],
            'V2': req.query['V2'],
            'V3': req.query['V3'],
            'KW': req.query['KW'],
            'KW1': req.query['KW1'],
            'KW2': req.query['KW2'],
            'KW3': req.query['KW3'],
            'KVA': req.query['KVA'],
            'KVAr': req.query['KVAr'],
            'KVArh': req.query['KVArh'],
            'KVA1': req.query['KVA1'],
            'KVA2': req.query['KVA2'],
            'KVA3': req.query['KVA3'],
            'KVAR1': req.query['KVAR1'],
            'KVAR2': req.query['KVAR2'],
            'KVAR3': req.query['KVAR3'],
            'PF': req.query['PF'],
            'PF1': req.query['PF1'],
            'PF2': req.query['PF2'],
            'PF3': req.query['PF3'],
            'THDi1': req.query['THDi1'],
            'THDi2': req.query['THDi2'],
            'THDi3': req.query['THDi3'],
            'THDin': req.query['THDin'],
            'THDig': req.query['THDig'],
            'TDD': req.query['TDD'],
            'THDv12': req.query['THDv12'],
            'THDv23': req.query['THDv23'],
            'THDv31': req.query['THDv31'],
            'THDv1': req.query['THDv1'],
            'THDv2': req.query['THDv2'],
            'THDv3': req.query['THDv3'],
            'THDvln': req.query['THDvln'],
            'VLN_Unbalanced': req.query['VLN_Unbalanced'],
            'Present_Demand_KW': req.query['Present_Demand_KW'],
            'Present_Demand_KVA': req.query['Present_Demand_KVA'],
            'Present_Demand_KVAr': req.query['Present_Demand_KVAr'],
            'Peak_Demand_KW': req.query['Peak_Demand_KW'],
            'Peak_Demand_KVA': req.query['Peak_Demand_KVA'],
            'Peak_Demand_KVAr': req.query['Peak_Demand_KVAr'],
            'KWh_Recieved': req.query['KWh_Recieved'],
            'KVARh_Recieved': req.query['KVARh_Recieved'],
            'KVAh_Recieved': req.query['KVAh_Recieved']
        }
        let hoursParameter = [];

        if (req.query.selectedHours) {
            hoursParameter = JSON.parse(req.query.selectedHours);
        }

        const selectedParams = Object.keys(parameter).filter(key => parameter[key] !== undefined);

        if (selectedParams.length === 0) {
            return res.status(400).send('No parameter selected');
        }
        const selectClause = selectedParams.map(param => `[${param}]`).join(', ');

        const selectHourClause = hoursParameter.map(hour => `DATEPART(HOUR, ReadingDateTime) = ${hour.id}`).join(' OR ');

        console.log(selectHourClause);
        if (selectHourClause) {
            console.log(selectHourClause);
        }

        const sqlQuery = `
        SELECT ${selectClause}
        FROM Data_Energy 
        WHERE DeviceId = @deviceId 
          AND CAST(ReadingDateTime AS DATE) >= @StartDate 
          AND CAST(ReadingDateTime AS DATE) <= @EndDate
    `;
        // ${selectHourClause ? `AND (${selectHourClause})` : ''}

        const result = await pool.request()
            .input('StartDate', sql.Date, formData.StartDate)
            .input('EndDate', sql.Date, formData.EndDate)
            .input('deviceId', sql.Int, deviceId)
            .query(sqlQuery, {
                requestTimeout: 30000
            });

        if (result.recordset.length === 0) {
            throw new Error('No Data Found in the Database');
        }
        res.status(200).send(result);

    } catch (error) {
        if (error) {
            console.log('Error fetching the data from the database', error);
            res.status(500).send('Internal Server Error');
        }
    }
})

app.listen(3000, (err) => {
    if (err) {
        console.log('error', err);
    }
    console.log(`Server is running on 3000`);
});