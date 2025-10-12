const inventoryModule = (() => {
  let inventory = [];
  const TAX_RATE = 0.1;

  const calculateTotalPrice = () => {
    const subTotal = inventory.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const tax = subTotal * TAX_RATE;
    return tax + subTotal;
  };

  return {
    addToInventory: (item) => {
      inventory.push(item);
    },
    removeFromInventory: (itemId) => {
      inventory = inventory.filter((item) => item.id !== itemId);
    },
    getInventoryItems: () => inventory,
    getTotalPrice: () => calculateTotalPrice(),
  };
})();

export default inventoryModule;
