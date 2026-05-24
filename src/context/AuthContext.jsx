import { useEffect , useState } from "react"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "../firebase/firebaseConfig"

import { AuthContext } from "./authContextValue"

import {
    ensureUserData ,
    handleRedirectLogin
} from "../firebase/authService"

export function AuthProvider({ children }) {
    const [user , setUser] = useState(null)
    const [authLoading , setAuthLoading] = useState(true)

    useEffect(() => {
        async function initAuth() {
            try {
                await handleRedirectLogin()
            } catch (error) {
                console.error(error)
            }

            const unsubscribe = onAuthStateChanged(
                auth ,
                async (currentUser) => {
                    if (currentUser) {
                        await ensureUserData(currentUser)
                    }

                    setUser(currentUser)
                    setAuthLoading(false)
                }
            )

            return unsubscribe
        }

        initAuth()
    } , [])

    return (
        <AuthContext.Provider
            value={{
                user ,
                authLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}