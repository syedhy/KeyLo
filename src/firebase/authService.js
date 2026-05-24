import { GoogleAuthProvider , signInWithPopup , signOut } from "firebase/auth"
import { doc , getDoc , setDoc } from "firebase/firestore"

import { auth , db } from "./firebaseConfig"

const defaultApps = [
    {
        id : "vscode" ,
        name : "VS Code" ,
        description : "Code editor shortcuts" ,
        shortcuts : [
            {
                title : "Command Palette" ,
                description : "Open VS Code command palette" ,
                keys : ["CmdLeft" , "ShiftLeft" , "P"]
            }
        ]
    }
]

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth , provider)

    await createUserIfNeeded(result.user)

    return result.user
}

export async function logoutUser() {
    await signOut(auth)
}

async function createUserIfNeeded(user) {
    const userRef = doc(db , "users" , user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
        return
    }

    await setDoc(userRef , {
        name : user.displayName ,
        email : user.email ,
        createdAt : new Date().toISOString()
    })

    const appRef = doc(db , "users" , user.uid , "apps" , "vscode")

    await setDoc(appRef , defaultApps[0])
}