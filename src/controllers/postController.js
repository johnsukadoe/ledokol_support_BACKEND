const {Post, Creator} = require("../models/mongo");

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




module.exports = {
    getPosts,
    createPost,
    removePost,
    editPost
}