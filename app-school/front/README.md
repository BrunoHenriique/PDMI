# Frontend do Sistema Escolar

Este é o frontend mobile do sistema escolar desenvolvido em React Native com Expo.

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Axios para requisições HTTP
- AsyncStorage para armazenamento local

## 📱 Funcionalidades

### Autenticação
- **Login**: Acesso com email e senha
- **Registro**: Cadastro de novos usuários (Aluno ou Professor)
- **Logout**: Sair do sistema

### Portal do Aluno
- Visualização do boletim com notas
- Interface personalizada para estudantes

### Portal do Professor
- Gerenciamento de disciplinas (criar, listar, excluir)
- Visualização de alunos matriculados
- Visualização de matrículas e notas
- Interface administrativa

## 🛠️ Como Executar

### Pré-requisitos
- Node.js
- npm ou yarn
- Expo CLI
- Backend rodando na porta 3000

### Passos

1. **Instalar dependências**:
```bash
npm install
```

2. **Configurar a URL da API**:
   - Abra `service/api.ts`
   - Altere `API_BASE_URL` para apontar para seu backend
   - Se estiver testando em dispositivo físico, use o IP da máquina ao invés de localhost

3. **Executar o projeto**:
```bash
npm start
```

4. **Abrir no dispositivo**:
   - Use o Expo Go no seu celular para escanear o QR code
   - Ou pressione 'w' para abrir no navegador

## 🔧 Configuração da API

O arquivo `service/api.ts` contém a configuração base do Axios. Por padrão está configurado para:
- URL: `http://localhost:3000`
- Timeout: 10 segundos
- Headers automáticos com JWT token

### Interceptors Configurados

- **Request**: Adiciona automaticamente o token JWT nas requisições
- **Response**: Remove token automático em caso de erro 401 (token expirado)

## 📄 Estrutura de Arquivos

```
front/
├── pages/
│   ├── home.tsx              # Página inicial de boas-vindas
│   ├── Login.tsx             # Tela de login
│   ├── Register.tsx          # Tela de cadastro
│   ├── AlunoHome.tsx         # Dashboard do aluno
│   └── ProfessorHome.tsx     # Dashboard do professor
├── service/
│   ├── api.ts                # Configuração base do Axios
│   ├── types.ts              # Interfaces TypeScript
│   ├── authService.ts        # Serviços de autenticação
│   ├── alunoService.ts       # Serviços de aluno
│   ├── professorService.ts   # Serviços de professor
│   ├── disciplinaService.ts  # Serviços de disciplina
│   ├── matriculaService.ts   # Serviços de matrícula
│   └── professorHasDisciplinaService.ts
└── App.tsx                   # Componente principal
```

## 🔐 Fluxo de Autenticação

1. **Primeiro Acesso**: Tela de boas-vindas com opções de login/cadastro
2. **Login**: Usuário faz login e recebe token JWT
3. **Armazenamento**: Token e tipo de usuário salvos no AsyncStorage
4. **Navegação**: Redirecionamento automático baseado no tipo de usuário
5. **Persistência**: App verifica token ao iniciar e mantém usuário logado

## 📊 APIs Integradas

### Autenticação (`/auth`)
- `POST /auth` - Cadastro de usuário
- `POST /auth/signin` - Login
- `PUT /auth` - Atualização de senha

### Alunos (`/aluno`)
- `GET /aluno` - Listar alunos
- `POST /aluno` - Criar aluno
- `PUT /aluno` - Atualizar aluno
- `DELETE /aluno` - Excluir aluno
- `GET /aluno/:id/bulletin` - Boletim do aluno

### Professores (`/professor`)
- `GET /professor` - Listar professores
- `POST /professor` - Criar professor
- `PUT /professor` - Atualizar professor
- `DELETE /professor` - Excluir professor

### Disciplinas (`/disciplina`)
- `GET /disciplina` - Listar disciplinas
- `POST /disciplina` - Criar disciplina
- `PUT /disciplina` - Atualizar disciplina
- `DELETE /disciplina` - Excluir disciplina

### Matrículas (`/matricula`)
- `GET /matricula` - Listar matrículas
- `POST /matricula` - Criar matrícula
- `PUT /matricula` - Atualizar matrícula (adicionar notas)
- `DELETE /matricula` - Excluir matrícula

## 🎨 Interface

- **Design System**: Cores consistentes e tipografia padronizada
- **Responsivo**: Interface adaptável a diferentes tamanhos de tela
- **UX**: Feedback visual para todas as ações do usuário
- **Navegação**: Fluxo intuitivo entre as telas

## 🚨 Tratamento de Erros

- Interceptors de requisição para tratamento automático de erros
- Alertas informativos para o usuário
- Logout automático em caso de token expirado
- Validações de formulário client-side

## 📱 Teste no Dispositivo

Para testar em um dispositivo físico:

1. Conecte o dispositivo na mesma rede WiFi
2. Altere `localhost` para o IP da sua máquina em `service/api.ts`
3. Execute `npm start` e escaneie o QR code com o Expo Go

Exemplo de configuração de IP:
```typescript
const API_BASE_URL = 'http://192.168.1.100:3000';
```