#!/usr/bin/env node

const database = require('../db');
const { v4: uuidv4 } = require('uuid');

// Dados de exemplo para demonstração
const SAMPLE_DATA = {
    products: [
        { product_id: 'PROD001', name: 'Curso de Marketing Digital', price: 497.00, category: 'Educação' },
        { product_id: 'PROD002', name: 'Consultoria Empresarial', price: 1500.00, category: 'Serviços' },
        { product_id: 'PROD003', name: 'E-book Growth Hacking', price: 97.00, category: 'Educação' },
        { product_id: 'PROD004', name: 'Mentoria Individual', price: 800.00, category: 'Serviços' },
        { product_id: 'PROD005', name: 'Template de Landing Page', price: 197.00, category: 'Ferramentas' }
    ],
    
    conversations: [
        { customer_phone: '+5511999887766', customer_name: 'João Silva', status: 'completed' },
        { customer_phone: '+5511888776655', customer_name: 'Maria Santos', status: 'active' },
        { customer_phone: '+5511777665544', customer_name: 'Carlos Oliveira', status: 'completed' },
        { customer_phone: '+5511666554433', customer_name: 'Ana Costa', status: 'abandoned' },
        { customer_phone: '+5511555443322', customer_name: 'Pedro Souza', status: 'completed' }
    ],
    
    objections: [
        { type: 'preço', text: 'Está muito caro para mim', customer_message: 'Não posso pagar esse valor agora' },
        { type: 'tempo', text: 'Não tenho tempo agora', customer_message: 'Estou muito ocupado essa semana' },
        { type: 'confiança', text: 'Preciso pensar melhor', customer_message: 'Não conheço bem a empresa' },
        { type: 'necessidade', text: 'Não preciso disso agora', customer_message: 'Talvez no futuro' },
        { type: 'decisão', text: 'Preciso conversar com meu sócio', customer_message: 'Não posso decidir sozinho' }
    ],
    
    contactReasons: [
        { category: 'dúvida', subcategory: 'produto', description: 'Dúvidas sobre funcionalidades' },
        { category: 'compra', subcategory: 'pagamento', description: 'Informações sobre formas de pagamento' },
        { category: 'suporte', subcategory: 'técnico', description: 'Problemas técnicos' },
        { category: 'reclamação', subcategory: 'entrega', description: 'Atraso na entrega' },
        { category: 'compra', subcategory: 'desconto', description: 'Solicitação de desconto' }
    ]
};

// Função para gerar data aleatória nos últimos N dias
function randomDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    return date.toISOString();
}

