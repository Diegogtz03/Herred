import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <Image
          src="/herred_logo.png"
          alt="Herred Logo"
          width={60}
          height={60}
        />
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/herred_text_logo.svg"
            alt="Herred"
            width={120}
            height={35}
          />
        </div>
      </div>
      <div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Image
            src="/icons/bell.svg"
            alt="Notifications"
            width={24}
            height={24}
          />
        </button>
      </div>
    </header>
  );
}
