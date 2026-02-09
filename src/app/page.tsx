import { UserInfo } from "@/components/user-info";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold">BGNEXT</h1>
        <p className="text-lg text-gray-600">BGNEXTサイトへようこそ</p>
        <UserInfo />
      </main>
    </div>
  );
}
