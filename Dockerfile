# Utilizza l'immagine ufficiale di Node.js come immagine di base
FROM node:19-bullseye

# Imposta la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia il file package.json (e package-lock.json se disponibile) nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install

# Copia i file sorgente dell'applicazione nella directory di lavoro del container
COPY . .

# Espone la porta 3012 per permettere l'accesso all'applicazione
EXPOSE 3012

# Comando per avviare l'applicazione
CMD [ "node", "app.js" ]
