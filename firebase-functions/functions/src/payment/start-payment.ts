import { https } from 'firebase-functions/v2';
import { BraintreeGateway, Environment } from 'braintree';
import { admin } from '../utils/admin-app';

const gateway = new BraintreeGateway({
	environment: Environment.Sandbox,
	merchantId: 'vqz2fphk6ggkwksd',
	publicKey: 'qyjtt6j87s5z8cn3',
	privateKey: 'fa59e3f11d6f3f13045b1272ffba9a17',
});

const startPayment = https.onCall(
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
			return { error: 'Not authenticated' };
		}
		const result = await gateway.transaction.sale({
			customerId: request.auth.uid,
			amount: request.data.amount,
			paymentMethodNonce: request.data.paymentMethodNonce,
			options: {
				submitForSettlement: true,
			},
		});

		if (result.success) {
			await admin
				.firestore()
				.collection('users')
				.doc(request.auth.uid)
				.update({
					balance: admin.firestore.FieldValue.increment(
						request.data.amount
					),
				});

			await admin
				.firestore()
				.collection('transactions')
				.doc(result.transaction.id)
				.set({
					id: result.transaction.id,
					user_id: request.auth.uid,
					type: 'pay_in',
					amount: request.data.amount,
					timestamp: admin.firestore.FieldValue.serverTimestamp(),
					status: 'completed',
				});
		}

		return result;
	}
);

export { startPayment };
