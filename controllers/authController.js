const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const User = require('../models/user');

const getJwt = (userId, secret, exp) => {
    return jwt.sign({ id: userId }, secret, { expiresIn: exp });
};

const extractPayload = (jwt) => {
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(payloadJson);
};

const createTokenAndRespond = (res, user) => {
    const token = getJwt(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRY);

    res.status(200).json({
        status: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    });
};

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                status: false,
                message: 'Please provide all required fields'
            });
        }

        const user = await User.create({ name, email, password, role });

        createTokenAndRespond(res, user);
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: 'Please provide all required fields',
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password))) {
            return res.status(401).json({
                status: false,
                message: 'Incorrect email or password',
            });
        }

        createTokenAndRespond(res, user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
};


// exports.GAuth = async (req, res, next) => {
//     try {
//         const { tokenId } = req.body;

//         if (!tokenId) {
//             return res.status(400).json({
//                 status: false,
//                 message: 'Please provide all required fields'
//             });
//         }

//         const { name, email, picture } = await jwt_decode(tokenId);

//         const user = await User.findOne({ email });

//         if (user) {
//             createTokenAndRespond(res, user);
//         } else {
//             const newUser = await User.create({
//                 name,
//                 email,
//                 password: '123456',
//                 dp: picture
//             });

//             createTokenAndRespond(res, newUser);
//         }
//     } catch (error) {
//         res.status(500).json({
//             status: false,
//             message: error.message
//         });
//     }
// };

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'You are not logged in'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'The user belonging to this token does no longer exist'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

