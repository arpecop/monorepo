export function BottomBar() {
  return (
    <div className="flex items-center justify-between h-8 px-4 text-xs text-gray-400 border-t border-white/10 bg-black/20">
      <div>
        <span>Ln 1, Col 1</span>
      </div>
      <div className="flex space-x-4">
        <span>UTF-8</span>
        <span>CRLF</span>
        <span>TypeScript React</span>
      </div>
    </div>
  )
}
