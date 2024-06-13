import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import { Breadcrum } from '../Components/Breadcrum/Breadcrum';
import { ProductDisplay } from '../Components/ProductDisplay/ProductDisplay';
import { DiscriptionBox } from '../Components/DiscriptionBox/DiscriptionBox';
import { RelatedProducts } from '../Components/RelatedProducts/RelatedProducts';

export const Product = () => {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  const product = allProducts.find((e) => e.id === Number(productId)); // corrected condition

  return (
    <div>
      <Breadcrum product={product} />
      {product && <ProductDisplay product={product} />} {/* Render ProductDisplay only if product is defined */}
      <DiscriptionBox/>
      <RelatedProducts/>
    </div>
  );
};
