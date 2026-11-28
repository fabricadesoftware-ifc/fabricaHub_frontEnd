import logo from '@/assets/logo-fabrica.png?inline'

export type ClasseArquivo = 'PDF' | 'Imagem' | 'Planilha'
export interface Arquivo {
  id: string
  nome: string
  tipo: ClasseArquivo
  bytes: number
  em: string
  autor: string
  conteudo: Blob
  usadoEm?: string
}
export const capacidade = 5 * 1024 ** 3
export function classe(nome: string): ClasseArquivo | undefined {
  const ext = nome.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'pdf') return 'PDF'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return 'Imagem'
  if (['csv', 'xlsx', 'xls', 'ods'].includes(ext)) return 'Planilha'
}
async function banco() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open('fabricahub-arquivos', 1)
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore('arquivos', { keyPath: 'id' })
      const data = atob(logo.slice(logo.indexOf(',') + 1))
      const imagem = new Blob([Uint8Array.from(data, (c) => c.charCodeAt(0))], {
        type: 'image/png',
      })
      const modelo = new Blob(['Projeto;Membro;Função;Entrada;Saída\r\n'], {
        type: 'text/csv;charset=utf-8',
      })
      const em = new Date().toISOString()
      store.add({
        id: 'logo',
        nome: 'logo-fabrica.png',
        tipo: 'Imagem',
        autor: 'Fábrica',
        em,
        bytes: imagem.size,
        conteudo: imagem,
        usadoEm: 'Sistema · marca',
      } satisfies Arquivo)
      store.add({
        id: 'modelo',
        nome: 'modelo-vinculos.csv',
        tipo: 'Planilha',
        autor: 'Fábrica',
        em,
        bytes: modelo.size,
        conteudo: modelo,
      } satisfies Arquivo)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
async function transacao<T>(
  modo: IDBTransactionMode,
  executar: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await banco()
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction('arquivos', modo)
      const req = executar(tx.objectStore('arquivos'))
      tx.oncomplete = () => resolve(req.result)
      tx.onabort = () => reject(tx.error ?? new Error('Operação interrompida.'))
    })
  } finally {
    db.close()
  }
}
export const arquivosApi = {
  listar: () => transacao<Arquivo[]>('readonly', (s) => s.getAll()),
  salvar: (a: Arquivo) => transacao('readwrite', (s) => s.add(a)),
  excluir: (id: string) => transacao('readwrite', (s) => s.delete(id)),
}
