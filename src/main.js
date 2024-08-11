
const invoke = window.__TAURI__.invoke

async function returnAddress() {
    return await invoke('address_command');
}

async function returnGuest() {
    return await invoke('guest_command');
}

async function searchPassword() {
    const query = document.querySelector("#greet-input").value
    window.location.href = `/pages/search?q=${query}`
}

async function createPassword() {
    const address = await returnAddress()
    const guest = await returnGuest()
    const slug = document.querySelector("#greet-input").value

    const response = await fetch(`${address}/create?guest=${guest}&slug=${slug}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    });

    const data = await response.json()

    await navigator.clipboard.writeText(data.key);
    window.location.href = "/"
}

async function getPassword(slug) {
    const address = await returnAddress()
    const guest = await returnGuest()

    const response = await fetch(`${address}/get?slug=${slug}&guest=${guest}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })

    const data = await response.json()
    await navigator.clipboard.writeText(data.key);
    window.location.href = "/"
}

async function populateItems() {
    const address = await returnAddress()
    const guest = await returnGuest()

    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')

    const endpointUrl = `${address}/search?guest=${guest}&q=${query}`

    const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })

    const data = await response.json();

    const container = document.getElementById('items-container');
    container.innerHTML = '';

    data.keys.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = item;
        itemElement.setAttribute('data-slug', item);
        itemElement.addEventListener('click', () => handleItemClick(item));
        container.appendChild(itemElement);
    });
}

async function handleItemClick(slug) {
    await getPassword(slug)
}

function changeDeviceSettings() {
    const newAddress = document.querySelector("#greet-input-address").value
    const newGuest = document.querySelector("#greet-input-guest").value

    invoke('change_device_settings_command', {
        address: newAddress,
        guest: newGuest
    })
}
