// import { initializeApp } from "firebase/app";
// import { 
//   getFirestore, 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc, 
//   collection, 
//   query, 
//   orderBy, 
//   onSnapshot,
//   increment,
//   serverTimestamp
// } from "firebase/firestore";
// import { 
//   getAuth, 
//   signInAnonymously, 
//   signInWithCustomToken 
// } from "firebase/auth";


// const firebaseConfig = JSON.parse(
//   typeof __firebase_config !== "undefined"
//     ? __firebase_config
//     : '{}'
// );


// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);


// (async () => {
//   try {
//     if (typeof __initial_auth_token !== "undefined") {
//       await signInWithCustomToken(auth, __initial_auth_token);
//     } else {
//       await signInAnonymously(auth);
//     }
//   } catch (error) {
//     console.error("Firebase Auth Error:", error);
//   }
// })();


// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


// const leaderboardCollectionPath = `/artifacts/${appId}/public/data/leaderboard`;


// //  @param {string} playerName

// export const updateLeaderboard = async (playerName) => {
//   if (!playerName) return;


//   const playerDocRef = doc(db, leaderboardCollectionPath, playerName);

//   try {
//     const docSnap = await getDoc(playerDocRef);

//     if (docSnap.exists()) {
      
//       await updateDoc(playerDocRef, {
//         wins: increment(1),
//         lastGame: serverTimestamp()
//       });
//     } else {
      
//       await setDoc(playerDocRef, {
//         name: playerName,
//         wins: 1,
//         losses: 0, 
//         lastGame: serverTimestamp()
//       });
//     }
//     console.log(`Leaderboard updated for ${playerName}`);
//   } catch (error) {
//     console.error("Error updating leaderboard: ", error);
//   }
// };

// export { db, leaderboardCollectionPath };