const methodOverride = require('koa-methodoverride');
import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import { Server } from 'http'
import { bootstrapControllers, Ctx } from 'amala'
import { resolve } from 'path'
import env from '@/helpers/env'
import path = require('path')
const render = require('koa-ejs')
import { Context, DefaultState } from "koa";
const app = new Koa()
const koaStatic = require('koa-static');

export default async function () {
  const router = new Router<DefaultState, Context>();
  const { MessageModel }  = require('../models/Message');
  render(app, {
    root: path.join(__dirname, '../../views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
  });
  await bootstrapControllers({
    app,
    router,
    basePath: '/',
    controllers: [resolve(__dirname, '../controllers/*')],
    disableVersioning: true,
  })
  app.use(methodOverride('_method'));
  app.use(cors({ origin: '*' }));
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(koaStatic(path.join(__dirname, '../../views/partials')));

  //edit message
  router.get('/messages/edit/:id?', async (ctx, next) => {
    const id = ctx.params.id;
    const result = await MessageModel.findById(id)
    await  ctx.render('edit', {
      title: 'Messages',  
      message: result
     })
  });

  //save edited message
  router.put('/messages/edit/:id?', async (ctx, next) => {
      MessageModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new:true}, (err:any, result:any) => {
      })
    return ctx.redirect('/');
  });

  //delete message
  router.delete('/messages/:id', async ctx => {
    const id = ctx.params.id;
    await MessageModel.findByIdAndDelete(id)
    .then(() => {
      ctx.response.body.json({redirect: '/'});
    });
  });
 
  //message details
  router.get('/messages/:id', async ctx => {
    const id = ctx.params.id;
    const result = await MessageModel.findById(id);
    await  ctx.render('details', {
        title: 'Messages',  
        message: result
    });   
  });

  //post new message
  router.post('/messages', async (ctx) => {
    const message = new MessageModel(ctx.request.body);
    await message.save()
    ctx.redirect('/messages')
  });

  //home page
  router.get('/messages', async (ctx, next) => {
    const result = await MessageModel.find()
    await ctx.render('index', {
      title: 'Messages',  
      messages: result
    });
  });
  
  //about page
  router.get('/about', async ctx => {
      await ctx.render('about', {
        title: 'About'
      });
  });
  
  //create message
  router.get('/create', async ctx => {
    await ctx.render('create', {
      title: 'Create a message'
    })
  });
  
  //redirection
  router.get('/', async ctx => {
     ctx.redirect('/messages')
  });

  //404 
   app.use(async(ctx, next) => {
    try {
      await next()
      const status = ctx.status || 404
      if (status === 404) {
          ctx.throw(404)
      }
    } catch (err:any) {
      ctx.status = err.status || 500
      if (ctx.status === 404) {
        await ctx.render('404', {
            title: 'Page not found'
        })
      }
    }
  });
  
  // checking out our schema is working fine
  router.get('/add-message', async ctx => {
      ctx.set('Content-Type', 'text/plain')
      const message = new MessageModel({
        title: 'lol',
        snippet: 'lolol',
        body: 'ololol'
      })
      await message.save()
      .then((result:any) => {
        ctx.response.body = result;
        console.log(result)
      });
  });
  router.get('/all-messages', async ctx => {
      ctx.set('Content-Type', 'text/plain');
      await MessageModel.find()
      .then((result:any) => {
        ctx.response.body = result
      })
  });

  return new Promise<Server>((resolve, reject) => {
    const connection = app
      .listen(env.PORT)
      .on('listening', () => {
        console.log(`HTTP is listening on ${env.PORT}`)
        resolve(connection)
      })
      .on('error', reject)
  })
};