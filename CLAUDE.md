# Hinweise für Claude

## Firestore-Regeln – eine Datei für alle Apps

Strichliste, Stundentracker und WexSuperAdmin nutzen dasselbe Firebase-Projekt (`wexhainis-getraenkestrichliste`) und damit **eine einzige Regeldatei**. Wer veröffentlicht, ersetzt immer die ganze Datei.

- **Maßgeblich ist `firestore.rules` im Repo `firestorm1902/wexhainis-stundentracker`.** Sie enthält beide Apps. Kopien in anderen Repos sind nur Spiegel.
- **Vor jeder Regeländerung:** zuerst die aktuell in Firebase veröffentlichten Regeln übernehmen (Firebase-Konsole → Firestore → Regeln, Editorinhalt auslesen) und mit der Datei im Stundentracker-Repo abgleichen. Nie eine ältere lokale Kopie veröffentlichen.
- **Nur die eigenen Abschnitte ändern** (z. B. Strichliste: Buchungen, Tage, Lager …; Stundentracker: `stunden`, `std*`). Gemeinsame Teile (`users`, Rollen, `isActive`, `slActive`, `stdActive`, Sperren) nur mit Rücksicht auf alle Apps ändern.
- Danach die geänderte Datei im Stundentracker-Repo committen (und Spiegel aktualisieren), dann veröffentlichen.
