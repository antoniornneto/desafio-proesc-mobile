export interface User {
  nome: string;
  matricula: string;
  turma: string;
  turno: string;
  cpf: string;
  cursoAno: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'html' | 'image';
  category: 'historico' | 'boletim' | 'declaracao' | 'comunicado';
  url: string;
  date: string;
  size: string;
}

export interface UploadedDocument {
  id: string;
  title: string;
  category: 'atestado' | 'justificativa' | 'requerimento';
  status: 'enviado' | 'em_analise' | 'aprovado' | 'rejeitado';
  uploadDate: string;
  file: File;
}
