import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// 1. Creamos la función que inicializa todo correctamente
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL!;
  
  // Es fundamental crear un Pool para reutilizar conexiones
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

// 2. Usamos globalThis para evitar el exceso de conexiones en Next.js HMR
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 3. Si ya existe una instancia (porque recargamos la página), la reutiliza
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// 4. Guardamos la instancia globalmente solo si estamos en desarrollo
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;