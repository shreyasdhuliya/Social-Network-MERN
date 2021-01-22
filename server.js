const express = require('express');
const connectDB = require('./config/db')

const app = express();

//connect database
connectDB();

//middleware
app.use(express.json({extended: false}))

app.get('/', (req,res) => res.send('API running'));

//DEfine Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

app.listen(6000, () => console.log('Server started on port 6000') )