// SyncUser.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function SyncUser() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;

        const syncUser = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://belencita-deployment.onrender.com';
                const res = await fetch(`${apiUrl}/api/sync-user`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        imageUrl: user.imageUrl || ""
                    })
                });

                if (!res.ok) {
                    console.error("Error sincronizando usuario:", await res.text());
                } else {
                    console.log("Usuario sincronizado correctamente ✅");
                }
            } catch (error) {
                console.error("Error al conectar con el backend:", error);
            }
        };

        syncUser();
    }, [user, isLoaded]);

    return null; // No renderiza nada
}