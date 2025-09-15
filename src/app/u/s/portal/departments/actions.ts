
'use server'

import { revalidatePath } from 'next/cache';
import { readDb, writeDb } from '@/lib/database';
import type { Department } from '@/lib/types';

export async function getDepartments(): Promise<Department[]> {
  const db = await readDb();
  return db.departments;
}

export async function createDepartment(formData: FormData) {
  const db = await readDb();
  
  const newDepartment: Department = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    head: {
      name: formData.get("headName") as string,
      email: formData.get("headEmail") as string,
    }
  };

  if (!newDepartment.id || !newDepartment.name || !newDepartment.head.name || !newDepartment.head.email) {
      throw new Error("Missing required fields.");
  }

  // check for duplicate ID
  if (db.departments.some(d => d.id === newDepartment.id)) {
      throw new Error("Department ID already exists.");
  }

  db.departments.push(newDepartment);
  await writeDb(db);

  revalidatePath('/u/s/portal/departments');
}

export async function updateDepartment(departmentId: string, formData: FormData) {
  const db = await readDb();
  const departmentIndex = db.departments.findIndex(d => d.id === departmentId);

  if (departmentIndex === -1) {
    throw new Error("Department not found.");
  }
  
  const updatedDepartment: Department = {
      ...db.departments[departmentIndex],
      name: formData.get("name") as string,
      head: {
        name: formData.get("headName") as string,
        email: formData.get("headEmail") as string,
      }
  };

  db.departments[departmentIndex] = updatedDepartment;
  await writeDb(db);
  
  revalidatePath('/u/s/portal/departments');
}

export async function deleteDepartment(departmentId: string) {
  const db = await readDb();
  const updatedDepartments = db.departments.filter(d => d.id !== departmentId);
  
  if (db.departments.length === updatedDepartments.length) {
      throw new Error("Department not found to delete.");
  }

  db.departments = updatedDepartments;
  await writeDb(db);

  revalidatePath('/u/s/portal/departments');
}
