const express=require('express') 
const  cors = require('cors')
const {client} =require('./db')
const app=express();

app.use(cors());
app.use(express.json());
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`Listening on port ${port}`));
app.post('/addSchool', async (req, res) => {
    const { Name, Address, latitude, longitude } = req.body;
    if (!Name || typeof Name !== 'string' || Name.trim().length === 0) {
        return res.status(400).send("Name is required and must be a non-empty string.");
    }
    if (!Address || typeof Address !== 'string' || Address.trim().length === 0) {
        return res.status(400).send("Address is required and must be a non-empty string.");
    }
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return res.status(400).send("Latitude must be a number between -90 and 90.");
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return res.status(400).send("Longitude must be a number between -180 and 180.");
    }
    const existingSchool = await client.query(
        `SELECT * FROM schools WHERE latitude = $1 AND longitude = $2`,
        [latitude, longitude]
    );
    if (existingSchool.rows.length > 0) {
        return res.status(400).send("A school with the same latitude and longitude already exists.");
    }

    try {
        const data = await client.query(
            `INSERT INTO schools(name, address, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING *`,
            [Name, Address,latitude, longitude]
        );
        res.status(200).json({ message: "School is added successfully", data: data.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding school.");
    }
});
app.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).send("Please provide valid latitude and longitude.");
    }
    try {
      
        const result = await client.query('SELECT name, address, latitude, longitude FROM schools');
        const schoolsWithDistance = result.rows.map(school => {
            const distance = Math.sqrt(
                Math.pow(school.latitude - latitude, 2) + Math.pow(school.longitude - longitude, 2)
            );
            return { ...school, distance };
        });

        const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json({ message: "Schools fetched and sorted by proximity", data: sortedSchools });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching schools.");
    }
});
