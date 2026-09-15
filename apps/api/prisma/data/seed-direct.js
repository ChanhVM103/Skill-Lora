import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.DATABASE_URL || 'mongodb+srv://9a5vominhchanh_db_user:RJpJDB6yNCYhw0Ec@cluster0.fryybtd.mongodb.net/skillora?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas...');
    const db = client.db('skillora');
    const users = db.collection('users');

    const email = 'tqlam150504@gmail.com';
    const rawPassword = 'lam12345';
    const passwordHash = bcrypt.hashSync(rawPassword, 10);
    const now = new Date();

    // Re-create document with exact field order: email -> fullName -> passwordHash -> role -> createdAt -> updatedAt -> __v
    await users.deleteOne({ email });

    const result = await users.insertOne({
      email,
      fullName: 'Trần Quốc Lâm',
      passwordHash: passwordHash,
      role: 'users',
      createdAt: now,
      updatedAt: now,
      __v: 0,
    });

    console.log('🎉 Successfully created user tqlam150504@gmail.com with ordered fields!');
    console.log(result);
  } catch (err) {
    console.error('❌ Error inserting document:', err);
  } finally {
    await client.close();
  }
}

main();
