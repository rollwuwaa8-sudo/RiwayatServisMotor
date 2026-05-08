const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzdD2pfyR3HC8r-fWt5_d4wwffPhgaTfnxQ9GfwNYZTe9Z0T8rzTkNXTZl3crHYWJ2hAg/exec";

async function cariRiwayat() {
    const nopol = document.getElementById('nopolInput').value;
    const resultContainer = document.getElementById('resultContainer');
    const loading = document.getElementById('loading');

    if (!nopol) return alert("Masukkan Nomor Polisi!");

    resultContainer.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        const response = await fetch(`${SCRIPT_URL}?nopol=${nopol}`);
        const data = await response.json();

        loading.classList.add('hidden');

        if (data.length === 0) {
            resultContainer.innerHTML = '<p style="text-align:center; color:red;">Data tidak ditemukan.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p><strong>Tanggal:</strong> ${new Date(item['Tanggal Servis']).toLocaleDateString('id-ID')}</p>
                <p><strong>Pemilik:</strong> ${item['Nama Pemilik']}</p>
                <p><strong>Detail:</strong> ${item['Detail Servis']}</p>
                <p><strong>Kilometer:</strong> ${item['KM']} KM</p>
            `;
            resultContainer.appendChild(card);
        });
    } catch (error) {
        loading.classList.add('hidden');
        alert("Terjadi kesalahan saat mengambil data.");
        console.error(error);
    }
}
