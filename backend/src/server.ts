import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import data from "../public/assets/mock/data.json";

const app = express();
export const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

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

  return res.status(200).json({
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

app.get("/api/available-categories", (req: Request, res: Response) => {
  const categoriasDoc = data.documentCategories;

  if (!categoriasDoc)
    return res
      .status(400)
      .json({ message: "Não foi possível retornar as categorias." });

  return res.status(200).json(categoriasDoc);
});

app.get("/api/status-config", (req: Request, res: Response) => {
  const statusConfig = data.statusConfig;

  if (!statusConfig)
    return res.status(400).json({
      message: "Não foi possível retornar as configurações de status.",
    });

  return res.status(200).json(statusConfig);
});

app.get("/api/student/documents", (req: Request, res: Response) => {
  const documentos = data.availableDocuments.map((doc) => ({
    ...doc,
    url: doc.url.replace("./assets/", "/assets/"),
  }));
  if (!documentos)
    return res.status(400).json({ message: "Erro ao buscar documentos." });

  return res.status(200).json(documentos);
});

app.get("/api/student/documents/uploaded", (req: Request, res: Response) => {
  try {
    const docUploadeds = data.uploadedDocuments.map((doc) => doc);
    if (!docUploadeds)
      return res.status(400).json({ message: "Erro ao buscar documentos." });

    return res.status(200).json(docUploadeds);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
