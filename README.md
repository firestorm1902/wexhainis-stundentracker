# Wexhainis Getränke-Strichliste

Web-App für den Verein:
- Getränke werden pro Ausfahrt-Tag eingeladen.
- Mitglieder buchen sie per Barcode mit ihrem eigenen Konto.
- Am Ende gleicht der Admin mit dem gezählten Rest ab.

Alle Handys teilen sich eine Firebase-Datenbank. Scannen funktioniert auch ohne Netz; die Buchungen werden gesendet, sobald wieder Verbindung besteht.

## Dateien im GitHub-Repository

| Datei | Zweck |
|---|---|
| `index.html` | die App |
| `sw.js` | hält die App offline startbar |
| `index_min.js` | Barcode-Erkennung (ZXing) |
| `manifest.webmanifest` | macht die Seite als App installierbar (Name, Farben, Symbole) |
| `icons/` | App-Symbole und Schnellzugriff-Symbole (Ordner mit allen Dateien hochladen) |
| `firestore.rules` | Sicherheitsregeln – werden in Firebase eingefügt, nicht auf GitHub gebraucht |

## Als App installieren (Android und iPhone)

Die Strichliste ist eine installierbare Web-App (PWA): Nach dem Installieren hat sie ein Wespen-Symbol auf dem Startbildschirm, startet im Vollbild ohne Adressleiste und funktioniert offline. Ein App-Store ist nicht nötig.

- **Android (Chrome):** In der App erscheint „Als App installieren“ → **Installieren**. Oder Menü **⋮** → „App installieren“. Samsung Internet: Menü ☰ → „Seite hinzufügen zu“ → „Startbildschirm“.
- **iPhone/iPad:** In **Safari** öffnen → **Teilen** → **„Zum Home-Bildschirm“** → „Hinzufügen“. Die App zeigt dafür eine Anleitung („So geht’s“, auch in der Hilfe unter **?**).
- Wurde der Link aus WhatsApp geöffnet, zuerst „Im Browser öffnen“ wählen – aus dem WhatsApp-Browser heraus lässt sich nicht installieren.
- **iPhone:** Die installierte App hat einen eigenen Speicher. Man muss sich dort **einmal neu anmelden**. Am besten installieren, bevor man offline bucht.
- **Updates:** Die installierte App prüft beim Öffnen und alle 30 Minuten auf eine neue Version. Ist eine da, erscheint unten „Neue Version da – Neu laden“.
- **Schnellzugriffe:** Lange auf das Wespen-Symbol drücken (Android) zeigt **Getränk buchen** (startet die Kamera), **Mein Konto**, **Korrektur beantragen**, **Kontakt & Feedback** und **Admin-Bereich** (nur für Admins/Vorstand; andere bleiben auf der Startseite bzw. werden weitergeleitet). Jeden Schnellzugriff kann man auf den Startbildschirm ziehen – wie ein kleiner Widget-Knopf. Echte Startbildschirm-Widgets können Web-Apps auf Android und iPhone nicht anbieten.
- **Zahl am App-Symbol:** Mitglieder sehen die Zahl neuer Antworten auf ihre Nachrichten und neu entschiedener Anträge; Getränke-Admins zusätzlich offene Korrekturanträge, der Super-Admin ungelesene Nachrichten im Posteingang. Auf dem iPhone (ab iOS 16.4, als App installiert) muss man dafür einmal „Erlauben“ tippen – die App fragt danach. Auf Android hängt die Anzeige vom Handy ab (manche zeigen nur einen Punkt).
- **Benachrichtigungen und Punkt am Symbol (Android):** Läuft die App im Hintergrund, kommt eine Handy-Benachrichtigung – für Admins bei neuen Korrekturanträgen, für den Super-Admin bei neuen Nachrichten (auch Fehlermeldungen und Feedback), für Mitglieder, wenn über ihren Antrag entschieden oder ihre Nachricht beantwortet wurde (dazu „Getränke gehen zu Ende“ und „Zu viel gescannt“ für Admins). Dadurch erscheint auf Android der Punkt am App-Symbol; Antippen öffnet die passende Stelle, beim Öffnen der App verschwinden sie. Mitglieder werden nach dem ersten Antrag bzw. der ersten Nachricht einmal gefragt, ob sie das möchten; Admins erlauben es unter Admin → Daten. Ist die App ganz geschlossen, kommt nichts (dafür bräuchte es einen eigenen Server).

## Einrichtung (einmalig, ca. 15 Minuten)

Die Firebase-Konsole hat links zwei Bereiche: **Projektverknüpfungen** (zuletzt benutzte Dienste) und **Produktkategorien** (alle Dienste).

### 1. Firebase-Projekt anlegen
1. <https://console.firebase.google.com> öffnen, mit dem Google-Konto des Vereins anmelden.
2. **Projekt erstellen**, Namen vergeben. Google Analytics kann aus bleiben.
3. Der kostenlose **Spark**-Tarif reicht. Keine Kreditkarte nötig.

### 2. Anmeldung einschalten
1. Links **Authentication** öffnen. Steht es nicht unter „Projektverknüpfungen“, oben über **Nach Produkten suchen** „Authentication“ eingeben. Falls ein Knopf **Jetzt starten** erscheint, ihn anklicken.
2. Reiter **Anmeldemethode** (bei schmalem Fenster ggf. die Reiterleiste nach rechts scrollen):
   - **E-Mail/Passwort** aktivieren. Die Option „E-Mail-Link (Anmeldung ohne Passwort)“ bleibt aus.
   - Falls **Anonym** aktiv ist: deaktivieren. Wird nicht mehr gebraucht.
3. Reiter **Einstellungen → Autorisierte Domains → Domain hinzufügen**: `DEIN-NAME.github.io` eintragen.

### 3. Datenbank anlegen
1. Links **Firestore** öffnen. Steht es nicht unter „Projektverknüpfungen“, über **Produktkategorien → Datenbanken und Speicher** oder die Suche oben.
2. **Datenbank erstellen**, Standort in Europa wählen (z. B. `europe-west3` Frankfurt). Der Standort lässt sich später nicht ändern.
3. **Im Produktionsmodus starten**.
4. Reiter **Regeln**: den kompletten Inhalt von `firestore.rules` einfügen und **Veröffentlichen**. Die Admin-ID trägst du in Schritt 6 nach.

### 4. Zugangsdaten in die App eintragen

Für das Projekt `wexhainis-getraenkestrichliste` ist das bereits erledigt; die Zugangsdaten stehen in `index.html`. Für ein anderes Projekt:

1. Links **Einstellungen** (Zahnrad) → **Allgemein**.
2. Ganz nach unten zu **Meine Apps** scrollen, auf das Web-Symbol **`</>`** klicken.
3. App-Namen vergeben (z. B. „Strichliste“). *Firebase Hosting* **nicht** anhaken, dann **App registrieren**.
4. Den angezeigten Block `const firebaseConfig = { … }` kopieren. Später findest du ihn wieder unter Einstellungen → Allgemein → Meine Apps → Option „Config“.
5. In `index.html` nach `KONFIGURATION` suchen (ca. Zeile 200). Den Platzhalter-Block `const firebaseConfig = { … };` komplett durch den kopierten ersetzen.

Die Werte in `firebaseConfig` sind keine Geheimnisse und dürfen im öffentlichen Repository stehen. Geschützt werden die Daten durch die Sicherheitsregeln.

### 5. Auf GitHub Pages hochladen
`index.html`, `sw.js` und `index_min.js` ins Repository legen (alle im selben Ordner). Nach ein bis zwei Minuten ist die Seite unter `https://DEIN-NAME.github.io/REPO/` erreichbar.

### 6. Super-Admin festlegen
1. Die Seite öffnen, **Registrieren** wählen und dein eigenes Konto anlegen (Name, E-Mail, Passwort).
2. **Fünfmal schnell auf den Titel** „Wexhainis Getränke-Strichliste“ oben tippen, das öffnet den Admin-Bereich. Es erscheint „Keine Admin-Rechte“. Darunter „Für die Einrichtung: Nutzer-ID“ aufklappen und die ID kopieren.
   - Alternativ steht die ID in der Firebase-Konsole unter Authentication → Nutzer → Spalte „Nutzer-UID“.
3. In der Firebase-Konsole unter **Firestore → Regeln** bei `superUids()` eintragen und **Veröffentlichen**:
   ```
   return ['aB3dE5fG7hJ9kL1mN3pQ5rS7tU9v'];
   ```
   Mehrere Super-Admins werden mit Komma getrennt: `['ID1', 'ID2']`. Ein zweiter Super-Admin als Vertretung ist sinnvoll.
4. Seite neu laden. Der Admin-Bereich ist jetzt offen.
5. Weitere **Admins** ernennst du direkt in der App unter **Admin → Personen**: Person antippen und bei „Rolle“ „Admin“ wählen. Die Regeln musst du dafür nicht mehr anfassen.

### 7. Testen
1. Im Admin einen **neuen Tag** anlegen.
2. **Einladen per Scan** wählen, eine Flasche scannen, das Getränk anlegen und Kästen antippen.
3. Auf einem zweiten Handy ein Konto registrieren. Es wartet zuerst auf Freischaltung: im Admin oben unter **Neue Anmeldungen** auf „Freischalten“ tippen. Danach scannen. Die Buchung erscheint beim Admin unter „Abgleich“ und „Nach Person“.

## Für die Mitglieder

- Seite öffnen, **Registrieren** wählen und Vor- und Nachname, E-Mail und Passwort eingeben. Dafür braucht man einmal Internet.
- Danach steht „Fast geschafft – dein Konto wartet auf Freischaltung“. Sobald ein Admin freischaltet, geht die App von selbst weiter.
- Am besten zum Home-Bildschirm hinzufügen:
  - iPhone: Safari → Teilen → „Zum Home-Bildschirm“
  - Android: Chrome → Menü → „Zum Startbildschirm hinzufügen“
- Man bleibt angemeldet, auch offline. Neues Handy oder Browserdaten gelöscht? Einfach mit derselben E-Mail **anmelden**, Name und Buchungen sind wieder da.
- Nach jeder Buchung steht die Meldung mit „Rückgängig“ eine Weile da (Countdown, Standard **10 Sekunden**), dann verschwindet sie. Ob es „Rückgängig“ gibt und wie lange, stellt der Super-Admin ein (siehe unten). Ist es ausgeschaltet, steht dort „Vertippt? Korrektur beantragen“.

### Rückgängig einstellen und nachverfolgen (Super-Admin)
Admin → **Einstellungen** → „Rückgängig nach dem Buchen“: an/aus und die Zeit (3–120 Sekunden). Der Server prüft das mit: Mitglieder können eine eigene Buchung nur löschen, solange Rückgängig an ist und höchstens die eingestellte Zeit plus 2 Minuten (für langsames Netz) vergangen ist. Dafür müssen die neuen `firestore.rules` veröffentlicht sein.

Jedes Rückgängig wird gemerkt: wer, wann, welches Getränk, und wie viele Sekunden nach dem Buchen. Beim **Abgleich** eines Tages steht die Liste „Rückgängig gemacht“. Fehlen bei einem Getränk Flaschen und wurde es an dem Tag zurückgenommen, ist die Zeile rot markiert und oben steht „Prüfen: Pils: fehlt 1, aber 1× rückgängig gemacht (Anna 15:20)“. Beim **Tag abschließen** kommt dann eine Rückfrage mit diesem Hinweis. Auch „Zu wenig gebucht“ zeigt die Rückgängig-Fälle der betroffenen Tage. Das Protokoll kann nur der Super-Admin löschen; es steckt auch im Backup.

**Übersicht über alle Tage:** Admin → „Zurückgenommene Buchungen“ → „Übersicht laden“ zeigt nach Person, wer wie oft zurückgenommen hat (diese Saison oder alles), mit den häufigsten Getränken. Wurde vorher bei „Zu wenig gebucht“ auf „Tage prüfen“ getippt, sind Fälle bei fehlenden Getränken rot markiert.

