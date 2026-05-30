const jumlahInput = document.getElementById("jumlah");
const btnTambah = document.getElementById("btnTambah");
const tableBody = document.getElementById("tableBody");
const saldoText = document.getElementById("saldo");

let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
let totalSaldo = 0;

// Format rupiah realtime
jumlahInput.addEventListener("input", (e) => {
  let angka = e.target.value.replace(/[^0-9]/g, "");

  if (!angka) {
    e.target.value = "";
    return;
  }

  e.target.value = "Rp " + Number(angka).toLocaleString("id-ID");
});

btnTambah.addEventListener("click", tambahData);

// Simpan ke localStorage
function simpanData() {
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
}

// Render tabel
function renderData(data) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${formatTanggal(data.tanggal)}</td>
    <td>${data.keterangan}</td>
    <td>${data.kategori}</td>
    <td>${data.tipe === "pemasukan"
      ? `Rp ${data.jumlah.toLocaleString("id-ID")}`
      : "-"}</td>
    <td>${data.tipe === "pengeluaran"
      ? `Rp ${data.jumlah.toLocaleString("id-ID")}`
      : "-"}</td>
    <td>
      <button class="delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  tableBody.prepend(tr);

  tr.querySelector(".delete-btn").addEventListener("click", () => {
    transaksi = transaksi.filter(item => item.id !== data.id);

    if (data.tipe === "pemasukan") {
      totalSaldo -= data.jumlah;
    } else {
      totalSaldo += data.jumlah;
    }

    saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");

    simpanData();
    tr.remove();
  });
}

// Tambah data
function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const keterangan = document.getElementById("keterangan").value;
  const kategori = document.getElementById("kategori").value;
  const tipe = document.getElementById("tipe").value;

  let jumlahRaw = jumlahInput.value.replace(/[^0-9]/g, "");

  if (!tanggal || !keterangan || !jumlahRaw) {
    alert("Isi semua data dulu.");
    return;
  }

  const jumlah = Number(jumlahRaw);

  const dataBaru = {
    id: Date.now(),
    tanggal,
    keterangan,
    kategori,
    tipe,
    jumlah
  };

  transaksi.push(dataBaru);
  simpanData();

  if (tipe === "pemasukan") {
    totalSaldo += jumlah;
  } else {
    totalSaldo -= jumlah;
  }

  saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");

  renderData(dataBaru);

  // Reset form
  document.getElementById("keterangan").value = "";
  document.getElementById("kategori").selectedIndex = 0;
  document.getElementById("tipe").selectedIndex = 0;
  jumlahInput.value = "";
}

// Format tanggal
function formatTanggal(tanggal) {
  return new Date(tanggal).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Isi tanggal sekarang
function isiTanggalSekarang() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById("tanggal").value = now.toISOString().slice(0, 16);
}

// Saat halaman dibuka
window.addEventListener("DOMContentLoaded", () => {
  isiTanggalSekarang();

  document
    .getElementById("btnToday")
    .addEventListener("click", isiTanggalSekarang);

  transaksi.forEach(data => {
    if (data.tipe === "pemasukan") {
      totalSaldo += data.jumlah;
    } else {
      totalSaldo -= data.jumlah;
    }

    renderData(data);
  });

  saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");
});
