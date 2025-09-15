
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from '@mui/icons-material/Google';
import { useState, useEffect } from 'react';
import { Combobox } from '@/components/ui/combobox';

type College = {
    university: string;
    college: string;
    college_type: string;
    state: string;
    district: string;
};

export default function SignupPage() {
  const [collegeValue, setCollegeValue] = useState("");
  const [colleges, setColleges] = useState<{ value: string; label: string }[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  
  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/master/colleges.json');
        const data: College[] = await response.json();
        const formattedColleges = data.map(c => ({
            value: c.college.toLowerCase(),
            label: c.college,
        }));
        setColleges(formattedColleges);
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
        // Handle error, maybe show a toast
      } finally {
        setLoadingColleges(false);
      }
    }
    fetchColleges();
  }, []);

  const handleGoogleSignup = () => {
    // Placeholder for Google Sign-up logic
    alert("Redirecting to Google for sign-up...");
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
              Enter your information to join the symposium community.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="college">College</Label>
              <Combobox 
                  items={colleges}
                  value={collegeValue}
                  onChange={setCollegeValue}
                  placeholder={loadingColleges ? "Loading colleges..." : "Select college..."}
                  searchPlaceholder="Search colleges..."
                  noResultsMessage="No college found."
                  disabled={loadingColleges}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">Create account</Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
