const mongoose = require('mongoose');
const uri = "mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/ledokol?retryWrites=true&w=majority&appName=ledokol";

mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');

    mongoose.connection.db.admin().command({ ping: 1 }, (err, result) => {
        if (err) {
            console.error('Error pinging MongoDB:', err);
        } else {
            console.log('MongoDB ping successful:', result);
        }
    });
});

const User = mongoose.model('User', {
    user_id: Number,
    username: String,
    email: String,
    password: String,
    join_date:Number,
    role:String,
    subscriptions:Array,
}, 'users');
const Post = mongoose.model('Post', {
    _id:Number,
    user_id: Number,
    titleRU:String,
    titleEN:String,
    descriptionRU:String,
    descriptionEN:String,
    timestamp:Number,
    preview:Object
}, 'posts');

const Creator = mongoose.model('Creator', {
    _id:Number,
    user_id: Number,
    subscribers:Number,
    channel_description:String,
    total_posts:Number,
    username:String,
}, 'creators');

module.exports = {
    User,
    Post,
    Creator
};