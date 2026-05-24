import { useEffect , useState } from "react"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "../firebase/firebaseConfig"
import { AuthContext } from "./authContextValue"
import { ensureUserData } from "../firebase/authService"

export function AuthProvider({ children }) {
    const [user , setUser] = useState(null)
    const [authLoading , setAuthLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , async (currentUser) => {
            if (currentUser) {
                await ensureUserData(currentUser)
            }

            setUser(currentUser)
            setAuthLoading(false)
        })

        return unsubscribe
    } , [])

    return (
        <AuthContext.Provider value={{ user , authLoading }}>
            {children}
        </AuthContext.Provider>
    )
}