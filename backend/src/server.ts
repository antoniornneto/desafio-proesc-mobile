import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const users = [
  {
    matricula: "2025070015",
    senha: "123321",
    nome: "Carlos Eduardo Oliveira Nascimento",
    cpf: "98765432100",
    rgNum: "987654321",
    rgEmissor: "SPP/AP",
    turma: "B",
    cursoAno: "7º Ano do Ensino Fundamental",
    turno: "Matutino",
    nomePai: "Eduardo Silva Nascimento",
    nomeMae: "Carla Oliveira Nascimento",
  },
];

app.get("/", (req: Request, res: Response) => {
  res.json({ message: `Servidor rodando na porta: ${PORT}` });
});

app.post("/auth/login", (req: Request, res: Response) => {
  const { matricula, senha } = req.body;

  const user = users.find(
    (u) => u.matricula === matricula && u.senha === senha
  );

  if (!user) {
    return res.status(401).json({ message: "Matrícula ou senha incorretos" });
  }

  res.status(200).json({
    message: "Login realizado.",
    user: {
      matricula: user.matricula,
      nome: user.nome,
      turma: user.turma,
      cursoAno: user.cursoAno,
      turno: user.turno,
      cpf: user.cpf,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
