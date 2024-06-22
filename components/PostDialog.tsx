// import { Copy } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import ProfilePhoto from "./shared/ProfilePhoto";

// export function PostDialog({
//   setOpen,
//   open,
//   src,
// }: {
//   setOpen: any;
//   open: boolean;
//   src: string;
// }) {
//   return (
//     <Dialog open={open}>
//       <DialogContent
//         onInteractOutside={() => setOpen(false)}
//         className="sm:max-w-md"
//       >
//         <DialogHeader>
//           <DialogTitle className="flex gap-2">
//             <ProfilePhoto src={src} />
//             <div>
//               <h1>mern project</h1>
//               <p className="text-xs">post to anyone</p>
//             </div>
//           </DialogTitle>
//           <DialogDescription>
//             Anyone who has this link will be able to view this.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2">
//           <div className="grid flex-1 gap-2">
//             <Input
//               id="link"
//               defaultValue="https://ui.shadcn.com/docs/installation"
//               readOnly
//             />
//           </div>
//           <Button type="submit" size="sm" className="px-3">
//             <span className="sr-only">Copy</span>
//             <Copy className="h-4 w-4" />
//           </Button>
//         </div>
//         <DialogFooter className="sm:justify-start">
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfilePhoto from "./shared/ProfilePhoto";
//import { Textarea } from "./ui/textarea";
import { Images } from "lucide-react";
import { useRef, useState } from "react";
//import { readFileAsDataUrl } from "@/lib/utils";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { readFileAsDataUrl } from "@/lib/utils";
import { createPostAction } from "@/lib/serveractions";
// import { createPostAction } from "@/lib/serveractions";
// import { toast } from "sonner";

export function PostDialog({
  setOpen,
  open,
  src,
}: {
  setOpen: any;
  open: boolean;
  src: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");

  const changeHandler = (e: any) => {
    setInputText(e.target.value);
  };

  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFile(dataUrl);
    }
  };
  const postActionHandler = async (formData: FormData) => {
    const inputText = formData.get("inputText") as string;
    // console.log(inputText);
    try {
      await createPostAction(inputText, selectedFile);
    } catch (error) {
      //   console.log("error occurred", error);
    }
    setInputText("");
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            <ProfilePhoto src={src} />
            <div>
              <h1>Komal Bhagat</h1>
              <p className="text-xs">Post to anyone</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            const promise = postActionHandler(formData);
            // toast.promise(promise, {
            //   loading: "Creating post...",
            //   success: "Post created",
            //   error: "Failed to create post",
            // });
          }}
        >
          <div className="flex flex-col">
            <Textarea
              id="name"
              name="inputText"
              value={inputText}
              onChange={changeHandler}
              className="border-none text-lg focus-visible:ring-0"
              placeholder="Type your message here."
            />
            <div className="my-4">
              {selectedFile && (
                <Image
                  src={selectedFile}
                  alt="preview-image"
                  width={400}
                  height={400}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center gap-4">
              <input
                ref={inputRef}
                onChange={fileChangeHandler}
                type="file"
                name="image"
                className="hidden"
                accept="image/*"
              />
              <Button type="submit">Post</Button>
            </div>
          </DialogFooter>
        </form>
        <Button
          className="gap-2"
          onClick={() => inputRef?.current?.click()}
          variant={"ghost"}
        >
          <Images className="text-blue-500" />
          <p>Media</p>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
