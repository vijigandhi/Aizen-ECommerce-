// src/adminMenu.js
export const adminMenu = [
    {
      title: 'Store Management',
      key: 'storeManagement',
      subItems: [
        { title: 'Add Store', key: 'addStore' },
        { title: 'Store Inventory', key: 'storeInventory' },
        { title: 'Manage Store', key: 'manageStore' }
      ]
    },
    {
      title: 'Product Management',
      key: 'productManagement',
      subItems: [
        { title: 'Add Category', key: 'addCategory' },
        { title: 'Add Sub Category', key: 'addSubCategory' }
        
      ]
    },
    {
      title: 'User Management',
      key: 'userManagement',
      subItems: [
        { title: 'Seller Request', key: 'sellerRequest' },
        { title: 'Manage Users', key: 'manageUsers' },
     
      ]
    },
    {
      title: 'Others', 
      key: 'others',
      subItems:[
        { title:'Add City', key:'addCity'},
        { title:'Add State',key:'addState'},
        { title:'Add Country',key:'addCountry'}
      ]
    }
  ];
  