# Desafio Técnico Proesc: Portal de Documentos do Aluno

## **Descrição do Projeto**

Foi desenvolvido um app simulando um portal escolar onde o aluno/responsável faz o login, visualiza documentos escolares e pode enviar novos documentos para a escola.

Abaixo segue os passos para rodar o projeto em seu computador.

## **Configuração inicial**

Faça o clone do repositório na sua área de trabalho (ou caminho de sua preferência) fazendo o download do arquivo .ZIP ou via terminal. Caso tenha feito o download, extraia os arquivos e acesse a pasta via terminal seguindo o caminho de onde a pasta foi extraída.

**Requisitos Importantes:**

- Para testar o aplicativo, é altamente recomendado que você tenha o aplicativo `Expo Go` instalado em seu celular. Outra alterantiva é usar um emulador em seu computador.
- Para cada pasta do projeto, você irá utilizar uma janela independente do CMD. Portanto, use uma para rodar o servidor e outra para rodar a aplicação mantendo as duas abertas.

### **1. Subindo o servidor (Backend)**

1.1 Com uma das janelas do CMD na raíz do projeto, acesse a pasta `backend` para fazer a instalação e subir o servidor:

```
cd backend

npm install
```

1.2 Após finalizar a instalação digite:

```
npm run dev
```

1.3 No seu terminal, você deve visualizar uma mensagem semelhante a:

![server no terminal](image/server.png)

> _Obs: Se você já tiver algum projeto rodando na porta 3000, acesse o arquivo `server.ts` em `desafio-proesc-mobile/backend/src/server.ts` e altere a variável `PORT` para uma porta livre._

### **2. Iniciando a aplicação (Frontend)**

Com o servidor rodando em uma das janelas do CMD, vamos instalar e iniciar a aplicação em outra.

2.1 Utilize uma segunda janela do CMD também na raíz do projeto e acesse a pasta `frontend` e instale as dependências:

```
cd frontend

npm install
```

2.2 Aguarde até o final da instalação e depois rode o projeto:

```
npx expo start
```

2.3 Com a aplicação rodando, você pode:

- Apontar a camera do celular para o QR code no terminal (iOS);
- Scanear o QR code com o Expo Go (Android);
- Apertar a tecla `a` no terminal que está rodando a aplicação para rodar no emulador Android (lembre-se de que o emulador precisa estar ligado);
- Apertar a tecla `i` no terminal que está rodando a aplicação para rodar no emulador iOS (lembre-se de que o emulador precisa estar ligado);
- Se você estiver visualizando a tela abaixo, deu tudo certo:
  ![tela de login](/image/loginScreen.png)

### **Credenciais de teste**

- Matrícula: 2025070015
- Senha: 123321
