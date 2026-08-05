import { logoutService } from "@/features/auth/service/auth.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Moon, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";

function UserDropdown() {
  const router = useRouter();
  const logout = async () => {
    try {
      await logoutService();
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-11 w-11 rounded-full p-0">
            <Avatar>
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-72 rounded-2xl border border-border bg-card p-2"
      >
        <div className="px-3 py-2">
          <p className="font-semibold">Martín Herrera</p>

          <p className="text-sm text-muted-foreground">martin@gmail.com</p>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User />
          Mi cuenta
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Settings />
          Configuración
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Moon />
          Tema
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-400" onClick={() => logout()}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
