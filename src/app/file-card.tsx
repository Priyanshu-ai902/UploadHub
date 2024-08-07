import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, GanttChartSquare, ImageIcon, MoreVerticalIcon, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";



function FileCardActions({ file }: { file: Doc<"files"> }) {
    const { toast } = useToast();
    const deleteFile = useMutation(api.files.deleteFile)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your file
                            and and you no longer access of it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            await deleteFile({
                                fileId: file._id,
                            });
                            toast({
                                variant: "default",
                                title: "File deleted ",
                                description: "Your file is deleted successfully",
                                className: "bg-red-500 text-white"
                            });
                        }}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsConfirmOpen(true)}
                        className="flex gap-1 text-red-500 items-center cursor-pointer">
                        <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );

}


export function FileCard({ file }: { file: Doc<"files"> }) {



    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileText />,
        "csv": <GanttChartSquare />,
    } as Record<Doc<"files">["type"], ReactNode>;

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">
                    {typeIcons[file.type]}
                    </div>{" "}
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions file={file} />
                </div>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
        </Card>

    )
}