
'use server';

import { revalidatePath } from 'next/cache';
import { readDb, writeDb } from '@/lib/database';
import type { Department } from '@/lib/types';

export async function createDepartment(formData: FormData) {
  const db = await readDb();
  const newDepartment: Department = {
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    head: {
      name: formData.get('headName') as string,
      email: formData.get('headEmail') as string,
    },
  };

  if (db.departments.some((d) => d.id === newDepartment.id)) {
    return { success: false, message: 'Department ID already exists.' };
  }

  db.departments.push(newDepartment);
  await writeDb(db);
  revalidatePath('/admin/departments');
  return { success: true, message: 'Department created successfully.' };
}

export async function updateDepartment(formData: FormData) {
  const db = await readDb();
  const departmentId = formData.get('id') as string;
  const department = db.departments.find((d) => d.id === departmentId);

  if (!department) {
    return { success: false, message: 'Department not found.' };
  }

  department.name = formData.get('name') as string;
  department.head = {
    name: formData.get('headName') as string,
    email: formData.get('headEmail') as string,
  };

  await writeDb(db);
  revalidatePath('/admin/departments');
  return { success: true, message: 'Department updated successfully.' };
}

export async function deleteDepartment(formData: FormData) {
  const db = await readDb();
  const departmentId = formData.get('id') as string;
  db.departments = db.departments.filter((d) => d.id !== departmentId);
  await writeDb(db);
  revalidatePath('/admin/departments');
  return { success: true, message: 'Department deleted successfully.' };
}
