# Desafio Técnico Proesc: Portal de Documentos do Aluno

## **Descrição do Projeto**

Portal escolar que permite alunos e responsáveis realizarem login, visualizarem documentos escolares e enviarem novos documentos para a instituição de ensino.

## **Pré-requisitos**

Antes de prosseguir, certifique-se de ter instalado:

- Node.js (versão 20.19.4 ou superior)
- npm ou yarn
- Expo Go no dispositivo móvel (Androido | iOS)
  - Alternativa: Emulador Android Studio ou Xcode

## **Instalação e Configuração**

### 1. Clone o Repositório

```
# Via CMD ou bash
git clone https://github.com/antoniornneto/desafio-proesc-mobile.git
cd desafio-proesc-mobile

# Ou faça o download do .ZIP e exraia
```

### 2. Configuração do backend

Abra um terminal na raíz do projeto:

```
# bash
cd backend
npm install
```

Inicie o servidor:

```
# bash
npm run dev
```

Com o servidor ativo, você deve ver uma mensagem indicando que o servidor está rodando na porta 3000.

> Se a porta 3000 estiver em ocupada:
>
> 1.  Acesse `backend/src/server.ts`
> 2.  Altere o valor da variável `PORT`
> 3.  Reinicie o servidor

### 3. Configuração do frontend

Mantenha o terminal do backend aberto e abra outra janela de terminal também na raíz do projeto para o frontend:

```
# bash
cd frontend
npm install
```

Acesse a pasta `frontend/src/utils/config.ts` e altere as variáveis:

```
const IPLOCAL = '192.168.X.XX'; # Insira o IP do seu computador
const PORT = '3000'; # Insira a mesma porta que colocou no backend na variável PORT
```

> Caso não saiba qual é o IP da sua máquina:
>
> 1.  Abra uma janela do CMD;
> 2.  Digite `ipconfig` e pressione enter;
> 3.  Copie e cole o valor final da linha `Endereço IPv4`
> 4.  Cole na variável `const IPLOCAL`

Inicie a aplicação:

```
# bash

npx expo start

---
## Rodando no celular

Após executar `npx expo start`, escolha uma das opções:

### Dispositivo físico:
- iOS: Aponte a câmera do celular para o QR code
- Android: Abra o Expo Go e escaneie o QR code

### Emuladores:
- Pressione `a` -> Android Emulador
- Pressione `i` -> iOS Emulador
```

Estrutura do projeto:

```

desafio-proesc-mobile/
├── backend/        # Servidor Node.js
│ ├── src/
│ └── package.json
├── frontend/       # Aplicativo React Native
│ ├── src/
│ └── package.json
└── image/          # Recursos de imagem

```

✅ Pronto! Essas configurações devem ser suficientes para rodar o app e testar.

## **Testes e Funcionalidades**

### 1. Tela de login

Credenciais de teste:

- matrícula: 2025070015
- senha: 123321

Na tela de login, insira as credenciais

```

```
