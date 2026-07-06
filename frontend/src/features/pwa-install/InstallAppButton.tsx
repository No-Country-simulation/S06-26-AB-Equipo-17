import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { IconButton } from "@/components/IconButton";
import { InstallIcon } from "@/components/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePwaInstall } from "./usePwaInstall";

/**
 * Ação "Instalar app" da topbar (ghost). Some quando o app já roda instalado
 * ou a plataforma não suporta instalação. No Chromium dispara o prompt nativo;
 * no iOS (sem prompt programático) abre o passo a passo manual do Safari.
 */
export function InstallAppButton() {
  const { t } = useTranslation("pwa");
  const { status, promptInstall } = usePwaInstall();
  const [iosOpen, setIosOpen] = useState(false);

  if (status === "hidden") return null;

  return (
    <>
      <IconButton
        variant="ghost"
        label={t("install")}
        onClick={status === "ios" ? () => setIosOpen(true) : promptInstall}
      >
        <InstallIcon />
      </IconButton>

      {status === "ios" && (
        <Dialog open={iosOpen} onOpenChange={setIosOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t("iosTitle")}</DialogTitle>
              <DialogDescription>{t("iosIntro")}</DialogDescription>
            </DialogHeader>
            <ol className="list-decimal space-y-2 pl-5 text-body text-ink">
              <li>{t("iosStep1")}</li>
              <li>{t("iosStep2")}</li>
              <li>{t("iosStep3")}</li>
            </ol>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="primary" fullWidth>
                  {t("gotIt")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
