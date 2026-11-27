// O logo é opcional: se src/assets/logo-fabrica.png não existir, fica `undefined`.
const logos = import.meta.glob<string>('@/assets/logo-fabrica.png', { eager: true, import: 'default' })

export const logoFabrica: string | undefined = Object.values(logos)[0]
