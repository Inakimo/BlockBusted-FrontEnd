function PageError({ texto }) {
  return (
    <div className="w-full py-space-xl flex items-center justify-center px-margin-sm">
      <p className="font-headline-md text-headline-md text-secondary-container uppercase text-center">{texto}</p>
    </div>
  )
}

export default PageError
