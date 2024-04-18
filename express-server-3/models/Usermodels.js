import knex from "knex";
import knexfile from "../knexfile.js";
import bcrypt from "bcrypt";

const saltRounds = 10;
const db = knex(knexfile);

// Function to generate salt and hash password
const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return { salt, hashedPassword };
};

// Function to create a new user
const createUser = async ({ firstname, lastname, email, password }) => {
  try {
    // Generate salt and hashed password
    const { salt, hashedPassword } = await generateHashedPassword(password);

    // Insert user into the database with hashed password and salt
    await db('user').insert({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      salt: salt,
      
    });

    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export default createUser;