**Rückfragen an Mitglieder:** Fehlt beim Abgleich ein Getränk und hat jemand es an dem Tag zurückgenommen, gibt es im „Prüfen“-Hinweis den Knopf „Rückfrage an …“ (auch in der Übersicht bei markierten Fällen: „Fragen“). Der Text ist vorausgefüllt und lässt sich ändern. Das Mitglied sieht die Rückfrage oben in der App (mit Benachrichtigung und Zahl am App-Symbol) und antwortet mit „Ja, bitte nachbuchen“, „Nein, nur vertippt“ oder eigenem Text. Die Antwort steht beim Abgleich des Tages unter „Rückfragen“, der Admin bekommt einen Hinweis. Ohne Differenz gibt es keinen Rückfrage-Knopf. Rückfragen lassen sich unter **📥 Aufgaben** mit 🗑 endgültig löschen; gehört eine zu einem gelöschten Tag, steht dort „Tag gelöscht“ (bei mehreren: „Alle ohne Tag löschen“). Wird ein Tag gelöscht, verschwinden seine Rückfragen und sein Rückgängig-Protokoll mit. Antwortet das Mitglied mit „Ja, bitte nachbuchen“, erscheint beim Admin der Knopf „1× Pils nachbuchen“ (so oft wie zurückgenommen, höchstens so viele wie fehlen) – ein Tipp, kurze Bestätigung, fertig; danach steht dort „Nachgebucht“. Bei eigener Antwort führt „Nachtragen …“ zum Formular, bei „Nein, nur vertippt“ gibt es keinen Nachbuchen-Knopf.

### Konto-Bereich oben
Der Kopf der App bleibt beim Scrollen oben stehen. Darin steht dein Profilbild mit „Name · Rolle ▾“. Antippen klappt den Konto-Bereich auf: Name, Rolle, Gruppe, E-Mail, **📷 Foto aufnehmen** (öffnet direkt die Frontkamera), **🖼️ Bild wählen** (Galerie; auch durch Tippen aufs Bild), **Bild entfernen**, **Passwort ändern** und **Abmelden** (mit Rückfrage). Diese Knöpfe sind dafür von der Startseite verschwunden; dort bleiben nur „Ich fahre heute“, Easter Eggs und Party.

### Sperren
Admin → **Personen** → **„Für Strichliste sperren“** sperrt die Person nur hier (`slBlock`); andere Apps wie der Stundentracker bleiben nutzbar. Eine Sperre für alle Apps (`blocked`) lässt sich nur in WexSuperAdmin setzen oder aufheben – in der Strichliste steht dann „In allen Apps gesperrt“.

**„Aus Strichliste entfernen“** (Super-Admin) und **Anmeldung ablehnen** wirken ebenfalls nur hier (`slGone` + `slBlock`): Die Person verschwindet aus den Listen der Strichliste und kann nicht buchen; das Konto und andere Apps bleiben unberührt. Unter „Entfernte Konten“ lässt sich das rückgängig machen. **Konten löschen geht nur in WexSuperAdmin** – Löschanträge werden in der Strichliste nur angezeigt.

### Bus-Check-in (wer ist wirklich dabei?)
Admin → 📅 Tag → **Bus-Check-in**: Busse anlegen (z. B. „Bus 1“, „Bus 2“), pro Bus einen **Bus-Leiter** wählen (jedes Mitglied, auch ohne Admin-Rechte), Dauer wählen (15 Min. bis 2 Std.) → **🚌 Check-in starten**.
- **Bus-Leiter** sehen oben in der App „Du bist Bus-Leiter: Bus 2“. Ihr Handy teilt alle 30 Sekunden den Standort, solange die App offen ist. Sie sehen, wer in ihrem Bus eingecheckt ist, können Personen ohne Handy über die **Suche** eintragen (nur registrierte, freigeschaltete und nicht gesperrte Mitglieder – die Liste wird beim Start gespeichert und von den Firebase-Regeln geprüft) und Einträge entfernen. Sie selbst sind automatisch eingecheckt.
- **Mitglieder** tippen **„📍 Ich bin im Bus“**. Die App ermittelt einmal den Standort; eingecheckt wird nur, wer nahe bei einem Bus-Leiter ist (ca. 400 m) – und zwar automatisch im richtigen Bus. Das prüfen die Firebase-Regeln auf dem Server, nicht nur die App.
- **QR-Code bleibt als zweiter Weg:** Der Admin kann jederzeit „📱 QR-Code zeigen“ – der Code wechselt alle 20 Sekunden und gilt nur, solange er angezeigt wird. Gedacht für alle, die keinen Standort teilen können oder wollen.
- **Admin** sieht die Check-ins nach Bus getrennt, „Haben heute gebucht, aber nicht eingecheckt“, kann Personen eintragen (mit Bus-Auswahl) und entfernen.
- **Datenschutz:** Gespeichert wird, dass und wann jemand eingecheckt hat und in welchem Bus. Die Standorte sehen nur Admins; sie werden beim **Beenden** gelöscht. Der Datenschutzhinweis der App erklärt das.
- **Tipp:** Den Check-in erst nach der Abfahrt starten – am Treffpunkt stehen auch Leute in der Nähe, die nicht mitfahren.
- **Personensuche (ohne Handy dabei):** Die Liste wird beim Start gespeichert. Solange ein Admin die App offen hat, wird sie laufend ergänzt (neu Freigeschaltete kommen dazu, Gesperrte fliegen raus). Ist der Bus-Leiter selbst Admin, findet er sowieso alle freigeschalteten Mitglieder. Taucht jemand nicht auf, steht dort der Grund (z. B. „noch nicht freigeschaltet“, „gesperrt“, „schon eingecheckt (Bus 2)“).
- **Standort klappt nicht?** „Ich bin im Bus“ probiert es bis zu 3-mal (sofort, nach 8 und nach 15 Sekunden) mit frischem Standort. Der Bus-Leiter teilt seinen Standort alle 15 Sekunden und bei jeder neuen Position; die Strichliste muss bei ihm offen und der Bildschirm an sein. Ist sein Standort ungenau (über 150 m), zeigt die App ihm einen Hinweis. Wer aus dem Check-in entfernt wurde, kann sich danach wieder per Standort einchecken (braucht die Regeln ab v103).
- **Ohne Kamera:** Unter dem QR-Code steht ein 6-stelliger Code (wechselt mit dem QR-Code alle 20 Sekunden). Mitglieder tippen in der Strichliste auf **„Code eingeben“** und geben ihn ein – das zählt wie ein gescannter QR-Code.
- Die Meldung „🚌 Eingecheckt“ steht 3 Minuten auf der Startseite. Danach steht der Check-in unter **Mein Konto → Meine Bus-Check-ins**.
- Alles wird protokolliert und steht in der **Excel-Auswertung** (Blatt „Bus-Check-in“ mit Bus und Art; Übersicht „Im Bus eingecheckt“).
- **Übersicht:** Admin → 📊 Auswertung → **Anwesenheit (Bus-Check-ins)**: pro Ausfahrt (wie viele im Bus, je Bus, wer gebucht hat ohne einzuchecken) und pro Person (bei wie vielen Ausfahrten dabei, Tage zum Aufklappen), wahlweise diese Saison oder alles; „Auffällig“ zeigt, wer mehrmals gebucht hat, ohne eingecheckt zu sein. **📄 Excel: nur Anwesenheit** lädt eine eigene Datei (Übersicht, pro Tag, pro Person, alle Check-ins). Die gesammelte Excel-Auswertung enthält dieselben Blätter „Anwesenheit pro Tag“ und „Anwesenheit pro Person“.
- Braucht die neuen Regeln (`buscode`, `busloc`, `busgeo`, `checkins`) – siehe `firestore.rules` im Stundentracker-Repo.

### Ein- und Auschecken per Knopf
Admin → Tag → **Mitnehmen und zurückzählen**: Umschalter **⬆️ Einladen** / **⬇️ Übrig zählen**, darunter jedes Getränk mit **−Kasten**, **−1**, einem Zahlenfeld zum direkten **Eintippen**, **+1** und **+Kasten** (je Gebinde) (z. B. „+Kasten 20“). Die Zahl zeigt den aktuellen Stand; Getränke unter dem Mindestbestand sind rot. Scannen (📷 Einladen / Rest zählen per Scan) geht weiterhin, ist aber nur noch die Alternative.

### Mindestens mitnehmen
Admin → **Getränke** → bei jedem Getränk **„Mindestens mitnehmen (Flaschen)“**. Admin → **Mitnehmen und zurückzählen** → **Packliste bearbeiten**: Dinge, die immer mit müssen (Flaschenöffner, Becher, Kasse …), pro Tag zum Abhaken. Fehlt etwas, steht es rot im Bereich „Mitnehmen“, und die App fragt nach – beim Schließen des Einlade-Scanners und beim Freigeben des Tags.

### Jugendschutz (U18)
Admin → **Personen** → **Online und zuletzt aktiv** (nur Admins): Unter jedem Namen steht **online** mit grünem Punkt, solange die Person die App im Vordergrund offen hat – sonst, wann sie zuletzt in der App war (z. B. „vor 5 Min.“, „gestern 21:14“). Oben steht, wie viele gerade online sind. Aufgeklappt stehen das genaue Datum, die letzte echte Anmeldung (Login mit Passwort) und die App-Version auf dem Handy. „Sortiert: Name“ schaltet auf „online / zuletzt aktiv“ um. So funktioniert es: Solange die App offen ist, meldet sich das Handy alle 5 Minuten; beim Wechsel in eine andere App, beim Sperren oder Schließen meldet es sich sofort ab. Klappt das nicht (Akku leer, kein Netz), gilt die Person nach 6½ Minuten ohne Meldung als offline. Gespeichert wird in der Collection `slseen` (ein Dokument pro Person). Die Liste aktualisiert sich nicht von selbst: Admins laden sie beim Öffnen des Admin-Bereichs und per „🔄 Online-Status“ – das sind so viele Lesevorgänge, wie es Personen gibt. Erfasst wird ab v2.9.5 (online-Status ab v2.9.6).

Admin → **Personen**: „minderjährig (U18)“ markiert eine Person. Admin → **Getränke**: pro Getränk „Für Jugendliche (U18) gesperrt“ – ohne Einstellung sind automatisch alle alkoholischen Sorten gesperrt; man kann aber z. B. ein Radler freigeben oder einen Energydrink sperren. Die markierten Personen erfahren davon nichts: gesperrte Getränke erscheinen bei ihnen einfach nicht in der Liste, und beim Scannen steht nur „kann gerade nicht gebucht werden – bitte beim Getränke-Admin melden“. Der Server prüft die Sperre ebenfalls.

### Lager (statt Einkaufsliste)
Admin → **Lager**: Bestand pro Getränk in Flaschen (mit Gebinden, z. B. „69 Fl. (3× Kasten 20 + 9)“) und ein **Mindestbestand** pro Getränk.
- **Buchen:** Wareneingang (mit „+ 1 Kasten“-Knöpfen), Entnahme oder Inventur (gezählten Ist-Bestand eintragen – die Differenz wird gebucht).
- **Pro Tag:** „Aus dem Lager abbuchen“ bucht das Mitgenommene ab, „Übrig zurück ins Lager“ bucht den Rest zurück. Wird später noch nachgeladen oder „Übrig“ geändert, erscheint nur die Differenz zum Buchen – nichts wird doppelt gebucht.
- **Einladen nur bis zum Bestand:** Für Getränke mit Lagerbestand lässt sich beim Einladen (Knöpfe, Scan, Abgleich) nicht mehr eintragen, als im Lager ist (Bestand + schon für diesen Tag Abgebuchtes). Die Zeile zeigt „im Lager noch x“ (was noch dazukommen darf), „+1“ und „+Kasten“ werden grau, wenn alles drin ist; ist mehr eingetragen als im Lager (z. B. von früher), steht „⚠️ x mehr als im Lager“ in Rot; bei zu viel lädt die App nur den Rest ein und sagt es. Getränke ohne geführten Bestand (noch nie gebucht/inventiert) sind nicht begrenzt.
- **Nachkaufen:** alles unter dem Mindestbestand, als Liste zum Teilen (WhatsApp) oder Kopieren.
- **Bedarf für die nächsten Ausflüge:** die frühere Einkaufslisten-Berechnung aus dem bisherigen Verbrauch.
- **Verlauf:** die letzten Lagerbewegungen mit Person und Uhrzeit. Alles steckt auch im Backup.

