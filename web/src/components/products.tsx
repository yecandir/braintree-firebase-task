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
			{products.map((product: DocumentData) => {
				console.log(product);
				return (
					<div key={product.id}>
						<h3>{product.id}</h3>
						<h3>{product.name}</h3>
						<p>{product.price}</p>
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
									console.log(result.data);
								} catch (error) {
									console.error('Error purchasing product:', error);
								}
							}}
						>
							Buy
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default Products;
