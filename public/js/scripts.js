// Scripts
// Author: Ombajo

// Business Logic
// _______________________________________________________________________________________

let selectedToppings = [];

const totalCostBox = document.getElementById("total-cost");
const toppingsCostBox = document.getElementById("toppings-cost");
const cheeseCostBox = document.getElementById("cheese-cost");
const gstCostBox = document.getElementById("gst-cost");
const deliveryBox = document.getElementById("delivery-cost");
const grandCostBox = document.getElementById("grand-cost");
const pizzaSize = document.getElementById("pizza-size");
const quantity = document.getElementById("quantity");
const toppingDivs = document.querySelectorAll(".topping");
const crustDivs = document.querySelectorAll(".crust");

const toppingPrices = {
  mushroom: 130,
  onion: 300,
  paneer: 450,
  paparika: 230,
  jalapeno: 230,
  greenOlives: 670,
  goldenCorn: 340,
  capsicum: 450,
  periPeriChicken: 340,
  barbeque: 560,
  sausage: 230,
  chickenTikka: 760,
  grilledChickenRasher: 230,
};

const crustPrices = {
  classicHandTossed: 340,
  cheeseBurst: 230,
  wheatThinCrust: 430,
  freshPan: 340,
  newHandTossed: 430,
};

let totalCost, toppingsCost, cheeseCost, gstCost, grandCost;

const RN = (num) => {
  return Math.round(num * 100) / 100;
};
const toggleClass = (item, c) => {
  item.classList.contains(c)
    ? item.classList.remove(c)
    : item.classList.add(c);
};
const camelize = (str) => {
  return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, "");
};

// TOPPING SELECTION (AS MANY AS YOU WANT)
toppingDivs.forEach((div) =>
  div.addEventListener("click", (e) => {
    let target = e.target;

    if (!(target.classList.contains("topping"))) {
      target = target.parentNode;
    }

    toggleClass(target, "on-the-pizza");
    let toppingName = target.querySelector("span").innerText;

    if (target.classList.contains("on-the-pizza")) {
      selectedToppings.push(toppingName);
    } else {
      selectedToppings.splice(selectedToppings.indexOf(toppingName), 1);
    }
    updateBill();
  })
);

// CRUST SELECTION (ONE AT ONCE)
let selectedCrust = "CLASSIC HAND TOSSED"; // default
crustDivs.forEach((div) => {
  div.addEventListener("click", (e) => {
    document.querySelector(".selected-crust").classList.remove(
      "selected-crust",
    );
    e.target.classList.add("selected-crust");
    selectedCrust = e.target.innerText;
    updateBill();
  });
});

// UPDATING BILL
const updateBill = () => {
  let s = Number(pizzaSize.options[pizzaSize.selectedIndex].value);
  let n = Number(quantity.options[quantity.selectedIndex].value);

  // CRUST BILL
  totalCost = crustPrices[camelize(selectedCrust)] * n;
  totalCostBox.innerText = "KES " + totalCost;
  // TOPPINGS BILL
  let toppingsCost = 0;
  selectedToppings.forEach((item) => {
    toppingsCost += toppingPrices[camelize(item)];
  });
  toppingsCost *= n;
  toppingsCostBox.innerText = "KES " + toppingsCost;
  // CHEESE
  cheeseCost = document.getElementById("extra-cheese").checked ? 36 * s * n : 0;
  cheeseCostBox.innerText = "KES " + cheeseCost;
  // GST
  gstCost = Math.trunc(RN(0.05 * (cheeseCost + toppingsCost + totalCost)));
  gstCostBox.innerText = "KES " + gstCost;
  // Delivery
  deliveryCost = document.getElementById("deliveryCost").checked ? 100 * s * n : 0;;
  deliveryBox.innerText = "KES " + deliveryCost;
  // GRAND COST
  if (s === 1) {
    grandCost = ((gstCost + cheeseCost + toppingsCost + totalCost + deliveryCost) * 1);
  } else if (s === 2) {
    grandCost = ((gstCost + cheeseCost + toppingsCost + totalCost + deliveryCost) * 2);
  } else {
    grandCost = ((gstCost + cheeseCost + toppingsCost + totalCost + deliveryCost) * 3);
  }
  grandCostBox.innerText = "KES " + Math.trunc(grandCost);
};

const buyNow = () => {
  event.preventDefault();  //to stop the form submitting	
  let s = Number(pizzaSize.options[pizzaSize.selectedIndex].value);
  let n = Number(quantity.options[quantity.selectedIndex].value);

  if (document.getElementById("deliveryCost").checked) {
    deliveryStatus = 'Yes'
  }
  else {
    deliveryStatus = 'No'
  }

  let receiptData = {
    receiptID: Date.now(),
    Pizza_size: pizzaSize.value,
    Number_of_Pizza: n,
    Grand_Total: grandCost,
    Delivery: deliveryStatus
  }
  // Database
  let database = []
  database.push(receiptData)

  console.log('Receipt: ', { receiptData })

  //saving to localStorage
  localStorage.setItem('Receipt', JSON.stringify(receiptData, '\t', 2));

  const downloadFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  };

  downloadFile(window.localStorage.getItem('Receipt'), `myReceipt-${receiptData.receiptID}.txt`, 'text/plain');

  if (document.getElementById("deliveryCost").checked) {
    alert('You will be contacted about shortly for you to confirm your delivery details')
  }
  else {
    alert('Your order is ready!...')
  }
}