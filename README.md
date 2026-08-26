# JariCode – Portfolio

JariCode on henkilökohtainen portfolio-sivusto, joka esittelee projektini, osaamiseni ja CV:ni. Sivusto on toteutettu galaksiteemalla: tumma tähtitausta, kultaiset yksityiskohdat ja tunnelmalliset animaatiot. Kaikki on tehty ilman kehyksiä pelkällä HTML:llä, CSS:llä ja vanilla-JavaScriptilla.

Sivusto löytyy osoitteesta https://jaricode.fi/

## Tekniikka

- HTML
- CSS (mukautetut ominaisuudet, grid, animaatiot)
- JavaScript (ei kehyksiä)
- Canvas-pohjaiset tausta-animaatiot (tähdet yms)
- Itse ladatut fontit (Cinzel, Cinzel Decorative, EB Garamond)

## Ominaisuudet

- Galaksiteema tummalla tähtitaustalla ja kultaisilla korostuksilla
- Glitch-efektillä animoitu otsikko
- Custom-kursori
- Projektiruudukko, jossa jokainen projekti on oma korttinsa (kuva, nimi, kuvaus, teknologiat, valmis/työn alla -status)
- Projektien suodatus teknologian ja tilan mukaan
- Esittely-, CV- ja yhteystieto-osiot
- Sertifikaatit linkitettyinä
- Video-CV popup-ikkunassa
- Responsiivinen ulkoasu
- Open Graph -metatiedot somejakoa varten

## Projektin rakenne

- `index.html` sivun rakenne ja sisältö
- `style.css` kaikki tyylit ja animaatiot
- `script.js` toiminnallisuus: projektiruudukko, suodatus, tausta-animaatiot, kursori, popupit
- `fonts.css` fonttien määrittelyt
- `fonts/` itse ladatut fonttitiedostot
- `img/` kuvat, ikonit ja sertifikaatit
- `video/` video-CV

## Käyttöönotto

Sivusto on staattinen HTML/CSS/JavaScript-sivu, joten se ei tarvitse asennusta, palvelinta eikä riippuvuuksia.

1. Kloonaa repo tai lataa tiedostot.

2. Avaa `index.html` selaimessa.

## Projektien muokkaus

Projektit määritellään `script.js`-tiedoston `PROJECTS`-listassa. Jokainen projekti on olio, jossa on nimi, kuvaus, teknologiat, tila ja linkki. Kuvan saa näkyviin lisäämällä polun `img`-kenttään (esim. `img:"img/tiedosto.webp"`); ilman kuvaa kortti näyttää oletuksena teemaan sopivan kuvion.