### Texte der Startseite ändern (Super-Admin)
Konto-Bereich oben → **✏️ Texte bearbeiten**. Alle änderbaren Texte sind gestrichelt umrandet: Titel, „Getränk scannen“, „Ich fahre heute“, „Deine Getränke heute“, „Korrektur beantragen“, die Reiter (Bestenliste, Sammelalbum, Mein Konto, Rückblick), „Easter Eggs heute“ und die Hinweise im Scanfenster. Antippen, neuen Text eingeben, speichern – gilt sofort für alle. Leer lassen stellt den Standard wieder her. „Fertig“ beendet den Modus. Darüber hinaus ist fast jeder feste Text der Mitglieder-Seiten änderbar: Hinweise, Texte in den Reitern (Bestenliste, Sammelalbum, Mein Konto, Rückblick) und in Fenstern wie „Korrektur beantragen“ oder „Kontakt & Feedback“. Mit **👆 Bedienen** lassen sich Reiter und Fenster öffnen, mit **✏️ Bearbeiten** geht es weiter. Ein geänderter Text gilt überall, wo genau dieser Originaltext steht. Ausgenommen sind Zahlen, Preise, Daten, Namen, Getränke und der Admin-Bereich (dort: „⇅ Anordnen“).

### Glocke für alle Mitglieder
Auch Mitglieder haben oben neben dem Namen eine **🔔**. Sie zählt neue Meldungen: eine **Rückfrage** eines Admins, einen **entschiedenen Antrag** (genehmigt/abgelehnt), eine **Antwort auf eine Nachricht** und eine **neue App-Version**. Ein Eintrag springt dorthin, wo man ihn liest („Meine Anträge“, „Meine Nachrichten“, Rückfrage oben). Gelesene Meldungen verschwinden von selbst; mit ✕ löscht man eine Meldung in den Verlauf, ↩ holt sie zurück. Admins sehen ihre Aufgaben (siehe unten) und diese persönlichen Meldungen zusammen in einer Glocke.

**🌙 Nicht stören:** In der Glocke unten gibt es „Nicht stören“ für 30 Min., 1, 3, 8 Stunden, bis morgen früh oder eine **eigene Dauer** (1–1440 Minuten). Solange es an ist, kommen auf diesem Handy keine Handy-Hinweise, Töne, Vibration oder Einblendungen für neue Meldungen; die Glocke (dann 🔕) zählt trotzdem weiter. Rückmeldungen auf das eigene Tippen (z. B. „Gebucht“, Fehler beim Buchen) bleiben unverändert. „Jetzt beenden“ schaltet es sofort aus. Gespeichert wird es nur auf dem jeweiligen Handy.

### Glocke für Admins
Gibt es im Admin-Bereich etwas zu tun, steht oben neben dem Namen eine **🔔 mit Zahl**: neue Anmeldungen, Löschanträge, offene Korrekturanträge, Antworten auf eigene Rückfragen und (Super-Admin) ungelesene Nachrichten. Antippen zeigt die Liste; ein Eintrag springt direkt in den passenden Bereich. **Später erinnern**: in 1, 3 oder 8 Stunden oder morgen früh – spätestens am nächsten Morgen um 8 Uhr meldet sich die Glocke wieder (mit Hinweis), solange noch etwas offen ist. Neue Aufgaben zeigt sie auch während der Pause sofort.

### Admin-Bereich: Reiter
Der Admin-Bereich ist in Reiter aufgeteilt: **📥 Aufgaben** (oben der gewählte bzw. laufende Tag mit seinen fünf Schritten und dem nächsten Schritt samt „Los →“; darunter die offenen Aufgaben: neue Anmeldungen, Korrekturanträge, Löschanträge, Posteingang, Antworten auf Rückfragen – mit Zahl), **📅 Tag**, **🍺 Getränke** (mit Lager), **📊 Auswertung**, **👥 Personen** und **⚙️ Einstellungen**. Ist etwas offen, öffnet der Admin-Bereich mit „Aufgaben“, sonst immer mit „Tag“. Bereiche ohne Einträge („… (0)“) werden ausgeblendet. Die Glocke springt direkt in den richtigen Reiter. **Aufklappen:** Bereiche (Überschrift mit Pfeil) und Einträge in Karten mit Pfeil im Kreis (z. B. „Buchen“, ein Getränk, eine Person) lassen sich antippen. Offene Karten sind gelb umrandet. Klappt man etwas auf, klappen die anderen Einträge derselben Liste bzw. die anderen Bereiche zu, und das Geöffnete rutscht unter die Leiste; **„Alle auf“** öffnet trotzdem alle Bereiche. Die Leiste mit Reitern, Suche und Bereichen bleibt beim Scrollen oben stehen; mit **„▴ Einklappen“** wird sie zu einer schmalen Zeile mit den Reitern, **▾** klappt sie wieder auf (wird pro Handy gemerkt). Würde die Leiste zusammen mit dem Kopf mehr als knapp die Hälfte des Bildschirms verdecken (kleines Handy, große Schrift), startet sie von selbst eingeklappt. Der Vorstand sieht nur die Reiter mit Bereichen, die er sehen darf.

- **Suche:** Unter den Reitern steht ein Suchfeld. Es findet Bereiche (auch über Stichwörter wie „Backup“, „Packliste“, „Inventur“), Getränke, Personen und Tage. Ein Tipp auf einen Treffer springt hin und klappt das Getränk bzw. die Person gleich auf.
- **Der Tag als Ablauf:** Im Bereich „Tag“ steht der Ablauf ① Einladen → ② Freigeben → ③ Läuft (x gebucht) → ④ Zählen → ⑤ Abschluss. Erledigte Schritte haben einen Haken, der nächste fällige ist gelb umrandet und steht darunter als gelber Hinweis mit **„Los →“**. Übersprungene Schritte (z. B. Einladen mit fehlender Mindestmenge, obwohl der Tag schon weiter ist) sind orange mit „!“ markiert. Antippen springt zum passenden Bereich – **Zählen** und **Abschluss** direkt zum **Abgleich**. Ist ein Schritt dran, leuchten **„Zum Scannen freigeben“** (gelb) bzw. **„Tag abschließen“** (grün). Ist ein Schritt erledigt, steht im passenden Bereich ein grüner Kasten „✓ … erledigt“ mit **„Weiter: … →“** zum nächsten Schritt (z. B. nach dem Einladen zu „Freigeben“). **„Läuft“** endet mit **„⏹ Scannen beenden“**: Der Knopf leuchtet, solange der Tag läuft, und steht auch bei den Buchungen („Alle zurück?“). Nach dem Beenden springt die App direkt zum **Abgleich** zum Zählen.
- **Schnell eintippen:** In den Zahlenfeldern im Abgleich (Mit, Übrig) und beim Einladen/Zählen springt die **Eingabetaste** der Handy-Tastatur (↵) ins Feld darunter (nächstes Feld derselben Spalte; die Taste zeigt bewusst ↵ statt „→|“, weil Android bei „Weiter“ selbst in Seitenreihenfolge springt); beim letzten Feld schließt sich die Tastatur. Gespeichert wird beim Verlassen des Feldes.
- **Hinweise antippen:** Die Tages-Hinweise oben („x Abweichungen“, „Leer / Geht zu Ende“, „fehlt noch Übrig“, „Noch nichts eingetragen“) sind Knöpfe und springen direkt zum Abgleich bzw. zum Einladen. Sie stehen nur bei „Aufgaben“ und „Tag“.
- **Tagesabschluss im Abgleich:** Unter der Abgleich-Tabelle steht ein Kasten mit dem, was noch fehlt („Übrig“ nicht eingetragen), dem noch nicht gebuchten **Lager** (Mitgenommenes abbuchen, Übriges zurückbuchen) mit dem Knopf **„📦 Lager jetzt buchen“** und **„🏁 Tag abschließen“**. Gebucht wird erst nach einer Bestätigung. Beim **Freigeben** fragt die App, ob das Mitgenommene gleich aus dem Lager abgebucht werden soll („Später“ geht auch); beim **Abschließen**, ob das Lager gleich mitgebucht werden soll. Berücksichtigt werden nur Getränke mit geführtem Lagerbestand.
- **Mehr …:** Selten Gebrauchtes (Partymodus, Fasnets-Titel, Easter Eggs verwalten) ist im Reiter „Einstellungen“ unter „Mehr …“ eingeklappt. Die Suche findet es trotzdem.
- **Vorsicht-Block:** „Backup importieren“, „Diesen Tag löschen“ und „Zurücksetzen / Werkszustand …“ stehen nur für den Super-Admin ganz unten unter „Daten“ in einem rot umrandeten Block.
- **Vorstand:** „Zu wenig gebucht“ und „Alle Tage“ sieht der Vorstand standardmäßig nicht. Der Super-Admin kann sie über „⇅ Anordnen“ mit dem Häkchen „Vorstand“ freigeben (nur lesen).

### Bereiche anordnen und umbenennen
Im Admin-Bereich oben **⇅ Anordnen**: Jeder Admin legt die Reihenfolge der Bereiche für sich fest und blendet mit dem Häkchen „zeigen“ Bereiche aus, die er nicht braucht (gilt nur für ihn, auf allen seinen Geräten). Der Knopf zeigt, wie viele ausgeblendet sind; „Alles zurücksetzen“ holt alles zurück. Der Super-Admin kann dort zusätzlich die **Überschriften** für alle ändern (leer = Standard), mit dem Häkchen **„Admins“** Bereiche für die Getränke-Admins und mit **„Vorstand“** für den Vorstand ausblenden (der Vorstand sieht immer nur lesend, Excel-Export geht) und mit **„Speichern + als Standard für alle“** die Standard-Reihenfolge festlegen. Wer keine eigene Reihenfolge hat (oder „Auf Standard zurücksetzen“ tippt), bekommt diese.

### Große Schrift
Die App passt sich an die Schriftgröße des Handys an: Formulare stapeln sich, wenn der Platz nicht reicht, Zahlenfelder bleiben lesbar, der Kopf bricht um und klebt nur dann oben, wenn er nicht zu viel Platz wegnimmt.

### Scannen
Auf der Startseite steht nur noch der Knopf **📷 Getränk scannen**. Antippen öffnet direkt das Scanfenster mit Kamera; „Scannen beenden“ klappt es wieder zu.
- Unten rechts erscheint beim Herunterscrollen ein gelber Knopf **nach oben**.
- **Passwort ändern:** angemeldet auf „Passwort ändern“ neben „Abmelden“ tippen.
- **Passwort vergessen?** E-Mail eintragen und auf „Passwort vergessen?“ tippen. Es kommt eine Mail von Firebase zum Zurücksetzen.
- Oben neben „Strichliste“ steht der Netzstatus. „offline · 3 warten“ heißt: 3 Buchungen sind gespeichert und werden gesendet, sobald Netz da ist. In dieser Zeit nicht abmelden; die App warnt davor.

Startet die Kamera nicht, zeigt die App eine Anleitung passend zu Gerät (Android, iPhone, Computer), Browser (Chrome, Samsung Internet, Firefox, Safari, als App installiert) und Fehler: Kamera nicht erlaubt, Kamera belegt (z. B. während eines Telefonats), keine Kamera, oder Link in WhatsApp/Instagram & Co. geöffnet (dann „Im Browser öffnen“ bzw. „Link kopieren“). Mit „Nochmal versuchen“ startet die Kamera erneut.

- **Ich fahre heute:** In der Scan-Ansicht auf das Auto tippen. Dann fragt die App bei jedem alkoholischen Getränk nach („Du fährst heute – trotzdem buchen?“). Admins sehen in der Tagesübersicht, wer heute fährt. Gilt nur für den einen Tag.
- **Ich fahre heute** zeigt beim Einschalten kurz ein Lenkrad mit „Gute Fahrt!“.
- **Easter Eggs für sich einstellen:** Wer Easter Eggs sehen darf, hat neben „Ich fahre heute“ den Knopf „Easter Eggs: an“. Dort wählt man *An*, *An, ohne Ton* (nur dieses Handy) oder *Aus* (für das Konto auf allen Handys: keine Popups, kein Verlauf, keine Sammelalbum-Meldungen; gezählt wird trotzdem).
- **Nachtmodus:** Oben rechts zwischen *Auto*, *Hell* und *Nacht* umschalten. *Auto* wird dunkel, wenn das Handy dunkel eingestellt ist oder in der Nachtzeit (Standard 19 bis 7 Uhr).
- **Nachtzeit einstellen (Super-Admin):** Admin → Einstellungen → **Nachtmodus**: Beginn und Ende wählen. Mit **„Nachtmodus in dieser Zeit für alle erzwingen“** ist die App in dieser Zeit für alle dunkel, auch bei „Hell“; der Knopf oben zeigt dann „Nacht 🔒“. Außerhalb der Zeit gilt wieder die eigene Wahl. Die Einstellung gilt nach kurzer Zeit auf allen Handys (auch auf dem Anmeldebildschirm, sobald das Handy sie einmal geladen hat).

