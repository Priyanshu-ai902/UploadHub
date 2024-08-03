import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
    return <div className="border-b py-3 bg-gray-50">
        <div className="items-center container mx-auto justify-between flex">
            <div className=" font-bold flex justify-between items-center text-lg">
                <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYm134bCIqPIdxE0uUFIdhd_YyB1RzVJKqIw&s" alt="logo" width={40}
                    height={40} />
                Upload
                <span className="text-blue-500">Hub</span>
            </div>
            <div className=" flex gap-2">
                <OrganizationSwitcher />
                <UserButton />

                <SignedOut>
                    <SignInButton>
                        <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>

        </div>
    </div>
}
