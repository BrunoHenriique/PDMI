import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function createNotificationsTables() {
  try {
    console.log('As tabelas de notificações já foram criadas pelo Prisma Migrate');
    return true;
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
}

export default createNotificationsTables;