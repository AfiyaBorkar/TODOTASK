const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors')
const dotenv = require('dotenv');
const path = require('path');

const app = express();
dotenv.config();

const port = process.env.PORT|| 5000; 
app.use(express.static(path.resolve(__dirname, './frontend/dist')));


app.use(express.json());
app.use(cors());
const supabaseUrl = 'https://hvqfeotifcbzumtmgbel.supabase.co'
const supabaseKey = process.env.supabaseKey_APIKEY
const supabase = createClient(supabaseUrl, supabaseKey)




app.post('/users', async (req, res) => {
    try {
        const { email, fullName } = req.body;
        const { data, error } = await supabase.from('users').insert([
            {
                email,
                full_name: fullName,
            },
        ]);
        if (error) throw error;
        res.json({ message: 'User added successfully', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './frontend/dist/index.html'));
  });
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
