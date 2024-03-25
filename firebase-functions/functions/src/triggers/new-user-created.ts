import * as functions from 'firebase-functions';
import { admin } from '../utils/admin-app';

// when new user is created, add them to firestore
const newUserToFirestore = functions.auth.user().onCreate((user) => {
	return admin.firestore().collection('users').doc(user.uid).set(
		{
			id: user.uid,
		},
		{ merge: true }
	);
});

export { newUserToFirestore };
