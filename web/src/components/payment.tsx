import { useEffect, useState } from 'react';
import './index.css';
import dropin from 'braintree-web-drop-in';
import { functions } from '../utility/firebase';
import { httpsCallable } from 'firebase/functions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BraintreeDropIn(props: any) {
	const { show } = props;

	const [balance, setBalance] = useState(0);

	const [braintreeInstance, setBraintreeInstance] =
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		useState<any>(undefined);

	useEffect(() => {
		if (show) {
			const initializeBraintree = () =>
				dropin.create(
					{
						// insert your tokenization key or client token here
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
						else setBraintreeInstance(instance);
					}
				);

			if (braintreeInstance) {
				braintreeInstance.teardown().then(() => {
					initializeBraintree();
				});
			} else {
				initializeBraintree();
			}
		}
	}, [show, balance]);

	return (
		<div style={{ display: `${show ? 'block' : 'none'}` }}>
			<h2>Add Balance</h2>
			<input
				type="number"
				onChange={(e) => {
					setBalance(Number(e.target.value));
				}}
			/>
			<div id={'braintree-drop-in-div'} />
			<button
				className={'braintreePayButton'}
				disabled={!braintreeInstance}
				onClick={() => {
					if (braintreeInstance) {
						braintreeInstance.requestPaymentMethod(
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							(error: string, payload: any) => {
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
									}).then((result) => {
										console.log(result);
									});
								}
							}
						);
					}
				}}
			>
				{'Pay'}
			</button>
		</div>
	);
}
