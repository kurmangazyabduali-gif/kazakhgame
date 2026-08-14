export default function ChampionshipPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Национальный Чемпионат</h1>
        <p className="text-muted-foreground text-lg">Соревнуйтесь с игроками со всего Казахстана</p>
      </div>
      
      <div className="flex justify-center mb-8 space-x-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-full">Global</button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-full hover:bg-secondary/80">Regional</button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-full hover:bg-secondary/80">School</button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 font-semibold border-b bg-muted/50 text-sm text-muted-foreground">
          <div className="col-span-2 text-center">Ранг</div>
          <div className="col-span-6">Игрок</div>
          <div className="col-span-4 text-right">Очки</div>
        </div>
        
        {/* Placeholder leaderboard rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/20 transition-colors">
            <div className="col-span-2 text-center font-bold text-lg">
              {i === 1 ? '🥇' : i === 2 ? '🥈' : i === 3 ? '🥉' : i}
            </div>
            <div className="col-span-6 font-medium">Игрок {i}</div>
            <div className="col-span-4 text-right font-mono font-semibold text-primary">
              {(10000 - i * 500).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
