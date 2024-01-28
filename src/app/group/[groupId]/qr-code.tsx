import { QRCodeSVG } from "qrcode.react";
import { Button } from "~/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { env } from "~/env";

export function QrCode({ code }: { code: string }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button className="mb-6 ml-3 text-xl">Get Join QR Code</Button>
      </PopoverTrigger>
      <PopoverContent>
        <QRCodeSVG
          className="mb-4 border-8 border-solid border-primary p-5"
          value={`https://${env.HOSTNAME}/join/${code}`}
          bgColor="hsl(var(--background))"
          fgColor="hsl(var(--foreground))"
          size={256}
        />
      </PopoverContent>
    </Popover>
  );
}
