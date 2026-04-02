import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

/**
 * Componente que sincroniza los datos del usuario con MongoDB
 * No renderiza nada en pantalla.
 */
export default function UserSync() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncAttempted = useRef(false);

  useEffect(() => {
    // Solo intentar sincronizar una vez por sesión del componente
    if (isLoaded && isSignedIn && user && !syncAttempted.current) {
      syncAttempted.current = true;
      
      const syncUser = async () => {
        try {
          // Tomar el email primario
          const email = user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : 'N/A';
          console.log('🔄 Intentando sincronizar usuario con el servidor...');

          const response = await fetch('http://localhost:3001/api/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: email,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            }),
          });

          const data = await response.json();
          if (data.success) {
            console.log('✅ Usuario sincronizado con MongoDB correctamente.');
          } else {
            console.error('❌ Error de sincronización:', data.error);
          }
        } catch (err) {
          console.error('❌ Error enviando datos al servidor:', err);
        }
      };

      syncUser();
    }
  }, [isLoaded, isSignedIn, user]);

  return null; // Este componente es invisible
}
