import { useState, useEffect } from 'react';
import { db, auth } from '../utility/firebase'; // Import auth from firebase
import './index.css';
import {
	collection,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';

const Balance = () => {
	const [balance, setBalance] = useState(0);

	const setupListener = () => {
		if (!auth.currentUser?.uid) {
			return () => {
				console.log('no user');
			};
		}

		const unsubscribe = onSnapshot(
			query(
				collection(db, 'users'),
				where('id', '==', auth.currentUser.uid)
			),
			(snapshot) => {
				const userDoc = snapshot.docs[0];
				const balance = userDoc.data().balance;
				setBalance(balance);
			}
		);

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
			<h3>Balance: {balance}</h3>
		</div>
	);
};

export default Balance;
