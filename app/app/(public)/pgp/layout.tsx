import { LocaleProvider } from "@/context/locale-context";
import { AuthProvider } from "@/context/AuthContext";

export default function PGPLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocaleProvider initialLocale="fr">{children}</LocaleProvider>
    </AuthProvider>
  );
}
