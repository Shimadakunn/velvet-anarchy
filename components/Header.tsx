import Image from "next/image";

export function Header() {
  return (
    <header className="w-full py-4 px-8 ">
      <div className="flex flex-col space-y-1 items-center relative">
        <Image src="/logo.svg" alt="Logo" width={60} height={60} className="" />
        <div className="text-5xl font-Dirty flex flex-col items-center space-y-[-12px]">
          <h1>VeLvEt</h1>
          <h1> AnaRCHy </h1>
        </div>
      </div>
    </header>
  );
}
