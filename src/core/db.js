import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey';

// eslint-disable-next-line import/no-mutable-exports
let db = null;
export default async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://js-exam-45082.firebaseio.com',
  });
  db = admin.firestore();
};

export { db };
