import {
	DocumentData,
	collection,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, auth } from '../utility/firebase'; // Import auth from firebase
import './index.css';

const Transactions = () => {
	const [transactions, setTransactions] = useState<DocumentData>([]);

	useEffect(() => {
		const gettransactions = async () => {
			try {
				if (!auth.currentUser) {
					console.log('no user');
					return;
				}
				const transactionsRef = query(
					collection(db, 'transactions'),
					where('user_id', '==', auth.currentUser.uid)
				);
				const transactionsQuery = await getDocs(transactionsRef);
				const transactionsData = transactionsQuery.docs.map((doc) => {
					return { ...doc.data(), id: doc.id };
				});
				setTransactions(transactionsData);
			} catch (error) {
				console.error('Error fetching transactions:', error);
			}
		};
		gettransactions();
	}, []);

	return (
		<div>
			<h1>Transactions</h1>
			<div className="transactions-container">
				<div className="transaction-row">
					<div className="transaction">S/N</div>
					<div className="transaction">Product ID</div>
					<div className="transaction">Type</div>
					<div className="transaction">Amount</div>
					<div className="transaction">Status</div>
				</div>
				{transactions.map(
					(transaction: DocumentData, index: number) => (
						<div className="transaction-row" key={transaction.id}>
							<div className="transaction">{index + 1}</div>
							<div className="transaction">
								{transaction.product_id}
							</div>
							<div className="transaction">{transaction.type}</div>
							<div className="transaction">{transaction.amount}</div>
							<div className="transaction">{transaction.status}</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default Transactions;
