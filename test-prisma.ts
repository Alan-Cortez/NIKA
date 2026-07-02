import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = "lancortez9966@gmail.com";
  console.log("Looking for:", email);
  
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    console.log("No user found!");
    return;
  }
  
  console.log("User found:", usuario.email, usuario.activo);
  
  const match = await bcrypt.compare("Aned170205", usuario.passwordHash);
  console.log("Password match?", match);
}

main().catch(console.error);
