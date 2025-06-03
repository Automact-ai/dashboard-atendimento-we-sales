#!/usr/bin/env node

const database = require('../db');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
    try {
        console.log('🔧 Iniciando configuração do banco de dados...');
        
        // Configurar schema
        await database.setupDatabase();
        console.log('✅ Schema do banco criado com sucesso');
        
        // Criar usuário admin padrão se não existir
        const adminEmail = 'admin@dashboard.com';
        const existingAdmin = await database.getUserByEmail(adminEmail);
        
        if (!existingAdmin) {
            const adminPassword = 'admin123';
            const passwordHash = await bcrypt.hash(adminPassword, 12);
            
            await database.createUser({
                email: adminEmail,
                password_hash: passwordHash,
                name: 'Administrador',
                company_name: 'Dashboard Admin',
                agent_id: 'admin-agent-001',
                settings: { theme: 'light', notifications: true }
            });
            
            console.log('✅ Usuário admin criado:');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Senha: ${adminPassword}`);
            console.log('⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');
        } else {
            console.log('ℹ️  Usuário admin já existe');
        }
        
        // Criar usuário de demonstração se não existir
        const demoEmail = 'demo@empresa.com';
        const existingDemo = await database.getUserByEmail(demoEmail);
        
        if (!existingDemo) {
            const demoPassword = 'demo123';
            const passwordHash = await bcrypt.hash(demoPassword, 12);
            
            await database.createUser({
                email: demoEmail,
                password_hash: passwordHash,
                name: 'Cliente Demonstração',
                company_name: 'Empresa Demo Ltda',
                agent_id: 'demo-agent-001',
                settings: { theme: 'light', notifications: true }
            });
            
            console.log('✅ Usuário demo criado:');
            console.log(`   Email: ${demoEmail}`);
            console.log(`   Senha: ${demoPassword}`);
        } else {
            console.log('ℹ️  Usuário demo já existe');
        }
        
        console.log('🎉 Configuração do banco concluída com sucesso!');
        console.log('📋 Próximos passos:');
        console.log('   1. Execute: npm run seed-db (para dados de exemplo)');
        console.log('   2. Execute: npm run dev (para iniciar o servidor)');
        
    } catch (error) {
        console.error('❌ Erro na configuração do banco:', error);
        process.exit(1);
    } finally {
        database.close();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase; 