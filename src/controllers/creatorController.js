const {Creator, User} = require("../models/mongo");

const getCreator = async (req, res) => {
    try {
        const query={
            user_id:req.query.user_id
        }

        let creator = [];

        creator = await Creator.findOne(query);
        res.status(200).json(creator);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateCreator = async (req, res) => {
    try {
        console.log(req.body)
        const { username, channel_description, user_id } = req.body.params.creator;

        const query = { user_id };

        const update = {
            $set: {
                username,
                channel_description
            }
        };

        const options = { new: true }; // Return the updated document

        const updatedCreator = await Creator.findOneAndUpdate(query, update, options);

        const userQuery = { user_id };
        const userUpdate = {
            $set: {
                username,
            }
        };
        const userOptions = { new: true };
        const updatedUser = await User.findOneAndUpdate(userQuery, userUpdate, userOptions);
        console.log(updatedUser)

        res.status(200).json(updatedCreator);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getCreators = async (req, res) => {
    try {
        let creator = await Creator.find();
        res.status(200).json(creator);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getCreator,
    updateCreator,
    getCreators
}