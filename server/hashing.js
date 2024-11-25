const sequelize = require('./config/database');  // Import sequelize instance
const bcrypt = require('bcrypt');
const User = require('./models/user');  // Import the User model after sequelize initialization

const saltRounds = 10;

async function hashExistingPasswords() {
  try {
    // Ensure that Sequelize has connected before querying the database
    await sequelize.authenticate();  // This ensures the DB connection is established
    console.log('Database connection established successfully.');

    // Retrieve all users from the database
    const users = await User.findAll();

    // Loop through each user
    for (const user of users) {
      if (!user.password_hash) {
        console.log(`No password_hash for user with email: ${user.email}, skipping.`);
        continue;
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(user.password_hash, saltRounds);

      // Update the user's password_hash in the database
      user.password_hash = hashedPassword;
      await user.save(); // Save the updated password_hash

      console.log(`Password for user ${user.email} has been hashed and updated.`);
    }

    console.log('All passwords have been hashed and updated.');
  } catch (err) {
    console.error('Error occurred while hashing passwords:', err);
  }
}

hashExistingPasswords();
