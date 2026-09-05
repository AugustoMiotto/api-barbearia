# Usa uma imagem oficial e leve do Node.js
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência primeiro (para aproveitar o cache)
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências e gera o Prisma Client
RUN npm install
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Expõe a porta que o Express está usando
EXPOSE 3000

# Inicia o servidor em modo de desenvolvimento
CMD ["npm", "run", "dev"]