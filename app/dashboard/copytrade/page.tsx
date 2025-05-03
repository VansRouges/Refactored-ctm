import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CopytradePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Cards */}
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <BackgroundCard key={i} index={i} />
          ))}
        </div>
      </div>

      {/* Blur Overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-xl bg-background/50" />

      {/* Coming Soon Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold tracking-tight">Coming Soon</CardTitle>
            <CardDescription className="text-lg">We&#39;re working on something exciting. Stay tuned!</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {/* <p className="text-muted-foreground">Our new platform is under development and will be launching soon.</p> */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex h-1 w-16 rounded-full bg-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BackgroundCard({ index }: { index: number }) {
  // Different heights for visual interest
  const heights = ["h-48", "h-64", "h-56", "h-72"]
  const height = heights[index % heights.length]

  // Different colors for visual interest even when blurred
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-teal-200",
  ]
  const color = colors[index % colors.length]

  return (
    <Card className={`${height} ${color} transform transition-transform hover:scale-105`}>
      <CardHeader>
        <CardTitle className="text-lg">Card {index + 1}</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This content will be blurred in the background.</p>
      </CardContent>
    </Card>
  )
}
