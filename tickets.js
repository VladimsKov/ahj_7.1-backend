const uuid = require('uuid');

let tickets = [
    {
        id: uuid.v4(),
        name: 'Задача 1',
        status: false,
        created: Date.now()
    },
    {
        id: uuid.v4(),
        name: 'Задача 2',
        status: false,
        created: Date.now()
    }
];

let ticketsFull = [
    {
        id: tickets[0].id,
        name: tickets[0].name,
        description: 'Текущий платеж по автокредиту',
        status: tickets[0].status,
        created: tickets[0].created
    },
    {
        id: tickets[1].id,
        name: tickets[1].name,
        description: 'Покупка наушников',
        status: tickets[1].status,
        created: tickets[1].created
    }
];

module.exports = {
    tickets,
    ticketsFull
};

