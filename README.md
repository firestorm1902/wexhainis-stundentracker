# Wexhainer Stundentracker

Smartphone-App zum Erfassen von Vereins-Arbeitsstunden (installierbare Web-App/PWA).
Läuft auf GitHub Pages, speichert in Firebase (Firestore) und nutzt dieselben Konten wie die Getränke-Strichliste.

## Funktionen
- Mitglieder erfassen eigene Stunden (Datum, Stunden, Tätigkeit, Notiz), bearbeiten und löschen sie
- Stempeluhr mit Bienen-Animation: ein-/ausstempeln (mit Pause), die Zeit wird beim Ausstempeln ins Formular übernommen; läuft bei geschlossener App weiter (nur auf dem eigenen Gerät)
- Liste nach Monaten mit Summen, Jahresfilter
- Excel-Export (Blätter „Arbeitsstunden“ und „Summe je Person“)
- JSON-Backup (Export/Import, auch Backups der Supabase-Version)
- Rollen: Mitglied, Vorstand (liest alle Stunden), Super-Admin (alles, Verwaltungsansicht)
- Offline-Eingabe: Einträge werden gesendet, sobald das Handy wieder online ist

## Einrichtung

### 1. Repository und GitHub Pages
1. Öffentliches Repository `wexhainis-stundentracker` anlegen (GitHub Pages ist bei privaten Repos nur mit bezahltem Tarif möglich).
2. Alle Dateien aus diesem Ordner in den Hauptzweig (`main`) hochladen.
3. Settings → Pages → „Deploy from a branch“ → Branch `main`, Ordner `/ (root)` → Save.
4. Nach ca. 1 Minute ist die App erreichbar unter `https://firestorm1902.github.io/wexhainis-stundentracker/`.

### 2. Firebase
Die App nutzt die Firebase-Konfiguration der Getränke-Strichliste (steht in `index.html`).
1. **Autorisierte Domain:** Firebase-Konsole → Authentication → Einstellungen → Autorisierte Domains. `firestorm1902.github.io` muss in der Liste stehen (bei der Strichliste vermutlich schon).
2. **Regeln veröffentlichen:** Firestore Database → Regeln → den **kompletten** Inhalt von `firestore.rules` einfügen → Veröffentlichen.
   Die Datei enthält die bisherigen Strichlisten-Regeln unverändert plus den neuen Abschnitt `stunden`. Sie ersetzt die alten Regeln komplett, deshalb immer diese Datei verwenden.
3. **Super-Admin:** Die Nutzer-ID steht in `firestore.rules` bei `superUids()` (bereits die bisherige).

### 3. Konten freigeben
- Wer schon ein Strichlisten-Konto hat, meldet sich mit denselben Zugangsdaten an. Der Super-Admin sieht das Konto unter **Verwaltung** und wählt „Stundentracker freigeben“.
- Neue Mitglieder registrieren sich in der App. Der Super-Admin gibt sie unter **Verwaltung** frei. **Achtung:** Das Freigeben eines wartenden Kontos schaltet es auch für die Strichliste frei, weil beide Apps dasselbe Profil nutzen.
- Rolle **Vorstand** (sieht alle Stunden) vergibt der Super-Admin ebenfalls unter Verwaltung.

## Versionen
Bei jeder Änderung `APP_VERSION` in `index.html` und `VERSION` in `sw.js` hochzählen. So lädt das Handy die neue Version.

## Hinweise
- Der Firebase-Web-API-Schlüssel in `index.html` darf öffentlich sein. Geschützt sind die Daten durch die Firestore-Regeln.
- Den Datenschutzhinweis in `index.html` (Konstante `PRIVACY`) bitte vom Verein prüfen und anpassen.
- Gesperrt wird ein Konto in beiden Apps gleichzeitig.
