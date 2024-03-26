import {
	DocumentData,
	collection,
	onSnapshot,
	query,
	where,
	orderBy,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, auth } from '../utility/firebase'; // Import auth from firebase
import './index.css';

const Transactions = () => {
	const [transactions, setTransactions] = useState<DocumentData>([]);

	const setupListener = () => {
		if (!auth.currentUser?.uid) {
			return () => {
				console.log('no user');
			};
		}

		const unsubscribe = onSnapshot(
			query(
				collection(db, 'transactions'),
				where('user_id', '==', auth.currentUser.uid),
				orderBy('created_at', 'desc')
			),
			(snapshot) => {
				const transactionsData = snapshot.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});

				setTransactions(transactionsData);
			}
		);

		// Unsubscribe from the listener when your component is unmounted
		return () => {
			unsubscribe();
		};
	};

	useEffect(() => {
		const cleanup = setupListener();
		return () => {
			cleanup();
		};
	}, []);

	return (
		<div>
			<h1>Transactions</h1>
			<div className="transactions-container">
				<div className="transaction-row">
					<div className="transaction">S/N</div>
					<div className="transaction">Date</div>
					<div className="transaction">Type</div>
					<div className="transaction">Amount</div>
					<div className="transaction">Product ID</div>
					<div className="transaction">Status</div>
				</div>
				{transactions.map(
					(transaction: DocumentData, index: number) => (
						<div className="transaction-row" key={transaction.id}>
							<div className="transaction">{index + 1}</div>
							<div className="transaction">
								{transaction.created_at?.toDate().toLocaleString()}
							</div>
							<div className="transaction">{transaction.type}</div>
							<div className="transaction">{transaction.amount}</div>
							<div className="transaction">
								{transaction.product_id}
							</div>
							<div className="transaction">{transaction.status}</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default Transactions;
