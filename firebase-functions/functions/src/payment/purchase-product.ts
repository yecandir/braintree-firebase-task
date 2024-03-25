import { https } from 'firebase-functions/v2';
import { admin } from '../utils/admin-app';

const purchaseProduct = https.onCall(
	{
		cors: [
			'http://localhost:5173',
			'https://midas-task-8ed57.web.app',
			'/firebase.com$/', // for firebase emulator
			'https://us-central1-midas-task-8ed57.cloudfunctions.net/',
			'*',
			'deployed-url-here',
		],
	},
	async (request) => {
		if (!request.auth) {
			return { error: 'not_authenticated' };
		}

		const { product_id } = request.data;

		const product = await admin
			.firestore()
			.collection('products')
			.doc(product_id)
			.get();

		if (!product.exists) {
			return { error: 'product_not_found' };
		}

		const productData = product.data();

		if (!productData) {
			return { error: 'product_not_found' };
		}

		await admin.firestore().collection('transactions').doc().set({
			user_id: request.auth.uid,
			product_id,
			type: 'purchase',
			amount: productData.price,
			status: 'completed',
			created_at: admin.firestore.FieldValue.serverTimestamp(),
		});

		await admin
			.firestore()
			.collection('users')
			.doc(request.auth.uid)
			.update({
				balance: admin.firestore.FieldValue.increment(
					-productData.price
				),
			});

		return { success: true };
	}
);

export { purchaseProduct };
