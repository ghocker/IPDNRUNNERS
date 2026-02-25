document.addEventListener('DOMContentLoaded', function () {
  // ===============================
  // KONFIGURASI
  // ===============================
  const ADMIN_WA = '6288707515651'; // GANTI NOMOR ADMIN

  const HARGA = {
    pendek: 145000,
    panjang: 160000,
  };

  const SIZE_UPCHARGE = {
    XL: 5000,
    '2XL': 10000,
    '3XL': 15000,
    '4XL': 20000,
    '5XL': 25000,
  };

  const ONGKIR_NORMAL = {
    Jawa: 15000,
    Luar: 25000,
  };

  const GRATIS_ONGKIR_QTY = 5;

  // ===============================
  // DATA PRODUK
  // ===============================
  const PRODUK = [
    { nama: 'Alpha Hijau', img: 'images/alpha.jpg' },
    { nama: 'Alpha Hitam', img: 'images/beta.jpg' },
    { nama: 'Endurance Merah', img: 'images/classic.jpg' },
    { nama: 'Endurance Putih', img: 'images/pro.jpg' },
    { nama: 'Endurance Hitam', img: 'images/endurance.jpg' },
    { nama: 'Velocity Orange', img: 'images/velocity.jpg' },
    { nama: 'Velocity Hitam', img: 'images/squad.jpg' },
    { nama: 'Velocity Biru', img: 'images/limited.jpg' },
    { nama: 'Aqua Biru', img: 'images/biru.jpg' },
    { nama: 'Aqua Merah Muda', img: 'images/pink.jpg' },
  ];
   

  let cart = [];
  const produkList = document.getElementById('produkList');
  const cartEl = document.getElementById('cart');
  const wilayahSelect = document.getElementById('wilayah');

  // ===============================
  // RENDER KATALOG
  // ===============================
  PRODUK.forEach((p) => {
    produkList.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.nama}">
        <div class="card-body">
          <strong>${p.nama}</strong>

          <select class="gender">
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>

          <select class="lengan">
            <option value="pendek">Lengan Pendek</option>
            <option value="panjang">Lengan Panjang</option>
          </select>

          <select class="size">
            <option>XS</option><option>S</option><option>M</option>
            <option>L</option><option>XL</option>
            <option>2XL</option><option>3XL</option>
            <option>4XL</option><option>5XL</option>
          </select>

          <input type="number" min="1" value="1" class="qty">

          <button onclick="tambah(this,'${p.nama}')">
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    `;
  });

  // ===============================
  // TAMBAH KE CART
  // ===============================
  window.tambah = function (btn, produk) {
    const card = btn.parentElement;

    const gender = card.querySelector('.gender').value;
    const lengan = card.querySelector('.lengan').value;
    const size = card.querySelector('.size').value;
    const qty = parseInt(card.querySelector('.qty').value);

    let harga = HARGA[lengan];
    if (SIZE_UPCHARGE[size]) harga += SIZE_UPCHARGE[size];

    cart.push({ produk, gender, lengan, size, qty, harga });
    renderCart();
  };

  // ===============================
  // HAPUS ITEM
  // ===============================
  window.hapusItem = function (index) {
    cart.splice(index, 1);
    renderCart();
  };

  // ===============================
  // HITUNG ONGKIR DINAMIS
  // ===============================
  function hitungOngkir(totalQty, wilayah) {
    if (totalQty >= GRATIS_ONGKIR_QTY) return 0;
    return ONGKIR_NORMAL[wilayah];
  }

  // ===============================
  // RENDER CART + RINGKASAN
  // ===============================
  function renderCart() {
    if (cart.length === 0) {
      cartEl.innerHTML = '<p>Keranjang masih kosong</p>';
      return;
    }

    let html = '';
    let subtotal = 0;
    let totalQty = 0;

    cart.forEach((i, idx) => {
      const totalItem = i.harga * i.qty;
      subtotal += totalItem;
      totalQty += i.qty;

      html += `
        <p>
          ${i.produk} | ${i.gender} | ${i.lengan} | ${i.size} x${i.qty}
          = Rp${totalItem.toLocaleString('id-ID')}
          <button onclick="hapusItem(${idx})">❌</button>
        </p>
      `;
    });

    const wilayah = wilayahSelect.value;
    const ongkir = hitungOngkir(totalQty, wilayah);
    const total = subtotal + ongkir;

    html += `
      <hr>
      <p><strong>Jumlah Item :</strong> ${totalQty} pcs</p>
      <p><strong>Subtotal :</strong> Rp${subtotal.toLocaleString('id-ID')}</p>
      <p><strong>Ongkir :</strong> Rp${ongkir.toLocaleString('id-ID')}
        ${ongkir === 0 ? '(Gratis Ongkir 🎉)' : `(${wilayah})`}
      </p>
      <p><strong>Total :</strong> Rp${total.toLocaleString('id-ID')}</p>
    `;

    cartEl.innerHTML = html;
  }

  // ===============================
  // AUTO UPDATE SAAT GANTI WILAYAH
  // ===============================
  wilayahSelect.addEventListener('change', renderCart);

  // ===============================
  // CHECKOUT → WHATSAPP
  // ===============================
  window.checkout = function () {
    if (cart.length === 0) {
      alert('Keranjang masih kosong');
      return;
    }

    const nama = document.getElementById('nama').value;
    const wa = document.getElementById('wa').value;
    const alamat = document.getElementById('alamat').value;
    const kecamatan = document.getElementById("kecamatan").value;
    const kelurahan = document.getElementById("kelurahan").value;
    const rtrw = document.getElementById("rtrw").value;
    const kodepos = document.getElementById("kodepos").value;
    const wilayah = wilayahSelect.value;

    const subtotal = cart.reduce((s, i) => s + i.harga * i.qty, 0);
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const ongkir = hitungOngkir(totalQty, wilayah);
    const total = subtotal + ongkir;

    const detail = cart
      .map(
        (i) =>
          `- ${i.produk}
  ${i.gender} | ${i.lengan} | ${i.size} x${i.qty}`
      )
      .join('\n');

    const pesan = `
Halo IPDNRUNNERS,
Saya ingin melakukan pemesanan:

Nama   : ${nama}
No WA  : ${wa}
Alamat:
${alamat}
Kelurahan ${kelurahan}
Kecamatan ${kecamatan}
RT/RW ${rtrw}
Kode Pos ${kodepos}

Detail Pesanan:
${detail}

Jumlah Item : ${totalQty} pcs
Subtotal    : Rp${subtotal.toLocaleString('id-ID')}
Ongkir      : Rp${ongkir.toLocaleString('id-ID')}
Total Bayar : Rp${total.toLocaleString('id-ID')}
`;

    window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };
});
