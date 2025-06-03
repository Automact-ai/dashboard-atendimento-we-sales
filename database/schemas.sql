-- Dashboard de Atendimento - Schema do Banco de Dados SQLite
-- Criado em: 2024
-- Versão: 1.0

-- Tabela de usuários/clientes
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    agent_id VARCHAR(100) UNIQUE NOT NULL, -- Identificador único do agente de IA
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    settings JSON -- Configurações do usuário (tema, preferências)
);

-- Tabela de sessões de usuário
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de conversas/atendimentos
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    conversation_id VARCHAR(255) UNIQUE NOT NULL, -- ID externo da conversa
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, completed, abandoned
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration INTEGER, -- duração em segundos
    channel VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, telegram, etc
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de mensagens das conversas
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    message_id VARCHAR(255),
    sender_type VARCHAR(20) NOT NULL, -- 'customer', 'agent'
    content TEXT,
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, audio, document
    timestamp DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER,
    product_id INTEGER,
    sale_id VARCHAR(255) UNIQUE,
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, refunded
    sale_date DATETIME NOT NULL,
    payment_method VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Tabela de objeções
CREATE TABLE IF NOT EXISTS objections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER,
    objection_type VARCHAR(100) NOT NULL, -- preço, tempo, confiança, etc
    objection_text TEXT NOT NULL,
    customer_message TEXT, -- mensagem original do cliente
    timestamp DATETIME NOT NULL,
    was_handled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
);

-- Tabela de quebras de objeções
CREATE TABLE IF NOT EXISTS objection_resolutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    objection_id INTEGER NOT NULL,
    resolution_text TEXT NOT NULL,
    agent_response TEXT, -- resposta do agente
    was_successful BOOLEAN DEFAULT FALSE,
    timestamp DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (objection_id) REFERENCES objections(id) ON DELETE CASCADE
);

-- Tabela de motivos de contato
CREATE TABLE IF NOT EXISTS contact_reasons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER,
    reason_category VARCHAR(100) NOT NULL, -- dúvida, compra, suporte, reclamação
    reason_subcategory VARCHAR(100),
    description TEXT,
    timestamp DATETIME NOT NULL,
    resolution_status VARCHAR(50) DEFAULT 'open', -- open, resolved, escalated
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
);

-- Tabela de logs de eventos
CREATE TABLE IF NOT EXISTS event_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_type VARCHAR(100) NOT NULL, -- login, logout, view_dashboard, export_data
    event_description TEXT,
    metadata JSON, -- dados adicionais do evento
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_agent_id ON users(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_start_time ON conversations(start_time);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_objections_user_id ON objections(user_id);
CREATE INDEX IF NOT EXISTS idx_objections_timestamp ON objections(timestamp);
CREATE INDEX IF NOT EXISTS idx_contact_reasons_user_id ON contact_reasons(user_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_user_id ON event_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_timestamp ON event_logs(timestamp);

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_conversations_timestamp 
    AFTER UPDATE ON conversations
    BEGIN
        UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_products_timestamp 
    AFTER UPDATE ON products
    BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_sales_timestamp 
    AFTER UPDATE ON sales
    BEGIN
        UPDATE sales SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Views para consultas frequentes
CREATE VIEW IF NOT EXISTS dashboard_metrics AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.agent_id,
    COUNT(DISTINCT c.id) as total_conversations,
    COUNT(DISTINCT s.id) as total_sales,
    COALESCE(SUM(s.total_amount), 0) as total_revenue,
    COUNT(DISTINCT o.id) as total_objections,
    COUNT(DISTINCT CASE WHEN o.was_handled = 1 THEN o.id END) as handled_objections
FROM users u
LEFT JOIN conversations c ON u.id = c.user_id
LEFT JOIN sales s ON u.id = s.user_id AND s.status = 'confirmed'
LEFT JOIN objections o ON u.id = o.user_id
WHERE u.is_active = 1
GROUP BY u.id, u.name, u.agent_id;

CREATE VIEW IF NOT EXISTS monthly_sales_summary AS
SELECT 
    s.user_id,
    strftime('%Y-%m', s.sale_date) as month_year,
    COUNT(*) as sales_count,
    SUM(s.total_amount) as total_revenue,
    AVG(s.total_amount) as avg_sale_value
FROM sales s
WHERE s.status = 'confirmed'
GROUP BY s.user_id, strftime('%Y-%m', s.sale_date)
ORDER BY month_year DESC;

CREATE VIEW IF NOT EXISTS top_products AS
SELECT 
    p.user_id,
    p.id as product_id,
    p.name as product_name,
    COUNT(s.id) as sales_count,
    SUM(s.total_amount) as total_revenue
FROM products p
LEFT JOIN sales s ON p.id = s.product_id AND s.status = 'confirmed'
GROUP BY p.user_id, p.id, p.name
ORDER BY sales_count DESC, total_revenue DESC;

-- Inserir configurações padrão do sistema
INSERT OR IGNORE INTO system_config (config_key, config_value, description) VALUES
('app_version', '1.0.0', 'Versão atual da aplicação'),
('maintenance_mode', 'false', 'Modo de manutenção'),
('max_sessions_per_user', '5', 'Máximo de sessões simultâneas por usuário'),
('session_timeout_hours', '24', 'Timeout da sessão em horas'),
('export_limit_rows', '10000', 'Limite de linhas para exportação'),
('chart_default_period_days', '30', 'Período padrão dos gráficos em dias'); 