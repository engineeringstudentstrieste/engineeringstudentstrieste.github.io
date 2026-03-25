# engineeringstudentstrieste.github.io

Sito ufficiale di **epsilon sigma tau (εστ)** - Engineering Students Trieste.

## Struttura progetto

- `frontend/`: React app (sito pubblico + area login soci)
- `backend/`: Node.js API (auth, punti soci, integrazione Google Wallet)

## Avvio locale

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm start
```

## Note deploy

- Frontend pubblicabile su GitHub Pages.
- Backend pronto per Cloud Run (vedi `backend/README.md`).
- Per produzione non committare mai chiavi/JSON di service account.

## Roadmap

- Stato attuale backend: Node.js + MongoDB.
- Evoluzione prevista: backend Java + MySQL mantenendo contratti API compatibili con il frontend.
