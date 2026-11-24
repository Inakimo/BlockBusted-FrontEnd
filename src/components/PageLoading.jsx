function PageLoading({ texto = 'Cargando...' }) {
  return (
    <div className="w-full py-space-xl flex items-center justify-center">
      <p className="font-headline-md text-headline-md text-cream uppercase tracking-wider">{texto}</p>
    </div>
  )
}

export default PageLoading
