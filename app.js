// Storage Controller
const StorageCtrl = (function(){

    // Public methods
    return {
        storeItem: function(item) {
            console.log(item)
            let items;
            // Check if any items in local storage
            if(localStorage.getItem('items') === null) {
                items = [];
                // Push new item
                items.push(item);
                // Set localstorage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get what is already in localstorage
                items = JSON.parse(localStorage.getItem('items'))

                // Push new item
                items.push(item);
                // Reset localstorage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemsStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, amount){
        this.id = id;
        this.time = new Date().toLocaleString();
        this.name = name;
        this.amount = amount;
    }
    // Data Struction - State
    const data = {
        // items: [
        //     // { id:0, name: 'Steak Dinner', amount: 1200 },
        //     // { id:1, name: 'Cookie', amount: 400 },
        //     // { id:2, name: 'Eggs', amount: 200 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalamount: 0
    }

    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, amount) {
            let ID;
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // amount to number
            amount = parseInt(amount);

            // Create new Item
            newItem = new Item(ID, name, amount);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            // Loop through items
            data.items.forEach(item => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updatedItem: function(name, amount) {
            // amount to number
            amount = parseInt(amount);
            let found = null;

            data.items.forEach(item => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.amount = amount;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id) {
            const ids = data.items.map(item => {
                return item.id
            });
            // Get index
            const index = ids.indexOf(id);

            // Remove item
            const isTrue = confirm('Are you sure to clear all?');
            if(isTrue) {
                data.items.splice(index, 1);
            }
        },
        clearAllItems:function(){
            const isTrue = confirm('Are you sure to clear all?');
            if(isTrue) {
                data.items = [];
            } else {
                window.location.reload();
            }
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalAmount: function() {
            let total = 0;

            // Loop through items and add cals
            data.items.forEach((item) => {
                total += item.amount;
            });

            // Set total amount in data structure
            data.totalamount = total;

            // Return total
            return data.totalamount;
        },
        logData: function () {
            return data
        }
    }
})();


// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemAmountInput: '#item-amount',
        totalAmount: '.total-amount',
        time: '.time'
    }
    // Public methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.amount} amount</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item far fa-edit"></i>
                </a>
                <br>
                <small class="time"><em>${item.time}</em></small>
            </li>`;
            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                amount: document.querySelector(UISelectors.itemAmountInput).value,
            }
        },
        addListItem: function(item){
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.amount} amount</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item far fa-edit"></i>
                </a>
                <br>
                <small class="time"><em>${item.time}</em></small>
                `;
                // Insert item
                document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn node list into array

            listItems = Array.from(listItems);
            listItems.forEach(listItem => {
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.amount} amount</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item far fa-edit"></i>
                    </a>`;
                }
            })
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemAmountInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemAmountInput).value = ItemCtrl.getCurrentItem().amount;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into arry
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                listItem.remove();
            })
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalAmount: function(totalAmount){
            document.querySelector(UISelectors.totalAmount).textContent = totalAmount;
        },
        clearEditState: function() {
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            this.clearInput();
        },
        showEditState: function() {
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();


// App Controller

const App = (function(ItemCtrl,StorageCtrl, UICtrl) {
    // Load event listeners

    const loadEventListeners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', (e)=> {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });


        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Delete item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item submit
    const itemAddSubmit = (e) => {
        e.preventDefault();
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and amount input
        if(input.name !== '' && input.amount !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.amount);
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total amount
            const totalAmount = ItemCtrl.getTotalAmount();

            // Add total amount to UI
            UICtrl.showTotalAmount(totalAmount)

            // Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear input
            UICtrl.clearInput();
        }
    }

    // Edit item click
    const itemEditClick = function(e) {
        e.preventDefault();
        if(e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArray = listId.split('-');

            // Get the actual id
            const id = parseInt(listIdArray[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }
    }

    // Update item submit

    const itemUpdateSubmit = function(e) {
        e.preventDefault();
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updatedItem(input.name, input.amount);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total amount
        const totalAmount = ItemCtrl.getTotalAmount();

        // Add total amount to UI
        UICtrl.showTotalAmount(totalAmount);

        // Update localstorage
        StorageCtrl.updateItemsStorage(updatedItem);

        UICtrl.clearEditState();
    }

    const itemDeleteSubmit = function(e) {
        e.preventDefault();
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total amount
        const totalAmount = ItemCtrl.getTotalAmount();

        // Add total amount to UI
        UICtrl.showTotalAmount(totalAmount);

        // Delete from localsorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
    }

    // Clear items event
    const clearAllItemsClick = function(e) {
        e.preventDefault();
        // Delete all items from data structure

        ItemCtrl.clearAllItems();

        // Remove from UI
        UICtrl.removeItems();

        // Clear from localstorage
        StorageCtrl.clearItemsFromStorage();

        // Get total amount
        const totalAmount = ItemCtrl.getTotalAmount();

        // Add total amount to UI
        UICtrl.showTotalAmount(totalAmount);

        // Hide UL
        UICtrl.hideList();
    }

    // Public methods
    return {
        init: function() {
            // Clear edit state / set initial state
            UICtrl.clearEditState();

            // Fetch items from data strucure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items)
            }

            // Get total amount
            const totalAmount = ItemCtrl.getTotalAmount();

            // Add total amount to UI
            UICtrl.showTotalAmount(totalAmount)

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


// Initialize App
App.init();