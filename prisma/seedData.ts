import { ItemCategory, ServiceCategory } from '@prisma/client'

export const customers = [
  {
    email: 'john@customer.com',
    firstName: 'John',
    lastName: 'Customer',
  },
  {
    email: 'jane@customer.com',
    firstName: 'Jane',
    lastName: 'Customer',
  },
  {
    email: 'josh@customer.com',
    firstName: 'Josh',
    lastName: 'Customer',
  },
]

export const services = [
  {
    email: 'john@service.com',
    name: 'Pizza Town',
    category: ServiceCategory.PIZZA,
    menu: {
      create: [
        {
          name: 'Pizza Diavolo',
          description: 'Extreme hot sauce, beans, corn, procsuito',
          price: 6.99,
          weight: 600,
          time: 20,
          categories: [ItemCategory.PIZZA],
        },
        {
          name: 'Pizza Pomodoro',
          description: 'Best pomodoro pizza',
          price: 5.99,
          time: 20,
          categories: [ItemCategory.PIZZA],
        },
        {
          name: 'Prosciutto e funghi',
          price: 7.56,
          weight: 500,
          categories: [ItemCategory.PIZZA],
        },
        {
          name: 'Pizza mexicano',
          description: 'For real mexicans',
          price: 5.99,
          categories: [ItemCategory.PIZZA],
        },
      ],
    },
  },
  {
    email: 'jane@service.com',
    name: 'Burger King',
    category: ServiceCategory.FASTFOOD,
    menu: {
      create: [
        {
          name: 'Big Burger',
          description: 'Extreme big burger',
          price: 7.5,
          weight: 800,
          time: 30,
          categories: [ItemCategory.MEAT],
        },
      ],
    },
  },
  {
    email: 'josh@service.com',
    name: 'Azul',
    category: ServiceCategory.RESTAURANT,
  },
]
