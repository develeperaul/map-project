export type Category = 'projects' | 'travel' | 'sport'

export interface Tag {
  id: number
  title: string
}

export interface MarkerImage {
  url: string
}

export interface Marker {
  id: string
  title: string
  description: string
  coordinates?: [number, number]
  category: Category
  date: string
  city: string
  tags?: Tag[]
  status?: number | 'completed'
  images: MarkerImage[]
  tasks?: Marker[]
}

export const mockMarkers: Marker[] = [
  {
    id: '1',
    title: 'Moscow Tech Hub',
    description: 'Конференция по веб-разработке',
    category: 'projects',
    date: '2024-06-15',
    city: 'Москва',
    tags: [
      { id: 1, title: 'IT' },
      { id: 2, title: 'Конференция' }
    ],
    status: 75,
    images: [
      { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' }
    ],
    tasks: [
      {
        id: '1-1',
        title: 'Подготовить программу',
        description: 'Составить список докладчиков',
        coordinates: [37.6241, 55.7521],
        category: 'projects',
        date: '2024-05-01',
        city: 'Москва',
        status: 'completed',
        images: []
      },
      {
        id: '1-2',
        title: 'Найти спонсоров',
        description: 'Связаться с компаниями',
        coordinates: [37.6098, 55.7612],
        category: 'projects',
        date: '2024-05-15',
        city: 'Москва',
        status: 'completed',
        images: []
      },
      {
        id: '1-3',
        title: 'Аренда зала',
        description: 'Забронировать помещение',
        coordinates: [37.6322, 55.7488],
        category: 'projects',
        date: '2024-06-01',
        city: 'Москва',
        status: 50,
        images: []
      },
      {
        id: '1-4',
        title: 'Пригласить спикеров',
        description: 'Отправить приглашения',
        coordinates: [37.5987, 55.7549],
        category: 'projects',
        date: '2024-06-10',
        city: 'Москва',
        status: 75,
        images: []
      },
      {
        id: '1-5',
        title: 'Организация питания',
        description: 'Заказать кейтеринг',
        coordinates: [37.6179, 55.7693],
        category: 'projects',
        date: '2024-06-12',
        city: 'Москва',
        status: 30,
        images: []
      }
    ]
  },
  {
    id: '2',
    title: 'Startup Summit',
    description: 'Митап стартапов в центре',
    category: 'projects',
    date: '2024-07-20',
    city: 'Москва',
    tags: [
      { id: 3, title: 'Стартапы' },
      { id: 4, title: 'Бизнес' }
    ],
    status: 'completed',
    images: [
      { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400' }
    ],
    tasks: [
      {
        id: '2-1',
        title: 'Выбрать площадку',
        description: 'Найти место для митапа',
        coordinates: [37.6245, 55.7565],
        category: 'projects',
        date: '2024-07-01',
        city: 'Москва',
        status: 'completed',
        images: []
      },
      {
        id: '2-2',
        title: 'Пригласить спикеров',
        description: 'Найти спикеров',
        coordinates: [37.6191, 55.7489],
        category: 'projects',
        date: '2024-07-10',
        city: 'Москва',
        status: 'completed',
        images: []
      }
    ]
  },
  {
    id: '3',
    title: 'AI Hackathon',
    description: 'Хакатон по искусственному интеллекту',
    category: 'projects',
    date: '2024-08-10',
    city: 'Москва',
    tags: [
      { id: 5, title: 'AI' },
      { id: 6, title: 'Хакатон' }
    ],
    status: 50,
    images: [
      { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400' }
    ],
    tasks: [
      {
        id: '3-1',
        title: 'Сформировать команды',
        description: 'Набрать участников',
        coordinates: [37.6034, 55.7793],
        category: 'projects',
        date: '2024-07-20',
        city: 'Москва',
        status: 'completed',
        images: []
      },
      {
        id: '3-2',
        title: 'Подготовить задачи',
        description: 'Создать кейсы для участников',
        coordinates: [37.5718, 55.7921],
        category: 'projects',
        date: '2024-07-25',
        city: 'Москва',
        status: 50,
        images: []
      }
    ]
  },
  {
    id: '4',
    title: 'Vue.js Meetup',
    description: 'Встреча разработчиков Vue',
    category: 'projects',
    date: '2024-09-05',
    city: 'Москва',
    tags: [
      { id: 7, title: 'Vue' },
      { id: 8, title: 'Frontend' }
    ],
    status: 30,
    images: [
      { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400' }
    ],
    tasks: []
  },
  {
    id: '5',
    title: 'DevOps Conference',
    description: 'Конференция по DevOps практикам',
    category: 'projects',
    date: '2024-10-12',
    city: 'Москва',
    tags: [
      { id: 9, title: 'DevOps' }
    ],
    status: 'completed',
    images: [
      { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' }
    ],
    tasks: []
  },

  {
    id: '11',
    title: 'Чемпионат России',
    description: 'Футбольный матч',
    coordinates: [37.8673, 55.7628],
    category: 'sport',
    date: '2024-06-20',
    city: 'Москва',
    tags: [
      { id: 10, title: 'Футбол' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400' }
    ]
  },
  {
    id: '12',
    title: 'Марафон',
    description: 'Забег на 42 км',
    coordinates: [37.5407, 55.7558],
    category: 'sport',
    date: '2024-07-30',
    city: 'Москва',
    tags: [
      { id: 11, title: 'Бег' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400' }
    ]
  },
  {
    id: '13',
    title: 'Теннисный турнир',
    description: 'Открытый кубок',
    coordinates: [37.6184, 55.7518],
    category: 'sport',
    date: '2024-08-15',
    city: 'Москва',
    tags: [
      { id: 12, title: 'Теннис' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400' }
    ]
  },
  {
    id: '14',
    title: 'Велогонка',
    description: 'Гонка по городу',
    coordinates: [37.6156, 55.7578],
    category: 'sport',
    date: '2024-09-25',
    city: 'Москва',
    tags: [
      { id: 13, title: 'Велоспорт' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400' }
    ]
  },
  {
    id: '15',
    title: 'Баскетбол',
    description: 'Матч лиги',
    coordinates: [37.6234, 55.7614],
    category: 'sport',
    date: '2024-10-10',
    city: 'Москва',
    tags: [
      { id: 14, title: 'Баскетбол' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400' }
    ]
  }
]

export function getMarkersByCategory(category: Category): Marker[] {
  return mockMarkers.filter(m => m.category === category)
}
