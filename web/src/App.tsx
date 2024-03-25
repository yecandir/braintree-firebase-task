import {
	GoogleAuthProvider,
	User,
	signInWithRedirect,
	signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import './App.css';
import DropIn from './components/payment';
import { auth } from './utility/firebase';
import Balance from './components/balance';
import Products from './components/products';

function App() {
	const [user, setUser] = useState<User | null>(null);

	const handleSignIn = () => {
		const provider = new GoogleAuthProvider();
		signInWithRedirect(auth, provider);
	};

	const handleSignOut = () => {
		signOut(auth);
	};

	auth.onAuthStateChanged((user) => {
		setUser(user);
	});

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setUser(user);
		});
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				{user ? (
					<>
						<h1>Welcome {user?.displayName}</h1>
						<button onClick={handleSignOut}>Logout</button>

						<Balance />

						<DropIn show="true" />

						<Products />
					</>
				) : (
					<>
						<h1>Login</h1>
						<button onClick={handleSignIn}>Login with Google</button>
					</>
				)}
			</header>
		</div>
	);
}

export default App;
