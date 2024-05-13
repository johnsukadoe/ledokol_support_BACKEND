const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

mongoose.connect('mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/?retryWrites=true&w=majority&appName=ledokol', { useUnifiedTopology: true });


const uri = "mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/?retryWrites=true&w=majority&appName=ledokol";
const client = new MongoClient(uri);

async function main() {
    await client.connect();
    
    // Выбор коллекции
    const db = client.db("ledokol");
    const collection = db.collection("posts");
    
    // Находим все посты
    const posts = await collection.find().toArray();
    
    // Для каждого поста обновляем массив likes
    for (const post of posts) {
        // Перебираем массив likes и обновляем значения
        post.likes.forEach(like => {
            like.liker_id = "41"; // Заменяем идентификатор на "41"
            like.timestamp = 1709125712; // Устанавливаем новый формат времени
        });
        
        // Обновляем пост в базе данных
        await collection.updateOne(
          { _id: post._id }, // Указываем пост по его _id
          { $set: { likes: post.likes } } // Устанавливаем новое значение для likes
        );
    }
    
    console.log("All posts updated with modified likes array.");
    client.close();
}


main().catch(console.error);