## Ansicht: Einfach und Barrierefrei

Jedes Mitglied kann unter **Konto (Name oben rechts) → 👓 Ansicht** zwei Ansichten einschalten. Sie gelten nur für dieses Handy und lassen sich kombinieren:

- **🟢 Einfache Ansicht:** nur das Wichtigste – großer Scan-Knopf, deine Getränke heute und „Mein Konto“. Bestenliste, Sammelalbum, Rückblick und Easter-Egg-Popups sind ausgeblendet (gezählt wird trotzdem). Der Admin-Zugang bleibt.
- **♿ Barrierefreie Ansicht:** größere Schrift (ca. +18 %), größere Knöpfe und Eingabefelder, stärkere Kontraste und Rahmen, unterstrichene Links, deutlich sichtbare Auswahl (gelber Rahmen) und keine Animationen oder Bewegungen.

## Tage zum Scannen freigeben

- Gebucht werden kann nur, wenn ein Admin einen Tag **zum Scannen freigegeben** hat (Admin → Tag). Sonst sehen Mitglieder „Gerade kein Tag zum Scannen freigegeben“.
- **Zum Scannen freigeben** / **Scannen beenden**: Freigeben gilt für einen Tag; wird ein anderer freigegeben, endet der vorige. „Tag anlegen und freigeben“ macht beides in einem Schritt.
- **Tag abschließen** beendet auch das Scannen. Ein abgeschlossener Tag ist nie freigegeben; wer ihn freigibt, öffnet ihn dabei wieder (mit Rückfrage).
- Buchungen, die Handys offline gespeichert haben, werden auch nach dem Beenden noch übertragen und zählen zu ihrem Tag.

## Nachtragen auf einen bestimmten Tag und „Zu wenig gebucht“

- **Buchung nachtragen** hat oben die Auswahl **„Nachtragen auf Tag“** – auch frühere oder abgeschlossene Tage (mit Hinweis). Die Liste darunter heißt „Am 14.11. gebucht von …“.
- **Zu wenig gebucht** (Admin, auch Vorstand): **„Tage prüfen“** rechnet für jeden Tag mit eingetragenem „Übrig“ pro Getränk *mitgenommen − gebucht − übrig*. Fehlende Flaschen erscheinen rot mit Betrag, zu viel Gebuchtes gelb. „Nachtragen auf diesen Tag“ springt direkt zum Nachtragen mit dem richtigen Tag. Gezählt wird per Zählabfrage – das kostet kaum Lesevorgänge.

## Backup

- **Backup speichern** (Admin → Daten) lädt eine JSON-Datei mit allem, was sich nicht neu berechnen lässt: Getränke (mit Sorte, Limits, Lager), Tage, Buchungen, Personen (mit Rolle, Gruppe, „unter 18“), alle Einstellungen (auch Gruppen, Fasnets-Titel, Easter-Egg-Regeln, Datenschutz, Nachtmodus), Korrekturanträge, Posteingang, Historie, Sammelalben, Easter-Egg-Verläufe, Fahrer-Markierungen und – abwählbar – Profilbilder. Nicht enthalten: Zähler und Bestenliste (werden nach dem Import neu berechnet) und die Logins (liegen bei Firebase Authentication). Vollständig wird es nur beim Super-Admin; Getränke-Admins fehlen Posteingang und Historie.
- **Backup importieren** (Super-Admin) zeigt vorher, was in der Datei steckt (mit Anzahl), und du hakst an, was importiert wird. **Personen**, Profilbilder und Historie sind standardmäßig abgewählt – Personen gelten auch für Stundentracker und WexSuperAdmin, beim Überschreiben fragt die App extra nach. Dazu wählst du, ob vorhandene Einträge **überschrieben** oder **behalten** werden (dann werden nur fehlende ergänzt). Was nicht im Backup steht, bleibt immer. Die Historie wird nur ergänzt, nie geändert. Ältere Backups und Daten der Offline-Version lassen sich weiter importieren.
- **Erinnerung:** Der Super-Admin stellt unter Daten ein, nach wie vielen Tagen ohne Backup erinnert wird (Standard 30, 0 = nie). Dann steht oben im Admin-Bereich „Zeit für ein Backup“ mit „Jetzt sichern“, und Admins bekommen einmal am Tag einen Hinweis.
- Die Datei enthält persönliche Daten – sicher aufbewahren (nicht in die WhatsApp-Gruppe).

- **Automatisches Backup vor dem Löschen (Super-Admin):** Bevor der Super-Admin etwas Größeres löscht – einen Tag mit Buchungen, eine Person (auf Wunsch mit Buchungen), einen Personeneintrag endgültig, alle erledigten Anträge oder Nachrichten, oder „Zurücksetzen / Werkszustand“ –, kommen nacheinander: **Passwort erneut eingeben**, ein **automatisches Backup** (JSON-Datei im Download-Ordner, Name mit Datum und Uhrzeit; immer mit Profilbildern, egal wie das Häkchen „Profilbilder mitsichern“ steht) und eine **letzte Bestätigung**, die den Dateinamen nennt. Schlägt das Backup fehl, fragt die App, ob trotzdem ohne Backup weitergemacht werden soll. Getränke-Admins sind davon nicht betroffen.

## Bedienung

- **Abfragen** („Wirklich löschen?“, „Du fährst heute – trotzdem buchen?“ usw.) erscheinen als eigene Fenster im Stil der App statt als Browser-Fenster. Löschen/Entfernen/Sperren hat einen roten Knopf.
- **Tippen:** Die Enter-Taste der Handy-Tastatur springt ins nächste Feld („Weiter“); im letzten Feld schickt sie ab (Anmelden, Antrag senden, Passwort speichern …) bzw. übernimmt die Eingabe. Zahlenfelder markieren beim Antippen ihren Inhalt, sodass man direkt überschreiben kann.
- **Anzahl** (Korrekturantrag, Nachtragen, Einladen per Scan) hat **− / +** Knöpfe – meist braucht man die Tastatur gar nicht.
- Auf Android verkleinert die Tastatur die Seite, sodass Fenster und Eingabefelder sichtbar bleiben.
- **Taschenlampe 🔦:** Beim Scannen (Hauptseite und Admin-Scan) erscheint oben rechts im Kamerabild ein Lampen-Knopf, wenn Handy und Browser das Kameralicht freigeben (Android/Chrome meist ja, iPhone je nach iOS-Version). Die Wahl wird pro Gerät gemerkt – wer sie anlässt, hat beim nächsten Scannen gleich Licht. Beim Stoppen geht die Lampe aus.

## Partymodus 🪩

- **Erlauben (Super-Admin):** Admin → Einstellungen → Partymodus → „Partymodus erlauben“. Standard: aus. Ist er nicht erlaubt, kann niemand ihn starten; wird er verboten, während er läuft, endet er sofort für alle.
- **Starten:** Ist er erlaubt, haben Getränke-Admins und der Super-Admin auf der **Startseite** neben „Ich fahre heute“ den Knopf **„🪩 Party starten“**. Es erscheint ein Fenster mit der Dauer (1, 3, 6 Stunden oder offen) – „Starten“. Derselbe Knopf heißt dann „🪩 Party beenden“. Im Admin-Bereich geht beides ebenfalls.
- **Alle anderen** bekommen beim Start ein Fenster „🎉 Partymodus! … Willst du mitmachen?“ mit einer roten **Triggerwarnung** (wechselnde Farben und Bewegung; bei Lichtempfindlichkeit, Epilepsie oder Migräne nicht mitmachen) und **Mitmachen** / **Nein danke**. Die Warnung erscheint auch beim späteren Einsteigen. Wer mitmacht, bekommt einen bunten, sich drehenden Farbschleier mit Lichtflecken, Titel und Knöpfe wechseln die Farbe. Die App bleibt normal bedienbar.
- Unten links erscheint ein Knopf **„🪩 Party: dabei / aus“** zum Aus- und wieder Einsteigen.
- Die Farbwechsel sind bewusst sanft (kein schnelles Blitzen). Wer am Handy „Bewegung reduzieren“ eingeschaltet hat, bekommt einen ruhigen Farbschleier ohne Animation.

- **Effekte (Admins):** Welche Animationen laufen, wählen Admins im Admin-Bereich unter „Partymodus“ oder während der Party auf der Startseite über **🎛 Effekte**: *Farbwirbel, Lichtspots, Discokugel, Laser, Konfetti, Emoji-Regen, Seifenblasen, Funkeln, Leuchtende Knöpfe*. Schnellwahl: *Alle an*, *Ruhig* (Farbwirbel, Lichtspots, Funkeln) und *Standard* (Farbwirbel, Lichtspots, Discokugel, Konfetti). Änderungen gelten sofort für alle, die mitmachen. Nichts davon blitzt; wer am Handy „Bewegung reduzieren“ eingestellt hat, sieht keine Animationen.

## Mehr: Bestenliste, Album, Mein Konto, Rückblick

Unter der Liste „Deine Getränke heute“ gibt es bis zu vier Reiter. Welche jemand sieht, legt der Super-Admin unter Einstellungen fest (Standard: nur „Mein Konto“).

| Reiter | Inhalt |
|---|---|
| **Bestenliste** | heute oder gesamt, Personen und Gruppen. Wonach gewertet wird, legt der Super-Admin fest (Standard: alkoholfreie Getränke). |
| **Sammelalbum** | alle Easter Eggs als Abzeichen. Antippen zeigt, wie man es bekommt, und bei gesammelten wie oft und wann zuletzt. Minderjährige sehen nur die alkoholfreien. |
| **Mein Konto** | eigene Getränke und Kosten der Saison (11.11. bis Aschermittwoch) pro Tag und Getränk, als Excel herunterladbar. |
| **Rückblick** | die eigene Saison wie ein Jahresrückblick: Getränke, Tage, Lieblingsgetränk, stärkster Tag, Easter Eggs, Platz der Gruppe und ein Fasnets-Titel. **Als Bild teilen** erzeugt ein Bild für WhatsApp oder Instagram. Ab Aschermittwoch erscheint oben ein Hinweis. |

## Fasnets-Titel im Rückblick

- Im Rückblick bekommt jede Person einen **Fasnets-Titel**. Von oben nach unten gilt der erste Titel, dessen Bedingung passt; gezählt wird die Saison (11.11. bis Aschermittwoch). Unter dem Titel steht, warum man ihn hat, und **„Alle Titel ansehen“** zeigt die ganze Liste.
- **Super-Admin:** Admin → **Fasnets-Titel (Rückblick)**: Titel umbenennen, an/aus, mit ↑/↓ sortieren, löschen, **Neuer Titel**. Bedingungen: keine Buchung, Getränke mindestens/höchstens, Tage dabei, Anteil alkoholfrei (%), Bier, Getränke einer Sorte, Lieblingssorte, am stärksten Tag, Easter Eggs gesammelt, Platz der Gruppe, Strichliste in €, immer (Auffang-Titel ganz unten).
- Standard wie bisher: Noch ohne Strich → Vernunft-Wefzg (≥ 60 % alkoholfrei) → Treue Fasnetsseele (≥ 8 Tage) → Stammgast der Strichliste (≥ 40 Getränke) → Gmiatliche Wefzg. Zusätzlich vorbereitet, aber aus: Wasserratte, Durchhalte-Wefzg, Gruppen-Champion, Easter-Egg-Jäger, Seltener Gast. **„Standard-Titel zurückholen“** ergänzt gelöschte Standard-Titel, eigene bleiben.

## Einstellungen (Super-Admin)

