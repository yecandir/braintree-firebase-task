import { useEffect, useState } from 'react';
import {
	DocumentData,
	collection,
	getDocs,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../utility/firebase'; // Import auth from firebase
import './index.css';

const Products = () => {
	const [products, setProducts] = useState<DocumentData>([]);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const productsRef = collection(db, 'products');
				const productsQuery = await getDocs(productsRef);
				const productsData = productsQuery.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setProducts(productsData);
			} catch (error) {
				console.error('Error fetching products:', error);
			}
		};
		getProducts();
	}, []);

	return (
		<div>
			<h1>Products</h1>
			<div className="products-container">
				{products.map((product: DocumentData) => (
					<div className="product" key={product.id}>
						<div>{product.name}</div>
						<div>{product.price}</div>
						<button
							onClick={async () => {
								try {
									const purchaseProduct = httpsCallable(
										functions,
										'purchaseProduct'
									);
									const result = await purchaseProduct({
										product_id: product.id,
									});

									const data = result?.data as {
										success: boolean;
										error: string;
									};

									if (data && data.success) {
										alert('Product purchased successfully');
									} else {
										alert(
											'Error: ' + data?.error || 'purchasing product'
										);
									}
								} catch (error) {
									console.error('Error purchasing product:', error);
								}
							}}
						>
							Buy
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default Products;
