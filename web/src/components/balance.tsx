import { useState, useEffect } from 'react';
import { db, auth } from '../utility/firebase'; // Import auth from firebase
import './index.css';
import {
	collection,
	getDocs,
	query,
	where,
} from 'firebase/firestore';

const Balance = () => {
	const [balance, setBalance] = useState(0);

	useEffect(() => {
		const getBalance = async () => {
			if (!auth.currentUser) {
				console.log('no user');
				return;
			}
			const userDocRef = query(
				collection(db, 'users'),
				where('id', '==', auth.currentUser.uid)
			);
			const userDocQuery = await getDocs(userDocRef);
			const user = userDocQuery.docs.find(
				(doc) => doc.id === auth.currentUser?.uid
			);

			console.log('user', user?.data().balance);
			if (user) {
				setBalance(user?.data().balance);
			}
		};

		getBalance();
	}, [auth.currentUser?.uid]); // Only re-run the query when the currently authenticated user's ID changes

	return (
		<div>
			<h3>Balance: {balance}</h3>
		</div>
	);
};

export default Balance;
