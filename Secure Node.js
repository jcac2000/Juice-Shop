app.post('/api/v1/login', async (req, res) => {
    const { email, password } = req.body;

    // '?' placeholder treats input as a string, not as part of SQL command
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    // The driver safely escapes the ' OR 1=1-- and searches for that literal text.
    const [rows] = await db.execute(query, [email, password]);

    if (rows.length > 0) {
        res.status(200).send("Welcome!");
    } else {
        res.status(401).send("Invalid login.");
    }
});
