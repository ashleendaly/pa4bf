import { QRCodeSVG } from "qrcode.react";
import { env } from "~/env";

export function QrCode({ code }: { code: string }) {
  return (
    <QRCodeSVG
      className="border-8 border-solid border-primary p-5"
      value={`https://${env.HOSTNAME}/join/${code}`}
      bgColor="hsl(var(--background))"
      fgColor="hsl(var(--foreground))"
      size={256}
    />
  );
}
