const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const {login, signup} = require('./controllers/signController')
const {getPosts, createPost, removePost, editPost} = require('./controllers/postController')
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

app.delete('/users', deleteUserById)



app.post('/subscriptions/unsubscribe', unsubscribeCreator)
app.post('/subscriptions/subscribe', subscribeCreator)
app.post('/posts', createPost);
app.post('/signup', signup);
app.post('/post/remove', removePost)


// app.post('ledokol-api/posts/:postId/like', async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const userId = req.body.userId;
//
//     const updatedPost = await CombinedPosts.findByIdAndUpdate(
//         postId,
//         { $addToSet: { likes: { user_id: userId, timestamp: Date.now()/1000 } } },
//         { new: true }
//     );
//
//
//     res.json(updatedPost);
//   } catch (error) {
//     console.error('Error adding like:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
//
// app.post('ledokol-api/posts/:postId/unlike', async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const userId = req.body.userId;
//
//     const updatedPost = await CombinedPosts.findByIdAndUpdate(
//         postId,
//         { $pull: { likes: { user_id: userId } } },
//         { new: true }
//     );
//
//
//     res.json(updatedPost);
//   } catch (error) {
//     console.error('Error removing like:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});