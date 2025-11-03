const IPLOCAL = '192.168.0.6'; // Insira o IP da sua máquina
const PORT = '3000'; // Insira a mesma porta da variável PORT em backend/src/server.ts
export const BASEURL = `http://${IPLOCAL}:${PORT}`;

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function obterNomeArquivo(url: string): string {
  return url.split('/').pop() || '';
}
export function formatarTamanhoArquivo(sizeStr: string): string {
  const bytes = Number(sizeStr);
  if (isNaN(bytes) || bytes < 0) return 'Valor inválido';

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0B';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  let formatted = value.toFixed(2).replace('.', ',').replace(/,00$/, '');
  return `${formatted}${sizes[i]}`;
}

export function formatarDataISO(dateStr: string): string {
  const data = new Date(dateStr);
  if (!(data instanceof Date) || isNaN(data.getTime())) return 'Data inválida';

  const dia = data.getUTCDate().toString().padStart(2, '0');
  const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
  const ano = data.getUTCFullYear().toString().slice(0);
  return `${dia}/${mes}/${ano}`;
}
