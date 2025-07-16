import { Button } from "@/components/ui/button";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryName = params.category;
  console.log(categoryName);

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}

      {/* Featured Article */}

      {/* Articles Grid */}

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 pb-16">
        <Button variant="outline">Previous</Button>
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}
