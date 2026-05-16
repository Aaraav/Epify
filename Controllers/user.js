import User from '../Modals/userModal.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        //  Validate password BEFORE hashing
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' }); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ email, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(err.errors).map((e) => e.message).join(', ')
            });
        }
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '7d',
            }
        );

        res.status(200).json({
            access_token: token,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
