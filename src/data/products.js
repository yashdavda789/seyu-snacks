// Product catalogue. Edit freely - prices, names and copy all live here.
//
//   kind    which 3D model gets built   (see src/three/studio.js -> FOOD)
//   tone    which colour ramp it uses   (TONES)
//   vessel  which wooden bowl: 0 deep, 1 wide and shallow, 2 tall katori
//   accent  no longer used - every bowl is the same wood (kept so the data
//           still matches older exports; safe to delete)

export const WHATSAPP_NUMBER = '918879613395'
export const WHATSAPP_DISPLAY = '+91 88796 13395'

// Brand shown above every product name on the cards.
// Change it here and all 48 follow. To give one product a different brand,
// add `brand: 'Something Else'` to that product's entry below.
export const PRODUCT_BRAND = 'Prashant Corner'

export function brandOf(product) {
  return product.brand ?? PRODUCT_BRAND
}

export const COUNTRIES = [
  { name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}' },
  { name: 'USA', flag: '\u{1F1FA}\u{1F1F8}' },
  { name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}' },
  { name: 'UK', flag: '\u{1F1EC}\u{1F1E7}' },
  { name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
]

export const DELIVERY_DAYS = '5-7 days'

// Within India we deliver everywhere. These are only the cities worth naming
// on the page - the ones with the largest number of people who grew up on
// this food and have moved away. Add or reorder freely; the band and the
// footer both read this list.
export const CITIES = [
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Ahmedabad',
  'Kolkata',
]

export const DOMESTIC_DAYS = '2-4 days'

export const PRODUCTS = [
  {"id": 0, "slug": "navratna-chivda", "title": "Navratna Chivda", "price": 600.0, "unit": "1 Kg", "desc": "A delicious and crunchy blend of rice flakes, crispy sev, Bengal gram, peanuts, potato, and lentils, perfectly seasoned…", "kind": "mix", "tone": "golden", "vessel": 0, "accent": 7541262},
  {"id": 1, "slug": "bikaneri-bhujia", "title": "Bikaneri Bhujia", "price": 600.0, "unit": "1 Kg", "desc": "A timeless favourite made with a fine blend of gram flour and traditional aromatic spices.", "kind": "strand", "tone": "golden", "vessel": 1, "accent": 1324588},
  {"id": 2, "slug": "lemon-bhujia", "title": "Lemon Bhujia", "price": 600.0, "unit": "1 Kg", "desc": "A crispy and crunchy sev infused with the refreshing zest and tangy flavour of lemon.", "kind": "strand", "tone": "pale", "vessel": 2, "accent": 3017535},
  {"id": 3, "slug": "aloo-bhujia-sev", "title": "Aloo Bhujia Sev", "price": 600.0, "unit": "1 Kg", "desc": "A crispy and flavourful sev made with the delicious goodness of potato and gram flour, seasoned with aromatic spices.", "kind": "strand", "tone": "golden", "vessel": 0, "accent": 8010246},
  {"id": 4, "slug": "potato-masala-chivda", "title": "Potato Masala Chivda", "price": 800.0, "unit": "1 Kg", "desc": "A crispy and flavourful namkeen made with crunchy potato flakes and a delicious blend of aromatic spices.", "kind": "mix", "tone": "red", "vessel": 1, "accent": 7541262},
  {"id": 5, "slug": "sp-fafda", "title": "SP. Fafda", "price": 700.0, "unit": "1 Kg", "desc": "Special Fafda is a traditional dry snack made from premium gram flour and delicately seasoned with classic spices.", "kind": "stick", "tone": "cream", "vessel": 2, "accent": 1324588},
  {"id": 6, "slug": "df-nylon-chivda", "title": "DF Nylon Chivda", "price": 850.0, "unit": "1 Kg", "desc": "DF Nylon Poha Chivda is a light and crispy dry namkeen made with thin nylon poha, delicately roasted to perfection.", "kind": "mix", "tone": "cream", "vessel": 0, "accent": 3017535},
  {"id": 7, "slug": "bhavnagari-gathiya", "title": "Bhavnagari Gathiya", "price": 600.0, "unit": "1 Kg", "desc": "Bhavnagri Gathiya is a classic dry namkeen made from premium gram flour and seasoned with mild spices.", "kind": "stick", "tone": "golden", "vessel": 1, "accent": 8010246},
  {"id": 8, "slug": "bhajani-chakli", "title": "Bhajani Chakli", "price": 640.0, "unit": "1 Kg", "desc": "Bhajani Chakli is a traditional snack made from a special blend of roasted multigrain flours and aromatic…", "kind": "spiral", "tone": "golden", "vessel": 2, "accent": 7541262},
  {"id": 9, "slug": "garlic-farsan", "title": "Garlic Farsan", "price": 600.0, "unit": "1 Kg", "desc": "Garlic Farsan is a bold and flavorful dry namkeen crafted with a crunchy mix of crispy ingredients infused with the rich…", "kind": "mix", "tone": "red", "vessel": 0, "accent": 1324588},
  {"id": 10, "slug": "kadipatta-farsan", "title": "Kadipatta Farsan", "price": 600.0, "unit": "1 Kg", "desc": "Kadhipatta Farsan is a flavorful dry namkeen made with a delightful mix of crispy ingredients tossed with aromatic fried…", "kind": "mix", "tone": "green", "vessel": 1, "accent": 3017535},
  {"id": 11, "slug": "farali-chivda", "title": "Farali Chivda", "price": 900.0, "unit": "1 Kg", "desc": "Special Farali Chivda is a premium fasting namkeen made with crispy potato sticks, roasted peanuts, cashews, and sweet…", "kind": "mix", "tone": "golden", "vessel": 2, "accent": 8010246},
  {"id": 12, "slug": "makai-chivda", "title": "Makai Chivda", "price": 760.0, "unit": "1 Kg", "desc": "Makai Chivda is a light and crunchy dry namkeen made from crisp corn flakes, perfectly roasted and seasoned with mild…", "kind": "mix", "tone": "golden", "vessel": 0, "accent": 7541262},
  {"id": 13, "slug": "schezwan-roll", "title": "Schezwan Roll", "price": 560.0, "unit": "1 Kg", "desc": "Schezwan Roll is a crispy, golden snack filled with a bold and spicy schezwan-flavored mixture.", "kind": "stick", "tone": "red", "vessel": 1, "accent": 1324588},
  {"id": 14, "slug": "methi-puri", "title": "Methi Puri", "price": 600.0, "unit": "1 Kg", "desc": "Methi Puri is a crispy and flavorful dry snack made with refined flour blended with fresh fenugreek leaves and aromatic…", "kind": "disc", "tone": "green", "vessel": 2, "accent": 3017535},
  {"id": 15, "slug": "nylon-papdi", "title": "Nylon Papdi", "price": 720.0, "unit": "1 Kg", "desc": "Nylon Papdi is a light and crispy dry namkeen made from refined flour and delicately seasoned for a mild, savory taste.", "kind": "disc", "tone": "cream", "vessel": 0, "accent": 8010246},
  {"id": 16, "slug": "sp-bhakarwadi", "title": "SP. Bhakarwadi", "price": 600.0, "unit": "1 Kg", "desc": "Special Bhakarwadi is a richer and more indulgent version of the traditional favorite, crafted with a premium blend of…", "kind": "wheel", "tone": "golden", "vessel": 1, "accent": 7541262},
  {"id": 17, "slug": "sweet-boondi", "title": "Sweet Boondi", "price": 680.0, "unit": "1 Kg", "desc": "Sweet Boondi is a delightful traditional sweet made from tiny golden droplets of gram flour, fried to perfection and…", "kind": "bead", "tone": "deep", "vessel": 2, "accent": 1324588},
  {"id": 18, "slug": "mora-sev", "title": "Mora Sev", "price": 600.0, "unit": "1 Kg", "desc": "Mora Sev is a thick and crunchy variation of traditional sev made from high-quality gram flour and blended with aromatic…", "kind": "strand", "tone": "golden", "vessel": 0, "accent": 3017535},
  {"id": 19, "slug": "ckp-karanji", "title": "CKP Karanji", "price": 50.0, "unit": "1 Piece", "desc": "CKP Karanji is a traditional festive delicacy known for its crisp, flaky outer shell and rich, flavorful filling.", "kind": "crescent", "tone": "golden", "vessel": 1, "accent": 8010246},
  {"id": 20, "slug": "dry-fruit-samosa", "title": "Dry Fruit Samosa", "price": 600.0, "unit": "1 Kg", "desc": "Dry Fruit Samosa is a rich and indulgent sweet snack filled with a premium blend of assorted dry fruits and nuts,…", "kind": "crescent", "tone": "deep", "vessel": 2, "accent": 7541262},
  {"id": 21, "slug": "sp-wheat-gul-poli", "title": "Sp. Wheat Gul Poli", "price": 50.0, "unit": "1 Piece", "desc": "Special Wheat Gulpoli is a traditional sweet flatbread made with fine wheat flour and generously filled…", "kind": "disc", "tone": "cream", "vessel": 0, "accent": 1324588},
  {"id": 22, "slug": "sweet-shankarpali", "title": "Sweet Shankarpali", "price": 625.0, "unit": "1 Kg", "desc": "Sweet Shankarpali is a traditional crunchy snack made from refined flour, ghee, and sugar, cut into small diamond-shaped…", "kind": "diamond", "tone": "cream", "vessel": 1, "accent": 3017535},
  {"id": 23, "slug": "methi-thepla", "title": "Methi Thepla", "price": 15.0, "unit": "1 Piece", "desc": "Methi Thepla is a traditional flatbread made with whole wheat flour, fresh fenugreek (methi) leaves, and a blend…", "kind": "disc", "tone": "green", "vessel": 2, "accent": 8010246},
  {"id": 24, "slug": "butter-mathri", "title": "Butter Mathri", "price": 650.0, "unit": "1 Kg", "desc": "Butter Chirote is a light and flaky savory snack made with delicate layered dough enriched with rich butter.", "kind": "disc", "tone": "cream", "vessel": 0, "accent": 7541262},
  {"id": 25, "slug": "kadipatta-mathari", "title": "Kadipatta Mathari", "price": 600.0, "unit": "1 Kg", "desc": "Kadhipatta Mathri is a flavorful variation of the traditional mathri, enriched with the aromatic essence of curry leaves…", "kind": "disc", "tone": "green", "vessel": 1, "accent": 1324588},
  {"id": 26, "slug": "golden-farsan", "title": "Golden Farsan", "price": 650.0, "unit": "1 Kg", "desc": "Golden Farsan is a vibrant dry namkeen blend made with a mix of crispy ingredients, perfectly fried to a rich golden finish.", "kind": "mix", "tone": "golden", "vessel": 2, "accent": 3017535},
  {"id": 27, "slug": "manglori-mix-farsan", "title": "Manglori Mix Farsan", "price": 600.0, "unit": "1 Kg", "desc": "Mangalori Mix Farsan is a flavorful dry namkeen inspired by coastal tastes, made with a vibrant blend of crispy…", "kind": "mix", "tone": "golden", "vessel": 0, "accent": 8010246},
  {"id": 28, "slug": "moongdal", "title": "Moongdal", "price": 720.0, "unit": "1 Kg", "desc": "Moong Dal is a light and crispy dry namkeen made from premium split moong lentils, fried to golden perfection and…", "kind": "bean", "tone": "golden", "vessel": 1, "accent": 7541262},
  {"id": 29, "slug": "methi-matthi", "title": "Methi Matthi", "price": 600.0, "unit": "1 Kg", "desc": "Our Methi Mathris are made with pure fenugreek, which has a natural bitterness.", "kind": "disc", "tone": "green", "vessel": 2, "accent": 1324588},
  {"id": 30, "slug": "palak-matthi", "title": "Palak Matthi", "price": 600.0, "unit": "1 Kg", "desc": "Palak Mathri is a savoury snack which is deep fried on low flame to crispy and melt in mouth texture.", "kind": "disc", "tone": "green", "vessel": 0, "accent": 3017535},
  {"id": 31, "slug": "diet-bhel", "title": "Diet Bhel", "price": 600.0, "unit": "1 Kg", "desc": "Diet Bhel is a light and crunchy namkeen blend made with puffed grains and carefully selected ingredients for a wholesome…", "kind": "mix", "tone": "golden", "vessel": 1, "accent": 8010246},
  {"id": 32, "slug": "bhakarwadi-big", "title": "Bhakarwadi Big", "price": 600.0, "unit": "1 Kg", "desc": "Bhakarwadi is a classic snack made with a crisp outer layer rolled around a flavorful, spiced filling of…", "kind": "wheel", "tone": "golden", "vessel": 2, "accent": 7541262},
  {"id": 33, "slug": "diet-corn-chivda", "title": "Diet Corn Chivda", "price": 650.0, "unit": "1 Kg", "desc": "Diet Corn Chivda is a light and crispy namkeen made with roasted corn flakes blended with puffed grains and mild seasoning.", "kind": "mix", "tone": "golden", "vessel": 0, "accent": 1324588},
  {"id": 34, "slug": "pravasi-chivda", "title": "Pravasi Chivda", "price": 680.0, "unit": "1 Kg", "desc": "Mahalaxmi Chivda is a rich and flavorful dry namkeen made with a traditional blend of crispy poha, peanuts, roasted…", "kind": "mix", "tone": "golden", "vessel": 1, "accent": 3017535},
  {"id": 35, "slug": "dryfruit-mixture", "title": "Dryfruit Mixture", "price": 1280.0, "unit": "1 Kg", "desc": "Dry Fruit Mixture is a rich and premium namkeen blend made with an assortment of crunchy dry fruits combined with crispy…", "kind": "mix", "tone": "deep", "vessel": 2, "accent": 8010246},
  {"id": 36, "slug": "garlic-sev", "title": "Garlic Sev", "price": 535.0, "unit": "1 Kg", "desc": "Garlic Sev is a flavorful dry namkeen made from premium gram flour infused with the bold taste of garlic and aromatic spices.", "kind": "strand", "tone": "red", "vessel": 0, "accent": 7541262},
  {"id": 37, "slug": "methi-ghatiya", "title": "Methi Ghatiya", "price": 600.0, "unit": "1 Kg", "desc": "Methi gathiya is a crisp and flavourful dry namkeen made from premium gram flour infused with the aromatic taste of…", "kind": "stick", "tone": "green", "vessel": 1, "accent": 1324588},
  {"id": 38, "slug": "homemade-poha-chivda", "title": "Homemade Poha Chivda", "price": 600.0, "unit": "1 Kg", "desc": "Homemade Poha Chivda is a traditional dry namkeen made with carefully roasted poha blended with crunchy peanuts and…", "kind": "mix", "tone": "golden", "vessel": 2, "accent": 3017535},
  {"id": 39, "slug": "kaju-bhajiya", "title": "Kaju Bhajiya", "price": 1700.0, "unit": "1 Kg", "desc": "Kaju Bhajiya is a premium savory delight made with crunchy whole cashews coated in a lightly spiced gram flour batter and…", "kind": "cashew", "tone": "deep", "vessel": 0, "accent": 8010246},
  {"id": 40, "slug": "nylon-sev", "title": "Nylon Sev", "price": 650.0, "unit": "1 Kg", "desc": "Nylon Sev is a fine and delicate dry namkeen made from premium gram flour, crafted into thin strands and fried to a…", "kind": "strand", "tone": "cream", "vessel": 1, "accent": 7541262},
  {"id": 41, "slug": "special-dalmuth", "title": "Special Dalmuth", "price": 960.0, "unit": "1 Kg", "desc": "Special Dalmuth Chivda is a flavorful dry namkeen made with a rich blend of lentils, sev, and crispy ingredients,…", "kind": "bean", "tone": "red", "vessel": 2, "accent": 1324588},
  {"id": 42, "slug": "panchratna-mix-chivda", "title": "Panchratna Mix Chivda", "price": 720.0, "unit": "1 Kg", "desc": "Panchratan Mix Chivda is a delightful dry namkeen crafted with a premium blend of five select ingredients, offering a…", "kind": "mix", "tone": "golden", "vessel": 0, "accent": 3017535},
  {"id": 43, "slug": "salted-boondi", "title": "Salted Boondi", "price": 600.0, "unit": "1 Kg", "desc": "Salted Boondi is a light and crispy dry namkeen made from tiny golden droplets of gram flour, fried to perfection and…", "kind": "bead", "tone": "deep", "vessel": 1, "accent": 8010246},
  {"id": 44, "slug": "chirote", "title": "Chirote", "price": 670.0, "unit": "1 Kg", "desc": "Special Chirote is a traditional flaky sweet made with delicate layers of refined flour, carefully folded and fried to a…", "kind": "disc", "tone": "cream", "vessel": 2, "accent": 7541262},
  {"id": 45, "slug": "chanadal", "title": "Chanadal", "price": 650.0, "unit": "1 Kg", "desc": "Masala Chana Dal is a crunchy and flavorful dry namkeen made from premium split chickpeas, fried to perfection and coated…", "kind": "bean", "tone": "golden", "vessel": 0, "accent": 1324588},
  {"id": 46, "slug": "anarse", "title": "Anarse", "price": 1120.0, "unit": "1 Kg", "desc": "Anarse is a traditional sweet made from soaked rice and jaggery, shaped into delicate discs and fried to a…", "kind": "diamond", "tone": "deep", "vessel": 1, "accent": 3017535},
  {"id": 47, "slug": "masala-moong", "title": "Masala Moong", "price": 720.0, "unit": "1 Kg", "desc": "Masala Moong is a crunchy and flavorful dry namkeen made from premium whole moong beans, perfectly fried and coated with…", "kind": "bean", "tone": "red", "vessel": 2, "accent": 8010246},
]

export function formatPrice(n) {
  return Number.isInteger(n) ? n.toLocaleString('en-IN') : n.toFixed(2)
}

export function whatsappLink(product) {
  const msg =
    `Hi Seyu Snacks & Namkeen! I'd like to order ${product.title} (${product.unit}) ` +
    `- Rs. ${formatPrice(product.price)}. Please share availability and delivery details.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export const GENERAL_WHATSAPP =
  `https://wa.me/${WHATSAPP_NUMBER}?text=` +
  encodeURIComponent("Hi Seyu Snacks & Namkeen, I'd like to place an order.")
