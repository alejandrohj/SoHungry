function updateSubtotal(dish) {
    const price = Number(dish.querySelector('.price').innerText);
    const units = Number (dish.querySelector('.quantity').value);
    let subtotal = dish.querySelector('.subtotal span')
    subtotal.innerText = price*units;
  }
  
  function calculateAll() {
    console.log('function activated')
    let dishList = document.querySelectorAll('.dish')
    dishList.forEach(dish=> {updateSubtotal(dish)})
    const finalPrice = document.querySelector('#order-total span')
    let subtotals= document.querySelectorAll('.subtotal span')
    let total=0;
    subtotals.forEach(subtotal=>{total+=Number(subtotal.innerText)})
    finalPrice.innerText = total;
  }

if (document.addEventListener) {
    document.addEventListener("click", handleClick, false);
}
else if (document.attachEvent) {
    document.attachEvent("onclick", handleClick);
}

function handleClick(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;

    // Climb up the document tree from the target of the event
    while (element) {
        if (element.nodeName === "INPUT" && /update/.test(element.className)) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            // with a class name called "foo"
            calculateAll(element);
            break;
        }

        element = element.parentNode;
    }
}