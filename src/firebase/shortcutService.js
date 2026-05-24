import { collection , getDocs } from "firebase/firestore"

import { db } from "./firebaseConfig"

export async function getApps() {
    const snapshot = await getDocs(collection(db , "apps"))

    return snapshot.docs.map((doc) => ({
        id : doc.id ,
        ...doc.data() ,
        shortcuts : doc.data().shortcuts || []
    }))
}