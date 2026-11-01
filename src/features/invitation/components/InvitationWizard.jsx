"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationFormSchema } from "@/features/invitation/schema";
import { createInvitationAction, updateInvitationAction } from "@/features/invitation/actions";
import { OnboardingGuideModal } from "./OnboardingGuideModal";
import { LivePhonePreview } from "./LivePhonePreview";
import { Step1InfoTheme } from "./Step1InfoTheme";
import { Step2Couple } from "./Step2Couple";
import { Step3Events } from "./Step3Events";
import { Step4GiftsStories } from "./Step4GiftsStories";
import { Step5ReviewPublish } from "./Step5ReviewPublish";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/Surface";
import { Alert } from "@/components/ui/Alert";
import { BookOpen, ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = [
  { id: 1, title: "Tema & URL" },
  { id: 2, title: "Mempelai" },
  { id: 3, title: "Acara" },
  { id: 4, title: "Konten" },
  { id: 5, title: "Finalisasi" },
];

export function InvitationWizard({
  themes = [],
  activeSubscription = null,
  quoteTemplates = [],
  musicTemplates = [],
  mode = "create",
  invitationId = null,
  initialData = null,
}) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryThemeId = searchParams.get("themeId");
  const [currentStep, setCurrentStep] = useState(1);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [serverError, setServerError] = useState("");

  const defaultThemeId = queryThemeId || themes[0]?.id || "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(invitationFormSchema),
    // Mode CREATE memakai nilai KOSONG (bukan data contoh) agar user tidak
    // sengaja mempublikasikan undangan berisi data dummy. Mode EDIT memakai
    // initialData dari DB. Placeholder di tiap input memandu pengisian.
    defaultValues: initialData || {
      title: "",
      slug: "",
      themeId: defaultThemeId,

      // Mempelai Pria
      groomNickname: "",
      groomFullName: "",
      groomFather: "",
      groomMother: "",
      groomPhotoUrl: "",

      // Mempelai Wanita
      brideNickname: "",
      brideFullName: "",
      brideFather: "",
      brideMother: "",
      bridePhotoUrl: "",

      // Foto Sampul & Konten
      coverUrl: "",
      quotes: "",
      openingText: "",

      // Acara (minimal 1 baris kosong — wajib diisi user)
      events: [
        {
          name: "",
          date: "",
          startTime: "",
          endTime: "",
          locationName: "",
          address: "",
          mapUrl: "",
        },
      ],
      loveStories: [],

      // Galeri
      galleryLayout: "CAROUSEL",
      galleries: [],

      // Gifts & Finalisasi
      gifts: [],
      physicalGiftAddress: "",
      physicalGiftReceiver: "",
      physicalGiftPhone: "",

      // Musik
      musicTitle: "",
      musicUrl: "",
      isMusicEnabled: true,
      isPublished: true,
    },
  });

  const formData = watch();

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["title", "slug", "themeId"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["groomNickname", "groomFullName", "brideNickname", "brideFullName"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["events"]);
    } else if (currentStep === 4) {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setServerError("");

    // Verifikasi Client-side untuk tema premium bagi pengguna gratis
    const chosenTheme = themes.find((t) => t.id === data.themeId);
    const isPremiumActive = activeSubscription && activeSubscription.package?.price > 0;

    if (chosenTheme?.isPremium && !isPremiumActive) {
      setServerError("Tema yang Anda pilih adalah Tema Premium. Silakan upgrade paket Anda ke Premium di halaman Langganan terlebih dahulu.");
      return;
    }

    const res = isEdit
      ? await updateInvitationAction(invitationId, data)
      : await createInvitationAction(data);

    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setServerError(res.error || "Terjadi kesalahan saat memproses data.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Guide Modal */}
      <OnboardingGuideModal
        forceOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      {/* Top Header Controls & Guide Button */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {isEdit ? "Edit Undangan" : "Buat Undangan Baru"}
          </h1>
          <p className="text-xs font-light text-muted-foreground">
            {isEdit
              ? "Perbarui informasi undangan Anda. Perubahan langsung tersimpan setelah difinalisasi."
              : "Isi informasi di bawah untuk membuat undangan pernikahan digital Anda"}
          </p>
        </div>

        <Button type="button" size="sm" onClick={() => setShowGuideModal(true)}>
          <BookOpen aria-hidden="true" />
          <span>Panduan Petunjuk</span>
        </Button>
      </div>

      {/* Stepper Progress Bar */}
      <nav
        aria-label="Langkah pembuatan undangan"
        className="overflow-x-auto rounded-2xl border border-border/60 bg-card p-4 shadow-(--shadow-gold-sm)"
      >
        <ol className="flex min-w-125 items-center justify-between">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  disabled={!isCompleted}
                  aria-current={isCurrent ? "step" : undefined}
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  className={`flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 disabled:cursor-default ${
                    isCompleted ? "cursor-pointer" : ""
                  } ${
                    isCurrent
                      ? "font-bold text-gold-500"
                      : isCompleted
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-gold-400 text-white shadow-md shadow-gold-400/30"
                        : isCompleted
                        ? "border border-gold-400/40 bg-gold-400/15 text-gold-500"
                        : "bg-zinc-200 text-muted-foreground dark:bg-zinc-800"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : step.id}
                  </span>
                  <span className="whitespace-nowrap text-xs">{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Server Error Alert */}
      {serverError && <Alert variant="error">{serverError}</Alert>}

      {/* Split-Screen Container: Left Form (60%) + Right Live Preview (40%) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Editor (7 Cols) */}
        <Surface padding="none" className="space-y-8 p-6 sm:p-8 lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <Step1InfoTheme
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                themes={themes}
              />
            )}
            {currentStep === 2 && (
              <Step2Couple register={register} errors={errors} watch={watch} setValue={setValue} invitationId={invitationId} />
            )}
            {currentStep === 3 && (
              <Step3Events
                register={register}
                errors={errors}
                control={control}
              />
            )}
            {currentStep === 4 && (
              <Step4GiftsStories
                register={register}
                control={control}
                watch={watch}
                setValue={setValue}
                quoteTemplates={quoteTemplates}
                invitationId={invitationId}
              />
            )}
            {currentStep === 5 && (
              <Step5ReviewPublish
                register={register}
                control={control}
                watch={watch}
                setValue={setValue}
                isSubmitting={isSubmitting}
                musicTemplates={musicTemplates}
                isEdit={isEdit}
                invitationId={invitationId}
              />
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <ArrowLeft aria-hidden="true" />
                <span>Sebelumnya</span>
              </Button>

              {currentStep < 5 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight aria-hidden="true" />
                </Button>
              )}
            </div>
          </form>
        </Surface>

        {/* Right Column: Sticky Live Phone Preview (5 Cols) */}
        <div className="hidden lg:col-span-5 lg:block">
          <LivePhonePreview formData={formData} themes={themes} />
        </div>
      </div>
    </div>
  );
}
