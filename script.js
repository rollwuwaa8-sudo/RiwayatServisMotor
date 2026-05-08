const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyO6xZCgWwiiN-Ku52-PJXl1MweGy0owU_NyiuacD7F7PIsx0YNzOb8vLmDHg5lbB6p1w/exec";

// Logika Pindah Tab
function openTab(tabName) {
    document.getElementById('inputSection').classList.add('hidden');
    document.getElementById('cariSection').classList.add('hidden');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if (tabName === 'input') {
        document.getElementById('inputSection').classList.remove('hidden');
    } else {
        document.getElementById('cariSection').classList.remove('hidden');
    }
    event.currentTarget.classList.add('active');
}

// Simpan Data
document.getElementById('servisForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpan');
    btn.disabled = true;
    btn.innerText = "Menyimpan...";

    const data = {
        nopol: document.getElementById('inNopol').value.toUpperCase().replace(/\s/g, ''),
        nama: document.getElementById('inNama').value,
        tanggal: document.getElementById('inTanggal').value,
        km: document.getElementById('inKM').value,
        detail: document.getElementById('inDetail').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        alert("Data Berhasil Disimpan!");
        document.getElementById('servisForm').reset();
    } catch (err) {
        alert("Gagal Simpan Data.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Simpan Data";
    }
});

// Cari Data
async function cariRiwayat() {
    const nopol = document.getElementById('nopolSearch').value.toUpperCase().replace(/\s/g, '');
    const container = document.getElementById('resultContainer');
    const loading = document.getElementById('loading');

    if (!nopol) return alert("Isi No Polisi!");

    container.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        const res = await fetch(`${SCRIPT_URL}?nopol=${nopol}`);
        const data = await res.json();
        loading.classList.add('hidden');

        if (data.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:red;">Data tidak ditemukan.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p><strong>Tanggal</strong> <span class="val">${item['Tanggal Servis']}</span></p>
                <p><strong>Nama</strong> <span class="val">${item['Nama Pemilik']}</span></p>
                <p><strong>KM</strong> <span class="val">${Number(item['KM']).toLocaleString('id-ID')}</span></p>
                <p class="detail-servis">Detail: <br><span style="color:var(--primary)">${item['Detail Servis']}</span></p>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        loading.classList.add('hidden');
        alert("Gagal mengambil data.");
    }
}
