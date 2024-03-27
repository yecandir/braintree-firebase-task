import { useEffect, useState } from 'react';
import './index.css';
import dropin from 'braintree-web-drop-in';
import { functions } from '../utility/firebase';
import { httpsCallable } from 'firebase/functions';

export default function BraintreeDropIn(props: { show: boolean }) {
	const { show } = props;
	const [balance, setBalance] = useState(0);
	const [braintreeInstance, setBraintreeInstance] =
		useState<dropin.Dropin | null>(null);

	const initializeBraintree = () =>
		dropin.create(
			{
				authorization: 'sandbox_s9h8hg2r_vqz2fphk6ggkwksd',
				container: '#braintree-drop-in-div',
				card: {
					overrides: {
						fields: {
							number: {
								placeholder: '4111 1111 1111 1111',
								prefill: '4111 1111 1111 1111',
							},
							cvv: {
								placeholder: '123',
								prefill: '123',
							},
							expirationDate: {
								placeholder: '10/25',
								prefill: '10/25',
							},
						},
					},
				},
			},
			function (error, instance) {
				if (error) console.error(error);
				if (!instance) console.error('No instance');
				else setBraintreeInstance(instance);
			}
		);

	useEffect(() => {
		if (show && !braintreeInstance) {
			initializeBraintree();
		}
	}, [show, braintreeInstance]);

	const handlePayment = () => {
		if (braintreeInstance) {
			braintreeInstance.requestPaymentMethod((error, payload) => {
				if (error) {
					console.error(error);
				} else {
					const paymentMethodNonce = payload.nonce;
					httpsCallable(
						functions,
						'startPayment'
					)({
						amount: balance,
						paymentMethodNonce,
					}).then(() => {
						braintreeInstance.clearSelectedPaymentMethod(); // Clear selected payment method
					});
				}
			});
		}
	};

	return (
		<div style={{ display: show ? 'block' : 'none' }}>
			<h2>Add Balance</h2>
			<input
				type="number"
				onChange={(e) => {
					setBalance(Number(e.target.value));
				}}
			/>
			<div id="braintree-drop-in-div" />
			<button
				className="braintreePayButton"
				disabled={!braintreeInstance}
				onClick={handlePayment}
			>
				Pay
			</button>
		</div>
	);
}
