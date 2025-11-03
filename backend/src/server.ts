import express, { Request, Response } from "express";
import cors from "cors";
import path, { extname } from "path";
import data from "../public/assets/mock/data.json";
import fs from "fs";
import { Document } from "./type";
import multer, { diskStorage } from "multer";
import crypto from "crypto";

const app = express();
export const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/assets/uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({ storage });

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

app.post(
  "/api/student/documents/upload",
  upload.single("file"),
  (req: Request, res: Response) => {
    const { title, category, type, size } = req.body;
    const file = req.file;

    if (!title || !category) {
      return res
        .status(400)
        .json({ message: "Título e categoria são obrigatórios." });
    }

    if (!file) {
      return res.status(400).json({ message: "Arquivo é obrigatório." });
    }
    const fileType = type || extname(file.originalname).substring(1);

    // Use o tamanho do multer se não vier no corpo
    const fileSize = file.size.toString();

    const fileUrl = `/assets/uploads/${file.filename}`;

    const newDoc: Document = {
      id: crypto.randomUUID(),
      title,
      category,
      type: fileType,
      url: fileUrl,
      status: data.documentStatus.ENVIADO,
      date: new Date().toISOString(),
      size: fileSize,
    };

    (data.uploadedDocuments as Document[]).push(newDoc);

    fs.writeFileSync(
      path.join(__dirname, "../public/assets/mock/data.json"),
      JSON.stringify(data, null, 2)
    );

    return res.status(201).json({
      message: "Documento enviado com sucesso.",
      document: newDoc,
    });
  }
);

app.put("/api/student/documents/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res
      .status(400)
      .json({ message: "ID do documento e status são obrigatórios." });
  }

  // Encontrar o documento pelo ID
  const documentIndex = (data.uploadedDocuments as Document[]).findIndex(
    (doc) => doc.id === id
  );

  if (documentIndex === -1) {
    return res.status(404).json({ message: "Documento não encontrado." });
  }

  // Atualizar o status
  (data.uploadedDocuments as Document[])[documentIndex].status = status;

  // Persistir as alterações no JSON
  fs.writeFileSync(
    path.join(__dirname, "../public/assets/mock/data.json"),
    JSON.stringify(data, null, 2)
  );

  return res.status(200).json({
    message: "Status atualizado com sucesso.",
    document: (data.uploadedDocuments as Document[])[documentIndex],
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
