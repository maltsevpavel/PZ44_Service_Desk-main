const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const PORT = 3044;
const PUBLIC = path.resolve(__dirname, 'public');
const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
function json(res, code, value){res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));}
async function bodyJSON(req){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>65536)throw new Error('Слишком большой запрос');}try{return JSON.parse(raw || '{}');}catch{throw new Error('Некорректный JSON в запросе');}}
async function staticFile(pathname, res){
  let decoded;try{decoded=decodeURIComponent(pathname);}catch{return json(res,400,{error:'Некорректный адрес'});}
  const filepath=path.resolve(PUBLIC,'.'+(decoded==='/'?'/index.html':decoded));
  if(!filepath.startsWith(PUBLIC+path.sep))return json(res,403,{error:'Доступ запрещён'});
  const ext=path.extname(filepath);
  if(!MIME[ext])return json(res,404,{error:'Файл не найден'});
  try{const bytes=await fs.readFile(filepath);res.writeHead(200,{'Content-Type':MIME[ext],'Cache-Control':'no-store'});res.end(bytes);}catch{json(res,404,{error:'Файл не найден'});}
}
let tickets=[
  {id:101,customer:'Алина Морозова',problem:'Не открывается учебный портал',status:'Новая'},
  {id:102,customer:'Игорь Ким',problem:'Не работает проектор в кабинете',status:'В работе'},
  {id:103,customer:'Мария Сергеева',problem:'Не удаётся войти в Wi-Fi',status:'Новая'}
];
let nextId=104;
async function handleApi(req,res,url){
 if(url.pathname==='/api/tickets'&&req.method==='GET')return json(res,200,{items:tickets,total:tickets.length});
 if(url.pathname==='/api/tickets'&&req.method==='POST'){
   const data=await bodyJSON(req);const customer=String(data.customer||'').trim();const problem=String(data.problem||'').trim();
   if(customer.length<2||problem.length<5)return json(res,422,{error:'Укажите имя (от 2 символов) и проблему (от 5 символов)'});
   const item={id:nextId++,customer,problem,status:'Новая'};tickets.unshift(item);return json(res,201,{message:'Заявка создана',item});
 }
 return json(res,404,{error:'Маршрут API не найден'});
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')){
    try{await handleApi(req,res,url);}catch(err){json(res,400,{error:err.message||'Ошибка данных'});}return;
  }
  if(req.method!=='GET')return json(res,405,{error:'Метод не поддерживается'});
  await staticFile(url.pathname,res);
});
server.listen(PORT,()=>console.log(`Откройте http://localhost:${PORT}`));
