const {User, Creator} = require("../models/mongo");

const getSubscriptions = async (req, res) => {
    let user = {};
    let users_ids = [];
    let subscriptions = [];
    console.log(req.query)
    user = await User.findOne({ user_id: req.query.user_id })
    users_ids = [...user.subscriptions]
    console.log(user, '=======')
    console.log(users_ids, 'someh')

    subscriptions = await Creator.find({ user_id: { $in: users_ids } }).limit(req.query.limit);
    if(subscriptions){
        res.status(200).json(subscriptions);
    }else{
        res.status(404).json({ error: 'Users not found' });
    }
}

const unsubscribeCreator = async (req, res) => {
    const { user_id, creator_id } = req.body.params;
    try {
        await Creator.findOneAndUpdate({ user_id: creator_id }, { $inc: { subscribers: -1 }});

        console.log(user_id)
        const user = await User.findOneAndUpdate(
            { user_id },
            { $pull: { subscriptions: creator_id } },
            { new: true }
        );


        res.status(200).json({ message: 'Successfully unsubscribed.' });



    } catch (error) {
        res.status(500).json({ error: 'Failed to unsubscribe.' });
    }
};
//f9dc9bdaa7464fffb63737e02b2798a8
const subscribeCreator = async (req, res) => {
    const { user_id, creator_id } = req.body.params;
    try {
        // Находим создателя по его идентификатору
        await Creator.updateOne({ user_id: creator_id }, { $inc: { subscribers: 1 } });

        const user = await User.findOneAndUpdate(
            { user_id },
            { $push: { subscriptions: creator_id } },
            { new: true }
        );

        res.status(200).json({ message: 'Successfully subscribed.' });



    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe.' });
    }
};


module.exports = {
    getSubscriptions,
    unsubscribeCreator,
    subscribeCreator
}