Unter Admin → **Einstellungen**:
- **Kontakt:** Name, WhatsApp-Nummer (oder Link) und Telefon. Erscheint überall, wo man sich melden soll: „Konto wartet auf Freischaltung durch …“, „gesperrt“, „keine Rechte“ und in der Hilfe – mit Knöpfen „WhatsApp an …“ und „Anrufen“.
- **Wer sieht was?** Für Easter Eggs, Bestenliste, Sammelalbum und Saison-Rückblick jeweils: *niemand (nur Super-Admin)*, *Admins und Vorstand*, *alle Mitglieder* oder *ausgewählte Personen*. **Standard: ausgeblendet.** Gezählt wird trotzdem, beim Einschalten sind die Daten also da. „Mein Konto“ sehen immer alle.
- **Bestenliste – Regeln:** wonach Personen gewertet werden (alkoholfreie Getränke, alle Getränke oder Bier), Überschrift, Anzahl der Plätze, Gruppen-Wertung an/aus und wonach die Gruppen sortiert werden (Getränke gesamt, pro Kopf, alkoholfreie, Anteil alkoholfrei), Startansicht heute/gesamt.

Außerdem zeigt **Neu registriert** die letzten 25 Registrierungen mit Status (wartet, aktiv, abgelehnt, gesperrt); „Als gesehen markieren“ setzt die „neu“-Markierung zurück.

## Datenschutz

- **Datenauskunft (Super-Admin):** Admin → 👥 Personen → Person aufklappen → **„📄 Datenauskunft (ZIP)“** (bei entfernten Konten das 📄). Die App sammelt alles, was zu der Person gespeichert ist, und lädt eine ZIP-Datei herunter: **Datenauskunft.xlsx** (Übersicht mit Stammdaten und Nutzung, dazu je ein Blatt für Buchungen, Korrekturanträge, Nachrichten an und vom Verein, Rückfragen, Bus-Check-ins, Fahrer, Rückgängig, Easter Eggs und Historie), **daten.json** (alle Rohdaten, maschinenlesbar) und **profilbild.jpg** (falls vorhanden). Für die Historie wird sie einmal ganz gelesen (Einträge der Person und Einträge, die ihren Namen nennen). Das Erstellen steht in der Historie. Die Datei nur an die Person selbst weitergeben.
- Bei der **Registrierung** muss man den Datenschutzhinweis bestätigen und kann gleich seine **Gruppe** wählen.
- Der Hinweis steht unten auf jeder Seite („Datenschutz“) und in der Hilfe: wer verantwortlich ist, was gespeichert wird, wofür, wer was sieht (mit den aktuellen Einstellungen), wo die Daten liegen, wie lange und welche Rechte man hat.
- Bestehende Konten sehen einmal den Hinweis „Bitte lies kurz …“ mit „Gelesen und einverstanden“.
- **Konto löschen:** Mitglieder beantragen es im Datenschutzhinweis. Der Super-Admin sieht oben im Admin „Löschanträge“ und entfernt das Konto (auf Wunsch mit Buchungen); das Login löscht er in der Firebase-Konsole.
- **Wer hat bestätigt? (Super-Admin):** Admin → **Datenschutz-Bestätigungen** zeigt „x von y“, Fortschrittsbalken und eine Liste (Filter *Offen* / *Alle*) mit Datum der Bestätigung bzw. der letzten Erinnerung.
  - **Erinnern** (einzeln oder „Alle Offenen in der App erinnern“): Beim nächsten Öffnen der App erscheint der Datenschutzhinweis als Fenster mit „Erinnerung von …“ und dem Knopf **Gelesen und einverstanden**.
  - **E-Mail an alle Offenen:** öffnet dein Mailprogramm mit allen offenen Adressen in BCC und fertigem Text.
  - **Text für WhatsApp-Gruppe:** fertiger Erinnerungstext mit Link zum Teilen.
  - **Neue Fassung: alle erneut bestätigen lassen:** nach einer wichtigen Änderung des Hinweises müssen alle (auch du) neu bestätigen.
- Verein, Aufbewahrungsdauer und einen Zusatztext stellt der Super-Admin unter Einstellungen → Datenschutzhinweis ein. **Bitte den Text vom Vorstand bzw. Datenschutz-Verantwortlichen prüfen lassen** – er ist eine Vorlage, keine Rechtsberatung.
- Gruppen, Kontakt und Datenschutz-Angaben sind schon vor der Anmeldung lesbar (für die Registrierung).

## Schutz der Zähler und der Bestenliste

- Mitglieder dürfen einen Zähler pro Schreibvorgang nur um genau 1 ändern und in der Bestenliste nur ihren eigenen Eintrag und ihre eigene Gruppe (Firebase-Regeln).
- Admin-Handys gleichen alle 5 Minuten die Zähler des aktiven Tages mit den echten Buchungen ab und korrigieren sie. Größere Abweichungen (mehr als 2) landen in der Historie.
- Das Handy des Super-Admins prüft einmal am Tag alle Zähler „seit Beginn“. Dafür liest es nur die Buchungen der Tage neu, an denen sich etwas geändert hat (neue oder spät synchronisierte Buchungen, Stornos und Nachträge durch Admins, die letzten 14 Tage). Pro Tag merkt es sich eine kleine Zusammenfassung (Sammlung `dsum`, nur für den Super-Admin lesbar); daraus entstehen alle Zähler und die Bestenliste. So bleibt der Verbrauch klein, auch nach vielen Jahren.
- **Zähler neu berechnen** (Admin, nur Super-Admin) liest dagegen alle Buchungen einmal komplett – nur nötig, wenn etwas nicht stimmt. Nach einem Backup-Import passiert das automatisch bei der nächsten Prüfung.
- Seit Version 46 braucht das die neue Regel für `dsum`: `firestore.rules` neu in die Firebase-Konsole einfügen und veröffentlichen. Solange das fehlt, zeigt der Admin-Bereich einen roten Hinweis und die tägliche Prüfung ist ausgesetzt.

## Einkaufsliste

Admin → **Einkaufsliste**: Einkauf für wie viele Ausflüge, Basis (letzte wie viele Ausflüge) und Puffer eintragen, unter „Lagerbestand“ die Flaschen im Lager (oder „Lager = Übrig vom …“ übernehmen), dann **Einkaufsliste berechnen**. Verbrauch pro Ausflug = gebucht, oder mitgenommen − übrig, falls das mehr ist. Ergebnis in Kästen (größtes Gebinde), teilbar per WhatsApp oder kopierbar.

## Hilfe

Der **?**-Knopf oben erklärt Mitgliedern, wofür die App ist und wie Buchen, Offline, Mein Konto, Fahrer-Modus und Profilbild funktionieren – ohne Easter Eggs und Extras.

## Rechte-Übersicht (Super-Admin)

Admin → 👥 Personen → **Rechte-Übersicht**: eine Tabelle pro Bereich (Buchen, Tage und Bus, Getränke und Lager, Personen, Auswertung, Nachrichten, Einstellungen und System), was **Mitglied**, **Vorstand**, **Getränke-Admin** und **Super-Admin** dürfen: ✏️ ändern, 👁 nur ansehen, 👤 nur eigenes, 🔓 nur wenn freigegeben, — nein. Grundlage sind die Firebase-Regeln (gelten auf dem Server) und die App. Oben steht der aktuelle Stand: wer Getränke-Admin und Vorstand ist, was der Vorstand zusätzlich sieht („Zu wenig gebucht“, „Alle Tage“), welche Bereiche für Admins bzw. Vorstand ausgeblendet sind, ob Admins den Partymodus starten dürfen, Easter Eggs und Rückgängig-Zeit.

### Berechtigungen pro Rolle einstellen (ab v2.14.0)

In der Rechte-Übersicht oben unter **„🔧 Berechtigungen pro Rolle einstellen“** legst du pro Bereich fest, was die Rollen dürfen:

| Bereich | Getränke-Admin | Vorstand |
|---|---|---|
| Tage, Einladen und Zählen · Bus-Check-in · Buchungen und Anträge · Getränke und Preise · Lager · Personen | ✏️ ändern (Standard) / 👁 nur ansehen / 🙈 ausgeblendet | 👁 ansehen (Standard) / 🙈 ausgeblendet |

- **Nur ansehen** sperrt das Ändern in der App (ausgegraut) **und auf dem Server** (Firebase-Regeln: `adminCan()` liest `config/perms`). Dafür müssen die Regeln ab v2.14.0 veröffentlicht sein.
- **Ausgeblendet** blendet die zugehörigen Bereiche in der App aus (gelesen werden die Daten weiterhin, z. B. für den Abgleich).
- Getrennte Bereiche greifen ineinander: Ist „Tage“ nur ansehen, darf „Lager“ trotzdem pro Tag ab-/zurückbuchen und „Bus-Check-in“ den Bus einrichten; ist „Getränke“ nur ansehen, darf „Lager“ trotzdem Bestand und Mindestbestand ändern.
- Nur Einschränken ist möglich – der Vorstand bekommt keine Schreibrechte. Der Super-Admin ist nie eingeschränkt. „Alles auf Standard“ hebt alles auf. Jede Änderung steht in der Historie.
- Eingeschränkte Getränke-Admins sehen oben im Admin-Bereich einen Hinweis, was eingeschränkt ist. Die Tabellen der Rechte-Übersicht zeigen deine Einschränkungen gestrichelt markiert.

## Leistung und Firebase-Abfragen (ab v2.15.0)

- **Gesammelt statt einzeln:** Listen laden ihre Daten in Paketen (Firestore `in`, bis zu 30 Werte je Abfrage) statt einer Abfrage pro Eintrag: Tage in „Mein Konto“, Profilbilder, Excel-Auswertung, Anwesenheit und Bedarf. Admins laden Profilbilder nicht mehr zusätzlich einzeln (sie hören ohnehin auf alle). „Zu wenig gebucht“ prüft alle Tage gleichzeitig. Gelesene Dokumente kosten gleich viel – es sind nur viel weniger Anfragen und Wartezeiten.
- **Indizes:** Alle Abfragen kommen mit den automatischen Einzelfeld-Indizes aus (nur Gleichheit bzw. Bereich auf einem Feld). Zusammengesetzte Indizes sind nicht nötig. Empfohlen, aber optional: in der Firebase-Konsole unter Firestore → Indizes → **Einzelnes Feld → Ausnahme hinzufügen** für große Textfelder das Indexieren abschalten (spart Speicher und Schreibzeit, nach diesen Feldern wird nie gesucht): `avatars.img`, `config.items` (App-Links mit Bildern), `log.text`, `msgs.text`, `bcmsg.text`, `asks.text`, `ueggs.items`, `days.bus`.
- **Zwischenspeicher:** Firestore hält alle Daten zusätzlich im Handy (IndexedDB, auch offline); Listener übertragen nur Änderungen. Die Anmeldeseite merkt sich Gruppen, Texte, Kontakt, Datenschutz und App-Links 6 Stunden und liest erst danach neu; angemeldete Handys halten diesen Speicher über die Listener aktuell.
- **Schneller Start:** Die Barcode-Bibliothek (`index_min.js`, 336 kB) wird nicht mehr sofort geladen, sondern beim ersten Scannen bzw. im Leerlauf ein paar Sekunden nach dem Start. Die Schriftart blockiert das erste Bild nicht mehr. Profilbilder werden „lazy“ dekodiert.

## Freischaltung neuer Konten

- Neue Konten können erst buchen, wenn ein **Admin** sie freischaltet. Admins sehen im Admin-Bereich ganz oben **Neue Anmeldungen** mit „Freischalten“ und „Ablehnen“ und bekommen eine kurze Meldung, wenn sich jemand registriert.
- Beim Freischalten lassen sich gleich **Gruppe** und **unter 18** setzen.
- Konten, die es vor Version 15 schon gab, bleiben aktiv. Der Super-Admin schaltet sich selbst automatisch frei.

## Jugendschutz

- Unter Admin → Personen (oder beim Freischalten) **unter 18** ankreuzen.
- Minderjährige sehen nur alkoholfreie Getränke. Bier, Radler/Mischbier, Wein/Sekt und Schnaps lassen sich für sie nicht buchen – das prüfen auch die Firebase-Regeln, also nicht nur die App. Admins können für sie ebenfalls nichts Alkoholisches nachtragen.
- Sie bekommen keine Easter Eggs mit Alkoholbezug, auch nicht die gemeinsamen der Gruppe.
- Wichtig dafür ist die richtige **Sorte** jedes Getränks (Admin → Getränke): *Bier, Radler/Mischbier, Alkoholfrei, Wein/Sekt, Wasser, Softdrink, Schnaps, Sonstiges*. Fehlt sie, setzt die App sie beim nächsten Öffnen durch einen Admin automatisch anhand des Namens; bitte einmal kontrollieren.

