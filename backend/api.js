const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const winston = require('winston');
require('dotenv').config();

const database = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Middleware de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }
});
app.use(limiter);

// Rate limiting mais restritivo para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // máximo 5 tentativas de login por IP
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de log
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Schemas de validação
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    company_name: Joi.string().optional(),
    agent_id: Joi.string().required()
});

// Middleware de autenticação JWT
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await database.getUserById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        logger.error('Erro na autenticação:', error);
        return res.status(403).json({ error: 'Token inválido' });
    }
};

// Middleware de log de eventos
const logEvent = (eventType, description, metadata = {}) => {
    return (req, res, next) => {
        const eventData = {
            user_id: req.user?.id || null,
            event_type: eventType,
            event_description: description,
            metadata,
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        };
        
        database.logEvent(eventData).catch(err => {
            logger.error('Erro ao registrar evento:', err);
        });
        
        next();
    };
};

// ==================== ROTAS ====================

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Login
app.post('/api/login', loginLimiter, async (req, res) => {
    try {
        // Validar entrada
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = value;

        // Buscar usuário
        const user = await database.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Atualizar último login
        await database.updateUserLastLogin(user.id);

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log do evento
        await database.logEvent({
            user_id: user.id,
            event_type: 'login',
            event_description: 'Login realizado com sucesso',
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
        });

        logger.info(`Login bem-sucedido para usuário: ${email}`);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company_name: user.company_name,
                agent_id: user.agent_id
            }
        });

    } catch (error) {
        logger.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Logout
app.post('/api/logout', authenticateToken, logEvent('logout', 'Logout realizado'), async (req, res) => {
    res.json({ success: true, message: 'Logout realizado com sucesso' });
});

// Verificar token
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            company_name: req.user.company_name,
            agent_id: req.user.agent_id
        }
    });
});

// Dashboard - Métricas principais
app.get('/api/dashboard/metrics', authenticateToken, logEvent('view_dashboard', 'Visualização do dashboard'), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const metrics = await database.getDashboardMetrics(req.user.id, startDate, endDate);
        
        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        logger.error('Erro ao buscar métricas:', error);
        res.status(500).json({ error: 'Erro ao buscar métricas' });
    }
});

// Top produtos
app.get('/api/dashboard/top-products', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const products = await database.getTopProducts(req.user.id, limit);
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        logger.error('Erro ao buscar top produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

// Top objeções
app.get('/api/dashboard/top-objections', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const objections = await database.getTopObjections(req.user.id, limit);
        
        res.json({
            success: true,
            data: objections
        });
    } catch (error) {
        logger.error('Erro ao buscar objeções:', error);
        res.status(500).json({ error: 'Erro ao buscar objeções' });
    }
});

// Top motivos de contato
app.get('/api/dashboard/contact-reasons', authenticateToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const reasons = await database.getTopContactReasons(req.user.id, limit);
        
        res.json({
            success: true,
            data: reasons
        });
    } catch (error) {
        logger.error('Erro ao buscar motivos de contato:', error);
        res.status(500).json({ error: 'Erro ao buscar motivos de contato' });
    }
});

// Vendas ao longo do tempo
app.get('/api/dashboard/sales-over-time', authenticateToken, async (req, res) => {
    try {
        const period = req.query.period || '30 days';
        const sales = await database.getSalesOverTime(req.user.id, period);
        
        res.json({
            success: true,
            data: sales
        });
    } catch (error) {
        logger.error('Erro ao buscar vendas ao longo do tempo:', error);
        res.status(500).json({ error: 'Erro ao buscar dados de vendas' });
    }
});

// Conversas ao longo do tempo
app.get('/api/dashboard/conversations-over-time', authenticateToken, async (req, res) => {
    try {
        const period = req.query.period || '30 days';
        const conversations = await database.getConversationsOverTime(req.user.id, period);
        
        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        logger.error('Erro ao buscar conversas ao longo do tempo:', error);
        res.status(500).json({ error: 'Erro ao buscar dados de conversas' });
    }
});

// Exportar dados (CSV)
app.get('/api/export/:type', authenticateToken, logEvent('export_data', 'Exportação de dados'), async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate } = req.query;
        
        let data = [];
        let filename = '';
        
        switch (type) {
            case 'sales':
                data = await database.getSalesOverTime(req.user.id, '365 days');
                filename = 'vendas.csv';
                break;
            case 'conversations':
                data = await database.getConversationsOverTime(req.user.id, '365 days');
                filename = 'conversas.csv';
                break;
            case 'products':
                data = await database.getTopProducts(req.user.id, 100);
                filename = 'produtos.csv';
                break;
            case 'objections':
                data = await database.getTopObjections(req.user.id, 100);
                filename = 'objecoes.csv';
                break;
            default:
                return res.status(400).json({ error: 'Tipo de exportação inválido' });
        }
        
        // Converter para CSV
        if (data.length === 0) {
            return res.status(404).json({ error: 'Nenhum dado encontrado para exportação' });
        }
        
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);
        
    } catch (error) {
        logger.error('Erro na exportação:', error);
        res.status(500).json({ error: 'Erro ao exportar dados' });
    }
});

// Criar usuário (admin only - pode ser usado para setup inicial)
app.post('/api/admin/create-user', async (req, res) => {
    try {
        // Validar entrada
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password, name, company_name, agent_id } = value;

        // Verificar se usuário já existe
        const existingUser = await database.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso' });
        }

        // Hash da senha
        const password_hash = await bcrypt.hash(password, 12);

        // Criar usuário
        const result = await database.createUser({
            email,
            password_hash,
            name,
            company_name,
            agent_id,
            settings: { theme: 'light', notifications: true }
        });

        logger.info(`Novo usuário criado: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            userId: result.lastID
        });

    } catch (error) {
        logger.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Middleware de erro global
app.use((error, req, res, next) => {
    logger.error('Erro não tratado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
async function startServer() {
    try {
        // Inicializar banco de dados
        await database.setupDatabase();
        
        // Criar diretório de logs se não existir
        const fs = require('fs');
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }
        
        // Limpeza periódica de sessões expiradas
        setInterval(async () => {
            try {
                await database.deleteExpiredSessions();
            } catch (error) {
                logger.error('Erro na limpeza de sessões:', error);
            }
        }, 60 * 60 * 1000); // A cada hora
        
        app.listen(PORT, () => {
            logger.info(`Servidor rodando na porta ${PORT}`);
            console.log(`🚀 API Dashboard de Atendimento rodando em http://localhost:${PORT}`);
        });
        
    } catch (error) {
        logger.error('Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de sinais de sistema
process.on('SIGINT', () => {
    logger.info('Recebido SIGINT, encerrando servidor...');
    database.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Recebido SIGTERM, encerrando servidor...');
    database.close();
    process.exit(0);
});

// Inicializar
startServer(); 