"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationFormSchema } from "@/lib/validations/invitation.schema";
import { createInvitationAction } from "@/server/actions/invitation.actions";
import { OnboardingGuideModal } from "./OnboardingGuideModal";
import { LivePhonePreview } from "./LivePhonePreview";
import { Step1InfoTheme } from "./Step1InfoTheme";
import { Step2Couple } from "./Step2Couple";
import { Step3Events } from "./Step3Events";
import { Step4GiftsStories } from "./Step4GiftsStories";
import { Step5ReviewPublish } from "./Step5ReviewPublish";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = [
  { id: 1, title: "Tema & URL" },
  { id: 2, title: "Mempelai" },
  { id: 3, title: "Acara" },
  { id: 4, title: "Konten" },
  { id: 5, title: "Finalisasi" },
];

export function InvitationWizard({ themes = [], activeSubscription = null, quoteTemplates = [], musicTemplates = [] }) {
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
    defaultValues: {
      title: "Pernikahan William & Eleanor",
      slug: "william-eleanor",
      themeId: defaultThemeId,

      // Mempelai Pria
      groomNickname: "William",
      groomFullName: "William Jonathan Tanuwijaya",
      groomFather: "Bapak William Jonathan",
      groomMother: "Ibu William Jonathan",
      groomPhotoUrl: "",

      // Mempelai Wanita
      brideNickname: "Eleanor",
      brideFullName: "Eleanor Grace Tanuwidjaja",
      brideFather: "Bapak Eleanor Grace",
      brideMother: "Ibu Eleanor Grace",
      bridePhotoUrl: "",

      // Foto Sampul & Konten
      coverUrl: "https://images.unsplash.com/photo-1519741497674-611481863552",
      quotes:
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. (QS. Ar-Rum: 21)",
      openingText: "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.",
      musicUrl: "https://pub-c48bd7eade8944c1bbc28a03f43c23f7.r2.dev/Beautiful_In_White.mp3",
      musicTitle: "Beautiful In White",
      isMusicEnabled: true,

      // Acara
      events: [
        {
          name: "Akad Nikah",
          date: "2026-08-08",
          startTime: "09:00",
          endTime: "10:30",
          locationName: "Masjid Raya Al-A'zham",
          address: "Jl. Jenderal Sudirman, Sukaasih, Kec. Tangerang, Kota Tangerang, Banten 15111",
          mapUrl: "https://maps.app.goo.gl/kX31s3V4F6T7U8W9",
        },
        {
          name: "Resepsi Pernikahan",
          date: "2026-08-08",
          startTime: "11:00",
          endTime: "14:00",
          locationName: "Grand Ballroom Al-A'zham",
          address: "Jl. Jenderal Sudirman, Sukaasih, Kec. Tangerang, Kota Tangerang, Banten 15111",
          mapUrl: "https://maps.app.goo.gl/kX31s3V4F6T7U8W9",
        },
      ],
      loveStories: [
        {
          title: "Pertama Bertemu",
          date: "2020",
          description: "Awal mula takdir mempertemukan kami di sebuah acara kampus.",
        },
        {
          title: "Menuju Pelaminan",
          date: "2025",
          description: "Setelah melewati banyak cerita bersama, kami memantapkan hati untuk melangkah ke jenjang pernikahan.",
        },
      ],

      // Galeri
      galleryLayout: "CAROUSEL",
      galleries: [
        { mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552", type: "PHOTO" },
        { mediaUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", type: "PHOTO" },
      ],

      // Gifts & Finalisasi
      gifts: [
        {
          type: "BANK",
          providerName: "BCA",
          accountName: "William Jonathan Tanuwijaya",
          accountNumber: "1234567890",
        },
      ],
      physicalGiftAddress: "Jl. Mawar No. 12, RT 01/RW 02, Kec. Coblong, Kota Bandung, Jawa Barat (40135)",
      physicalGiftReceiver: "William & Eleanor",
      physicalGiftPhone: "081234567890",

      // Musik
      musicTitle: "Nadhif Basalamah - Bergema Sampai Selamanya",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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

    const res = await createInvitationAction(data);
    if (res.success) {
      router.push("/dashboard");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Buat Undangan Baru
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Isi informasi di bawah untuk membuat undangan pernikahan digital Anda
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="rounded-xl text-xs flex items-center gap-1.5 bg-gradient-to-r from-[#C8A96A] to-[#b39150] hover:from-[#b39150] hover:to-[#9e7e40] text-white font-semibold shadow-md shadow-[#C8A96A]/20 border-none transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Panduan Petunjuk</span>
        </Button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-border/60 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                onClick={() => isCompleted && setCurrentStep(step.id)}
                className={`flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? "text-[#C8A96A] font-bold"
                    : isCompleted
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-[#C8A96A] text-white shadow-md shadow-[#C8A96A]/30"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span className="text-xs whitespace-nowrap">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-medium">
          {serverError}
        </div>
      )}

      {/* Split-Screen Container: Left Form (60%) + Right Live Preview (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Editor (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1A1A1A] p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm space-y-8">
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
              <Step2Couple register={register} errors={errors} watch={watch} setValue={setValue} />
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
              />
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-border/40">
              <Button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="rounded-xl text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </Button>

              {currentStep < 5 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-xl bg-[#C8A96A] hover:bg-[#b39150] text-white text-xs flex items-center gap-1.5"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Live Phone Preview (5 Cols) */}
        <div className="hidden lg:block lg:col-span-5">
          <LivePhonePreview formData={formData} themes={themes} />
        </div>
      </div>
    </div>
  );
}
