export default function GamesLibraryPage() {
  const games = [
    { id: '1', title: 'Асық ату', category: 'Ұлттық спорт', desc: 'Традиционная игра в асыки' },
    { id: '2', title: 'Келін шай', category: 'Ұлттық дәстүр', desc: 'Искусство правильной подачи чая' },
    { id: '3', title: 'Тоғызқұмалақ', category: 'Стратегия', desc: 'Национальная логическая игра' },
    { id: '4', title: 'Жамбы ату', category: 'Ұлттық спорт', desc: 'Стрельба из лука по мишени' },
    { id: '5', title: 'Құсбегілік', category: 'Ұлттық дәстүр', desc: 'Охота с ловчими птицами' },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-4">Библиотека Игр</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Изучайте казахскую культуру и тренируйте навыки через цифровые версии национальных игр и традиций.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
            <div className="aspect-video bg-muted flex items-center justify-center p-6">
              {/* Placeholder for game image */}
              <span className="text-muted-foreground font-semibold uppercase tracking-widest">{game.title}</span>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{game.category}</div>
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{game.desc}</p>
              <button className="w-full py-2 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/80 transition-colors">
                Играть
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
