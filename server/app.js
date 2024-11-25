const express = require('express');
const cors = require('cors');
const { sequelize, initModels } = require('./models');
const userRoutes = require('./routes/userRoutes');
const venueRoutes = require('./routes/venueRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/venues', venueRoutes); 

sequelize.authenticate()
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Error connecting to the database:', err));

initModels();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