## Gruppen (Narrenfiguren)

- Der **Super-Admin** legt unter Admin → **Gruppen** die Gruppen an (z. B. Wilde Wefzg, Hofgoischd), Admins ordnen Personen unter Admin → Personen zu.
- Die Gruppe steht neben dem Namen, in der Bestenliste und im Rückblick.
- Gruppen-Easter-Eggs: „30 Getränke für die Gruppe“ und „Gruppe bleibt vernünftig“ (10 alkoholfreie). Sie erscheinen auf allen Handys.

## Kontakt, Fehler melden, Feedback (Posteingang)

- **Mitglieder** schreiben über **„Kontakt & Feedback“** (unten auf jeder Seite), über die Hilfe (**?**) oder über „Nachricht an …“ (z. B. beim Warten auf Freischaltung). Drei Arten: *Nachricht*, *Fehler melden* (auf Wunsch mit Geräte-Infos: App-Version, Handy, Browser, Bildschirm, online/offline) und *Feedback / Idee*.
- **Name und E-Mail** des Absenders kommen automatisch aus dem Konto – die Firebase-Regeln lassen keinen anderen Namen zu. Auch wartende oder gesperrte Konten können schreiben.
- **Super-Admin:** ganz oben im Admin **Posteingang (ungelesen)** mit Filtern *Offen / Fehler / Feedback / Alle*. Aufklappen markiert als gelesen; **Antworten** (erscheint beim Mitglied in der App, mit Hinweis), **Erledigt**, **Ungelesen**, **Löschen**, „Alle erledigten löschen“. Neue Nachrichten melden sich mit einem Hinweis.
- Mitglieder sehen unter „Meine Nachrichten“ ihre Nachrichten und Antworten; im Fußbereich steht „1 neu“, wenn eine Antwort da ist.
- WhatsApp als Kontaktweg ist entfallen; die Telefonnummer (falls eingetragen) bleibt als „Anrufen“.

## Zu viel gescannt

- Pro Getränk unter Admin → Getränke: **„Darf mehr gebucht werden (Flaschen)“**.
  - **Zahl eingetragen (auch 0): harte Grenze.** Sind *mitgenommen + diese Zahl* gebucht, lässt sich das Getränk nicht mehr buchen – weder per Scan noch mit „+1“. Mitglieder sehen „ausgebucht“ und „Bitte beim Getränke-Admin melden“. 0 heißt: Schluss, sobald alles Mitgenommene gebucht ist. Wurde das Getränk heute gar nicht mitgenommen, ist es gesperrt.
  - **Ausgebucht-Meldung:** Sobald ein Getränk mit Grenze voll ist, bekommen alle Admin-Handys oben die rot-schwarze Leiste „Getränk ausgebucht“ mit Ton und Vibration – und eine Handy-Benachrichtigung, wenn die App im Hintergrund läuft. Wird wieder Platz frei (Storno, mehr eingeladen), meldet sich das Getränk beim nächsten Vollwerden erneut.
  - **Leer: keine Grenze.** Es wird nur gemeldet (siehe unten).
  - Die Grenze greift erst, wenn für den Tag etwas als mitgenommen eingetragen ist. Admins können weiterhin nachtragen. Gezählt wird in `dused` (pro Tag und Getränk); Admin-Handys gleichen den Zähler laufend mit den echten Buchungen ab. Handys ohne Netz kennen den aktuellen Stand nicht – dort kann es einzelne Buchungen über der Grenze geben, die dann wie bisher gemeldet werden.
- Werden an einem Tag mehr Flaschen gebucht als *mitgenommen + dieser Wert*, bekommen **alle Admin-Handys** oben eine rot-schwarze Meldung mit Ton: welches Getränk, wie viele zu viel und **wer** die Buchungen über der Grenze gemacht hat. „Ansehen“ öffnet im Admin den Bereich **„Zu viel gescannt“** mit Uhrzeit und Person jeder überzähligen Buchung.
- Getränke, die an dem Tag gar nicht mitgenommen wurden und keinen Wert haben, lösen keine Meldung aus (dafür gibt es den Hinweis „nicht mitgenommen“).
- Wie bei „Getränke gehen zu Ende“: Die Meldung kommt nur, solange die App auf dem Admin-Handy offen ist (mit erlaubten Benachrichtigungen auch im Hintergrund).

## Korrektur- und Nachbuchungsanträge

- **Mitglieder:** unter „Deine Getränke heute“ und in „Mein Konto“ auf **Korrektur beantragen**: *Nachbuchen* oder *Stornieren*, Tag (die letzten Ausflüge), Getränk, Anzahl (bis 20 pro Antrag – für mehr einen zweiten Antrag stellen) und eine Bemerkung. Beim **Stornieren** stehen nur Getränke zur Auswahl, die man an dem Tag selbst gebucht hat, und höchstens so viele, wie gebucht wurden (abzüglich schon beantragter Stornos). Unter **Meine Anträge** steht der Status; offene Anträge lassen sich zurückziehen. Wird entschieden, kommt eine Meldung.
- **Getränke-Admins und Super-Admin:** oben im Admin **Korrekturanträge** mit **Genehmigen** / **Ablehnen** (mit Begründung). Genehmigen bucht nach bzw. storniert die jüngsten passenden Buchungen und zieht die Zähler mit. Neue Anträge melden sich mit einem Hinweis. Erledigte stehen aufklappbar darunter, alles steht auch in der Historie.
- **Super-Admin:** kann jeden Antrag löschen (Knopf „Löschen“ an jedem Antrag) und unter „Erledigt“ alle erledigten auf einmal. Gelöscht wird nur der Antrag – Buchungen, die durch eine Genehmigung entstanden oder storniert wurden, bleiben, wie sie sind. Das Löschen steht in der Historie.
- Jugendschutz gilt auch hier: Minderjährige können keinen Alkohol nachbuchen lassen. Der Vorstand sieht die Anträge nicht.

## Admin-Bereich öffnen

