import { Document } from './interfaces';

export type LoginFormData = {
  matricula: string;
  senha: string;
};

export type userSession = {
  nome: string;
  matricula: string;
  turma: string;
  turno: string;
  cpf: string;
  cursoAno: string;
};

export type AppStackParamList = {
  Home: undefined;
  AvailableDocuments: undefined;
  SentDocuments: undefined;
  DocumentViewer: { doc: Document };
};
