import { pool } from '../database/postgress';

async function createNotificationsTables() {
  try {
    // Tabela de notificações
    const notificationsQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        professor_id INTEGER REFERENCES professors(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) CHECK (type IN ('lembrete', 'comunicado', 'aviso', 'urgente')) DEFAULT 'aviso',
        target_audience VARCHAR(50) CHECK (target_audience IN ('meus_alunos', 'todos_alunos')) DEFAULT 'meus_alunos',
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const notificationReadsQuery = `
      CREATE TABLE IF NOT EXISTS notification_reads (
        id SERIAL PRIMARY KEY,
        notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
        read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(notification_id, student_id)
      );
    `;

    await pool.query(notificationsQuery);
    console.log("Tabela 'notifications' criada com sucesso!");

    await pool.query(notificationReadsQuery);
    console.log("Tabela 'notification_reads' criada com sucesso!");

  } catch (error) {
    console.error("Erro ao criar tabelas de notificações:", error);
  }
}

createNotificationsTables();