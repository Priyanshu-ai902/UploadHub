"use client"

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";


const formSchema = z.object({
    title: z.string().min(1).max(20),
    file: z
        .custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, `Required`),
})

export function UploadButton() {
    const { toast } = useToast();
    const organization = useOrganization();
    const user = useUser()
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        console.log(values.file)
        if (!orgId) return;

        const postUrl = await generateUploadUrl();

        const fileType = values.file[0].type;

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileType },
            body: values.file[0],
        });
        const { storageId } = await result.json()

        const types = {
            "image/png": "image",
            "application/pdf": "pdf",
            "test/csv": "csv",
        } as Record<string, Doc<"files">["type"]>;

        try {
            await createFile({
                name: values.title,
                fileId: storageId,
                orgId,
                type: types[fileType],
            });

            form.reset();
            setIsFileDialogOpen(false)

            toast({
                variant: "default",
                title: "File Uploaded",
                description: "Now everyone can view your file",
                className: "bg-purple-400 text-black"
            })

        } catch (err) {
            toast({
                variant: "default",
                title: "Something went wrong",
                description: "Your file is not uploaded ,try again",
                className: "bg-red-500 text-white"
            })
        }


    }

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

    const createFile = useMutation(api.files.createFile)

    return (
        <Dialog
            open={isFileDialogOpen}
            onOpenChange={(isOpen) => {
                setIsFileDialogOpen(isOpen);
                form.reset();
            }}
        >
            <DialogTrigger asChild>

                <Button>Upload File</Button>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">Uplaod your file here</DialogTitle>
                    <DialogDescription>
                        This file will be accessible by anyone in your organization
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field: { onChange }, ...field }) => (
                                <FormItem>
                                    <FormLabel>File</FormLabel>
                                    <FormControl>
                                        <Input

                                            type="file" {...fileRef}

                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit"
                            disabled={form.formState.isSubmitting}
                            className="flex gap-1">
                            {form.formState.isSubmitting && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Submit</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    );
}
