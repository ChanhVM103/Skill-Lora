import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'tqlam150504@gmail.com';
  const rawPassword = 'lam12345';
  const passwordHash = bcrypt.hashSync(rawPassword, 10);

  const user = await prisma.users.upsert({
    where: { email },
    update: {
      passwordHash: passwordHash,
      fullName: 'Trần Quốc Lâm',
      role: 'users',
    },
    create: {
      email,
      fullName: 'Trần Quốc Lâm',
      passwordHash: passwordHash,
      role: 'users',
    },
  });

  console.log('✅ Created/Updated test user in MongoDB Atlas:');
  console.log({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    password: rawPassword,
    role: user.role,
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
