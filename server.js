const express = require('express');

const app = express();

app.get('/', (req,res) => res.send('API running'));

app.listen(6000, () => console.log('Server started on port 6000') )