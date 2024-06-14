const {Post, Creator, Likes, User} = require("../models/mongo");

const getPosts = async (req, res) => {
    try {
        const { creators } = req.query;
        console.log(req.query)

        let posts;
        if (creators) {
            posts = await Post.find({ user_id: { $in: creators } });
        } else if(req.query.isProfile) {
            posts = await Post.find({user_id:req.query.user_id})
        } else if(req.query.post_id) {
            posts = await Post.find({_id:req.query.post_id});
        }else {
            posts = await Post.find();
        }


        res.status(200).json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const createPost = async (req, res) => {
    try {
        const newPost = new Post(req.body);

        const lastPost = await Post.findOne({}, {}, { sort: { '_id': -1 } });

        newPost._id = lastPost ? lastPost._id + 1 : 1;

        const savedPost = await newPost.save();

        const query = { _id: savedPost._id };
        const updateData = { $set: req.body };

        await Post.updateOne(query, updateData);

        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const removePost = async (req, res) => {
    try {
        const postId = req.body.query.post_id;
        // проверяем, существует ли пост с таким id
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Удаление поста
        const deletedPost = await Post.findByIdAndDelete(postId);
        console.log(deletedPost)
        // Находим создателя по его идентификатору
        // let query = {
        //     user_id: post.user_id
        // }
        // const creator = await Creator.findOne(query);
        // console.log(creator)
        //
        // if (!creator) {
        //     console.error('Creator not found');
        //     return res.status(500).send('Server Error');
        // }
        //
        // // Уменьшаем количество общих постов на единицу
        // creator.total_posts -= 1;
        // console.log(creator)
        // // Сохраняем изменения
        // await creator.save();

        res.status(200).json(deletedPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const editPost = async (req, res) => {
    try {
        const { _id, titleRU, titleEN, descriptionRU, descriptionEN, timestamp, preview } = req.body;
        console.log(_id)
        console.log(req.body)
        // Проверяем, существует ли пост с таким postId
        const post = await Post.findById(_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Обновляем данные поста
        post.titleRU = titleRU;
        post.titleEN = titleEN
        post.descriptionRU = descriptionRU;
        post.descriptionEN = descriptionEN;
        post.timestamp = timestamp;
        post.preview = preview;

        // Сохраняем обновленный пост в базе данных
        const updatedPost = await post.save();

        // Отправляем ответ с обновленным постом
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const likePost = async (req, res) => {
    const { postId, likerId } = req.body.params;
    
    
    const data = await Post.updateOne(
      { _id: postId },
      { $push: { likes: { liker_id: likerId, timestamp: Math.floor(new Date().getTime() / 1000) } } }
    );
    
    res.status(200).json(data);
};

const unlikePost = async (req, res) => {
    const { postId, likerId } = req.body.params;
    
    try {
        // Находим пост по его _id и удаляем лайк пользователя
        const data = await Post.updateOne(
          { _id: postId },
          { $pull: { likes: { liker_id: likerId } } }
        );
        
        res.status(200).json(data);
    } catch (error) {
        console.error("Error occurred while unliking the post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const commentPost = async (req, res) => {
    const { comment, postId, userId, parentId } = req.body.params;
    
    try {
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        const user = await User.findOne({ user_id: userId });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        let newComment = {
            comment_id: parentId ? post.comments.length + 1 : post.comments.length + 5,
            text: comment,
            timestamp: Date.now(),
            user: {
                id: user.user_id,
                username: user.username,
                logo: user.logo,
            }
        };
        
        if (parentId) {
            const parentComment = post.comments.find(comment => comment.comment_id === parentId);
            if (!parentComment) {
                return res.status(404).json({ error: "Parent comment not found" });
            }
            parentComment.responses.push(newComment);
        } else {
            post.comments.push(newComment);
        }
        
        await post.save();
        res.status(200).json({ success: true, message: "Comment added successfully" });
    } catch (error) {
        console.error("Error occurred while commenting the post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const editComment = async (req, res) => {
    const { commentId, newText, parentId } = req.body.params;
    
    try {
        const query = parentId ? { "comments.responses.comment_id": commentId } : { "comments.comment_id": commentId };
        const post = await Post.findOne(query);
        
        if (!post) {
            return res.status(404).json({ error: "Comment not found" });
        }
        
        const commentToUpdate = parentId ? post.comments.find(comment => comment.responses.find(response => response.comment_id === commentId)) :
          post.comments.find(comment => comment.comment_id === commentId);
        
        if (!commentToUpdate) {
            return res.status(404).json({ error: "Comment not found" });
        }
        
        commentToUpdate.text = newText;
        await post.save();
        
        res.status(200).json({ success: true, message: "Comment updated successfully" });
    } catch (error) {
        console.error("Error occurred while editing the comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const removeComment = async (req, res) => {
    const { commentId, parentId } = req.body.params;
    
    try {
        const query = parentId ? { "comments.responses.comment_id": commentId } : { "comments.comment_id": commentId };
        const post = await Post.findOne(query);
        
        if (!post) {
            return res.status(404).json({ error: "Comment not found" });
        }
        
        if (parentId) {
            post.comments.forEach(comment => {
                comment.responses = comment.responses.filter(response => response.comment_id !== commentId);
            });
        } else {
            post.comments = post.comments.filter(comment => comment.comment_id !== commentId);
        }
        
        await post.save();
        
        res.status(200).json({ success: true, message: "Comment removed successfully" });
    } catch (error) {
        console.error("Error occurred while removing the comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
    getPosts,
    createPost,
    removePost,
    editPost,
    unlikePost,
    likePost,
    commentPost,
    editComment,
    removeComment
}