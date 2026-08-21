import { CulturalScenario, ScenarioState, ScenarioAction, InteractionFeedback } from '../../engine/scenario/types'

export const firstTeaScenario: CulturalScenario = {
  id: 'kelin_shai_first_tea',
  slug: 'first-tea',
  title: 'Первое чаепитие',
  category: 'guest',
  locales: ['kk', 'ru'],
  culturalRules: [
    {
      id: 'demo-serve-elder-first',
      scenario: 'Қонақ келді',
      cultural_rule: 'Сначала проявляется уважение к старшему гостю.',
      explanation: 'Demo rule for gameplay architecture. Production content must be verified with cultural advisors and linked sources.',
      source: 'Demo content',
      source_url: null,
      verified: false,
    },
    {
      id: 'demo-modest-piala-fill',
      scenario: 'Қонақ келді',
      cultural_rule: 'Пиалу не переполняют; важны аккуратность и внимание.',
      explanation: 'Demo rule for interactive tea amount scoring. Production content must be verified before release.',
      source: 'Demo content',
      source_url: null,
      verified: false,
    },
  ],
  
  npcs: [
    {
      id: 'ene',
      name: 'Ене',
      role: 'свекровь',
      ageGroup: 'elder',
      relation: 'family',
      position: { x: 260, y: 160 },
      state: 'waiting',
      preferences: { likesStrongTea: false }
    },
    {
      id: 'adult_guest',
      name: 'Қонақ',
      role: 'гость',
      ageGroup: 'adult',
      relation: 'guest',
      position: { x: 650, y: 190 },
      state: 'waiting',
      preferences: { sugar: true }
    },
    {
      id: 'younger_guest',
      name: 'Іні',
      role: 'младший гость',
      ageGroup: 'young',
      relation: 'guest',
      position: { x: 500, y: 120 },
      state: 'idle',
      preferences: { sugar: false }
    },
    {
      id: 'guest',
      name: 'Ақсақал',
      role: 'старший гость',
      ageGroup: 'elder',
      relation: 'guest',
      position: { x: 700, y: 340 },
      state: 'waiting',
      preferences: { sugar: false }
    }
  ],
  
  items: [
    { id: 'teapot', name: 'Шайник', type: 'interactable', initialPosition: { x: 450, y: 450 } },
    { id: 'cup1', name: 'Пиала 1', type: 'container', initialPosition: { x: 400, y: 400 }, state: { filled: false, sugar: false } },
    { id: 'cup2', name: 'Пиала 2', type: 'container', initialPosition: { x: 500, y: 400 }, state: { filled: false, sugar: false } },
    { id: 'cup3', name: 'Пиала 3', type: 'container', initialPosition: { x: 455, y: 390 }, state: { filled: false, sugar: false } },
    { id: 'sugar', name: 'Қант', type: 'interactable', initialPosition: { x: 550, y: 450 } },
    { id: 'bauyrsak', name: 'Бауырсақ', type: 'interactable', initialPosition: { x: 450, y: 350 }, state: { placed: false } },
    { id: 'qurt', name: 'Құрт', type: 'interactable', initialPosition: { x: 365, y: 350 }, state: { placed: false } },
    { id: 'sweets', name: 'Тәттілер', type: 'interactable', initialPosition: { x: 535, y: 350 }, state: { placed: false } },
    { id: 'napkins', name: 'Майлық', type: 'interactable', initialPosition: { x: 610, y: 430 }, state: { placed: false } }
  ],
  
  steps: [
    {
      id: 'step1_greet',
      title: 'Встреча',
      description: 'Гость вошел. Что нужно сделать?',
      npcId: 'guest',
      availableActions: ['greet', 'pour', 'place'],
      expectedActions: ['greet'],
      onAction: (action: ScenarioAction): InteractionFeedback => {
        if (action.type === 'greet' && action.targetId === 'guest') {
          return { success: true, reaction: 'smile', message: 'Гость доволен вашим приветствием.', scoreDelta: { etiquette: 5, hospitality: 10 } }
        }
        return { success: false, reaction: 'surprise', message: 'Нужно поприветствовать гостя.', scoreDelta: { etiquette: -10 } }
      },
      isComplete: (state: ScenarioState) => state.completedActions.some(a => a.type === 'greet' && a.targetId === 'guest')
    },
    {
      id: 'step2_prepare_table',
      title: 'Дастархан',
      description: 'Подготовьте дастархан: поставьте бауырсақ, құрт и сладости в центр стола.',
      availableActions: ['place', 'pour', 'give'],
      expectedActions: ['place'],
      onAction: (action: ScenarioAction, state: ScenarioState): InteractionFeedback => {
        if (action.type === 'place' && action.itemId) {
          const item = state.items.get(action.itemId)
          if (item?.state) item.state.placed = true
          if (['bauyrsak', 'qurt', 'sweets'].includes(action.itemId)) {
            return { success: true, reaction: 'nod', message: `${item?.name ?? 'Предмет'} аккуратно поставлен на дастархан.`, scoreDelta: { neatness: 4, hospitality: 3 } }
          }
          return { success: true, reaction: 'none', message: 'Предмет на месте.', scoreDelta: { neatness: 1 } }
        }
        return { success: false, reaction: 'wait', message: 'Сначала подготовьте дастархан.', scoreDelta: { etiquette: -4 } }
      },
      isComplete: (state: ScenarioState) => ['bauyrsak', 'qurt', 'sweets'].every((id) => Boolean(state.items.get(id)?.state?.placed))
    },
    {
      id: 'step3_pour_elder',
      title: 'Первый чай',
      description: 'Кому следует подать первую пиалу чая?',
      npcId: 'ene',
      availableActions: ['pour', 'give', 'place'],
      expectedActions: ['pour', 'give'],
      onAction: (action: ScenarioAction, state: ScenarioState): InteractionFeedback => {
        if (action.type === 'pour' && action.targetId?.startsWith('cup')) {
          // Check fill amount
          if (action.value && action.value > 80) {
            return { success: false, reaction: 'displeasure', message: 'Вы налили слишком много чая (шүпілдемеу керек).', scoreDelta: { tradition: -15, neatness: -10 } }
          }
          if (action.value && action.value < 20) {
            return { success: false, reaction: 'displeasure', message: 'Слишком мало чая.', scoreDelta: { tradition: -5 } }
          }
          const cup = state.items.get(action.targetId)
          if (cup && cup.state) cup.state.filled = true
          return { success: true, reaction: 'none', message: 'Вы налили чай с уважением.', scoreDelta: { tradition: 5 } }
        }
        
        if (action.type === 'give' && action.targetId === 'ene') {
          const cup = state.items.get(action.itemId || '')
          if (cup?.state?.filled) {
            return { success: true, reaction: 'thanks', message: 'Ене рада вашему вниманию.', scoreDelta: { tradition: 15, etiquette: 5 } }
          }
          return { success: false, reaction: 'wait', message: 'Пиала пустая.', scoreDelta: { etiquette: -5 } }
        }

        if (action.type === 'give' && action.targetId === 'guest') {
            return { success: false, reaction: 'displeasure', message: 'По традиции первый чай подают Ене (свекрови).', scoreDelta: { tradition: -20, etiquette: -10 } }
        }
        
        return { success: false, reaction: 'wait', message: 'Что-то пошло не так.' }
      },
      isComplete: (state: ScenarioState) => state.completedActions.some(a => a.type === 'give' && a.targetId === 'ene')
    },
    {
      id: 'step4_pour_guest',
      title: 'Угощение гостя',
      description: 'Подайте чай гостю. Не забудьте, что гость любит чай с сахаром.',
      npcId: 'adult_guest',
      availableActions: ['pour', 'give', 'place', 'add_sugar'],
      expectedActions: ['pour', 'add_sugar', 'give'],
      onAction: (action: ScenarioAction, state: ScenarioState): InteractionFeedback => {
        if (action.type === 'add_sugar' && action.targetId?.startsWith('cup')) {
            const cup = state.items.get(action.targetId)
            if (cup && cup.state) cup.state.sugar = true
            return { success: true, reaction: 'none', message: 'Вы добавили сахар.', scoreDelta: { hospitality: 5 } }
        }

        if (action.type === 'pour' && action.targetId?.startsWith('cup')) {
          const cup = state.items.get(action.targetId)
          if (cup && cup.state) cup.state.filled = true
          return { success: true, reaction: 'none', message: 'Вы налили чай.', scoreDelta: { neatness: 5 } }
        }
        
        if (action.type === 'give' && action.targetId === 'adult_guest') {
          const cup = state.items.get(action.itemId || '')
          if (cup?.state?.filled) {
            if (cup.state.sugar) {
                return { success: true, reaction: 'thanks', message: 'Гость доволен, что вы помните про сахар.', scoreDelta: { hospitality: 20, etiquette: 10 } }
            } else {
                return { success: false, reaction: 'surprise', message: 'Гость любит сладкий чай, но поблагодарил.', scoreDelta: { hospitality: -10 } }
            }
          }
          return { success: false, reaction: 'wait', message: 'Пиала пустая.', scoreDelta: { etiquette: -5 } }
        }
        
        return { success: false, reaction: 'wait', message: 'Что-то пошло не так.' }
      },
      isComplete: (state: ScenarioState) => state.completedActions.some(a => a.type === 'give' && a.targetId === 'adult_guest')
    },
    {
      id: 'step5_younger_guest',
      title: 'Следующий гость',
      description: 'Младший гость тоже ждёт внимания. Налейте пиалу и передайте её без сахара.',
      npcId: 'younger_guest',
      availableActions: ['pour', 'give', 'place', 'add_sugar'],
      expectedActions: ['pour', 'give'],
      onAction: (action: ScenarioAction, state: ScenarioState): InteractionFeedback => {
        if (action.type === 'pour' && action.targetId?.startsWith('cup')) {
          if (typeof action.value === 'number' && (action.value < 25 || action.value > 85)) {
            return { success: false, reaction: 'surprise', message: 'Количество чая получилось неудачным.', scoreDelta: { neatness: -8 } }
          }
          const cup = state.items.get(action.targetId)
          if (cup?.state) cup.state.filled = true
          return { success: true, reaction: 'none', message: 'Пиала готова.', scoreDelta: { neatness: 4 } }
        }

        if (action.type === 'add_sugar' && action.targetId?.startsWith('cup')) {
          const cup = state.items.get(action.targetId)
          if (cup?.state) cup.state.sugar = true
          return { success: false, reaction: 'surprise', message: 'Этот гость не просил сахар.', scoreDelta: { hospitality: -6 } }
        }

        if (action.type === 'give' && action.targetId === 'younger_guest') {
          const cup = state.items.get(action.itemId || '')
          if (!cup?.state?.filled) {
            return { success: false, reaction: 'wait', message: 'Пиала пустая.', scoreDelta: { etiquette: -5 } }
          }
          if (cup.state.sugar) {
            return { success: false, reaction: 'confused', message: 'Гость принял чай, но сахар был лишним.', scoreDelta: { hospitality: -5 } }
          }
          return { success: true, reaction: 'thanks', message: 'Младший гость благодарит вас.', scoreDelta: { hospitality: 8, etiquette: 4 } }
        }

        return { success: false, reaction: 'wait', message: 'Продолжайте обслуживание гостей.' }
      },
      isComplete: (state: ScenarioState) => state.completedActions.some(a => a.type === 'give' && a.targetId === 'younger_guest')
    }
  ],
  
  initialize() {
    // Initial setup if needed, handled by engine
  }
}
