document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Aceh Gayo Coffe Beans",
        img: "image/products/aceh-gayo-coffee-beans.jpg",
        price: 75000,
      },

      {
        id: 2,
        name: "Bali Kintamani Coffee Beans",
        img: "image/products/bali-kintamani-coffee-beans.jpg",
        price: 75000,
      },

      {
        id: 3,
        name: "Bali Ulian Coffee Beans",
        img: "image/products/bali-ulian-coffee-beans.jpg",
        price: 75000,
      },

      {
        id: 4,
        name: "Flores Colol Coffee Beans",
        img: "image/products/flores-colol-coffee-beans.jpg",
        price: 75000,
      },

      {
        id: 5,
        name: "Sumatra Dolok Coffee Beans",
        img: "image/products/sumatra-dolok-sanggul-coffee-beans.jpg",
        price: 75000,
      },

      {
        id: 6,
        name: "Toraja Mialo Coffee Beans",
        img: "image/products/toraja-mialo-coffee-beans.jpg",
        price: 75000,
      },

      {
        id: 7,
        name: "Black Pearl Coffee Beans",
        img: "image/products/black-pearl-coffee-beans.jpg",
        price: 360000,
      },

      {
        id: 8,
        name: "Luwak Coffee Beans",
        img: "image/products/luwak-coffee-beans.jpg",
        price: 350000,
      },

      {
        id: 9,
        name: "Coffee Pot 900ml Black",
        img: "image/products/coffee-pot-900-ml-black.jpg",
        price: 517000,
      },

      {
        id: 10,
        name: "Coffee Pot 1000ml",
        img: "image/products/coffee-pot-1000-ml.jpg",
        price: 423000,
      },

      {
        id: 11,
        name: "T-Shirt CKI Black",
        img: "image/products/t-shirt-cki-black.jpg",
        price: 160000,
      },

      {
        id: 12,
        name: "T-Shirt CKI White",
        img: "image/products/t-shirt-cki-white.jpg",
        price: 160000,
      },
    ],
  }));

  Alpine.data('menu', () => ({
    items: [
      {
        name: '- Espresso Elixir -',
        img: 'image/menu/espresso-delight.jpg',
        price: 'IDR 28K'
      },
      {
        name: '- American Voyage -',
        img: 'image/menu/americano.jpg',
        price: 'IDR 32K'
      },
      {
        name: '- Lavish Latte -',
        img: 'image/menu/latte.jpg',
        price: 'IDR 42K'
      },
      {
        name: '- Matcha Marvel -',
        img: 'image/menu/matcha-latte.jpg',
        price: 'IDR 48K'
      },
      {
        name: '- Mocha Madness -',
        img: 'image/menu/mocha-madness.jpg',
        price: 'IDR 50K'
      },
      {
        name: '- Caramel Dream -',
        img: 'image/menu/caramel-machiato.jpg',
        price: 'IDR 55K'
      },
    ]
  }))

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //cek apakah ada barang yang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);

      //jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          //jika barnag berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri satu persatu
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim data ketika checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  // const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open("http://wa.me/6285817053122?text=" + encodeURIComponent(message));

  // Minta transaction token menggunakan ajax / fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// Format pesan Whatsapp
// const formatMessage = (obj) => {
//   return `Data Customer
//   Nama: ${obj.name}
//   Email: ${obj.email}
//   No HP: ${obj.phone}
//   Data Pesanan
//   ${JSON.parse(obj.items).map(
//     (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
//   )}
//   TOTAL: ${rupiah(obj.total)}
//   Terima kasih.`;
// };

// Rupiah Convertion
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
