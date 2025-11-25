// static products that contains id, name, img url, product type, details, price, old price.
const productsDB = [
    {id: 1, name: 'Superman Dumbbell Set', img: '1.png', type: 'equipments', details: 'Superman Dumbbell Set, 2.5 to 50 kg, High Quality Fitness Equipment, PU Material', price: 87750, oldPrice: 97750},
    {id: 2, name: 'Super Olympic Hex Bar', img: '2.png', type: 'equipments', details: 'Super Olympic Hex Bar. / Trap Barell, Trap Bar Deadlifts', price: 6900, oldPrice: 20},
    {id: 3, name: 'Lifting Bar', img: '3.png', type: 'equipments', details: 'Olympic Weight Lifting Bar 7ft, Strongest 220cm Weight lifting Barbell', price: 4200, oldPrice: 5200},
    
    {id: 4, name: 'Fat Burners', img: '4.png', type: 'supplements', details: 'Universal Nutrition Animal Cuts 42 Packs', price: 3500, oldPrice: 4200},
    {id: 5, name: 'Bpi Sports Cla + Carnitine 50 Servings', img: '5.png', type: 'supplements', details: 'Flavor Fruit Punch, Rainbow Ice, Snow Cone, Watermelon Freeze, Brand Bpi Sports', price: 1750, oldPrice: 2050},
    {id: 6, name: 'Cloma Pharma Black Spider 100 Capsules', img: '6.png', type: 'supplements', details: 'Brand Cloma Pharma', price: 1550, oldPrice: 2000},

    {id: 7, name: 'RAW CUT OFF BAR-BASIC TANK', img: '7.png', type: 'apparels', details: 'Size: SMALL MEDIUM LARGE XLARGE XXLARGE', price: 455, oldPrice: 650},
    {id: 8, name: 'ULTRA RAGLAN T-SHIRT', img: '8.png', type: 'apparels', details: 'Size: SMALL MEDIUM LARGE XLARGE XXLARGE', price: 486, oldPrice: 695.00},
    {id: 9, name: 'ULTRA-CAMO VENTED TANK [LIMITED QUANTITIES]', img: '9.png', type: 'apparels', details: 'Size: SMALL MEDIUM LARGE XLARGE XXLARGE', price: 486, oldPrice: 695.00},

    {id: 10, name: 'Aolikes Carpal Tunnel Wrist Brace', img: '10.png', type: 'accessories', details: 'Wrist Support For Men And Women Adjustable Wrist Strap Fits Both Hands For Sports Protecting Wrist Joint Pain Relief', price: 250, oldPrice: 300},
    {id: 11, name: '3M Adjustable Wrist Support - Black', img: '11.png', type: 'accessories', details: '3M Adjustable Wrist Support - Black', price: 99, oldPrice: 200},
    {id: 12, name: 'Men Chest Handbag', img: '12.png', type: 'accessories', details: 'Crossbody Bag Fashionable Men Chest Handbag Crossbody Bag Green', price: 549.55, oldPrice: 824.65},
];
// get product id from url (/product.html?id=1)
const prodId = new URLSearchParams(window.location.search).get('id');

const LOCAL_STORAGE_CART = 'listCarts';
const openShopping = '#showCart';
const closeShopping = '.cart .closeShopping';
const listCart = 'ul.listCart'
const total = '.cart .total';
const quantity = '.card span.quantity';

let listCarts = [];
let currentProduct = null;

$(function() {
    $(function init() {
        // populate card
        if (prodId) {
            currentProduct = get_product(prodId);

            if (currentProduct) {
                document.title = currentProduct.name;
                $('#productImage')[0].src = `images/products/${currentProduct.img}`;
                $('#productName')[0].innerHTML = currentProduct.name;
                $('#productType')[0].innerHTML = 'GYM ' + currentProduct.type.toUpperCase();
                $('#productDetails')[0].innerHTML = currentProduct.details;
                $('#productPrice')[0].innerHTML = currentProduct.price.toLocaleString() + '  EGP';
                $('#productOldPrice')[0].innerHTML = currentProduct.oldPrice.toLocaleString();
            } else {
                // product not found
                console.error("Bad Request: id not correct!");
                window.location.href = 'error.html';
            }
        } else {
            console.error("Bad Request: id not provided");
            window.location.href = 'error.html';
        }

        // populate listCarts
        let localCart = load_local(LOCAL_STORAGE_CART);
        listCarts = localCart ? localCart : [];

        reloadCart();
    });

    $('#buyBtn').click(function() {
        show_alert(`Product ${currentProduct.name} has been bought successfully!`);
    });

    $('#alertDismissBtn').click(function() {
        $('#msg').toggleClass('active');
    });
    
    // localStorage.clear();
    $('#addToCart').click(function() {
        if (!currentProduct) return;
        // check if the cart is full
        const cartMaxSize = 5;
        let cartSize = Object.keys(listCarts).length;
        if (cartSize >= cartMaxSize) return;

        if (listCarts[currentProduct.id] == null)
        {
            // by reference
            // listCarts[currentProduct.id] = productsDB[prodId-1]; // add product to cart
            // listCarts[prodId].quantity = 1; // add another field to indicate the order quantity

            // by value
            listCarts[currentProduct.id] = {
                id: currentProduct.id,
                name: currentProduct.name,
                img: currentProduct.img,
                price: currentProduct.price,
                quantity: 1,
            };

            save_local(LOCAL_STORAGE_CART, listCarts);
            show_alert(`Product ${currentProduct.name} has been added to cart successfully!`);
            reloadCart();
        }
    });

    $('#loginBtn').click(function() {
        // TODO: Change the URL
        window.location.href = 'login.html';
    });
    
    $(openShopping).click(function() {
        document.body.classList.add('active');
    });
    
    $(closeShopping).click(function() {
        document.body.classList.remove('active');
    });

});

function reloadCart() {
    $(listCart)[0].innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    listCarts.forEach((value, key) => {
        if (value != null) {
            totalPrice = totalPrice + value.price;
            count = count + value.quantity;
        
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="images/products/${value.img}" /></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${key}, -1)">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, 1)">+</button>
                </div>
            `;
            $(listCart)[0].appendChild(newDiv);
        }
    })

    $(total)[0].innerText = totalPrice.toLocaleString(); // convert to string        
    $(quantity)[0].innerText = count;
}

function changeQuantity(key, value) {
    let newQuantity = listCarts[key].quantity + value;
    if (newQuantity == 0) {
        delete listCarts[key];
    } else {
        listCarts[key].quantity = newQuantity;
        listCarts[key].price = listCarts[key].quantity * get_product(key).price;
    }
    save_local(LOCAL_STORAGE_CART, listCarts);
    reloadCart();
}

function get_product(id) {
    let product = null;
    productsDB.forEach(p => {
       if (p.id == id) product = p
    });
    return product;
}

function save_local(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function load_local(key) {
    let result = localStorage.getItem(key);
    return JSON.parse(result);
}

function show_alert(msg) {
    $('#msg').toggleClass('active');
    $('#msgContent')[0].innerHTML = msg;
}