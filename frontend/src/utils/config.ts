const IPLOCAL = '192.168.0.6'; // Insira o IP da sua máquina
const PORT = '3000'; // Insira a mesma porta da variável PORT em backend/src/server.ts
export const BASEURL = `http://${IPLOCAL}:${PORT}`;

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export const obterNomeArquivo = (url: string): string => {
  return url.split('/').pop() || '';
};
