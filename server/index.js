const express = require("express");
const app = express();
app.get("/data", (req, res) => {
    const dummy = [
        {
            userName: "Sujoy Saha",
            age: 21,
            gender: "Male",
            school: "Bhowani Pur High School",
            collage: "none",
        },
    ];
    res.setHeader('Access-Control-Allow-Origin','http://localhost:5173').json({ data: dummy });
});

app.listen(8000, () => {
    console.log("Server is running at 8000");
});
