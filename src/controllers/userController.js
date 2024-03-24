const {User, Creator, Post} = require("../models/mongo");

const getUsers = async (req, res) => {
    let query = {};
    let users = [];
    if(req.query.limit){
        if (req.query.username) {
            query.username = req.query.username;
        }
        if (req.query.email) {
            query.email = req.query.email;
        }
        if (req.query.user_id) {
            query.user_id = req.query.user_id;
        }
        if (req.query.password) {
            query.password = req.query.password;
        }
        users = await User.find(query).limit(req.query.limit);
    }else{
        users= await User.find();
    }
    if(users){
        res.status(200).json(users);
    }else{
        res.status(404).json({ error: 'Users not found' });
    }
}


const deleteUserById = async (req, res) => {
    const user_id = req.query.user_id;

    try {
        const deletedUser = await User.findOneAndDelete({ user_id: user_id });

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const creators = await Creator.findOneAndDelete({ user_id: user_id });

        const result = await Post.deleteMany({ user_id: user_id });


        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = {
    getUsers, deleteUserById
}