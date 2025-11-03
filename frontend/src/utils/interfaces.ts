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
  description: string;
  size: string;
}

export interface UploadedDocument {
  id: string;
  title: string;
  category: 'atestado' | 'justificativa' | 'requerimento' | 'outros';
  status: 'enviado' | 'em_analise' | 'aprovado' | 'rejeitado';
  date: string;
  file: File;
  url: string;
  type: 'pdf' | 'docx' | 'html' | 'image';
  size: string;
  description: string;
}

export interface Categories {
  [key: string]: string;
}
