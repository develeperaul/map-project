export type Category = 'projects' | 'travel' | 'sport'

export interface Marker {
  id: string
  title: string
  description: string
  coordinates: [number, number]
  category: Category
  image?: string
}

export const mockMarkers: Marker[] = [
  {
    id: '1',
    title: 'Moscow Tech Hub',
    description: 'Конференция по веб-разработке',
    coordinates: [37.6173, 55.7558],
    category: 'projects',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
  },
  {
    id: '2',
    title: 'Startup Summit',
    description: 'Митап стартапов в центре',
    coordinates: [37.6295, 55.7532],
    category: 'projects',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400'
  },
  {
    id: '3',
    title: 'AI Hackathon',
    description: 'Хакатон по искусственному интеллекту',
    coordinates: [37.5881, 55.7856],
    category: 'projects',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400'
  },
  {
    id: '4',
    title: 'Vue.js Meetup',
    description: 'Встреча разработчиков Vue',
    coordinates: [37.5424, 55.7584],
    category: 'projects',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400'
  },
  {
    id: '5',
    title: 'DevOps Conference',
    description: 'Конференция по DevOps практикам',
    coordinates: [37.6112, 55.7619],
    category: 'projects',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
  },

  {
    id: '6',
    title: 'Эйфелева башня',
    description: 'Символ Парижа',
    coordinates: [2.2945, 48.8584],
    category: 'travel',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400'
  },
  {
    id: '7',
    title: 'Колизей',
    description: 'Древний амфитеатр в Риме',
    coordinates: [12.4964, 41.8902],
    category: 'travel',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400'
  },
  {
    id: '8',
    title: 'Биг-Бен',
    description: 'Знаменитая башня в Лондоне',
    coordinates: [-0.1246, 51.5007],
    category: 'travel',
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=400'
  },
  {
    id: '9',
    title: 'Статуя Свободы',
    description: 'Символ Нью-Йорка',
    coordinates: [-74.0445, 40.6892],
    category: 'travel',
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400'
  },
  {
    id: '10',
    title: 'Тадж-Махал',
    description: 'Жемчужина Индии',
    coordinates: [78.0421, 27.1751],
    category: 'travel',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400'
  },

  {
    id: '11',
    title: 'Чемпионат России',
    description: 'Футбольный матч',
    coordinates: [37.8673, 55.7628],
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400'
  },
  {
    id: '12',
    title: 'Марафон',
    description: 'Забег на 42 км',
    coordinates: [37.5407, 55.7558],
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400'
  },
  {
    id: '13',
    title: 'Теннисный турнир',
    description: 'Открытый кубок',
    coordinates: [37.6184, 55.7518],
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400'
  },
  {
    id: '14',
    title: 'Велогонка',
    description: 'Гонка по городу',
    coordinates: [37.6156, 55.7578],
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400'
  },
  {
    id: '15',
    title: 'Баскетбол',
    description: 'Матч лиги',
    coordinates: [37.6234, 55.7614],
    category: 'sport',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
  }
]

export function getMarkersByCategory(category: Category): Marker[] {
  return mockMarkers.filter(m => m.category === category)
}