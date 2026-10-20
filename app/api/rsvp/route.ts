import { env } from 'cloudflare:workers';
import { getDb } from '../../../db';
import { confirmations } from '../../../db/schema';
import { desc } from 'drizzle-orm';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Forbidden',{status:403});
 try{const {name,key}=await request.json() as {name?:unknown;key?:unknown};if(typeof name!=='string'||name.trim().length<3||name.trim().length>100||typeof key!=='string'||!/^[0-9a-f-]{36}$/i.test(key))return Response.json({error:'Dados inválidos'},{status:400});await getDb().insert(confirmations).values({id:key,name:name.trim(),createdAt:new Date().toISOString()}).onConflictDoUpdate({target:confirmations.id,set:{name:name.trim()}});return Response.json({ok:true})}catch{return Response.json({error:'Não foi possível salvar'},{status:500})}
}
export async function GET(request:Request){const secret=(env as unknown as Record<string,string>).ADMIN_PASSWORD;if(!secret||request.headers.get('authorization')!==`Bearer ${secret}`)return new Response('Acesso restrito',{status:401});const rows=await getDb().select().from(confirmations).orderBy(desc(confirmations.createdAt));return Response.json(rows,{headers:{'Cache-Control':'no-store'}})}

