import {
    collection ,
    deleteDoc ,
    doc ,
    getDocs ,
    setDoc
} from "firebase/firestore"

import { db } from "./firebaseConfig"

export async function getUserApps(uid) {
    const snapshot = await getDocs(collection(db , "users" , uid , "apps"))

    return snapshot.docs.map((document) => ({
        id : document.id ,
        ...document.data() ,
        shortcuts : document.data().shortcuts || []
    }))
}

export async function saveUserApp(uid , app) {
    const appRef = doc(db , "users" , uid , "apps" , app.id)

    await setDoc(appRef , app)
}

export async function deleteUserApp(uid , appId) {
    const appRef = doc(db , "users" , uid , "apps" , appId)

    await deleteDoc(appRef)
}