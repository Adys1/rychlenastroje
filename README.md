# Rychlé nástroje – veřejný web

Statický web připravený k nasazení. Obsahuje:

- `index.html` – losovací kolo a sadu nástrojů (časovač, týmy, kostka, náhodné číslo, paleta barev, ano/ne)
- `studio.html` + `studio.js` – lokální editor jednoduchého animovaného videa s exportem
- `contact.html` – kontaktní stránku
- `language.js` – přepínání češtiny, angličtiny, němčiny, polštiny a slovenštiny
- `logo.svg` – favicon a logo

## Spuštění lokálně

Nejjednodušší je otevřít `index.html`. Pro otestování jako webserver (doporučeno):

```bash
python -m http.server 8000
```

Pak otevřete `http://localhost:8000`.

## Zveřejnění na internetu

Jde o čistě statický web, nepotřebuje databázi ani serverový backend. Nahrajte celý obsah této složky do služby pro statické weby, například Netlify, Cloudflare Pages nebo GitHub Pages. Jako kořen webu nastavte tuto složku; vstupní stránkou je `index.html`.

Před zveřejněním:

1. Ověřte kontaktní e-mail v `contact.html` a případně jej změňte.
2. Vlastní doménu připojte v administraci hostingu a zapněte HTTPS.
3. Pro SEO doplňte vlastní doménu do `sitemap.xml` a ověřte metadata.
4. Otestujte web na telefonu i počítači a v aktuálním Chrome, Firefoxu, Safari a Edge.

## Důležitá omezení

- Losování, časovač, rozdělení týmů a další nástroje běží lokálně v prohlížeči. Jména a výsledky se nikam neposílají.
- Studio **nepoužívá AI model**. Vytváří jednoduché animované video z připraveného textového scénáře; export a podporované formáty závisí na prohlížeči a výkonu zařízení.
- Tlačítko YouTube pouze otevře YouTube Studio. Samotné nahrání vyžaduje přihlášení a potvrzení uživatelem na YouTube.
- Není zde administrace, uživatelské účty, cloudové ukládání, analytika ani kontaktní formulář. Pro tyto funkce je potřeba bezpečný backend a odpovídající zásady ochrany osobních údajů.

## Licence a podklady

Projekt vychází z dodaných souborů. Před komerčním zveřejněním ověřte práva ke všem použitým textům, fontům, obrázkům a značkám.


## Optimalizace rychlosti

Tato verze omezuje zbytečně časté překreslování časovače, snižuje rozlišení interního canvasu na velmi jemných displejích, odstraňuje externí blokující načítání fontu a přednačítá interní stránku při najetí na odkaz nebo při jeho zaměření. Některé náročné rozostřovací efekty byly omezeny, aby se web lépe choval i na slabších telefonech.

Soubor `_headers` nastavuje cache hlavičky na hostingu, který tento formát podporuje (např. Cloudflare Pages). Adresa `*.workers.dev` sama o sobě neukazuje, jak je Worker naprogramovaný. Pokud web obsluhuje vlastní Cloudflare Worker, musí se cache hlavičky nastavit také v jeho odpovědích; samotné nahrání `_headers` je u vlastního Workeru nezaručuje.
