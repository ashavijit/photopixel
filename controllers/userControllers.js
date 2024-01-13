const UserSchema = require('../models/user');

const GetALLUsers = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query; // range of data
    const skip = (page - 1) * limit;
    const [users, totalCount] = await Promise.all([
        UserSchema.find().skip(skip).limit(limit).lean().exec(),
        UserSchema.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const result = {
        totalCount,
        totalPages,
        page,
        limit,
        data: users,
    };

    res.status(200).json({
        code: 200,
        message: 'Success',
        result,
    });
};

const GetOneUser = async (req, res, next) => {
    const User = await UserSchema.findById(req.params.id).lean().exec();

    if (!User) {
        return res.status(404).json({
            code: 404,
            message: 'User not found',
        });
    }

    res.status(200).json({
        code: 200,
        message: 'Success',
        result: User,
    });
};

module.exports = {
    GetALLUsers,
    GetOneUser,
};