import {useState} from "react";
import inventoryModule from "./inventory-module";

const App = () => {
  const [inventory, setInventory] = useState(
    inventoryModule.getInventoryItems()
  );
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);

  const handleAddToInventory = () => {
    const newItem = {
      id: Math.random().toString(36).substring(7),
      name: itemName,
      price: itemPrice,
      quantity: itemQuantity,
    };
    inventoryModule.addToInventory(newItem);
    setInventory(inventoryModule.getInventoryItems());
    setItemName("");
    setItemPrice(0);
    setItemQuantity(1);
  };

  const handleRemoveFromInventory = (itemId) => {
    inventoryModule.removeFromInventory(itemId);
    setInventory(inventoryModule.getInventoryItems());
  };

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} - Quantity: {item.quantity}
            <button onClick={() => handleRemoveFromInventory(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total Price: $ {inventoryModule.getTotalPrice().toFixed()}</h3>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Item Price"
        value={itemPrice}
        onChange={(e) => setItemPrice(parseFloat(e.target.value))}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleAddToInventory}>Add to Inventory</button>
    </div>
  );
};

export default App;
