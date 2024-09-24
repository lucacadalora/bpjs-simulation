// Inisialisasi Cleave.js untuk input gaji
const cleaveGaji = new Cleave('#gaji', {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    delimiter: '.',
    numeralDecimalMark: ',',
    numeralDecimalScale: 0,
    numeralPositiveOnly: true
});

document.getElementById('bpjsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Mendapatkan input dari pengguna
    const gaji = parseFloat(cleaveGaji.getRawValue());
    const anggotaKeluarga = parseInt(document.getElementById('anggotaKeluarga').value);

    // Validasi input
    if (isNaN(gaji) || isNaN(anggotaKeluarga) || gaji <= 0 || anggotaKeluarga <= 0) {
        showAlert('Mohon masukkan nilai gaji dan anggota keluarga yang valid.');
        return;
    }

    // --- Perhitungan BPJS Kesehatan ---
    const plafonBPJSKes = 12000000;
    const gajiBPJSKes = Math.min(gaji, plafonBPJSKes);

    const persenIuranKaryawanBPJSKes = anggotaKeluarga > 5 ? 2 : 1;
    const iuranKaryawanBPJSKes = (persenIuranKaryawanBPJSKes / 100) * gajiBPJSKes;
    const iuranPerusahaanBPJSKes = (4 / 100) * gajiBPJSKes;

    // --- Perhitungan BPJS Ketenagakerjaan ---
    // Jaminan Hari Tua (JHT)
    const persenIuranKaryawanJHT = 2;
    const persenIuranPerusahaanJHT = 3.7;
    const iuranKaryawanJHT = (persenIuranKaryawanJHT / 100) * gaji;
    const iuranPerusahaanJHT = (persenIuranPerusahaanJHT / 100) * gaji;

    // Jaminan Pensiun (JP)
    const plafonGajiJP = 10042000; // Plafon gaji JP terbaru
    const gajiJP = Math.min(gaji, plafonGajiJP);
    const persenIuranKaryawanJP = 1;
    const persenIuranPerusahaanJP = 2;
    const iuranKaryawanJP = (persenIuranKaryawanJP / 100) * gajiJP;
    const iuranPerusahaanJP = (persenIuranPerusahaanJP / 100) * gajiJP;

    // Total investasi (JHT dan JP)
    const totalInvestasiKaryawan = iuranKaryawanJHT + iuranKaryawanJP;
    const totalInvestasiPerusahaan = iuranPerusahaanJHT + iuranPerusahaanJP;
    const totalInvestasi = totalInvestasiKaryawan + totalInvestasiPerusahaan;

    // --- Total Potongan ---
    const totalPotongan = iuranKaryawanBPJSKes + totalInvestasiKaryawan;

    // Menghitung "Gaji Bersih"
    const gajiBersih = gaji - totalPotongan;

    // Menampilkan hasil
    const hasilDiv = document.getElementById('hasil');
    hasilDiv.innerHTML = `
        <div class="card shadow-lg">
            <div class="card-body p-5">
                <h4 class="card-title text-center mb-4">📊 Hasil Perhitungan</h4>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Iuran BPJS Kesehatan (Karyawan):</strong> ${formatRupiah(iuranKaryawanBPJSKes)}</li>
                    <li class="list-group-item"><strong>Iuran JHT (Karyawan):</strong> ${formatRupiah(iuranKaryawanJHT)}</li>
                    <li class="list-group-item"><strong>Iuran JP (Karyawan):</strong> ${formatRupiah(iuranKaryawanJP)}</li>
                    <li class="list-group-item"><strong>Total Potongan BPJS:</strong> ${formatRupiah(totalPotongan)}</li>
                </ul>
                <div class="mt-4">
                    <p><strong>💰 Investasi dari Karyawan (JHT + JP):</strong> ${formatRupiah(totalInvestasiKaryawan)}</p>
                    <p><strong>🏢 Investasi dari Perusahaan (JHT + JP):</strong> ${formatRupiah(totalInvestasiPerusahaan)}</p>
                    <p class="highlight"><strong>Total Investasi per Bulan:</strong> ${formatRupiah(totalInvestasi)}</p>
                    <hr/>
                    <p><strong>🤑 Gaji Bersih Anda:</strong> ${formatRupiah(gajiBersih)}</p>
                    <p class="highlight text-center">Dengan membayar <strong>${formatRupiah(totalPotongan)}</strong>, Anda mendapatkan total investasi <strong>${formatRupiah(totalInvestasi)}</strong>, berkat kontribusi perusahaan sebesar <strong>${formatRupiah(totalInvestasiPerusahaan)}</strong>. Ini seperti mendapatkan "gaji tambahan" berupa tabungan untuk masa depan Anda! 🎉</p>
                </div>
            </div>
        </div>
    `;
    hasilDiv.scrollIntoView({ behavior: 'smooth' });
});

function showAlert(message) {
    const hasilDiv = document.getElementById('hasil');
    hasilDiv.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>⚠️ Error!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    hasilDiv.scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk format Rupiah
function formatRupiah(angka) {
    return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}
