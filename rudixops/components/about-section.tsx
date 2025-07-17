import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutSection() {
  return (
    <Card className="w-full h-full frosted-glass text-white border-none shadow-lg bg-black/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">About This IDE</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-lg">
        <p>
          This is a minimalist IDE-like editor, inspired by the clean aesthetics of Neovim and the sleek design of
          macOS. It's built with Next.js, React, and Tailwind CSS, leveraging shadcn/ui components for a modern look and
          feel.
        </p>
        <p>
          The goal was to create a visually appealing and functional code editing environment that highlights key
          features like line numbering, a dark frosted glass theme, and a framework sidebar for easy navigation.
        </p>
        <p>Feel free to explore the code, modify it, and make it your own!</p>
        <div className="text-sm text-gray-300">
          <p>Version: 1.0.0</p>
          <p>Built by v0.dev</p>
        </div>
      </CardContent>
    </Card>
  )
}
