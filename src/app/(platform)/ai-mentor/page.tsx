export default function AIMentorPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in duration-500 h-[calc(100vh-5rem)] flex flex-col">
      <div className="text-center mb-6 shrink-0">
        <h1 className="text-4xl font-bold mb-2">AI Mentor</h1>
        <p className="text-muted-foreground">
          Добро пожаловать! Спроси меня о национальных играх, традициях и культурном наследии Казахстана.
        </p>
      </div>

      <div className="flex-1 bg-card border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
          {/* Mock chat message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-secondary text-secondary-foreground px-4 py-3 rounded-2xl rounded-tl-sm">
              <p className="text-sm font-semibold mb-1">AI Mentor</p>
              <p>Сәлеметсіз бе! Я ваш цифровой наставник по культуре Великой Степи. Какую национальную игру или традицию вы хотите изучить сегодня?</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-card border-t shrink-0">
          <form className="flex gap-2">
            <input
              type="text"
              placeholder="Спросите о правилах Асық ату..."
              className="flex-1 px-4 py-2 rounded-md border bg-background"
            />
            <button
              type="button"
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