// Função para gerar dados realistas
function generateRandomData(userId) {
    const data = {
        conversations: [],
        products: [],
        sales: [],
        objections: [],
        contactReasons: [],
        messages: []
    };
    
    // Gerar produtos
    SAMPLE_DATA.products.forEach(product => {
        data.products.push({
            user_id: userId,
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            category: product.category,
            description: `Descrição detalhada do produto ${product.name}`
        });
    });
    
    // Gerar conversas dos últimos 60 dias
    for (let i = 0; i < 50; i++) {
        const conversation = {
            user_id: userId,
            conversation_id: `conv_${uuidv4().slice(0, 8)}`,
            customer_phone: `+5511${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
            customer_name: `Cliente ${i + 1}`,
            status: ['active', 'completed', 'abandoned'][Math.floor(Math.random() * 3)],
            start_time: randomDate(60),
            channel: 'whatsapp'
        };
        
        if (conversation.status === 'completed') {
            const startTime = new Date(conversation.start_time);
            const endTime = new Date(startTime.getTime() + (Math.random() * 3600000)); // até 1 hora
            conversation.end_time = endTime.toISOString();
            conversation.duration = Math.floor((endTime - startTime) / 1000);
        }
        
        data.conversations.push(conversation);
    }
    
    // Gerar vendas (30% das conversas completadas resultam em venda)
    const completedConversations = data.conversations.filter(c => c.status === 'completed');
    const salesCount = Math.floor(completedConversations.length * 0.3);
    
    for (let i = 0; i < salesCount; i++) {
        const conversation = completedConversations[i];
        const product = SAMPLE_DATA.products[Math.floor(Math.random() * SAMPLE_DATA.products.length)];
        
        data.sales.push({
            user_id: userId,
            conversation_id: conversation.conversation_id,
            product_id: product.product_id,
            sale_id: `sale_${uuidv4().slice(0, 8)}`,
            customer_phone: conversation.customer_phone,
            customer_name: conversation.customer_name,
            quantity: Math.floor(Math.random() * 3) + 1,
            unit_price: product.price,
            total_amount: product.price * (Math.floor(Math.random() * 3) + 1),
            status: 'confirmed',
            sale_date: conversation.end_time || conversation.start_time,
            payment_method: ['cartão', 'pix', 'boleto'][Math.floor(Math.random() * 3)]
        });
    }
    
    // Gerar objeções
    for (let i = 0; i < 30; i++) {
        const objection = SAMPLE_DATA.objections[Math.floor(Math.random() * SAMPLE_DATA.objections.length)];
        const conversation = data.conversations[Math.floor(Math.random() * data.conversations.length)];
        
        data.objections.push({
            user_id: userId,
            conversation_id: conversation.conversation_id,
            objection_type: objection.type,
            objection_text: objection.text,
            customer_message: objection.customer_message,
            timestamp: randomDate(45),
            was_handled: Math.random() > 0.3 // 70% são tratadas
        });
    }
    
    // Gerar motivos de contato
    for (let i = 0; i < 40; i++) {
        const reason = SAMPLE_DATA.contactReasons[Math.floor(Math.random() * SAMPLE_DATA.contactReasons.length)];
        const conversation = data.conversations[Math.floor(Math.random() * data.conversations.length)];
        
        data.contactReasons.push({
            user_id: userId,
            conversation_id: conversation.conversation_id,
            reason_category: reason.category,
            reason_subcategory: reason.subcategory,
            description: reason.description,
            timestamp: randomDate(30),
            resolution_status: ['open', 'resolved', 'escalated'][Math.floor(Math.random() * 3)]
        });
    }
    
    return data;
}

async function seedDatabase() {
    try {
        console.log('🌱 Iniciando população do banco com dados de exemplo...');
        
        // Buscar usuários existentes
        const users = await database.all('SELECT * FROM users WHERE is_active = 1');
        
        if (users.length === 0) {
            console.log('❌ Nenhum usuário encontrado. Execute primeiro: npm run setup-db');
            return;
        }
        
        for (const user of users) {
            console.log(`📊 Gerando dados para usuário: ${user.name} (${user.email})`);
            
            // Verificar se já tem dados
            const existingData = await database.get(
                'SELECT COUNT(*) as count FROM conversations WHERE user_id = ?',
                [user.id]
            );
            
            if (existingData.count > 0) {
                console.log(`ℹ️  Usuário ${user.email} já possui dados. Pulando...`);
                continue;
            }
            
            const sampleData = generateRandomData(user.id);
            
            // Inserir produtos
            for (const product of sampleData.products) {
                await database.run(`
                    INSERT INTO products (user_id, product_id, name, description, price, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [product.user_id, product.product_id, product.name, product.description, product.price, product.category]);
            }
            
            // Inserir conversas
            for (const conv of sampleData.conversations) {
                await database.run(`
                    INSERT INTO conversations (user_id, conversation_id, customer_phone, customer_name, status, start_time, end_time, duration, channel)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [conv.user_id, conv.conversation_id, conv.customer_phone, conv.customer_name, conv.status, conv.start_time, conv.end_time, conv.duration, conv.channel]);
            }
            
            // Buscar IDs reais dos produtos e conversas inseridas
            const insertedProducts = await database.all('SELECT * FROM products WHERE user_id = ?', [user.id]);
            const insertedConversations = await database.all('SELECT * FROM conversations WHERE user_id = ?', [user.id]);
            
            // Inserir vendas
            for (const sale of sampleData.sales) {
                const product = insertedProducts.find(p => p.product_id === sale.product_id);
                const conversation = insertedConversations.find(c => c.conversation_id === sale.conversation_id);
                
                if (product && conversation) {
                    await database.run(`
                        INSERT INTO sales (user_id, conversation_id, product_id, sale_id, customer_phone, customer_name, quantity, unit_price, total_amount, status, sale_date, payment_method)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [sale.user_id, conversation.id, product.id, sale.sale_id, sale.customer_phone, sale.customer_name, sale.quantity, sale.unit_price, sale.total_amount, sale.status, sale.sale_date, sale.payment_method]);
                }
            }
            
            // Inserir objeções
            for (const objection of sampleData.objections) {
                const conversation = insertedConversations.find(c => c.conversation_id === objection.conversation_id);
                
                if (conversation) {
                    await database.run(`
                        INSERT INTO objections (user_id, conversation_id, objection_type, objection_text, customer_message, timestamp, was_handled)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [objection.user_id, conversation.id, objection.objection_type, objection.objection_text, objection.customer_message, objection.timestamp, objection.was_handled]);
                }
            }
            
            // Inserir motivos de contato
            for (const reason of sampleData.contactReasons) {
                const conversation = insertedConversations.find(c => c.conversation_id === reason.conversation_id);
                
                if (conversation) {
                    await database.run(`
                        INSERT INTO contact_reasons (user_id, conversation_id, reason_category, reason_subcategory, description, timestamp, resolution_status)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [reason.user_id, conversation.id, reason.reason_category, reason.reason_subcategory, reason.description, reason.timestamp, reason.resolution_status]);
                }
            }
            
            console.log(`✅ Dados criados para ${user.name}:`);
            console.log(`   - ${sampleData.products.length} produtos`);
            console.log(`   - ${sampleData.conversations.length} conversas`);
            console.log(`   - ${sampleData.sales.length} vendas`);
            console.log(`   - ${sampleData.objections.length} objeções`);
            console.log(`   - ${sampleData.contactReasons.length} motivos de contato`);
        }
        
        console.log('🎉 População do banco concluída com sucesso!');
        console.log('📋 Próximo passo: Execute npm run dev para iniciar o servidor');
        
    } catch (error) {
        console.error('❌ Erro ao popular banco:', error);
        process.exit(1);
    } finally {
        database.close();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase; 