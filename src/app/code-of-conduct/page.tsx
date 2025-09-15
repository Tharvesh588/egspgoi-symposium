
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CodeOfConductPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Code of Conduct</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the Code of Conduct page. The rules and regulations for the symposium will be detailed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
