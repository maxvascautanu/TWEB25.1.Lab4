# Real Madrid CF — Laborator CGI
## Instrucțiuni de instalare și rulare

---

## Structura fișierelor

```
proiect/
├── index.html
├── prezentare.html
├── date-cheie.html
├── palmares.html
├── lot.html
├── formular.html        ← Formularul de înregistrare fan (NOU)
├── style.css
├── app.js
├── formular.js          ← Validare JavaScript (NOU)
└── cgi-bin/
    ├── formular.py      ← Script CGI Python (NOU)
    └── fans.csv         ← Creat automat la prima trimitere
```

---

## Cum rulezi serverul (local)

### Metoda 1 — Python 3 (cel mai simplu)

```bash
cd proiect/
python3 -m http.server --cgi 8080
```

Deschide în browser: `http://localhost:8080/formular.html`

### Metoda 2 — Apache cu CGI activat

1. Copiază fișierele în `/var/www/html/`
2. Activează modulul CGI:
   ```bash
   sudo a2enmod cgid
   sudo systemctl restart apache2
   ```
3. Configurează `cgi-bin/` în VirtualHost:
   ```apache
   ScriptAlias /cgi-bin/ /var/www/html/cgi-bin/
   <Directory "/var/www/html/cgi-bin">
       AllowOverride None
       Options +ExecCGI
       AddHandler cgi-script .py
       Require all granted
   </Directory>
   ```

---

## Permisiuni necesare

```bash
# Script-ul CGI trebuie să fie executabil
chmod +x cgi-bin/formular.py

# Directorul cgi-bin trebuie să permită scriere (pentru fans.csv)
chmod 755 cgi-bin/
```

---

## Fișierul fans.csv

Se creează automat în `cgi-bin/fans.csv` la prima trimitere de formular.

**Coloane CSV:**
| Coloana     | Descriere                          |
|-------------|-------------------------------------|
| timestamp   | Data și ora înregistrării           |
| prenume     | Prenumele fanului                   |
| nume        | Numele de familie                   |
| email       | Adresa de email                     |
| telefon     | Numărul de telefon (opțional)       |
| tara        | Codul țării (MD, RO, ES, ...)       |
| varsta      | Vârsta                              |
| jucator     | Jucătorul favorit                   |
| ani_fan     | Câți ani este fan Real Madrid       |
| rating      | Nota acordată (1-5 stele)           |
| competitii  | Competiții urmărite (separate prin `\|`) |
| mesaj       | Comentariul fanului                 |
| ip          | Adresa IP a vizitatorului           |

**Exemplu fans.csv:**
```csv
"timestamp","prenume","nume","email","telefon","tara","varsta","jucator","ani_fan","rating","competitii","mesaj","ip"
"2026-04-29 14:35:00","Alexandru","Ionescu","alex@email.com","+373 69 111 222","MD","25","Vinícius Júnior","10","5","LaLiga|UCL","Hala Madrid!","127.0.0.1"
```

---

## Funcționalitățile implementate

### 1. Formular HTML (`formular.html`)
- **12 câmpuri**: prenume, nume, email, telefon, țara, vârstă, jucător favorit, ani fan, rating (stele), competiții (checkbox multiplu), mesaj, termeni
- Trimite date prin `method="POST"` la `cgi-bin/formular.py`
- Funcționează și fără JavaScript (submit tradițional)

### 2. Script CGI Python (`cgi-bin/formular.py`)
- Citește datele POST cu modulul `cgi`
- **Validare server-side** completă (dublă față de JS)
- **Salvează** în `fans.csv` cu `csv.DictWriter`
- Returnează **JSON** dacă clientul acceptă `application/json`
- Returnează **HTML** pentru browsere fără JS (fallback)
- Include **timestamp** și **IP** la fiecare înregistrare

### 3. Validare JavaScript (`formular.js`)
- **Validare live** la evenimentul `blur` (ieșire din câmp)
- **Feedback vizual**: câmpuri verzi (✓) sau roșii (✗) cu mesaje de eroare
- Contor de caractere pentru câmpul „Mesaj"
- **Submit AJAX** cu `fetch()` — fără reîncărcarea paginii
- Banner de succes afișat după trimitere reușită
- Fallback la submit tradițional dacă serverul nu răspunde

---

## Validări implementate

| Câmp          | Reguli de validare                                    |
|---------------|-------------------------------------------------------|
| Prenume       | Obligatoriu, 2-50 caractere, doar litere              |
| Nume          | Obligatoriu, 2-60 caractere, doar litere              |
| Email         | Obligatoriu, format valid (regex)                     |
| Telefon       | Opțional, format internațional                        |
| Țara          | Obligatoriu, din lista predefinită                    |
| Vârstă        | Obligatoriu, număr întreg 5-120                       |
| Jucător       | Obligatoriu, din lista predefinită                    |
| Ani fan       | Obligatoriu, număr întreg 0-100                       |
| Rating        | Obligatoriu, 1-5 stele                               |
| Competiții    | Cel puțin una selectată                              |
| Mesaj         | Opțional, maxim 500 caractere                        |
| Termeni       | Obligatoriu bifat                                    |

---

## Testare rapidă

```bash
# Testează scriptul CGI direct din terminal
cd cgi-bin/
python3 -c "
import os
os.environ['REQUEST_METHOD'] = 'POST'
os.environ['CONTENT_TYPE'] = 'application/x-www-form-urlencoded'
import sys
from io import BytesIO
body = b'prenume=Ion&nume=Popescu&email=ion@test.com&tara=MD&varsta=30&jucator=Rodrygo&ani_fan=5&rating=5&competitii=LaLiga&termeni=da'
os.environ['CONTENT_LENGTH'] = str(len(body))
sys.stdin = open('/dev/stdin', 'rb')
" formular.py
```
