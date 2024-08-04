"use client"

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Divide, LoaderCircle } from "lucide-react";



export default function Home() {
  const organization = useOrganization();
  const user = useUser()

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }


  const files = useQuery(api.files.getFiles,
    orgId ? { orgId } : "skip");
  const isLoading = files === undefined


  return (
    <main className="container mx-auto pt-7">

      {isLoading && (
        <div className="flex flex-col gap-2 w-full items-center mt-24">
          <LoaderCircle className="h-24 w-24 animate-spin" />
          <div className="text-2xl">
            Loading your files...
          </div>
        </div>
      )}

      {!isLoading && files.length === 0 && (
        <div className="flex flex-col gap-2 w-full items-center">
          <Image src="https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-6219421-5102419.png" alt="image" width="300" height="300" />
          <div className="font-semibold">You have no files, upload one now</div>
          <UploadButton />
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Your Files</h1>
            <UploadButton />
          </div >

          <div className="grid grid-cols-4 gap-2 mt-3">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </>
      )}

    </main >
  );
}
