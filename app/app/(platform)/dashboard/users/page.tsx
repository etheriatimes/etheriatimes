"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Mail,
  Shield,
  User as UserIcon,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminUsersApi } from "@/lib/api";
import type { User as UserType } from "@/lib/api/types";

interface UserDisplay {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "editor" | "author" | "subscriber";
  status: "active" | "inactive" | "pending";
  articlesCount: number;
  joinedAt: string;
}

const mockUsers: UserDisplay[] = [
  {
    id: "1",
    name: "Marie Dupont",
    email: "marie.dupont@etheria.com",
    avatar: "",
    role: "admin",
    status: "active",
    articlesCount: 45,
    joinedAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Thomas Martin",
    email: "thomas.martin@etheria.com",
    avatar: "",
    role: "editor",
    status: "active",
    articlesCount: 32,
    joinedAt: "2025-02-20",
  },
  {
    id: "3",
    name: "Sophie Laurent",
    email: "sophie.laurent@etheria.com",
    avatar: "",
    role: "editor",
    status: "active",
    articlesCount: 28,
    joinedAt: "2025-03-10",
  },
  {
    id: "4",
    name: "Pierre Moreau",
    email: "pierre.moreau@etheria.com",
    avatar: "",
    role: "author",
    status: "active",
    articlesCount: 15,
    joinedAt: "2025-04-05",
  },
  {
    id: "5",
    name: "Julie Bernard",
    email: "julie.bernard@etheria.com",
    avatar: "",
    role: "author",
    status: "active",
    articlesCount: 12,
    joinedAt: "2025-05-12",
  },
  {
    id: "6",
    name: "Marc Leroy",
    email: "marc.leroy@etheria.com",
    avatar: "",
    role: "author",
    status: "inactive",
    articlesCount: 8,
    joinedAt: "2025-06-18",
  },
  {
    id: "7",
    name: "Jean Dupont",
    email: "jean.dupont@etheria.com",
    avatar: "",
    role: "subscriber",
    status: "active",
    articlesCount: 0,
    joinedAt: "2025-07-22",
  },
  {
    id: "8",
    name: "Claire Martin",
    email: "claire.martin@etheria.com",
    avatar: "",
    role: "subscriber",
    status: "pending",
    articlesCount: 0,
    joinedAt: "2026-03-01",
  },
];

const roleConfig = {
  admin: { label: "Administrateur", variant: "destructive" as const },
  editor: { label: "Rédacteur", variant: "default" as const },
  author: { label: "Auteur", variant: "secondary" as const },
  subscriber: { label: "Abonné", variant: "outline" as const },
};

const statusConfig = {
  active: { label: "Actif", color: "text-green-500" },
  inactive: { label: "Inactif", color: "text-gray-500" },
  pending: { label: "En attente", color: "text-yellow-500" },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDisplay | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "editor" | "author" | "subscriber">(
    "author"
  );
  const [newUserPassword, setNewUserPassword] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const response = await adminUsersApi.list({ pageSize: 50 });
      if (response.success && response.data) {
        const mapped: UserDisplay[] = response.data.map((u) => ({
          id: u.id,
          name: u.name || u.username || "Unknown",
          email: u.email,
          avatar: u.avatarUrl,
          role:
            (u.role?.toLowerCase() as "admin" | "editor" | "author" | "subscriber") || "subscriber",
          status: u.active ? "active" : "inactive",
          articlesCount: 0,
          joinedAt: u.createdAt || new Date().toISOString(),
        }));
        setUsers(mapped);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;
    try {
      await adminUsersApi.delete(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete.id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]));
  };

  const handleDelete = (user: UserDisplay) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setSelectedUsers((prev) => prev.filter((id) => id !== userToDelete.id));
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleCreate = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser: UserDisplay = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "active",
      articlesCount: 0,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newUser, ...prev]);
    setCreateDialogOpen(false);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("author");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
          <p className="text-sm text-muted-foreground">Gérez les utilisateurs de votre site</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-sm text-muted-foreground">
            {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? "s" : ""} sélectionné
            {selectedUsers.length > 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Envoyer un email
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="mr-2 h-4 w-4" />
              Changer le rôle
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Sélectionner tout"
                />
              </TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Articles</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <UserIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleSelectUser(user.id)}
                      aria-label={`Sélectionner ${user.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleConfig[user.role].variant}>
                      {roleConfig[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`flex items-center gap-1.5 ${statusConfig[user.status].color}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {statusConfig[user.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{user.articlesCount}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.joinedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer un email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {userToDelete?.name} ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvel utilisateur</DialogTitle>
            <DialogDescription>Créez un nouvel utilisateur pour votre site</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nom complet</Label>
              <Input
                id="userName"
                placeholder="Nom de l'utilisateur"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="email@exemple.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPassword">Mot de passe</Label>
              <Input
                id="userPassword"
                type="password"
                placeholder="Mot de passe"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole">Rôle</Label>
              <Select
                value={newUserRole}
                onValueChange={(v) => setNewUserRole(v as typeof newUserRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="editor">Rédacteur</SelectItem>
                  <SelectItem value="author">Auteur</SelectItem>
                  <SelectItem value="subscriber">Abonné</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!newUserName.trim() || !newUserEmail.trim()}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
