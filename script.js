let adatok = [];

document.getElementById('létrehozásGomb').addEventListener('click', megjelenítLétrehozásŰrlap);
document.getElementById('mentésGomb').addEventListener('click', létrehozásVagyFrissítésTétel);

document.addEventListener('DOMContentLoaded', adatokBetöltése);

async function táblázatRenderelése() {
  const törzs = document.getElementById('tételekTörzs');
  törzs.innerHTML = '';

  adatok.forEach(tétel => {
    const sor = document.createElement('tr');
    sor.innerHTML = `
      <td>${tétel.id}</td>
      <td>${tétel.name}</td>
      <td>
        <button onclick="tételSzerkesztése(${tétel.id}, '${tétel.name}')">Szerkesztés</button>
        <button onclick="tételTörlése(${tétel.id})">Törlés</button>
      </td>
    `;
    törzs.appendChild(sor);
  });
}

async function adatokBetöltése() {
  try {
    const response = await fetch('https://restful-api.dev/');
    if (!response.ok) {
      throw new Error('Hiba történt az adatok lekérdezése közben.');
    }
    adatok = await response.json();
    táblázatRenderelése();
  } catch (hiba) {
    console.error('Hiba történt:', hiba);
    alert('Hiba történt az adatok lekérdezése közben.');
  }
}

function megjelenítLétrehozásŰrlap() {
  document.getElementById('létrehozásŰrlap').style.display = 'block';
}

async function létrehozásVagyFrissítésTétel() {
  const név = document.getElementById('tételNév').value;

  if (!név) {
    alert('Kérlek adj meg egy érvényes tétel nevet.');
    return;
  }

  try {
    const metódus = kiválasztottTételAzonosító ? 'PUT' : 'POST';
    const url = kiválasztottTételAzonosító ? `https://restful-api.dev/${kiválasztottTételAzonosító}` : 'https://restful-api.dev/';
    const response = await fetch(url, {
      method: metódus,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: név }),
    });

    if (!response.ok) {
      throw new Error('Hiba történt az adatok mentése közben.');
    }

    adatokBetöltése();
    document.getElementById('létrehozásŰrlap').reset();
    document.getElementById('létrehozásŰrlap').style.display = 'none';
  } catch (hiba) {
    console.error('Hiba történt:', hiba);
    alert('Hiba történt az adatok mentése közben.');
  }
}

async function tételTörlése(azonosító) {
  const megerősítve = confirm('Biztosan törölni szeretnéd ezt a tételt?');
  if (!megerősítve) return;

  try {
    const response = await fetch(`https://restful-api.dev/${azonosító}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Hiba történt az adat törlése közben.');
    }

    adatokBetöltése();
  } catch (hiba) {
    console.error('Hiba történt:', hiba);
    alert('Hiba történt az adat törlése közben.');
  }
}
