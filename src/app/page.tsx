"use client"

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";



export default function Home() {
  const organization = useOrganization();
  const user = useUser()

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }


  const files = useQuery(api.files.getFiles,
    orgId ? { orgId } : "skip");


  return (
    <main className="container mx-auto pt-7">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Files</h1>
        <UploadButton />
      </div >

      <div className="grid grid-cols-4 gap-2 mt-3">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />
        })
        }
      </div>
    </main >
  );
}
