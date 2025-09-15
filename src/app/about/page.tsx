
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">About Symposium Central</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the about page. Content will be added here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
