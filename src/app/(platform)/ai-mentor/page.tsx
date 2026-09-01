'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { ShanyraqMark } from '@/components/ui/heritage/ShanyraqMark'
import { HeritageButton } from '@/components/ui/heritage/HeritageButton'
import { Send, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

interface Message {
  sender: 'ai' | 'user'
  text: string
  timestamp: Date
}

const KNOWLEDGE_BASE = [
  {
    keywords: ['асық ату', 'асык', 'asyk', 'правила асык', 'как играть'],
    response: 'Асық ату — одна из старейших игр кочевников. Играют костями надпяточного сустава овцы (асыками). Цель игры — выбить асыки соперников из круга с помощью своего тяжелого асыка (Сақа). Успех зависит от точности, силы броска и глазомера. Положение кости "Алшы" (ребром вверх) считается самым удачливым!'
  },
  {
    keywords: ['тоғызқұмалақ', 'тогызкумалак', 'алгебра', 'логика'],
    response: 'Тоғызқұмалақ (девять камешков) называют "алгеброй чабанов". Это настольная логическая игра. У каждого игрока по 9 лунок (отау) и один накопитель (қазан). В начале в каждой лунке лежит по 9 шариков (құмалақ). Игроки делают ходы, распределяя шарики. Цель — собрать более 81 шарика в свой қазан.'
  },
  {
    keywords: ['келін шай', 'келин шай', 'чай', 'невестка'],
    response: 'Келін шай — красивая традиция гостеприимства и уважения. Молодая невестка (келін) заваривает и разливает чай гостям и родственникам мужа. Важно наливать чай понемногу (с уважением), не допуская полного остывания чайника. Эта традиция демонстрирует культуру общения, этикет и гостеприимство.'
  },
  {
    keywords: ['жамбы ату', 'лук', 'стрельба', 'всадник'],
    response: 'Жамбы ату — традиционная казахская стрельба из лука на скаку. Всадник на высокой скорости должен попасть в подвешенную серебряную мишень (жамбы). Игра развивает меткость, координацию и невероятную наездническую ловкость.'
  },
  {
    keywords: ['арқан тартыс', 'аркан тартыс', 'перетягивание'],
    response: 'Арқан тартыс — национальное перетягивание каната. В нашей 3D-версии игры вы используете механику "Hold & Release" (удержание и своевременное отпускание силы), чтобы поймать идеальный ритм команды и перетянуть канат на свою сторону!'
  },
  {
    keywords: ['құсбегілік', 'беркут', 'охота', 'птицы'],
    response: 'Құсбегілік — искусство дрессировки ловчих птиц (беркутов, соколов). Это не просто охота, а глубокая духовная связь человека и дикой птицы. В игре вы учитесь управлять полётом беркута и завоевывать его доверие.'
  }
]

const DEFAULT_RESPONSE = 'Керемет сұрақ! Я с радостью расскажу вам о национальных играх Казахстана. Вы можете спросить меня о правилах Асық ату, Тоғызқұмалақ, Келін шай, Жамбы ату или Арқан тартыс.'

export default function AIMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Сәлеметсіз бе! Я ваш цифровой AI-наставник по культуре Великой Степи. Расскажу о правилах, истории и тонкостях национальных игр Казахстана. О чём вы хотите узнать сегодня?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return

    const userMessage: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking and typing
    setTimeout(() => {
      const lowerText = textToSend.toLowerCase()
      let replyText = DEFAULT_RESPONSE

      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some(keyword => lowerText.includes(keyword))) {
          replyText = item.response
          break
        }
      }

      const aiMessage: Message = {
        sender: 'ai',
        text: replyText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1200)
  }

  const suggestions = [
    'Асық ату ережесі қандай?',
    'Тоғызқұмалақ туралы айтшы',
    'Келін шай дәстүрі не білдіреді?',
    'Арқан тартыс қалай ойналады?'
  ]

  return (
    <div className="w-full flex-1 flex flex-col bg-background relative overflow-hidden">
      {/* Background Ornament Pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/textures/sand.png')] mix-blend-overlay z-0" />
      
      {/* Upper header */}
      <MaterialSurface material="nightSky" className="py-12 border-b border-border/20 shadow-md relative z-10 shrink-0">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center bg-surface-elevated">
              <ShanyraqMark size="sm" className="text-gold" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-foreground">
                AI Mentor
              </h1>
              <p className="text-xs text-text-muted font-heading uppercase tracking-widest">
                Цифрлық мәдени кеңесші
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Онлайн көмекші
          </div>
        </div>
      </MaterialSurface>

      {/* Main chat layout */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col overflow-hidden relative z-10 gap-6">
        
        {/* Chat Window container */}
        <div className="flex-1 bg-surface border border-border/30 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
          
          {/* Subtle watermark ornament in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <KazakhOrnament variant="tumar" className="w-[400px] h-[400px] text-gold" />
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[85%] px-5 py-4 rounded-3xl relative shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gold text-primary rounded-tr-none font-medium' 
                      : 'bg-surface-elevated border border-border/40 text-foreground rounded-tl-none'
                  }`}
                >
                  <p className={`text-[10px] font-heading uppercase tracking-wider mb-1 ${
                    msg.sender === 'user' ? 'text-primary/70' : 'text-gold'
                  }`}>
                    {msg.sender === 'user' ? 'СЕН' : 'AI MENTOR'}
                  </p>
                  <p className="leading-relaxed text-sm md:text-base font-serif">
                    {msg.text}
                  </p>
                  <span className={`block text-[9px] text-right mt-2 ${
                    msg.sender === 'user' ? 'text-primary/50' : 'text-text-muted'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-elevated border border-border/40 px-5 py-4 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce duration-1000" />
                  <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce duration-1000 delay-150" />
                  <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce duration-1000 delay-300" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-6 py-3 bg-background/50 border-t border-border/10 flex gap-2 overflow-x-auto no-scrollbar shrink-0 select-none">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="px-4 py-2 rounded-full border border-border/40 bg-surface text-xs font-semibold text-text-muted hover:border-gold hover:text-gold transition-colors duration-300 whitespace-nowrap"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Form Input */}
          <div className="p-4 bg-surface border-t border-border/30 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputValue)
              }} 
              className="flex gap-3 items-center bg-background/50 border border-border/40 rounded-2xl p-2 pl-4 focus-within:border-gold/50 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Сауалыңызды осы жерге жазыңыз..."
                className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder-text-muted text-sm md:text-base"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  inputValue.trim() 
                    ? 'bg-gold text-primary shadow-lg hover:scale-105 active:scale-95' 
                    : 'bg-surface text-text-muted border border-border/10 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
