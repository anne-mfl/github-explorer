import Search from "components/Search"
import Image from "next/image"
import logo from "assets/logo.png"
import mark from "assets/mark.png"

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-20">
      <div className="mb-3 flex items-center">
        <Image
          src={mark}
          alt="GitHub Explorer Logo"
          width={40}
          height={40}
        />
        <Image
          src={logo}
          alt="GitHub Explorer Logo"
          width={140}
          height={140}
        />
        <p className="text-4xl font-medium">Explorer</p>
      </div>
      <Search />
    </main>
  );
}
