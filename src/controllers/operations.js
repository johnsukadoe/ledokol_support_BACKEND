const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

mongoose.connect('mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/?retryWrites=true&w=majority&appName=ledokol', { useUnifiedTopology: true });


const uri = "mongodb+srv://johnsukadoe:qPz8am91@ledokol.iv6xhsg.mongodb.net/?retryWrites=true&w=majority&appName=ledokol";
const client = new MongoClient(uri);

async function main() {
    await client.connect();

    // Выбор коллекции
    const db = client.db("ledokol");
    const collection = db.collection("users");

    // Получение данных
    const updateResult = await collection.updateMany(
        {}, // Пустой объект выбирает все документы в коллекции
        {
            $set: {
                role: 'creator',
                join_date: 1672960000,
                subscriptions: [1, 3, 4]
            }
        }
    );

    // Вывод данных
    console.log(updateResult);
}

main().catch(console.error);