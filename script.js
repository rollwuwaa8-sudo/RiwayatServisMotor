const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyO6xZCgWwiiN-Ku52-PJXl1MweGy0owU_NyiuacD7F7PIsx0YNzOb8vLmDHg5lbB6p1w/exec"; // Pastikan URL ini benar

// Fungsi Ganti Tab
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    if(tabName === 'input') {
        document.getElementById('inputSection').classList.remove('hidden');
        event.currentTarget.classList.add('active');
    } else {
        document.getElementById('cariSection').classList.remove('hidden');
        event.currentTarget.classList.add('active');
    }
}

// SIMPAN DATA (Input)
document.getElementById('servisForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpan');
    btn.disabled = true;
    btn.innerText = "Menyimpan...";

    const formData = {
        action: 'add',
        nopol: document.getElementById('inNopol').value.toUpperCase(),
        nama: document.getElementById('inNama').value,
        tanggal: document.getElementById('inTanggal').value,
        km: document.getElementById('inKM').value,
        detail: document.getElementById('inDetail').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        alert("Data berhasil disimpan!");
        document.getElementById('servisForm').reset();
    } catch (err) {
        alert("Gagal menyimpan data.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Simpan Data";
    }
});

// CARI DATA
async function cariRiwayat() {
    const nopol = document.getElementById('nopolSearch').value;
    const resultContainer = document.getElementById('resultContainer');
    const loading = document.getElementById('loading');

    if (!nopol) return alert("Masukkan No Polisi!");

    resultContainer.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        const response = await fetch(`${SCRIPT_URL}?nopol=${nopol}`);
        const data = await response.json();
        loading.classList.add('hidden');

        if (data.length === 0) {
            resultContainer.innerHTML = '<p style="text-align:center;color:red;">Data tidak ditemukan.</p>';
            return;
        }

        data.reverse().forEach(item => { // Data terbaru di atas
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p><strong>Tanggal</strong> <span class="val">${item['Tanggal Servis']}</span></p>
                <p><strong>Pemilik</strong> <span class="val">${item['Nama Pemilik']}</span></p>
                <p><strong>KM</strong> <span class="val">${Number(item['KM']).toLocaleString('id-ID')} km</span></p>
                <p class="detail-servis"><strong>Detail:</strong> <span>${item['Detail Servis']}</span></p>
            `;
            resultContainer.appendChild(card);
        });
    } catch (e) {
        loading.classList.add('hidden');
        alert("Error mengambil data.");
    }
}
