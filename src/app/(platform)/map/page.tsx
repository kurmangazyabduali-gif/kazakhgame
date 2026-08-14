export default function MapPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 animate-in slide-in-from-left-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Интерактивная Карта Казахстана</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Исследуйте регионы, открывайте уникальные традиции и культурное наследие Великой Степи.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-card rounded-xl border p-4 shadow-sm min-h-[500px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30" />
          {/* Placeholder for map */}
          <div className="text-center z-10">
            <span className="text-4xl">🗺️</span>
            <p className="mt-4 font-semibold text-muted-foreground">Карта загружается...</p>
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-card border rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Регионы</h3>
            <ul className="space-y-2">
              {['Астана', 'Алматы', 'Шымкент', 'Туркестанская область', 'Карагандинская область'].map((region, i) => (
                <li key={i}>
                  <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                    {region}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
