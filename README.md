# COMP-EX 2027 — Interactive Demo (Vercel)

A complete, clickable demo of the COMP-EX 2027 online expo platform (VCMDWA, Nagpur) that runs **without a
server**: every `/api/...` call is answered inside the browser by `src/demo/mockServer.js`, and the data is
kept in the visitor's own browser (localStorage). Use the **Reset demo** button in the yellow strip to start over.

Prepared by Hayat Computers & Security Solutions (Media Partner).

## What works
- Home, About VCMDWA, categories, contact, enquiry form
- Exhibitor registration with the live stall map (15-minute stall hold, booked stalls lock)
- Visitor registration → registration code; QR ID card in the chat bot
- Digital COMP-EX Directory (search + filter, call / WhatsApp / directions)
- Ask COMP-EX chat bot: FAQs, empty-stalls map, rate card, stall status, visitor registration in chat
- Admin panel — login **admin@vcmdwa.org / Compex@2027**: approve / reject / reopen, mark paid, edit, delete,
  book stalls from the map, visitors, gate check-in, entrance QR, enquiries, chats, admins, CSV export, booking summary
- Not in the demo (needs the real server): e-mails, WhatsApp sending, uploading a new venue drawing

## Deploy on Vercel
1. Push this folder to a GitHub repo (or drag-and-drop it in the Vercel dashboard / run `npx vercel`).
2. Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist` (already set in `vercel.json`).
3. No environment variables are needed.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
```

The production platform (FastAPI + MongoDB) is the separate COMPEX-2027-full-project.zip.
