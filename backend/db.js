const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
require('dotenv').config();

class Database {
    constructor() {
        this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../database/dashboard.db');
        this.db = null;
        this.isInitialized = false;
    }

    // Inicializar conexão com o banco
    async init() {
        return new Promise((resolve, reject) => {
            // Criar diretório se não existir
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Erro ao conectar com o banco:', err.message);
                    reject(err);
                } else {
                    console.log('Conectado ao banco SQLite');
                    this.isInitialized = true;
                    resolve();
                }
            });

            // Configurar modo WAL para melhor performance
            this.db.exec("PRAGMA journal_mode = WAL;");
            this.db.exec("PRAGMA foreign_keys = ON;");
        });
    }

    // Executar schema/migrations
    async setupDatabase() {
        if (!this.isInitialized) {
            await this.init();
        }

        const schemaPath = path.join(__dirname, '../database/schemas.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        return new Promise((resolve, reject) => {
            this.db.exec(schema, (err) => {
                if (err) {
                    console.error('Erro ao executar schema:', err);
                    reject(err);
                } else {
                    console.log('Schema executado com sucesso');
                    resolve();
                }
            });
        });
    }

    // Executar query com promisify
    async run(sql, params = []) {
        if (!this.isInitialized) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        lastID: this.lastID, 
                        changes: this.changes 
                    });
                }
            });
        });
    }

    // Buscar um registro
    async get(sql, params = []) {
        if (!this.isInitialized) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Buscar múltiplos registros
    async all(sql, params = []) {
        if (!this.isInitialized) {
            await this.init();
        }
        
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Executar transação
    async transaction(queries) {
        if (!this.isInitialized) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("BEGIN TRANSACTION");
                
                let completed = 0;
                const errors = [];
                
                queries.forEach((query, index) => {
                    this.db.run(query.sql, query.params || [], function(err) {
                        if (err) {
                            errors.push({ index, error: err });
                        }
                        
                        completed++;
                        
                        if (completed === queries.length) {
                            if (errors.length > 0) {
                                this.db.run("ROLLBACK", () => {
                                    reject(errors);
                                });
                            } else {
                                this.db.run("COMMIT", () => {
                                    resolve();
                                });
                            }
                        }
                    });
                });
            });
        });
    }

    // Métodos específicos para usuários
    async createUser(userData) {
        const { email, password_hash, name, company_name, agent_id, settings } = userData;
        const sql = `
            INSERT INTO users (email, password_hash, name, company_name, agent_id, settings)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return this.run(sql, [email, password_hash, name, company_name, agent_id, JSON.stringify(settings || {})]);
    }

    async getUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
        return this.get(sql, [email]);
    }

    async getUserById(id) {
        const sql = 'SELECT * FROM users WHERE id = ? AND is_active = 1';
        return this.get(sql, [id]);
    }

    async updateUserLastLogin(userId) {
        const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
        return this.run(sql, [userId]);
    }

    // Métodos para métricas do dashboard
    async getDashboardMetrics(userId, startDate = null, endDate = null) {
        let dateFilter = '';
        let params = [userId];

        if (startDate && endDate) {
            dateFilter = 'AND DATE(c.start_time) BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        const sql = `
            SELECT 
                COUNT(DISTINCT c.id) as total_conversations,
                COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_conversations,
                COUNT(DISTINCT s.id) as total_sales,
                COALESCE(SUM(CASE WHEN s.status = 'confirmed' THEN s.total_amount ELSE 0 END), 0) as total_revenue,
                COUNT(DISTINCT o.id) as total_objections,
                COUNT(DISTINCT CASE WHEN o.was_handled = 1 THEN o.id END) as handled_objections,
                COUNT(DISTINCT cr.id) as total_contacts
            FROM users u
            LEFT JOIN conversations c ON u.id = c.user_id ${dateFilter}
            LEFT JOIN sales s ON u.id = s.user_id ${dateFilter.replace('c.start_time', 's.sale_date')}
            LEFT JOIN objections o ON u.id = o.user_id ${dateFilter.replace('c.start_time', 'o.timestamp')}
            LEFT JOIN contact_reasons cr ON u.id = cr.user_id ${dateFilter.replace('c.start_time', 'cr.timestamp')}
            WHERE u.id = ?
        `;
        
        return this.get(sql, params);
    }

    async getTopProducts(userId, limit = 10) {
        const sql = `
            SELECT 
                p.name as product_name,
                COUNT(s.id) as sales_count,
                SUM(s.total_amount) as total_revenue
            FROM products p
            LEFT JOIN sales s ON p.id = s.product_id AND s.status = 'confirmed'
            WHERE p.user_id = ?
            GROUP BY p.id, p.name
            ORDER BY sales_count DESC, total_revenue DESC
            LIMIT ?
        `;
        return this.all(sql, [userId, limit]);
    }

    async getTopObjections(userId, limit = 10) {
        const sql = `
            SELECT 
                objection_type,
                COUNT(*) as count,
                COUNT(CASE WHEN was_handled = 1 THEN 1 END) as handled_count,
                ROUND(COUNT(CASE WHEN was_handled = 1 THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
            FROM objections
            WHERE user_id = ?
            GROUP BY objection_type
            ORDER BY count DESC
            LIMIT ?
        `;
        return this.all(sql, [userId, limit]);
    }

    async getTopContactReasons(userId, limit = 10) {
        const sql = `
            SELECT 
                reason_category,
                COUNT(*) as count,
                COUNT(CASE WHEN resolution_status = 'resolved' THEN 1 END) as resolved_count
            FROM contact_reasons
            WHERE user_id = ?
            GROUP BY reason_category
            ORDER BY count DESC
            LIMIT ?
        `;
        return this.all(sql, [userId, limit]);
    }

    async getSalesOverTime(userId, period = '30 days') {
        const sql = `
            SELECT 
                DATE(sale_date) as date,
                COUNT(*) as sales_count,
                SUM(total_amount) as total_revenue
            FROM sales
            WHERE user_id = ? AND status = 'confirmed' AND sale_date >= date('now', '-${period}')
            GROUP BY DATE(sale_date)
            ORDER BY date ASC
        `;
        return this.all(sql, [userId]);
    }

    async getConversationsOverTime(userId, period = '30 days') {
        const sql = `
            SELECT 
                DATE(start_time) as date,
                COUNT(*) as conversation_count,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
            FROM conversations
            WHERE user_id = ? AND start_time >= date('now', '-${period}')
            GROUP BY DATE(start_time)
            ORDER BY date ASC
        `;
        return this.all(sql, [userId]);
    }

    // Métodos para sessões
    async createSession(sessionData) {
        const { id, user_id, expires_at, ip_address, user_agent } = sessionData;
        const sql = `
            INSERT INTO user_sessions (id, user_id, expires_at, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `;
        return this.run(sql, [id, user_id, expires_at, ip_address, user_agent]);
    }

    async getSession(sessionId) {
        const sql = `
            SELECT s.*, u.email, u.name, u.agent_id
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ? AND s.expires_at > CURRENT_TIMESTAMP
        `;
        return this.get(sql, [sessionId]);
    }

    async deleteSession(sessionId) {
        const sql = 'DELETE FROM user_sessions WHERE id = ?';
        return this.run(sql, [sessionId]);
    }

    async deleteExpiredSessions() {
        const sql = 'DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP';
        return this.run(sql);
    }

    // Log de eventos
    async logEvent(eventData) {
        const { user_id, event_type, event_description, metadata, ip_address, user_agent } = eventData;
        const sql = `
            INSERT INTO event_logs (user_id, event_type, event_description, metadata, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        return this.run(sql, [user_id, event_type, event_description, JSON.stringify(metadata || {}), ip_address, user_agent]);
    }

    // Fechar conexão
    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar banco:', err.message);
                } else {
                    console.log('Conexão com banco fechada');
                }
            });
        }
    }
}

// Instância única do banco
const database = new Database();

module.exports = database; 