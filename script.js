const jumlahInput = document.getElementById("jumlah");
const btnTambah = document.getElementById("btnTambah");
const tableBody = document.getElementById("tableBody");
const saldoText = document.getElementById("saldo");

let totalSaldo = 0;

// Format rupiah realtime
jumlahInput.addEventListener("input", function (e) {
  let angka = e.target.value.replace(/[^0-9]/g, "");

  if (angka === "") {
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

  let jumlahx = jumlahInput.value.replace(/[^0-9]/g, "");

  // Validasi
  if (tanggal === "" || keterangan === "" || jumlahx === "") {
    alert("Isi semua data dulu.");
    return;
  }

  let jumlah = parseInt(jumlahx);

  if (isNaN(jumlah)) {
    alert("Jumlah harus angka.");
    return;
  }

  // Update saldo
  if (tipe === "pemasukan") {
    totalSaldo += jumlah;
  } else {
    totalSaldo -= jumlah;
  }

  saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${formatTanggal(tanggal)}</td>
    <td>${keterangan}</td>
    <td>${kategori}</td>

    <td>
      ${
        tipe === "pemasukan"
          ? `<span class="badge masuk">Rp ${jumlah.toLocaleString(
              "id-ID",
            )}</span>`
          : "-"
      }
    </td>

    <td>
      ${
        tipe === "pengeluaran"
          ? `<span class="badge keluar">Rp ${jumlah.toLocaleString(
              "id-ID",
            )}</span>`
          : "-"
      }
    </td>

    <td>
      <button class="delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  tableBody.prepend(tr);
  // Kirim ke Google Sheets
  fetch(
    "https://script.google.com/macros/s/AKfycbyTlBc9T8h9fhp8801Kmq71cPQc4l1iKIyVa7Xu1arqnxrXjh2erSv3DCiH59xgmWHz/exec",
    {
      method: "POST",
      body: JSON.stringify({
        tanggal,
        keterangan,
        kategori,
        tipe,
        jumlah,
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Berhasil dikirim:", data);
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  // Hapus data
  tr.querySelector(".delete-btn").addEventListener("click", () => {
    if (tipe === "pemasukan") {
      totalSaldo -= jumlah;
    } else {
      totalSaldo += jumlah;
    }

    saldoText.innerText = "Rp " + totalSaldo.toLocaleString("id-ID");

    tr.remove();
  });

  // Reset form
  document.getElementById("keterangan").value = "";
  jumlahInput.value = "";
}

function formatTanggal(tanggal) {
  const date = new Date(tanggal);

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Auto isi tanggal & waktu realtime
window.addEventListener("DOMContentLoaded", () => {
  const sekarang = new Date();

  sekarang.setMinutes(sekarang.getMinutes() - sekarang.getTimezoneOffset());

  document.getElementById("tanggal").value = sekarang
    .toISOString()
    .slice(0, 16);
});
