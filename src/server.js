const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const {login, signup} = require('./controllers/signController')
const {getPosts, createPost, removePost, editPost, unlikePost, likePost, commentPost, editComment, removeComment} = require('./controllers/postController')
const {getUsers, deleteUserById} = require('./controllers/userController')
const {getSubscriptions, unsubscribeCreator, subscribeCreator} = require("./controllers/subscriptionsController");
const {getCreator, updateCreator, getCreators} = require("./controllers/creatorController");


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

``
app.get('/posts', getPosts)
app.get('/users', getUsers)
app.get('/subscriptions', getSubscriptions)
app.get('/login', login);
app.get('/creator', getCreator);
app.get('/creators', getCreators)

app.put('/post', editPost)
app.put('/creator', updateCreator)
app.put('/post/comment/edit', editComment)

app.delete('/users', deleteUserById)
app.delete('/post/comment', removeComment)



app.post('/subscriptions/unsubscribe', unsubscribeCreator)
app.post('/subscriptions/subscribe', subscribeCreator)
app.post('/posts', createPost);
app.post('/signup', signup);
app.post('/post/remove', removePost)
app.post('/post/like', likePost)
app.post('/post/unlike', unlikePost)
app.post('/post/comment', commentPost)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});