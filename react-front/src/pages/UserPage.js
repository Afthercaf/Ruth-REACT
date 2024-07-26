import React from 'react';
import UserPanel from '../components/UserPanel.jsx';
 // Import Orders component
import {ProductList} from './ProductList.jsx';  // Import ProductList component

const UserPage = () => {
  return (
    <div>
      <UserPanel />
      <ProductList />   {/* Add ProductList component */}
    </div>
  );
};

export default UserPage;
