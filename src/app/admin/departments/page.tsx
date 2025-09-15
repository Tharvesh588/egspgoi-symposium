
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { departments as initialDepartments } from "@/lib/data";
import type { Department, LoggedInUser } from "@/lib/types";

export default function AdminDepartmentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isNewDepartmentDialogOpen, setIsNewDepartmentDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
        const parsedUser = JSON.parse(userData) as LoggedInUser;
        if (parsedUser.role !== 'superadmin') {
            router.push('/portal/dashboard');
        } else {
            setUser(parsedUser);
        }
    } else {
        router.push('/auth/login');
    }
  }, [router]);

  const handleCreateDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDepartment: Department = {
      id: `dept-${Date.now()}`,
      name: formData.get("name") as string,
      head: {
        name: formData.get("headName") as string,
        email: formData.get("headEmail") as string,
      }
    };
    setDepartments([...departments, newDepartment]);
    setIsNewDepartmentDialogOpen(false);
  };
  
  const handleUpdateDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDepartment) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedDepartment: Department = {
      ...editingDepartment,
      name: formData.get("name") as string,
      head: {
        name: formData.get("headName") as string,
        email: formData.get("headEmail") as string,
      }
    };
    setDepartments(departments.map(d => d.id === updatedDepartment.id ? updatedDepartment : d));
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartments(departments.filter(d => d.id !== departmentId));
  };

  if (user?.role !== 'superadmin') {
    return null; // or a loading spinner while redirecting
  }


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Departments
          </h2>
          <p className="text-muted-foreground">
            Manage your college's departments and their heads.
          </p>
        </div>
         <Dialog open={isNewDepartmentDialogOpen} onOpenChange={setIsNewDepartmentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>
                Fill in the details for the new department.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDepartment}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Department Name
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="headName" className="text-right">
                    Head's Name
                  </Label>
                  <Input id="headName" name="headName" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="headEmail" className="text-right">
                    Head's Email
                  </Label>
                  <Input id="headEmail" name="headEmail" type="email" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Department Head</TableHead>
                <TableHead>Head's Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary">{dept.name}</Badge>
                  </TableCell>
                  <TableCell>{dept.head?.name || "N/A"}</TableCell>
                  <TableCell className="text-muted-foreground">{dept.head?.email || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => setEditingDepartment(dept)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                           </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                 <Trash className="mr-2 h-4 w-4" />
                                 <span>Delete</span>
                               </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the 
                                  <span className="font-semibold"> {dept.name} </span> 
                                  department and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteDepartment(dept.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit Department Dialog */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the details for the department.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateDepartment}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Department Name
                  </Label>
                  <Input id="edit-name" name="name" className="col-span-3" defaultValue={editingDepartment?.name} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-headName" className="text-right">
                    Head's Name
                  </Label>
                  <Input id="edit-headName" name="headName" className="col-span-3" defaultValue={editingDepartment?.head?.name} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-headEmail" className="text-right">
                    Head's Email
                  </Label>
                  <Input id="edit-headEmail" name="headEmail" type="email" className="col-span-3" defaultValue={editingDepartment?.head?.email} required />
                </div>
              </div>
              <DialogFooter>
                 <Button variant="outline" onClick={() => setEditingDepartment(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </>
  );
}

    