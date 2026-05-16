import { Mail } from "lucide-react";
import TeknisiProfile from "@/components/TeknisiProfile";
import AdminProfilePage from "../components/AdminProfilePage";

export default function ProfilePage() {
  const { user } = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="space-y-6 animate-fade-in max-w-screen">
      {/* Profile Header */}
      <div className="bg-card border rounded-xl overflow-hidden w-full">
        {/* bg */}
        <div className="h-24 bg-linear-to-r from-primary/80 to-primary/40" />

        <div className="md:px-5 md:pb-5 -mt-10 ">
          <div className="flex flex-col  gap-4 justify-center items-center md:justify-start md:items-start">
            {/* circle profil */}
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card shadow-md">
              {user?.name.charAt(0) ?? "U"}
            </div>
            {/* name & email */}
            <div className="md:flex-1 pt-2 flex flex-col justify-center items-center md:justify-start md:items-start">
              <h1 className="text-xl font-bold text-foreground">
                {user?.name ?? "username"}
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {user?.email ?? "email@example.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* data */}
      {user?.role === "admin" ? <AdminProfilePage /> : <TeknisiProfile />}
    </div>
  );
}
