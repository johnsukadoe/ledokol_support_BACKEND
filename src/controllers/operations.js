const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

mongoose.connect('mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/?retryWrites=true&w=majority&appName=ledokol', { useUnifiedTopology: true });


const uri = "mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/?retryWrites=true&w=majority&appName=ledokol";
const client = new MongoClient(uri);

async function addCommentsToPosts() {
    await client.connect();
    
    // Выбор коллекции
    const db = client.db("ledokol");
    const collection = db.collection("posts");
    
    // Находим все посты
    const posts = await collection.find().toArray();
    
    // Создаем комментарии и добавляем их к каждому посту
    for (const post of posts) {
        const comments = [];
        
        // Создаем комментарии для каждого поста
        for (let i = 1; i <= 5; i++) { // Пример: создаем 5 комментариев для каждого поста
            const comment = {
                comment_id: i,
                text: "Some comment",
                timestamp: 1709125712,
                user: {
                    id: 41,
                    username: "mirass",
                    logo: "",
                },
                responses: [] // Пустой массив ответов для каждого комментария
            };
            comments.push(comment);
        }
        
        // Добавляем комментарии к посту
        await collection.updateOne(
          { _id: post._id }, // Указываем пост по его _id
          { $set: { comments: comments } } // Устанавливаем новое значение для comments
        );
    }
    
    console.log("Comments added to all posts.");
    client.close();
}


addCommentsToPosts().catch(console.error);