import dotenv from "dotenv";
import express from "express"
const app = express();

dotenv.config();

const port = process.env.PORT || 8080;

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Ping');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