Für Admins und Vorstand gibt es in der Reiterleiste unter der Scan-Seite (neben Bestenliste, Mein Konto …) den Reiter **„🛠️ Admin“** – er öffnet den Admin-Bereich; andere Mitglieder sehen ihn nicht. Alternativ geht es weiterhin, indem man **fünfmal schnell hintereinander auf den Titel** oben tippt (innerhalb von zwei Sekunden). Zurück geht es über „Zurück zum Scannen“ oben rechts. Oben steht eine **Navigation** mit allen Bereichen (antippen springt hin). Jeder Bereich lässt sich über seine Überschrift **ein- und ausklappen**, „Alle auf“ / „Alle zu“ schaltet alle; das Handy merkt sich die Auswahl. Das ist nur ein Sichtschutz – die eigentlichen Rechte prüfen die Firebase-Regeln. Wer kein Admin und nicht Vorstand ist, bleibt einfach in der normalen Ansicht – oder wird auf die Seite weitergeleitet, die der Super-Admin unter Einstellungen → Kontakt bei „Weiterleitung“ einträgt (z. B. https://wexhainer.de/). Die Einrichtungs-Ansicht mit der eigenen Nutzer-ID (für `superUids` in `firestore.rules`) erreicht man nur noch über die Adresse mit **`?setup=1`** am Ende, z. B. `…/index.html?setup=1`, dann 5× auf den Titel tippen.

## Excel-Auswertung (Admins)

Unter Admin → **Excel-Auswertung** einen Zeitraum wählen (oder „Gesamter Zeitraum“, „Dieser Monat“, „Gewählter Tag“) und **Excel erstellen** tippen. Die Datei enthält:

| Blatt | Inhalt |
|---|---|
| Übersicht | Zeitraum, Anzahl Tage und Personen, Getränke, Wert, Fehlmengen, Liste der Tage |
| Pro Person | jedes Mitglied mit Anzahl je Getränk, Getränke gesamt und **Kosten**, darunter die Summen |
| Person pro Tag | wer an welchem Tag was getrunken hat, mit Preis und Summe |
| Abgleich pro Tag | mitgenommen, gebucht, Soll-Rest, gezählt, Differenz und Werte |
| Buchungen | jede einzelne Buchung mit Datum, Uhrzeit, Person, Getränk und Art |
| Getränke | Stammdaten mit Sorte, Preis, Gebinde und Barcodes |

Summen und Kosten stehen als Formeln drin, Kopfzeilen sind fixiert und mit Filter versehen. Die Kosten werden mit den **aktuellen** Preisen berechnet. Die Datei entsteht direkt im Browser (ohne zusätzliche Bibliothek); dafür wird nur Internet für das Laden der Buchungen gebraucht.

## Historie (Super-Admin)

Unter Admin → **Historie** steht jede Änderung: Mitglieder (Registrierung, Name, Rolle, Sperre, Entfernen, Profilbild, Passwort), Buchungen (Rückgängig, Storno, Nachtrag), Einladen und Zählen, Getränke, Tage, Easter Eggs und System (Zähler, Import, Zurücksetzen). Datum wählen, die Bereiche lassen sich aufklappen. Mit „auch normale Scans“ erscheinen zusätzlich alle Buchungen des Datums. Die Historie kann niemand ändern. Löschen kann sie nur der Super-Admin über „Zurücksetzen / Werkszustand“ (Häkchen „Historie“, mit Passwort und Backup vorher); danach bleibt ein Eintrag stehen, wer wann zurückgesetzt hat.

## Buchungen einer Person korrigieren

Unter Admin → **Buchung nachtragen** die Person wählen: Darunter stehen ihre Buchungen des Tages, pro Getränk mit „−1 stornieren“ und aufklappbar einzeln. Nachtragen und Stornieren passen die Easter-Egg-Zähler automatisch an.

## Zurücksetzen bis zum Werkszustand (Super-Admin)

Admin → ⚙️ Einstellungen → Daten → roter Block → **Zurücksetzen / Werkszustand …**. Dort hakst du an, was gelöscht wird („Alles anhaken“ = Werkszustand):

| Auswahl | Was gelöscht wird |
|---|---|
| Statistiken & Easter-Egg-Zähler (vorausgewählt) | Zähler (Gruppe und Personen), Bestenlisten, Sammelalben, Easter-Egg-Verläufe – danach lösen alle Easter Eggs neu aus |
| Buchungen und Tage | alle Tage, Buchungen, Fahrer-Markierungen, Rückgängig-Protokoll, Rückfragen; Bus-Check-ins werden dabei immer mitgelöscht |
| Bus-Check-ins | alle Check-ins mit Standorten und Codes |
| Getränke und Lager | alle Getränke (Preise, Barcodes), Lagerbewegungen, Packliste |
| Korrekturanträge und Posteingang | alle Anträge und Nachrichten |
| Eigene Easter Eggs und Fasnets-Titel | selbst angelegte Easter Eggs, Kategorien, Titel, Bestenlisten-Einstellungen |
| Einstellungen auf Standard | Texte, Abschnitte/Überschriften, Kontakt, Datenschutz, Farben, Rückgängig, Funktionen, Partymodus, Backup-Erinnerung |
| Gruppen | alle Gruppen (Personen bleiben, nur ohne Gruppe) |
| Profilbilder | alle Profilbilder |
| Historie | das ganze Protokoll; danach steht nur noch ein Eintrag, wer wann was zurückgesetzt hat (braucht die Regeln ab v101) |

Danach: Passwort eingeben → automatisches Backup (Download-Ordner) → letzte Bestätigung mit der Liste. Während gelöscht wird, zeigt ein Fortschrittsbalken den Stand (erst wird gezählt, dann gelöscht); am Ende steht, wie viele Einträge aus welchen Bereichen gelöscht wurden. Dasselbe beim Löschen eines Tages. **Immer erhalten bleiben** die Personen und Konten (sie gelten auch für Stundentracker und WexSuperAdmin; löschen nur in WexSuperAdmin) und die persönlichen Ansichten der Admins.

## Rollen

Rollen vergibt der Super-Admin unter Admin → Personen → Rolle.

| | Mitglied | Vorstand | Getränke-Admin | Super-Admin |
|---|:-:|:-:|:-:|:-:|
| Getränke für sich buchen, eigene Buchung zurücknehmen, Passwort ändern | ✓ | ✓ | ✓ | ✓ |
| Tag, Abgleich, Nach Person, Buchungen, Getränke, Personen **ansehen** | | ✓ | ✓ | ✓ |
| Excel-Auswertung erstellen | | ✓ | ✓ | ✓ |
| Tage, Getränke, Einladen, Zählen, Abgleich **ändern**, CSV, Backup speichern | | | ✓ | ✓ |
| Buchungen stornieren und nachtragen, Namen korrigieren | | | ✓ | ✓ |
| Neue Konten freischalten, unter 18 markieren, Gruppe zuordnen | | | ✓ | ✓ |
| Partymodus starten und beenden | | | ✓ | ✓ |
| Einstellungen: Kontakt, wer sieht was, Bestenliste-Regeln | | | | ✓ |
| Easter Eggs verwalten und an/aus, Zähler neu berechnen, Gruppen anlegen | | | | ✓ |
| Neu registrierte Mitglieder, Historie, Zurücksetzen / Werkszustand | | | | ✓ |
| Tag löschen, Backup importieren | | | | ✓ |
| Rollen vergeben, Konten sperren, entfernen, Passwort-Mail | | | | ✓ |

- **Vorstand** sieht im Admin-Bereich (5× auf den Titel tippen) alles nur lesend, ohne Rollen der Personen. Einziger Knopf ist „Excel erstellen“.
- **Getränke-Admin** (früher „Admin“) kümmert sich um Tage, Getränke und Abgleich. Easter Eggs an/aus und „Zähler neu berechnen“ darf er nicht mehr.

Die Rechte prüfen die Firebase-Regeln, nicht nur die App.
- **Sperren:** wirkt sofort. Die Person sieht „Dein Konto ist gesperrt“ und kann nichts mehr buchen.
- **Entfernen:** sperrt das Konto und nimmt es aus der Liste. Auf Wunsch werden dabei alle Buchungen der Person gelöscht. Unter „Entfernte Konten“ lässt sich das rückgängig machen.
- **Login endgültig löschen:** In der Firebase-Konsole unter Authentication → Nutzer, über das Menü „⋮“ der Person. Die App verlinkt dorthin. Direkt aus der App geht das im kostenlosen Tarif nicht. Fremde Passwörter setzen geht ebenfalls nicht; dafür gibt es die Passwort-Mail.

## Profilbilder

- Jedes Mitglied tippt in der Scan-Ansicht auf den runden Kreis neben „Gebucht als“ und wählt ein Foto (Kamera oder Galerie). Das Bild wird auf dem Handy quadratisch zugeschnitten und auf 160×160 Pixel verkleinert (etwa 10 KB).
- Das Bild erscheint groß im Easter-Egg-Popup und klein im Verlauf „Easter Eggs heute“, bei Gruppen-Easter-Eggs immer das Bild der Person, die es ausgelöst hat. Ohne Bild erscheinen die Initialen.
- „Bild entfernen“ steht direkt darunter. **Admins** sehen die Bilder unter Admin → Personen und können unpassende entfernen.
- Die Bilder liegen in der Datenbank (nicht in Firebase Storage, das für neue Projekte den kostenpflichtigen Tarif bräuchte). Andere Handys laden ein Bild einmal pro Sitzung und merken es sich.

## Namen

- Der Name wird bei der Registrierung festgelegt und hängt am Konto. Mitglieder können ihn nicht ändern, das verhindern die Sicherheitsregeln.
- Admins und Super-Admins können einen Namen unter **Admin → Personen** korrigieren, z. B. bei Tippfehlern. Dort stehen auch die E-Mail-Adressen. Gleiche Namen werden als „doppelt“ markiert.
- Bei älteren Konten fehlt die E-Mail in der Liste noch. Sie wird automatisch ergänzt, sobald die Person die App das nächste Mal öffnet.
- Wer mit einer zweiten E-Mail-Adresse ein weiteres Konto anlegt, taucht in der Personenliste als eigener Eintrag auf.

## Ablauf an einem Tag

1. **Vorher (Admin):**
   - **Neuer Tag** mit Datum und Ziel anlegen. Er wird **nicht** automatisch freigegeben: Erst mit **„Zum Scannen freigeben“** wird er der aktive Tag für alle Handys (ein bisher freigegebener Tag bleibt bis dahin aktiv).
   - Optional „Rest vom Vortag übernehmen“ ankreuzen.
   - **Einladen per Scan:** Flasche oder Kasten scannen und „+1 Kasten“ bzw. „+1 Flasche“ antippen.
2. **Unterwegs (alle):** Getränk nehmen, Barcode scannen.
3. **Danach (Admin):**
   - **Rest zählen per Scan** oder in der Spalte **Übrig** direkt eintippen, wie viele Flaschen übrig sind.
   - Die Spalte **Diff.** zeigt, was nicht gescannt wurde.
   - Mit **Nach Person als CSV** gibt es die Abrechnung pro Mitglied.
   - Im Kasten **Tagesabschluss** das **Lager buchen** und den **Tag abschließen** (fragt auch selbst nach dem Lager).

## Warnung, wenn Getränke zu Ende gehen

- Unter **Admin → Getränke** bei jedem Getränk **„Warnen ab Rest (Flaschen)“** eintragen, z. B. 6. Ohne Wert gibt es für dieses Getränk keine Warnung.
- Sinkt am aktiven Tag der Soll-Rest (mitgenommen minus gebucht) auf diesen Wert, bekommen **alle Admins** unten eine rot-schwarze Hinweisleiste mit Ton und Vibration – egal, ob sie gerade scannen oder im Admin-Bereich sind. Bei „leer“ kommt ein zweiter Hinweis.
- **OK** schließt die Leiste. Wird später doch mehr eingetragen, ist die Warnung wieder scharf.
- In der **Tagesübersicht** stehen „Leer“ und „Geht zu Ende“ ganz oben, im **Abgleich** sind die Zeilen markiert.
- **Hinweis:** Die Warnung kommt nur, solange die App auf dem Admin-Handy geöffnet ist. Mit „Warnungen aufs Handy erlauben“ (Admin → Daten) erscheint sie zusätzlich als Handy-Benachrichtigung, wenn die App im Hintergrund offen ist – auf dem iPhone nur, wenn die App über „Zum Home-Bildschirm“ installiert ist. Benachrichtigungen bei ganz geschlossener App bräuchten einen eigenen Server (Firebase Blaze-Tarif).

## Easter Eggs

Bei bestimmten Buchungen erscheint ein Vollbild mit Wespe, Animation, Ton und Vibration. Es bleibt stehen, bis man **Schließen** tippt. Mit **Teilen** lässt es sich verschicken (Bild, z. B. per WhatsApp). Wer zum ersten Mal ein Abzeichen bekommt, sieht danach ein eigenes **Sammelalbum-Popup** (helle Karte mit Medaille, „x von y Abzeichen“) – nur wenn das Sammelalbum für ihn sichtbar ist. Solange es offen ist, pausiert der 10-Sekunden-Countdown der Buchungsmeldung. Easter Eggs sieht nur, wer sie laut „Wer sieht was?“ sehen darf. Jedes Easter Egg kommt pro Person und Tag nur einmal, auch nach „Rückgängig“.

**Nur auf dem eigenen Handy**
- 1., 3., 5., 7., 8., 9. und 10. Bier am Tag, danach bei jedem weiteren Bier (mit zunehmendem Augenzwinkern Richtung Heimfahrt)
- erstes Wasser nach mindestens 3 Bier
- Schnapszahl bei den eigenen Getränken (11, 22, 33 …): heute und seit Beginn
- Scan um 11:11 Uhr, um Mitternacht und am 11.11.
- für jede Sorte etwas: erstes und fünftes/zehntes **Wasser**, erster und fünfter **Softdrink**, erstes und drittes **Alkoholfreies**, **Radler**, **Wein/Sekt** und **Schnaps**, das erste **sonstige** Getränk, „Schlau!“ (Wasser nach mindestens 2 Schnäpsen)
- 50 und 100 Getränke seit Beginn

**Auf allen Handys** („Max Meier hat … ausgelöst“)
- Anstich: erster Scan des Tages
- 10., 20. und 30. Bier der ganzen Gruppe am Tag
- 10 Wasser, 10 Softdrinks und 11 Schnäpse der ganzen Gruppe am Tag
- alle 100 Getränke seit Beginn
- Schnapszahl bei allen Getränken der Gruppe: heute und seit Beginn

**Für jede Getränkesorte derselbe Satz:** 1., 3., 5. und 10. am Tag sowie 25. und 50. seit Saisonbeginn – für Bier, Radler, Alkoholfrei, Wein/Sekt, Wasser, Softdrinks, Schnaps und Sonstiges. Bestehende Easter Eggs bleiben; wo es schon eins mit derselben Zahl gibt (z. B. 1. Bier), wird keins doppelt angelegt.

**Nach Sorte ein-/ausschalten (Super-Admin):** Admin → Easter Eggs verwalten → „Nach Getränkesorte ein-/ausschalten“. Pro Sorte zwei Schalter: *Easter Eggs* (aus = für diese Sorte kommt gar nichts) und *Sammelalbum* (aus = Popups ja, aber nicht im Sammelalbum). Darunter lässt sich die Liste nach Sorte filtern.

**Animationen:** Konfetti, Sprudelblasen, Getränke-Regen (passendes Emoji zur Sorte), Feuerwerk, Wespenschwarm, „Dreh durch“ (die Karte wirbelt herein), Luftballons und Sternenregen – jeweils mit eigener Melodie und eigenem Vibrationsmuster. Standard ist „automatisch“: Die App wählt abwechselnd eine Animation, die zum Getränk passt. Im Editor lässt sich pro Easter Egg eine feste Animation oder „Zufall“ einstellen.

Hinweise:
- **Was als Bier zählt**, legt die **Sorte** des Getränks fest (Admin → Getränke). Ohne Angabe rät die App aus dem Namen. Radler und Alkoholfreies zählen nicht als Bier.
- Die **Gruppen-Easter-Eggs** brauchen Netz. Offline wird weiter mitgezählt, aber ohne Meldung.
- Nach Stornos, Nachträgen oder einem Import unter **Admin → Daten → Zähler neu berechnen** tippen, damit die Zahlen wieder stimmen.
- **Geräusche:** Easter Eggs mit Getränkebezug spielen statt der Melodie ein echtes Geräusch passend zur Sorte, zufällig aus mehreren (Ordner `sounds/`, Dateien `<sorte>-<nr>.mp3`): Bier (Flasche öffnen, Kronkorken, Einschenken, Kronkorken 2 – auch für Radler und Alkoholfreies), Wein/Sekt (Korken, Anstoßen, Gläser), Softdrink (Eiswürfel, Dose), Wasser (Sprudelflasche, Einschenken). Für Schnaps und Sonstiges kommt noch die Melodie. Weitere Geräusche: Datei nach `sounds/` legen, in `index.html` bei `SND_FILES` die Anzahl erhöhen und in `sw.js` (CORE) eintragen. „An, ohne Ton“ bleibt still. Probehören: Admin → Easter Eggs verwalten → „🔊 Getränke-Geräusche anhören“.
- **Rückgängig, Storno, Korrektur:** Wird eine Buchung zurückgenommen, vom Admin storniert (auch „−“ bei Nachtragen) oder per genehmigtem Korrekturantrag entfernt, verschwinden die Easter Eggs, die genau diese Buchung ausgelöst hat – unter „Deine“ und bei Gruppen-Meldungen unter „Für alle“. Wird die Zahl später wieder erreicht, kommt das Easter Egg erneut. Das Sammelalbum bleibt. Gilt für Easter Eggs ab v2.8.0; für Gruppen-Meldungen beim eigenen Rückgängig braucht es die Regeln ab v2.8.0.
- **Easter Eggs für alle: an/AUS** (Admin → Daten) schaltet alles für alle Handys ab: keine Popups, kein Verlauf, keine Sammelalbum-Einträge (gezählt wird weiter). Ist es aus, steht auf der Startseite statt des persönlichen Knopfs „Easter Eggs: für alle aus“ (nur beim Super-Admin, mit Direkt-Einschalten); Mitglieder sehen den Knopf dann nicht.
- **Verlauf für alle:** In der Scan-Ansicht steht unter „Deine Getränke heute“ der Abschnitt „Easter Eggs heute“ mit zwei Reitern: *Für alle* (alle gemeinsamen Easter Eggs des Tages mit Uhrzeit und Auslöser) und *Deine* (die eigenen). Die eigenen sind in der Datenbank gespeichert und bleiben auch bei einem Handywechsel erhalten.
- **Vorschau für Admins:** Im Admin-Bereich zeigt „Anstehende Easter Eggs“ für den aktiven Tag, was als Nächstes kommt – für die Gruppe (Anstich, nächstes Gruppen-Bier, nächste Schnapszahl, 11:11 und 11.11.) und pro Person, sortiert danach, wer am nächsten dran ist.
- **Verwalten (Super-Admin):** Unter Admin → **Easter Eggs verwalten** lässt sich jedes Easter Egg an- und ausschalten, ändern, kopieren, löschen und als Vorschau anzeigen; „Neues Easter Egg“ legt eins an, „Standard-Easter-Eggs zurückholen“ setzt nur die mitgelieferten zurück und holt gelöschte wieder – **eigene Easter Eggs bleiben erhalten**. Einstellbar sind:
  - **Für:** jede Person für sich oder alle gemeinsam
  - **Wann:** genau bei einer Anzahl, bei jeder n-ten, ab einer Anzahl jedes Mal, bei Schnapszahl, „erstes … nach mindestens n …“, zu einer Uhrzeit, an einem Datum
  - **Getränk** (Sorte oder alle) und **Zeitraum** (heute oder seit Beginn)
  - **Animation:** automatisch, fest oder Zufall
  - **Texte:** eine Zeile pro Variante im Format `Titel | Text`; mehrere Zeilen wechseln sich ab. `{n}` wird durch die Zahl ersetzt, `{name}` durch die Person.
- Die mitgelieferten Easter Eggs stehen als `DEFAULT_RULES` in `index.html`. Sobald der Super-Admin etwas ändert, wird die Liste in der Datenbank gespeichert und gilt für alle Handys. Neue mitgelieferte Easter Eggs aus späteren Updates kommen automatisch dazu – außer solche, die der Super-Admin gelöscht hat.
  - **Animation:** pro Easter Egg wählbar (siehe oben).

## Kosten und Grenzen (kostenloser Spark-Tarif)

- **Datenbank:** 50.000 Lesevorgänge und 20.000 Schreibvorgänge pro Tag (Zurücksetzen gegen 9 Uhr deutscher Zeit). Jede Buchung kostet etwa vier Schreibvorgänge (also bis ca. 5.000 Buchungen am Tag) und auf jedem Admin-Handy, das gerade offen ist, einen Lesevorgang. Jedes Öffnen der App kostet ein Mitglied etwa 30–50 Lesevorgänge; ein Admin-Handy, das nach längerer Pause den Admin-Bereich öffnet, liest die Buchungen des Tages und die Mitgliederliste neu.
- **Faustregel:** bis ca. 60 Handys mit 3–4 Admin-Handys und 1.500 Getränken am Tag passt es gut. Darüber: nur so viele Admins wie nötig, oder den Blaze-Tarif (Abrechnung nach Verbrauch, mit Budget-Warnung) nehmen.
- Ist das Tageskontingent aufgebraucht, sperrt Firebase bis zum Zurücksetzen; Buchungen bleiben auf den Handys gespeichert und werden danach gesendet.
- **Anmeldung:** bis zu 100 neue Konten pro Stunde und Internetanschluss. Das genügt auch, wenn sich alle gleichzeitig im selben WLAN registrieren.
- **E-Mails:** 150 „Passwort vergessen“-Mails pro Tag.

## Update der App

Aktuell ist **Version v2.15.0**. Die Nummer folgt dem Muster **vHaupt.Neben.Fehler** (bis Version 103 wurde fortlaufend gezählt):
- **Fehler** hochzählen (v2.0.0 → v2.0.1) bei kleinen Korrekturen,
- **Neben** hochzählen (v2.0.1 → v2.1.0) bei neuen Funktionen,
- **Haupt** hochzählen (v2.1.0 → v3.0.0) bei großen Umbauten.

Nach Änderungen an zwei Stellen gleich ändern:
- in `index.html`: `const APP_VERSION = '2.15.0';`
- in `sw.js`: `const VERSION = 'strichliste-v2.15.0';`

Dazu oben in der Liste `CHANGELOG` (in `index.html`) einen Eintrag ergänzen: `{ v: '2.0.1', d: 'JJJJ-MM-TT', i: [['m', 'Text für alle'], ['a', 'Text nur für Admins']] }`. Rollen: `m` alle Mitglieder, `b` Vorstand, `a` Admins, `s` Super-Admin.

### Nachrichten an Mitglieder (Super-Admin)
Admin → ⚙️ Einstellungen → **Nachricht an alle** (oder in der Suche „Rundnachricht“). Bei **An** wählen: **alle Mitglieder**, **nur Admins und Vorstand** oder **einzelne Mitglieder …** – dann Namen suchen und antippen (beliebig viele, mit ✕ wieder entfernen). Dazu Überschrift (optional), Text und wie lange sie gilt (1, 3, 7, 30 Tage oder bis zum Zurückziehen) → **📢 Senden**.

- Die Nachricht erscheint bei den Empfängern groß im Vordergrund, sobald sie die Strichliste öffnen (oder gerade offen haben), bis sie **„Gelesen“** tippen. Oben steht, von wem sie kommt – Name und Rolle, z. B. „Nachricht von Jonas Maurer (Super-Admin)“; persönliche Nachrichten als „Persönliche Nachricht von …“. Mehrere ungelesene kommen nacheinander.
- **Nachlesen:** Unter **Mein Konto → 📢 Nachrichten** stehen alle Nachrichten, die noch gültig sind (bis zum Ablaufdatum oder Zurückziehen), mit Datum und Kennzeichnung „persönlich“. Ungelesene sind gelb umrandet und zeigen eine Zahl am Reiter „Mein Konto“. „Gelesen“ geht auch dort.
- Persönliche Nachrichten kann nur der Empfänger lesen (die Firebase-Regeln prüfen das), sonst niemand außer dem Super-Admin.
- Mehrere Nachrichten können gleichzeitig laufen. Unter „Aktuelle Nachrichten“ steht pro Nachricht „gelesen x/y“, aufgeklappt wer wann gelesen hat und bei persönlichen Nachrichten, wer noch nicht. „Vorschau“ zeigt sie dir, „Zurückziehen“ nimmt sie zurück.
- Braucht die Regeln ab v2.3.0 (`bcmsg`, `bcread`). Eine Nachricht aus v2.2.0 wird automatisch übernommen.

### Links zu anderen Apps (Super-Admin)
Admin → ⚙️ Einstellungen → **Links zu anderen Apps** (oder in der Suche „Links“). Mit **„+ WexStunden“** ist der Stundentracker mit Bild und Beschreibung sofort drin; **„+ App hinzufügen“** für weitere (z. B. die Vereinsseite). Pro App: Name, Kurzbeschreibung, Link (muss mit `https://` beginnen) und ein Bild (**🖼 Bild …** – wird quadratisch zugeschnitten und verkleinert; ohne Bild erscheint der Anfangsbuchstabe). Reihenfolge mit ↑/↓. Zwei Häkchen legen fest, wo die Kacheln erscheinen: **auf der Anmeldeseite** (auch für noch nicht Angemeldete) und/oder **unten auf der Startseite** nach dem Anmelden. Die Vorschau zeigt sie wie bei den Mitgliedern; erst **Speichern** macht sie sichtbar. Ein Tipp auf eine Kachel öffnet die App in einem neuen Fenster. Braucht die Regeln ab v2.5.0 (Anmeldeseite darf `config/applinks` lesen).

### Viele Nutzer gleichzeitig / Firebase-Verbrauch
Der kostenlose Firebase-Tarif erlaubt pro Tag 50.000 Lesevorgänge und 20.000 Schreibvorgänge (Zähler beginnt um 9 Uhr). Ist ein Limit erreicht, geht bis 9 Uhr am nächsten Tag nichts mehr. Damit das nicht passiert:
- Den Stand „gebucht pro Getränk“ (für die Buchungsgrenze) hören nur Admin-Handys live mit. Mitglieder holen ihn nur, wenn es überhaupt eine Buchungsgrenze gibt – direkt vor dem Buchen eines begrenzten Getränks und sonst höchstens einmal pro Minute. Das spart bei jeder Buchung einen Lesevorgang auf jedem offenen Handy.
- Admin → 📊 Auswertung → **Firebase-Verbrauch**: vorsichtige Schätzung für heute, mit Warnung ab 50 %. Gerechnet wird: Schreiben = Buchungen × 8; Lesen = Buchungen × 5 (beim Buchen) + Buchungen × 5 × Anzahl Admins (als wäre die App bei allen offen) + Personen mit Buchungen × 4 App-Starts × 50. Admin-Arbeit und Löschvorgänge sind nicht enthalten; „So ist gerechnet“ zeigt die Aufschlüsselung. Die Zahlen gelten für den angezeigten Zeitpunkt („Stand …“); **🔄 Aktualisieren** holt den neuesten Stand (ohne zusätzliche Lesevorgänge). Genaue Zahlen: Firebase-Konsole → Firestore → Nutzung. Wird es regelmäßig knapp: Blaze-Tarif mit Budgetgrenze.

### TooDruck-Modus 🍻 (Admins und Super-Admin)
Auf der Startseite **🍻 TooDruck-Modus** tippen → die App zeigt, was gesperrt wird, und fragt nach. Danach sind bis zum **nächsten Morgen 6:00 Uhr** ist der **ganze Admin-Bereich** für diese Person **nur noch zum Ansehen** (ab v2.10.0): alles Schreibende ist ausgegraut – nichts anlegen, ändern, löschen, freigeben, einladen, zählen, Lager buchen, stornieren, nachtragen oder abschließen. Erlaubt bleiben Reiter, Suche, Springen, Auf-/Zuklappen, Tag auswählen, Ansicht umschalten, Aktualisieren, Excel/CSV und Backup herunterladen. Oben steht ein Hinweis, auf der Startseite ein Banner. Eigene Getränke scannen geht weiter.
- Gilt **pro Person** (auf allen ihren Geräten), nicht für alle Admins gleichzeitig.
- Admins können ihn nicht vorzeitig beenden. Der Super-Admin kann ihn mit **„Freischalten“** und **zweimaliger Passworteingabe** beenden – bei sich im Banner, bei anderen unter Admin → 👥 Personen → **„TooDruck-Modus aktiv“** (erscheint nur, wenn jemand ihn an hat). Braucht die Regeln ab v2.7.1.
- Gilt für Getränke-Admins und den Super-Admin gleich. Die frühere Auswahl, *was* gesperrt wird, gibt es seit v2.10.0 nicht mehr – gesperrt ist immer alles Schreibende im Admin-Bereich.
- Die Sperre ist ein Selbstschutz in der App (keine Firebase-Regel).

### Versionsverlauf
Unten auf **„Version v…“** tippen → Versionsverlauf. Jeder sieht nur, was für seine Rolle gilt: Mitglieder die Mitglieder-Neuerungen, der Vorstand zusätzlich Vorstand-Themen, Admins zusätzlich Admin-Themen, der Super-Admin alles (mit Kennzeichnung, für wen ein Punkt gilt). Gibt es seit dem letzten Öffnen eine neue Version, steht „neu“ daneben. Der Super-Admin blendet den Verlauf unter Admin → Einstellungen → „Versionsverlauf anzeigen“ für alle ein oder aus (er selbst sieht ihn weiter).

Seit Version 56 gibt es neue Regeln (`dused` für die Buchungsgrenze; vorher Backup, `dsum` und `theme`). Falls noch nicht geschehen: `firestore.rules` neu in die Firebase-Konsole einfügen und veröffentlichen.

Dann holen sich alle Handys beim nächsten Öffnen mit Netz die neue Version. Ganz unten auf der Seite steht „Version v2.15.0“. Daran siehst du, ob das Update auf einem Handy angekommen ist. Falls nicht: die Seite schließen und neu öffnen, beim zweiten Öffnen ist die neue Version aktiv.

## Daten aus der Offline-Version übernehmen

1. In der alten Version unter **Admin → Daten → Backup speichern** eine JSON-Datei erzeugen.
2. In der neuen Version unter **Admin → Daten → Backup importieren** diese Datei auswählen (nur der Super-Admin).

Die alten Buchungen haben keinen Personennamen.
