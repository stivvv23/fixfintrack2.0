const jumlahInput = document.getElementById("jumlah");
const btnTambah = document.getElementById("btnTambah");
const tableBody = document.getElementById("tableBody");
const saldoText = document.getElementById("saldo");

let totalSaldo = 0;

// format rupiah realtime
jumlahInput.addEventListener("input", (e) => {
  let angka = e.target.value.replace(/[^0-9]/g, "");

  if (!angka) {
    e.target.value = "";
    return;
  }

  e.target.value = "Rp " + Number(angka).toLocaleString("id-ID");
});

btnTambah.addEventListener("click", tambahData);

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

  // update saldo
  totalSaldo += tipe === "pemasukan" ? jumlah : -jumlah;
  saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${formatTanggal(tanggal)}</td>
    <td>${keterangan}</td>
    <td>${kategori}</td>
    <td>${tipe === "pemasukan" ? `Rp ${jumlah.toLocaleString("id-ID")}` : "-"}</td>
    <td>${tipe === "pengeluaran" ? `Rp ${jumlah.toLocaleString("id-ID")}` : "-"}</td>
    <td>
      <button class="delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  tableBody.prepend(tr);

tr.querySelector(".delete-btn").addEventListener("click", () => {
  if (tipe === "pemasukan") {
    totalSaldo -= jumlah;
  } else {
    totalSaldo += jumlah;
  }

  saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");
  tr.remove();
});

  // reset form
  document.getElementById("keterangan").value = "";
  document.getElementById("kategori").selectedIndex = 0;
  document.getElementById("tipe").selectedIndex = 0;
  jumlahInput.value = "";
}

// format tanggal
function formatTanggal(tanggal) {
  return new Date(tanggal).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// set tanggal sekarang
function isiTanggalSekarang() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById("tanggal").value = now.toISOString().slice(0, 16);
}

window.addEventListener("DOMContentLoaded", () => {
  isiTanggalSekarang();
  document.getElementById("btnToday").addEventListener("click", isiTanggalSekarang);
});