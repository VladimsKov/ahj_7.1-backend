const { tickets, ticketsFull } = require('./tickets');

const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const uuid = require('uuid');

const app = new Koa();
const public = path.join(__dirname, '/public');

app.use(koaStatic(public));

app.use(koaBody({
    urlencoded: true,
    multipart: true,    
}));

app.use((ctx, next) => {
    ctx.response.set('Access-Control-Allow-Origin', '*');
    if (ctx.request.method !== 'OPTIONS') {
        next();
        return;
    }
    ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    ctx.response.status = 204;
});


app.use(async ctx => {
    const { method } = ctx.request.query;
    
    switch (method) {
        case 'allTickets':
        ctx.response.body = tickets;
        return;
        case 'ticketById': 
        const { id } = ctx.request.query;
        const fullTicket = ticketsFull.find(item => item.id === id);
        ctx.response.body = JSON.stringify(fullTicket.description);
        return;
        case 'addTicket':
        const {modal_name, modal_discr} = ctx.request.body;
        const newTicket = {
            id: uuid.v4(),
            name: modal_name,
            status: false,
            created: Date.now()
        };
        const newFullTicket = {
            id: newTicket.id,
            name: modal_name,
            description: modal_discr,
            status: newTicket.status,
            created: newTicket.created
        }
        tickets.push(newTicket);
        ticketsFull.push(newFullTicket);
        ctx.response.status = 201;                           
        return;
        case 'deleteTicket':
        const { delId } = ctx.request.query;
        const delTicketIdx = tickets.findIndex(item => item.id === delId);
        const delFullTicketIdx = ticketsFull.findIndex(item => item.id === delId);
        tickets.splice(delTicketIdx, 1);
        ticketsFull.splice(delFullTicketIdx, 1);
        ctx.response.status = 204;
        return;
        case 'changeTicket':
        const { changeId } = ctx.request.query;
        const {modal_new_name, modal_new_discr} = ctx.request.body;
        const changedTicket = tickets.find(item => item.id === changeId);
        const changedFullTicket = ticketsFull.find(item => item.id === changeId);
        changedTicket.name = modal_new_name;
        changedTicket.description = modal_new_discr;
        changedTicket.name = modal_new_name;
        changedFullTicket.description = modal_new_discr;
        ctx.response.status = 204;              
    }
});

const server = http.createServer(app.callback());

const port = 7000;

server.listen(port, (err) => {
    if (err) {
        return console.log('Error occured:', err)
    }
    console.log(`server is listening on ${port}`)
});