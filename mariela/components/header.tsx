import Link from "next/link";
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-xl text-white p-4 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-4xl font-light uppercase">Мариела Иванова</div>
        <div>
          <Link href="/#начало" className="mx-2 hover:text-gray-300">
            Начало
          </Link>
          <Link href="/#услуги" className="mx-2 hover:text-gray-300">
            Услуги
          </Link>
          <Link href="/#контакти" className="mx-2 hover:text-gray-300">
            Контакти
          </Link>
        </div>
      </nav>
    </header>
  );
}
