export default function AdminDashboardPage() {
  return (
    <div className="w-full p-6 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель Администратора</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Пользователей</h3>
          <p className="text-3xl font-bold">1,204</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Игровых сессий</h3>
          <p className="text-3xl font-bold">8,432</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Школ</h3>
          <p className="text-3xl font-bold">142</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-muted-foreground mb-2">Активных Игр</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card border rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Управление</h3>
          <ul className="space-y-2">
            {['Пользователи', 'Игры', 'Школы', 'Регионы', 'Традиции', 'Достижения', 'Музей'].map((item, i) => (
              <li key={i}>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-muted font-medium transition-colors">
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-2 bg-card border rounded-xl p-4 shadow-sm flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground text-center">Выберите раздел для управления контентом</p>
        </div>
      </div>
    </div>
  )
}
