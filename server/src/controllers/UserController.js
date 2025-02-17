import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Get all users
export const getUsers = async (_req, res) => {
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
};

// Register a new user
export const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ username, password }); 

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; 
        const user = await User.findOne({ username }); 

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });

        res.json({ message: 'Login successful', token, user });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err });
    }
};

// Get a user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err });
    }
};

// Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.username = username || user.username;
        user.password = password || user.password;

        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete user with ID: ${id}`); // Log the user ID

        const user = await User.findById(id);
        if (!user) {
            console.log(`User not found with ID: ${id}`); // Log if user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        console.log(`User deleted with ID: ${id}`); // Log successful deletion

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err); // Log the error
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
};